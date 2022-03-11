import { Client } from '@elastic/elasticsearch'
import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { newJSONLinesFormatter, newJSONLinesParser, readJSON } from '@wholebuzz/fs/lib/json'
import { mergeStreams } from '@wholebuzz/fs/lib/merge'
import { openReadableFileSet } from '@wholebuzz/fs/lib/parquet'
import {
  pipeFilter,
  pipeFromFilter,
  shardReadable,
  shardWritables,
  streamAsyncFilter,
  streamFilter,
} from '@wholebuzz/fs/lib/stream'
import { openWritableFiles, ReadableFileSpec, shardIndex } from '@wholebuzz/fs/lib/util'
import esort from 'external-sorting'
import { Knex, knex } from 'knex'
import level from 'level'
import { LevelUp } from 'levelup'
import * as mongoDB from 'mongodb'
import { Duplex, Readable } from 'stream'
import sub from 'subleveldown'
import StreamTree, { pumpWritable, ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import { streamFromElasticSearch, streamToElasticSearch } from './elasticsearch'
import {
  DatabaseCopyFormat,
  DatabaseCopySchema,
  DatabaseCopySourceType,
  DatabaseCopyTargetType,
  formatContentType,
  formatHasSchema,
  guessFormatFromFilename,
  guessSourceTypeFromFilename,
  guessTargetTypeFromFilename,
  pipeFromOutputFormatTransform,
  pipeInputFormatTransform,
  sourceHasDatabaseFile,
  targetHasDatabaseFile,
} from './format'
import {
  dumpToKnex,
  knexFormatCreateTableSchema,
  knexInspectTableSchema,
  knexLogConfig,
  knexPoolConfig,
  queryKnex,
} from './knex'
import { Column, formatDDLCreateTableSchema, guessSchemaFromFile } from './schema'
import { findObjectProperty, updateObjectPropertiesAsync } from './util'

const batch2 = require('batch2')
const levelIteratorStream = require('level-iterator-stream')
const { PARQUET_LOGICAL_TYPES } = require('parquetjs/lib/types')

function initParquet() {
  PARQUET_LOGICAL_TYPES.TIMESTAMP_MILLIS.fromPrimitive = (x: any) => new Date(Number(BigInt(x)))
}

export interface DatabaseCopySourceFile {
  url?: string
  query?: string
  columnType?: Record<string, string>
  extra?: Record<string, any>
  extraOutput?: boolean
  schema?: Column[]
  schemaFile?: string
  sourceFormat?: DatabaseCopyFormat
  sourceShards?: number
  sourceShardFilter?: (index: number) => boolean
  sourceStream?: ReadableStreamTree[]
  transformInputObject?: (x: unknown) => unknown | Promise<unknown>
  transformInputObjectStream?: () => Duplex
}

export interface DatabaseCopySource {
  sourceConnection?: Record<string, any>
  sourceElasticSearch?: Client
  sourceFormat?: DatabaseCopyFormat
  sourceFiles?: DatabaseCopySourceFile[] | Record<string, DatabaseCopySourceFile>
  sourceHost?: string
  sourceLevel?: level.LevelDB | LevelUp
  sourceMongodb?: mongoDB.MongoClient
  sourceName?: string
  sourceKnex?: Knex
  sourcePassword?: string
  sourceShards?: number
  sourceStream?: ReadableStreamTree
  sourceTable?: string
  sourceType?: DatabaseCopySourceType
  sourcePort?: number
  sourceUser?: string
}

export interface DatabaseCopyTarget {
  targetConnection?: Record<string, any>
  targetElasticSearch?: Client
  targetFormat?: DatabaseCopyFormat
  targetFile?: string
  targetHost?: string
  targetKnex?: Knex
  targetLevel?: level.LevelDB | LevelUp
  targetMongodb?: mongoDB.MongoClient
  targetName?: string
  targetPassword?: string
  targetShards?: number
  targetStream?: WritableStreamTree[]
  targetTable?: string
  targetType?: DatabaseCopyTargetType
  targetPort?: number
  targetUser?: string
}

export interface DatabaseCopyOptions extends DatabaseCopySource, DatabaseCopyTarget {
  batchSize?: number
  columnType?: Record<string, string>
  compoundInsert?: boolean
  contentType?: string
  copySchema?: DatabaseCopySchema
  engineOptions?: any
  externalSortBy?: string[]
  extra?: Record<string, any>
  extraOutput?: boolean
  fileSystem?: FileSystem
  group?: boolean
  groupLabels?: boolean
  limit?: number
  orderBy?: string[]
  query?: string
  shardBy?: string
  schema?: Column[]
  schemaFile?: string
  tempDirectories?: string[]
  transformObject?: (x: unknown) => unknown | Promise<unknown>
  transformObjectStream?: () => Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: () => Duplex
  where?: Array<string | any[]>
}

export type DatabaseCopyFormats = Record<string, DatabaseCopyFormat | null>

export function guessFormatFromSource(source: DatabaseCopySourceFile) {
  return source.sourceStream ? DatabaseCopyFormat.object : guessFormatFromFilename(source.url)
}

export function getSourceConnection(args: DatabaseCopyOptions) {
  const sourceFilesEntries = Object.entries(args.sourceFiles ?? {})
  const sourceFilesType =
    sourceFilesEntries.length === 1
      ? guessSourceTypeFromFilename(sourceFilesEntries[0][1].url)
      : undefined
  return sourceHasDatabaseFile(sourceFilesType)
    ? {
        database: undefined,
        filename: sourceFilesEntries[0][1].url,
        timezone: 'UTC',
        user: undefined,
      }
    : {
        database: args.sourceName,
        user: args.sourceUser,
        password: args.sourcePassword,
        host: args.sourceHost,
        port: args.sourcePort,
        timezone: 'UTC',
        options: args.sourceType === 'mssql' ? { trustServerCertificate: true } : undefined,
        charset: args.sourceType === 'mysql' ? 'utf8mb4' : undefined,
        ...args.sourceConnection,
      }
}

export function getTargetConnection(args: DatabaseCopyOptions) {
  const targetFileType = guessTargetTypeFromFilename(args.targetFile)
  return targetHasDatabaseFile(targetFileType)
    ? {
        timezone: 'UTC',
        filename: args.targetFile,
      }
    : {
        database: args.targetName,
        user: args.targetUser,
        password: args.targetPassword,
        host: args.targetHost,
        port: args.targetPort,
        timezone: 'UTC',
        options: args.targetType === 'mssql' ? { trustServerCertificate: true } : undefined,
        charset: args.targetType === 'mysql' ? 'utf8mb4' : undefined,
        ...args.targetConnection,
      }
}

export function getSourceConnectionString(args: DatabaseCopyOptions) {
  return `${args.sourceUser}:${args.sourcePassword}@${args.sourceHost}:${args.sourcePort}`
}

export function getTargetConnectionString(args: DatabaseCopyOptions) {
  return `${args.targetUser}:${args.targetPassword}@${args.targetHost}:${args.targetPort}`
}

export function getShardFunction(args: DatabaseCopyOptions) {
  return (x: Record<string, any>, modulus: number) => {
    const value = x[args.shardBy!]
    return typeof value === 'number' ? value % modulus : shardIndex(value, modulus)
  }
}

export function getOrderByFunction(args: DatabaseCopyOptions) {
  return (a: Record<string, any>, b: Record<string, any>) => {
    for (const orderBy of args.orderBy!) {
      const valA = a[orderBy]
      const valB = b[orderBy]
      if (valA < valB) return -1
      else if (valB < valA) return 1
    }
    return 0
  }
}

export function getExternalSortFunction(args: DatabaseCopyOptions): Array<(x: any) => any> {
  return args.externalSortBy!.map((sortBy) => (x: any) => x[sortBy])
}

export function getSourceFormats(args: DatabaseCopyOptions) {
  if (args.sourceStream) return { '0': DatabaseCopyFormat.object }
  const ret: DatabaseCopyFormats = {}
  for (const [key, sourceFile] of Object.entries(args.sourceFiles ?? {})) {
    ret[key] =
      (sourceFile.query || args.query) && sourceFile.url !== 's3://athena.csv'
        ? DatabaseCopyFormat.jsonl
        : guessFormatFromSource(sourceFile) || DatabaseCopyFormat.json
    if (ret[key] === DatabaseCopyFormat.parquet) initParquet()
  }
  return ret
}

export function getSourceFormat(args: DatabaseCopyOptions, sourceFormats: DatabaseCopyFormats) {
  if (args.sourceFormat) return args.sourceFormat
  const formats = Object.values(sourceFormats)
  if (!formats.length) return DatabaseCopyFormat.json
  return formats[0] && formats.every((format) => format === formats[0]) ? formats[0] : undefined
}

export function getTargetFormat(args: DatabaseCopyOptions, sourceFormat?: DatabaseCopyFormat) {
  return (
    args.targetFormat ||
    guessFormatFromFilename(args.targetFile) ||
    (args.sourceFiles && sourceFormat) ||
    DatabaseCopyFormat.json
  )
}

export async function openSources(
  args: DatabaseCopyOptions,
  sourceFiles: Array<[string, DatabaseCopySourceFile]>,
  sourceFormats: DatabaseCopyFormats,
  sourceFormat?: DatabaseCopyFormat,
  targetFormat?: DatabaseCopyFormat
): Promise<ReadableStreamTree[] | Record<string, ReadableStreamTree | ReadableStreamTree[]>> {
  const directoryStream =
    sourceFiles.length === 1 &&
    sourceFiles[0][1].url?.endsWith('/') &&
    !sourceFiles[0][1].url?.startsWith('http') &&
    !args.sourceStream
      ? new Readable()
      : undefined
  const sourceSpec: Record<string, ReadableFileSpec> = {}
  sourceFiles.forEach(([sourceFileName, sourceFile]) => {
    sourceSpec[sourceFileName] = {
      format:
        sourceFormat === targetFormat && sourceFormat === DatabaseCopyFormat.parquet
          ? undefined
          : sourceFormat || sourceFormats[sourceFileName] || undefined,
      url: sourceFile.url,
      stream: sourceFile.sourceStream,
      options: {
        query: sourceFile.query || args.query,
        extra: sourceFile.extra || args.extra,
        extraOutput: sourceFile.extraOutput || args.extraOutput,
        shards: sourceFile.sourceShards || args.sourceShards,
        shardFilter: sourceFile.sourceShardFilter,
      },
    }
  })
  const inputs: ReadableStreamTree[] | Record<string, ReadableStreamTree[]> = args.sourceStream
    ? [args.sourceStream]
    : sourceFiles.length === 1 && sourceFiles[0][1].url === '-'
    ? [StreamTree.readable(process.stdin)]
    : directoryStream
    ? [StreamTree.readable(directoryStream)]
    : await openReadableFileSet(args.fileSystem!, sourceSpec)
  // If the source is a directory, read the directory.
  if (directoryStream) {
    directoryStream.push(
      JSON.stringify(await args.fileSystem!.readDirectory(sourceFiles[0][1].url!), null, 2)
    )
    directoryStream.push(null)
  }
  return inputs
}

export async function openTargets(args: DatabaseCopyOptions, format?: DatabaseCopyFormat) {
  const outputs =
    args.targetStream ||
    (args.targetFile === '-'
      ? [StreamTree.writable(process.stdout)]
      : await openWritableFiles(args.fileSystem!, args.targetFile!, {
          contentType: formatContentType(format),
          shards: args.targetShards,
        }))
  for (let i = 0; i < outputs.length; i++) {
    if (args.transformBytesStream) outputs[i] = outputs[i].pipeFrom(args.transformBytesStream())
    if (args.transformBytes) outputs[i] = pipeFromFilter(outputs[i], args.transformBytes)
  }
  return outputs
}

export async function dbcp(args: DatabaseCopyOptions) {
  const sourceFiles = Object.entries(args.sourceFiles ?? {})
  const sourceFormats = getSourceFormats(args)
  const sourceFormat = getSourceFormat(args, sourceFormats)
  const targetFormat = getTargetFormat(args, sourceFormat)
  const targetType = args.targetType ?? guessTargetTypeFromFilename(args.targetFile) ?? undefined
  const sourceConnection = getSourceConnection(args)
  const orderByFunction = (args.orderBy?.length ?? 0) > 0 ? getOrderByFunction(args) : undefined
  const externalSortFunction =
    (args.externalSortBy?.length ?? 0) > 0 ? getExternalSortFunction(args) : undefined
  const isNotBytes2Bytes =
    sourceFormat !== targetFormat ||
    sourceFiles.length > 1 ||
    sourceFiles.some((x) => x[1].sourceShards) ||
    args.sourceShards ||
    args.targetShards ||
    args.externalSortBy ||
    args.transformObject ||
    args.transformObjectStream
  if (
    !args.sourceStream &&
    !args.sourceKnex &&
    !args.sourceElasticSearch &&
    !args.sourceLevel &&
    !args.sourceMongodb &&
    (!sourceFiles.length || !args.fileSystem) &&
    (!args.sourceType ||
      (!sourceConnection.filename && (!sourceConnection.database || !sourceConnection.user)) ||
      (!args.sourceTable && !args.query))
  ) {
    throw new Error(
      `Missing source parameters ${JSON.stringify(
        {
          sourceType: args.sourceType,
          sourceFiles: args.sourceFiles,
          sourceDatabase: sourceConnection.database,
          sourceUser: sourceConnection.user,
          sourceTable: args.sourceTable,
        },
        null,
        2
      )}`
    )
  }

  if (
    !args.targetStream &&
    !args.targetKnex &&
    !args.targetElasticSearch &&
    !args.targetLevel &&
    !args.targetMongodb &&
    (!args.targetFile || !args.fileSystem) &&
    (!targetType ||
      !args.targetName ||
      !args.targetUser ||
      (!args.targetTable && !args.compoundInsert))
  ) {
    throw new Error(
      `Missing target parameters ${JSON.stringify(
        {
          targetType,
          targetFile: args.targetFile,
          targetDatabase: args.targetName,
          targetUser: args.targetUser,
          targetTable: args.targetTable,
        },
        null,
        2
      )}`
    )
  }

  if (sourceFormat === DatabaseCopyFormat.parquet) initParquet()
  const shouldInspectSchema =
    (formatHasSchema(targetFormat) || args.copySchema === DatabaseCopySchema.schemaOnly) &&
    args.targetFile &&
    args.copySchema !== DatabaseCopySchema.dataOnly

  // If the copy source is a database.
  if (!args.sourceStream && (!args.sourceFiles || sourceHasDatabaseFile(args.sourceType))) {
    if (args.targetFile && !targetHasDatabaseFile(targetType)) {
      const formattingKnex =
        shouldInspectSchema || targetFormat === DatabaseCopyFormat.sql
          ? targetType
            ? knex({ client: targetType, log: knexLogConfig })
            : args.sourceKnex ?? knex({ client: args.sourceType, log: knexLogConfig })
          : undefined
      // If the copy is database->file: JSON-formatting transform.
      const input =
        args.copySchema !== DatabaseCopySchema.schemaOnly ? await queryDatabase(args) : undefined
      try {
        const outputs = await openTargets(args, targetFormat)
        await dumpToFile(input?.input, outputs, {
          columnType: args.columnType,
          copySchema: args.copySchema,
          externalSortFunction,
          format: targetFormat,
          formattingKnex,
          shardFunction: getShardFunction(args),
          schema: shouldInspectSchema ? await databaseInspectSchema(args) : undefined,
          sourceTable: args.sourceTable,
          targetType: targetType || (args.sourceKnex ? args.sourceType : undefined),
          targetShards: args.targetShards,
          tempDirectories: args.tempDirectories,
        })
      } catch (error) {
        throw error
      } finally {
        if (input) await input.destroy()
        if (formattingKnex) await formattingKnex.destroy()
      }
    } else {
      // If the copy is database->database: no transform.
      const input = await queryDatabase(args)
      try {
        await dumpToDatabase(input.input, { ...args, targetType }, args.targetTable!, {
          batchSize: args.batchSize,
          compoundInsert: args.compoundInsert,
        })
      } catch (error) {
        throw error
      } finally {
        await input.destroy()
      }
    }
  } else {
    // Else the copy source is a file.
    const inputs = await openSources(args, sourceFiles, sourceFormats, sourceFormat, targetFormat)
    if (args.targetStream || (args.targetFile && !targetHasDatabaseFile(targetType))) {
      // If the copy is file->file: no transform.
      const outputs = await openTargets(args, targetFormat)
      const schema = shouldInspectSchema
        ? args.schema ||
          (args.schemaFile
            ? ((await readJSON(args.fileSystem!, args.schemaFile)) as Column[])
            : sourceFiles.length === 1
            ? Object.values(await guessSchemaFromFile(args.fileSystem!, sourceFiles[0][1].url!))
            : undefined)
        : undefined
      await updateObjectPropertiesAsync(inputs, async (inputGroup, inputGroupKey) => {
        const inputArray = Array.isArray(inputGroup) ? inputGroup : [inputGroup]
        await updateObjectPropertiesAsync(inputArray, async (input) => {
          if (isNotBytes2Bytes) {
            const inputFile = findObjectProperty(args.sourceFiles, inputGroupKey)
            input = await pipeInputFormatTransform(input, sourceFormats[inputGroupKey]!)
            if (inputFile?.transformInputObject) {
              input = pipeFilter(input, inputFile.transformInputObject)
            }
            if (inputFile?.transformInputObjectStream) {
              input = input.pipe(inputFile.transformInputObjectStream())
            }
          }
          return input
        })
        return Array.isArray(inputGroup) ? inputGroup : inputArray[0]
      })
      await dumpToFile(
        mergeStreams(inputs, {
          compare: orderByFunction,
          group: args.group,
          labelSource: args.groupLabels,
        }),
        outputs,
        {
          columnType: args.columnType,
          copySchema: args.copySchema,
          externalSortFunction,
          format: isNotBytes2Bytes ? targetFormat : undefined,
          formattingKnex:
            shouldInspectSchema && targetType
              ? knex({ client: targetType, log: knexLogConfig })
              : undefined,
          shardFunction: getShardFunction(args),
          schema,
          sourceTable: args.sourceTable,
          targetType,
          targetShards: args.targetShards,
          tempDirectories: args.tempDirectories,
          transformObject: args.transformObject,
          transformObjectStream: args.transformObjectStream,
        }
      )
    } else {
      // If the copy is file->database: JSON-parsing transform.
      await updateObjectPropertiesAsync(inputs, async (inputGroup, inputGroupKey) => {
        const inputArray = Array.isArray(inputGroup) ? inputGroup : [inputGroup]
        await updateObjectPropertiesAsync(inputArray, async (input) => {
          if (args.transformBytes) input = pipeFilter(input, args.transformBytes)
          if (args.transformBytesStream) input = input.pipe(args.transformBytesStream())
          input = await pipeInputFormatTransform(input, sourceFormats[inputGroupKey]!)
          if (args.transformObject) input = pipeFilter(input, args.transformObject)
          if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
          return input
        })
        return Array.isArray(inputGroup) ? inputGroup : inputArray[0]
      })
      await dumpToDatabase(
        mergeStreams(inputs, {
          compare: orderByFunction,
          group: args.group,
          labelSource: args.groupLabels,
        }),
        { ...args, targetType },
        sourceFormat === DatabaseCopyFormat.sql ? '' : args.targetTable!,
        { batchSize: args.batchSize, compoundInsert: args.compoundInsert }
      )
    }
  }
}

async function writeSchema(
  output: WritableStreamTree,
  options: {
    columnType?: Record<string, string>
    format: DatabaseCopyFormat
    formattingKnex?: Knex
    schema?: Column[]
    table?: string
    type?: string
  }
) {
  const readable = new Readable()
  if (options.schema) {
    readable.push(
      options.format === DatabaseCopyFormat.sql
        ? options.type === DatabaseCopySourceType.athena
          ? formatDDLCreateTableSchema(options.table ?? '', options.schema, options.columnType)
          : knexFormatCreateTableSchema(
              options.formattingKnex!,
              options.table ?? '',
              options.schema,
              options.columnType
            )
        : JSON.stringify(options.schema)
    )
  }
  readable.push(null)
  await pumpWritable(output, undefined, StreamTree.readable(readable))
}

export async function dumpToFile(
  input: ReadableStreamTree | undefined,
  outputs: WritableStreamTree[],
  options: {
    columnType?: Record<string, string>
    copySchema?: DatabaseCopySchema
    externalSortFunction?: Array<(x: any) => any>
    format?: DatabaseCopyFormat
    formattingKnex?: Knex
    schema?: Column[]
    shardFunction?: (x: Record<string, any>, modulus: number) => number
    sourceTable?: string
    targetType?: string
    targetShards?: number
    tempDirectories?: string[]
    transformObject?: (x: unknown) => unknown
    transformObjectStream?: () => Duplex
  }
) {
  if (options.copySchema === DatabaseCopySchema.schemaOnly) {
    for (const output of outputs) {
      await writeSchema(output, {
        columnType: options.columnType,
        format: options.format!,
        formattingKnex: options.formattingKnex,
        schema: options.schema,
        table: options.sourceTable,
        type: options.targetType,
      })
    }
  } else {
    const simpleExternalSort =
      options?.externalSortFunction &&
      options.format === DatabaseCopyFormat.jsonl &&
      !options.transformObjectStream &&
      !options.transformObject &&
      outputs.length === 1
    if (options.schema && options.format === DatabaseCopyFormat.sql) {
      for (const output of outputs) {
        output.node.stream.write(
          knexFormatCreateTableSchema(
            options.formattingKnex!,
            options.sourceTable ?? '',
            options.schema,
            options.columnType
          )
        )
      }
    }
    if (!simpleExternalSort) {
      for (let i = 0; i < outputs.length; i++) {
        if (options.format !== undefined) {
          outputs[i] = await pipeFromOutputFormatTransform(
            outputs[i],
            options.format,
            options.formattingKnex,
            options.sourceTable,
            options.schema ? { schema: options.schema, columnType: options.columnType } : undefined
          )
        }
        if (options.transformObjectStream) {
          outputs[i] = outputs[i].pipeFrom(options.transformObjectStream())
        }
        if (options.transformObject) {
          outputs[i] = pipeFromFilter(outputs[i], options.transformObject)
        }
      }
    }
    if (!options?.externalSortFunction) {
      const writable = shardWritables(outputs, options.targetShards, options.shardFunction)
      await pumpWritable(writable, undefined, input)
    } else {
      const inputs = shardReadable(input!, options.targetShards, options.shardFunction)
      const esorts = []
      for (let i = 0; i < outputs.length; i++) {
        let writable = outputs[i]
        if (!simpleExternalSort) writable = writable.pipeFrom(newJSONLinesParser())
        const esortArgs = {
          input: inputs[i].pipe(newJSONLinesFormatter()).finish(),
          output: writable.finish(),
          tempDir: options.tempDirectories?.[i] || __dirname,
          deserializer: JSON.parse,
          serializer: JSON.stringify,
          maxHeap: 100,
        }
        esorts.push(esort(esortArgs).asc(options.externalSortFunction))
      }
      await Promise.all(esorts)
    }
  }
}

async function dumpToDatabase(
  input: ReadableStreamTree,
  args: DatabaseCopyOptions,
  table: string,
  options?: { compoundInsert?: boolean; batchSize?: number; returning?: string }
) {
  if (args.targetType === DatabaseCopyTargetType.es) {
    const client =
      args.targetElasticSearch ??
      new Client({
        node: args.targetName ?? '',
        auth: {
          username: args.targetUser ?? '',
          password: args.targetPassword ?? '',
        },
      })
    try {
      const output = streamToElasticSearch(client, {
        index: args.targetTable ?? '',
        bulkOptions: args.engineOptions,
        extra: args.extra,
        extraOutput: args.extraOutput,
      })
      await pumpWritable(output, undefined, input)
    } catch (error) {
      throw error
    } finally {
      await client.close()
    }
  } else if (args.targetType === DatabaseCopyTargetType.level) {
    const levelOptions = {
      valueEncoding: 'json',
      ...args.extra,
    }
    const db: level.LevelDB | undefined = !args.targetLevel
      ? level(args.targetFile!, levelOptions)
      : undefined
    const sublevel = db && args.targetTable ? sub(db, args.targetTable, levelOptions) : undefined
    const targetLevel = args.targetLevel ?? sublevel ?? db
    const getKey = (item: any) => item[args.orderBy?.[0] || 'id']
    try {
      await pumpWritable(
        StreamTree.writable(
          streamAsyncFilter(async (item: any) => {
            const key = getKey(item)
            if (key) await targetLevel!.put(key, item)
            return undefined
          })
        ),
        undefined,
        input
      )
    } catch (error) {
      throw error
    } finally {
      if (sublevel) await sublevel.close()
      if (db) await db.close()
    }
  } else if (args.targetType === DatabaseCopyTargetType.mongodb) {
    const client: mongoDB.MongoClient =
      args.targetMongodb ?? new mongoDB.MongoClient('mongodb://' + getTargetConnectionString(args))
    if (!args.targetMongodb) await client.connect()
    try {
      const db: mongoDB.Db = client.db(args.targetName)
      const collection: mongoDB.Collection = db.collection(args.targetTable ?? '')
      const stream = StreamTree.writable(
        streamAsyncFilter(async (data: any) => {
          await collection.insertMany(data)
        })
      ).pipeFrom(batch2.obj({ size: options?.batchSize ?? 4000 }))
      await pumpWritable(stream, undefined, input)
    } catch (error) {
      throw error
    } finally {
      if (!args.targetMongodb) await client.close()
    }
  } else {
    const targetKnex =
      args.targetKnex ??
      knex({
        client: args.targetType,
        connection: getTargetConnection(args),
        pool: knexPoolConfig,
        useNullAsDefault: args.targetType === DatabaseCopyTargetType.sqlite,
      })
    try {
      return await dumpToKnex(input, targetKnex, table, options)
    } catch (error) {
      throw error
    } finally {
      await targetKnex.destroy()
    }
  }
}

async function queryDatabase(args: DatabaseCopyOptions) {
  if (args.sourceType === DatabaseCopySourceType.es) {
    const client =
      args.sourceElasticSearch ??
      new Client({
        node: args.sourceName ?? '',
        auth: {
          username: args.sourceUser ?? '',
          password: args.sourcePassword ?? '',
        },
      })
    let input = await streamFromElasticSearch(client, {
      index: args.sourceTable!,
      orderBy: args.orderBy,
    })
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return { input, destroy: () => client.close() }
  } else if (args.sourceType === DatabaseCopySourceType.level) {
    const levelOptions = {
      valueEncoding: 'json',
      ...args.extra,
    }
    const db: level.LevelDB | undefined = !args.sourceLevel
      ? level(Object.entries(args.sourceFiles!)[0][1].url!, levelOptions)
      : undefined
    const sublevel = db && args.sourceTable ? sub(db, args.sourceTable, levelOptions) : undefined
    const sourceLevel = args.sourceLevel ?? sublevel ?? db
    const iterator = levelIteratorStream(sourceLevel!.iterator())
    let input = StreamTree.readable(iterator).pipe(streamFilter((x) => x.value))
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return {
      input,
      destroy: async () => {
        if (sublevel) await sublevel.close()
        if (db) await db.close()
      },
    }
  } else if (args.sourceType === DatabaseCopySourceType.mongodb) {
    const client: mongoDB.MongoClient =
      args.sourceMongodb ?? new mongoDB.MongoClient('mongodb://' + getSourceConnectionString(args))
    if (!args.sourceMongodb) await client.connect()
    const db: mongoDB.Db = client.db(args.sourceName)
    const collection: mongoDB.Collection = db.collection(args.sourceTable ?? '')
    let input = StreamTree.readable(
      collection.find(args.query ? JSON.parse(args.query) : undefined).stream()
    )
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return {
      input,
      destroy: async () => {
        if (!args.sourceMongodb) await client.close()
      },
    }
  } else {
    const sourceKnex =
      args.sourceKnex ??
      knex({
        client: args.sourceType,
        connection: getSourceConnection(args),
        pool: knexPoolConfig,
      } as any)
    let input = queryKnex(sourceKnex, args.sourceTable!, args)
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return { input, destroy: () => sourceKnex.destroy() }
  }
}

export async function databaseInspectSchema(args: DatabaseCopyOptions) {
  if (args.schema) return args.schema
  if (args.schemaFile) return (await readJSON(args.fileSystem!, args.schemaFile)) as Column[]
  const sourceKnex =
    args.sourceKnex ??
    knex({
      client: args.sourceType,
      connection: getSourceConnection(args),
      pool: knexPoolConfig,
    } as any)
  try {
    return await knexInspectTableSchema(sourceKnex, args.sourceTable ?? '')
  } catch (error) {
    throw error
  } finally {
    await sourceKnex.destroy()
  }
}
