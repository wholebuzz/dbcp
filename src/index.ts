import { Client } from '@elastic/elasticsearch'
import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { newJSONLinesFormatter, newJSONLinesParser, readJSON } from '@wholebuzz/fs/lib/json'
import { mergeStreams } from '@wholebuzz/fs/lib/merge'
import { openReadableFileSet } from '@wholebuzz/fs/lib/parquet'
import { pipeFilter, pipeFromFilter, shardReadable, shardWritables } from '@wholebuzz/fs/lib/stream'
import { openWritableFiles, ReadableFileSpec, shardIndex } from '@wholebuzz/fs/lib/util'
import esort from 'external-sorting'
import { Knex, knex } from 'knex'
import level from 'level'
import { LevelUp } from 'levelup'
import * as mongoDB from 'mongodb'
import { Duplex, Readable } from 'stream'
import StreamTree, { pumpWritable, ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import {
  openElasticSearchInput,
  openElasticSearchOutput,
  streamFromElasticSearch,
  streamToElasticSearch,
} from './elasticsearch'
import {
  DatabaseCopyFormat,
  DatabaseCopyInputType,
  DatabaseCopyOutputType,
  DatabaseCopySchema,
  DatabaseCopyShardFunction,
  formatContentType,
  formatHasSchema,
  guessFormatFromFilename,
  guessInputTypeFromFilename,
  guessOutputTypeFromFilename,
  inputHasDatabaseFile,
  outputHasDatabaseFile,
  outputIsSqlDatabase,
  pipeFromOutputFormatTransform,
  pipeInputFormatTransform,
} from './format'
import {
  dumpToKnex,
  knexFormatCreateTableSchema,
  knexInspectTableSchema,
  knexLogConfig,
  knexPoolConfig,
  queryKnex,
} from './knex'
import { openLevelDbInput, openLevelDbOutput, streamFromLevelDb, streamToLevelDb } from './leveldb'
import { openMongoDbInput, openMongoDbOutput, streamFromMongoDb, streamToMongoDb } from './mongodb'
import { Column, formatDDLCreateTableSchema, guessSchemaFromFile } from './schema'
import { findObjectProperty, updateObjectPropertiesAsync } from './util'

const { PARQUET_LOGICAL_TYPES } = require('parquetjs/lib/types')

function initParquet() {
  PARQUET_LOGICAL_TYPES.TIMESTAMP_MILLIS.fromPrimitive = (x: any) => new Date(Number(BigInt(x)))
}

export interface DatabaseCopyInputFile {
  url?: string
  query?: string
  columnType?: Record<string, string>
  extra?: Record<string, any>
  extraOutput?: boolean
  schema?: Column[]
  schemaFile?: string
  inputFormat?: DatabaseCopyFormat
  inputShards?: number
  inputShardFilter?: (index: number) => boolean
  inputStream?: ReadableStreamTree[]
  transformInputObject?: (x: unknown) => unknown | Promise<unknown>
  transformInputObjectStream?: () => Duplex
}

export interface DatabaseCopyInput {
  inputConnection?: Record<string, any>
  inputElasticSearch?: Client
  inputFormat?: DatabaseCopyFormat
  inputFiles?: DatabaseCopyInputFile[] | Record<string, DatabaseCopyInputFile>
  inputHost?: string
  inputLeveldb?: level.LevelDB | LevelUp
  inputMongodb?: mongoDB.MongoClient
  inputName?: string
  inputKnex?: Knex
  inputPassword?: string
  inputShardBy?: string
  inputShardFunction?: DatabaseCopyShardFunction
  inputShardIndex?: number
  inputShards?: number
  inputStream?: ReadableStreamTree
  inputTable?: string
  inputType?: DatabaseCopyInputType
  inputPort?: number
  inputUser?: string
}

export interface DatabaseCopyOutput {
  outputConnection?: Record<string, any>
  outputElasticSearch?: Client
  outputFormat?: DatabaseCopyFormat
  outputFile?: string
  outputHost?: string
  outputKnex?: Knex
  outputLeveldb?: level.LevelDB | LevelUp
  outputMongodb?: mongoDB.MongoClient
  outputName?: string
  outputPassword?: string
  outputShardFunction?: DatabaseCopyShardFunction
  outputShards?: number
  outputStream?: WritableStreamTree[]
  outputTable?: string
  outputType?: DatabaseCopyOutputType
  outputPort?: number
  outputUser?: string
}

export interface DatabaseCopyOptions extends DatabaseCopyInput, DatabaseCopyOutput {
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
  probeBytes?: number
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

export function guessFormatFromInput(input: DatabaseCopyInputFile) {
  return input.inputStream ? DatabaseCopyFormat.object : guessFormatFromFilename(input.url)
}

export function getInputConnection(args: DatabaseCopyOptions) {
  const inputFilesEntries = Object.entries(args.inputFiles ?? {})
  const inputFilesType =
    inputFilesEntries.length === 1
      ? guessInputTypeFromFilename(inputFilesEntries[0][1].url)
      : undefined
  return inputHasDatabaseFile(inputFilesType)
    ? {
        database: undefined,
        filename: inputFilesEntries[0][1].url,
        timezone: 'UTC',
        user: undefined,
      }
    : {
        database: args.inputName,
        user: args.inputUser,
        password: args.inputPassword,
        host: args.inputHost,
        port: args.inputPort,
        timezone: 'UTC',
        options: args.inputType === 'mssql' ? { trustServerCertificate: true } : undefined,
        charset: args.inputType === 'mysql' ? 'utf8mb4' : undefined,
        ...args.inputConnection,
      }
}

export function getOutputConnection(args: DatabaseCopyOptions) {
  const outputFileType = guessOutputTypeFromFilename(args.outputFile)
  return outputHasDatabaseFile(outputFileType)
    ? {
        timezone: 'UTC',
        filename: args.outputFile,
      }
    : {
        database: args.outputName,
        user: args.outputUser,
        password: args.outputPassword,
        host: args.outputHost,
        port: args.outputPort,
        timezone: 'UTC',
        options: args.outputType === 'mssql' ? { trustServerCertificate: true } : undefined,
        charset: args.outputType === 'mysql' ? 'utf8mb4' : undefined,
        ...args.outputConnection,
      }
}

export function getInputConnectionString(args: {
  inputHost?: string
  inputPassword?: string
  inputPort?: string | number
  inputUser?: string
}) {
  return `${args.inputUser}:${args.inputPassword}@${args.inputHost}:${args.inputPort}`
}

export function getOutputConnectionString(args: {
  outputHost?: string
  outputPassword?: string
  outputPort?: string | number
  outputUser?: string
}) {
  return `${args.outputUser}:${args.outputPassword}@${args.outputHost}:${args.outputPort}`
}

export function getShardFunction(args: DatabaseCopyOptions) {
  switch (args.outputShardFunction) {
    case DatabaseCopyShardFunction.random:
      return (_: Record<string, any>, modulus: number) => Math.floor(Math.random() * modulus)

    case DatabaseCopyShardFunction.roundrobin:
      let count = 0
      return (_: Record<string, any>, modulus: number) => count++ % modulus

    case DatabaseCopyShardFunction.number:
    case DatabaseCopyShardFunction.md5lsw:
    default:
      return (x: Record<string, any>, modulus: number) => {
        const value = x[args.shardBy!]
        return typeof value === 'number' ? value % modulus : shardIndex(value, modulus)
      }
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

export function getInputFormats(args: DatabaseCopyOptions) {
  if (args.inputStream) return { '0': DatabaseCopyFormat.object }
  const ret: DatabaseCopyFormats = {}
  for (const [key, inputFile] of Object.entries(args.inputFiles ?? {})) {
    ret[key] =
      inputFile.inputFormat ||
      args.inputFormat ||
      ((inputFile.query || args.query) && inputFile.url !== 's3://athena.csv'
        ? DatabaseCopyFormat.jsonl
        : guessFormatFromInput(inputFile) || DatabaseCopyFormat.json)
    if (ret[key] === DatabaseCopyFormat.parquet) initParquet()
  }
  return ret
}

export function getInputFormat(args: DatabaseCopyOptions, inputFormats: DatabaseCopyFormats) {
  if (args.inputFormat) return args.inputFormat
  const formats = Object.values(inputFormats)
  if (!formats.length) return DatabaseCopyFormat.json
  return formats[0] && formats.every((format) => format === formats[0]) ? formats[0] : undefined
}

export function getOutputFormat(args: DatabaseCopyOptions, inputFormat?: DatabaseCopyFormat) {
  return (
    args.outputFormat ||
    guessFormatFromFilename(args.outputFile) ||
    (args.inputFiles && inputFormat) ||
    DatabaseCopyFormat.json
  )
}

export async function openInputs(
  args: DatabaseCopyOptions,
  inputFiles: Array<[string, DatabaseCopyInputFile]>,
  inputFormats: DatabaseCopyFormats,
  inputFormat?: DatabaseCopyFormat,
  outputFormat?: DatabaseCopyFormat
): Promise<ReadableStreamTree[] | Record<string, ReadableStreamTree | ReadableStreamTree[]>> {
  const directoryStream =
    inputFiles.length === 1 &&
    inputFiles[0][1].url?.endsWith('/') &&
    !inputFiles[0][1].url?.startsWith('http') &&
    !args.inputStream
      ? new Readable()
      : undefined
  const inputSpec: Record<string, ReadableFileSpec> = {}
  inputFiles.forEach(([inputFileName, inputFile]) => {
    inputSpec[inputFileName] = {
      format:
        inputFormat === outputFormat && inputFormat === DatabaseCopyFormat.parquet
          ? undefined
          : inputFormat || inputFormats[inputFileName] || undefined,
      url: inputFile.url,
      stream: inputFile.inputStream,
      options: {
        query: inputFile.query || args.query,
        extra: inputFile.extra || args.extra,
        extraOutput: inputFile.extraOutput || args.extraOutput,
        shards: inputFile.inputShards || args.inputShards,
        shardFilter:
          inputFile.inputShardFilter ||
          (args.inputShardIndex !== undefined ? (x) => x === args.inputShardIndex : undefined),
      },
    }
  })
  const inputs: ReadableStreamTree[] | Record<string, ReadableStreamTree[]> = args.inputStream
    ? [args.inputStream]
    : inputFiles.length === 1 && inputFiles[0][1].url === '-'
    ? [StreamTree.readable(process.stdin)]
    : directoryStream
    ? [StreamTree.readable(directoryStream)]
    : await openReadableFileSet(args.fileSystem!, inputSpec)
  // If the input is a directory, read the directory.
  if (directoryStream) {
    directoryStream.push(
      JSON.stringify(await args.fileSystem!.readDirectory(inputFiles[0][1].url!), null, 2)
    )
    directoryStream.push(null)
  }
  return inputs
}

export async function openOutputs(args: DatabaseCopyOptions, format?: DatabaseCopyFormat) {
  const outputs =
    args.outputStream ||
    (args.outputFile === '-'
      ? [StreamTree.writable(process.stdout)]
      : await openWritableFiles(args.fileSystem!, args.outputFile!, {
          contentType: formatContentType(format),
          shards: args.outputShards,
        }))
  for (let i = 0; i < outputs.length; i++) {
    if (args.transformBytesStream) outputs[i] = outputs[i].pipeFrom(args.transformBytesStream())
    if (args.transformBytes) outputs[i] = pipeFromFilter(outputs[i], args.transformBytes)
  }
  return outputs
}

export async function dbcp(args: DatabaseCopyOptions) {
  const inputFiles = Object.entries(args.inputFiles ?? {})
  const inputFormats = getInputFormats(args)
  const inputFormat = getInputFormat(args, inputFormats)
  const outputFormat = getOutputFormat(args, inputFormat)
  const outputType = args.outputType ?? guessOutputTypeFromFilename(args.outputFile) ?? undefined
  const inputConnection = getInputConnection(args)
  const orderByFunction = (args.orderBy?.length ?? 0) > 0 ? getOrderByFunction(args) : undefined
  const externalSortFunction =
    (args.externalSortBy?.length ?? 0) > 0 ? getExternalSortFunction(args) : undefined
  const isNotBytes2Bytes =
    inputFormat !== outputFormat ||
    inputFiles.length > 1 ||
    inputFiles.some((x) => x[1].inputShards) ||
    args.inputShards ||
    args.outputShards ||
    args.externalSortBy ||
    args.transformObject ||
    args.transformObjectStream
  if (
    !args.inputStream &&
    !args.inputKnex &&
    !args.inputElasticSearch &&
    !args.inputLeveldb &&
    !args.inputMongodb &&
    (!inputFiles.length || !args.fileSystem) &&
    (!args.inputType ||
      (!inputConnection.filename && (!inputConnection.database || !inputConnection.user)) ||
      (!args.inputTable && !args.query))
  ) {
    throw new Error(
      `Missing input parameters ${JSON.stringify(
        {
          inputType: args.inputType,
          inputFiles: args.inputFiles,
          inputDatabase: inputConnection.database,
          inputUser: inputConnection.user,
          inputTable: args.inputTable,
        },
        null,
        2
      )}`
    )
  }

  if (
    !args.outputStream &&
    !args.outputKnex &&
    !args.outputElasticSearch &&
    !args.outputLeveldb &&
    !args.outputMongodb &&
    (!args.outputFile || !args.fileSystem) &&
    (!outputType ||
      !args.outputName ||
      !args.outputUser ||
      (!args.outputTable && !args.compoundInsert))
  ) {
    throw new Error(
      `Missing output parameters ${JSON.stringify(
        {
          outputType,
          outputFile: args.outputFile,
          outputDatabase: args.outputName,
          outputUser: args.outputUser,
          outputTable: args.outputTable,
        },
        null,
        2
      )}`
    )
  }

  if (inputFormat === DatabaseCopyFormat.parquet) initParquet()
  const shouldInspectSchema =
    (formatHasSchema(outputFormat) || args.copySchema === DatabaseCopySchema.schemaOnly) &&
    args.outputFile &&
    args.copySchema !== DatabaseCopySchema.dataOnly

  // If the copy input is a database.
  if (!args.inputStream && (!args.inputFiles || inputHasDatabaseFile(args.inputType))) {
    if (args.outputFile && !outputHasDatabaseFile(outputType)) {
      const formattingKnex =
        shouldInspectSchema || outputFormat === DatabaseCopyFormat.sql
          ? outputType
            ? knex({ client: outputType, log: knexLogConfig })
            : args.inputKnex ?? knex({ client: args.inputType, log: knexLogConfig })
          : undefined
      // If the copy is database->file: JSON-formatting transform.
      const input =
        args.copySchema !== DatabaseCopySchema.schemaOnly ? await queryDatabase(args) : undefined
      try {
        const outputs = await openOutputs(args, outputFormat)
        await dumpToFile(input?.input, outputs, {
          columnType: args.columnType,
          copySchema: args.copySchema,
          externalSortFunction,
          format: outputFormat,
          formattingKnex,
          shardFunction: getShardFunction(args),
          schema: shouldInspectSchema ? await databaseInspectSchema(args) : undefined,
          inputTable: args.inputTable,
          outputType: outputType || (args.inputKnex ? args.inputType : undefined),
          outputShards: args.outputShards,
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
        await dumpToDatabase(input.input, { ...args, outputType }, args.outputTable!, {
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
    // Else the copy input is a file.
    const inputs = await openInputs(args, inputFiles, inputFormats, inputFormat, outputFormat)
    if (args.outputStream || (args.outputFile && !outputHasDatabaseFile(outputType))) {
      // If the copy is file->file: no transform.
      const outputs = await openOutputs(args, outputFormat)
      const schema = shouldInspectSchema
        ? args.schema ||
          (args.schemaFile
            ? ((await readJSON(args.fileSystem!, args.schemaFile)) as Column[])
            : inputFiles.length === 1
            ? Object.values(
                await guessSchemaFromFile(args.fileSystem!, inputFiles[0][1].url!, args.probeBytes)
              )
            : undefined)
        : undefined
      await updateObjectPropertiesAsync(inputs, async (inputGroup, inputGroupKey) => {
        const inputArray = Array.isArray(inputGroup) ? inputGroup : [inputGroup]
        await updateObjectPropertiesAsync(inputArray, async (input) => {
          if (isNotBytes2Bytes) {
            const inputFile = findObjectProperty(args.inputFiles, inputGroupKey)
            input = await pipeInputFormatTransform(input, inputFormats[inputGroupKey]!)
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
          format: isNotBytes2Bytes ? outputFormat : undefined,
          formattingKnex:
            shouldInspectSchema && outputIsSqlDatabase(outputType)
              ? knex({ client: outputType, log: knexLogConfig })
              : undefined,
          shardFunction: getShardFunction(args),
          schema,
          inputTable: args.inputTable,
          outputType,
          outputShards: args.outputShards,
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
          input = await pipeInputFormatTransform(input, inputFormats[inputGroupKey]!)
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
        { ...args, outputType },
        inputFormat === DatabaseCopyFormat.sql ? '' : args.outputTable!,
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
        ? options.type === DatabaseCopyInputType.athena
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
    inputTable?: string
    outputType?: string
    outputShards?: number
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
        table: options.inputTable,
        type: options.outputType,
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
            options.inputTable ?? '',
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
            options.inputTable,
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
      const writable = shardWritables(outputs, options.outputShards, options.shardFunction)
      await pumpWritable(writable, undefined, input)
    } else {
      const inputs = shardReadable(input!, options.outputShards, options.shardFunction)
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
  if (args.outputType === DatabaseCopyOutputType.elasticsearch) {
    const client = await openElasticSearchOutput(args)
    try {
      const output = streamToElasticSearch(client, {
        index: args.outputTable ?? '',
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
  } else if (args.outputType === DatabaseCopyOutputType.level) {
    const db = await openLevelDbOutput({
      ...args,
      outputTable: args.outputTable ? [args.outputTable] : undefined,
    })
    const outputLeveldb = Object.values(db.tables)[0] ?? db.db
    const getKey = (item: any) => item[args.orderBy?.[0] || 'id']
    try {
      const output = streamToLevelDb(outputLeveldb, { getKey })
      await pumpWritable(output, undefined, input)
    } catch (error) {
      throw error
    } finally {
      await db.close()
    }
  } else if (args.outputType === DatabaseCopyOutputType.mongodb) {
    const db = await openMongoDbOutput({
      ...args,
      outputTable: args.outputTable ? [args.outputTable] : undefined,
    })
    try {
      const output = Object.values(db.tables)[0]
      const stream = streamToMongoDb(output)
      await pumpWritable(stream, undefined, input)
    } catch (error) {
      throw error
    } finally {
      await db.close()
    }
  } else {
    const outputKnex =
      args.outputKnex ??
      knex({
        client: args.outputType,
        connection: getOutputConnection(args),
        pool: knexPoolConfig,
        useNullAsDefault: args.outputType === DatabaseCopyOutputType.sqlite,
      })
    try {
      return await dumpToKnex(input, outputKnex, table, options)
    } catch (error) {
      throw error
    } finally {
      await outputKnex.destroy()
    }
  }
}

async function queryDatabase(args: DatabaseCopyOptions) {
  if (args.inputType === DatabaseCopyInputType.elasticsearch) {
    const client = await openElasticSearchInput(args)
    let input = await streamFromElasticSearch(client, {
      index: args.inputTable!,
      orderBy: args.orderBy,
    })
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return { input, destroy: () => client.close() }
  } else if (args.inputType === DatabaseCopyInputType.level) {
    const db = await openLevelDbInput({
      ...args,
      inputFile: Object.entries(args.inputFiles!)[0][1].url!,
      inputTable: args.inputTable ? [args.inputTable] : undefined,
    })
    const inputLeveldb = Object.values(db.tables)[0] ?? db.db
    let input = streamFromLevelDb(inputLeveldb)
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return {
      input,
      destroy: () => db.close(),
    }
  } else if (args.inputType === DatabaseCopyInputType.mongodb) {
    const db = await openMongoDbInput({
      ...args,
      inputTable: args.inputTable ? [args.inputTable] : undefined,
    })
    let input = streamFromMongoDb(Object.values(db.tables)[0], args)
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return {
      input,
      destroy: () => db.close(),
    }
  } else {
    const inputKnex =
      args.inputKnex ??
      knex({
        client: args.inputType,
        connection: getInputConnection(args),
        pool: knexPoolConfig,
      } as any)
    let input = queryKnex(inputKnex, args.inputTable!, args)
    if (args.transformObject) input = pipeFilter(input, args.transformObject)
    if (args.transformObjectStream) input = input.pipe(args.transformObjectStream())
    return { input, destroy: () => inputKnex.destroy() }
  }
}

export async function databaseInspectSchema(args: DatabaseCopyOptions) {
  if (args.schema) return args.schema
  if (args.schemaFile) return (await readJSON(args.fileSystem!, args.schemaFile)) as Column[]
  const inputKnex =
    args.inputKnex ??
    knex({
      client: args.inputType,
      connection: getInputConnection(args),
      pool: knexPoolConfig,
    } as any)
  try {
    return await knexInspectTableSchema(inputKnex, args.inputTable ?? '')
  } catch (error) {
    throw error
  } finally {
    await inputKnex.destroy()
  }
}

export function assignDatabaseCopyInputProperties(
  target: DatabaseCopyInput,
  source?: DatabaseCopyInput
) {
  return {
    ...target,
    inputConnection: source?.inputConnection,
    inputElasticSearch: source?.inputElasticSearch,
    inputFormat: source?.inputFormat,
    inputFiles: source?.inputFiles,
    inputHost: source?.inputHost,
    inputLeveldb: source?.inputLeveldb,
    inputMongodb: source?.inputMongodb,
    inputName: source?.inputName,
    inputKnex: source?.inputKnex,
    inputPassword: source?.inputPassword,
    inputShardBy: source?.inputShardBy,
    inputShardFunction: source?.inputShardFunction,
    inputShardIndex: source?.inputShardIndex,
    inputShards: source?.inputShards,
    inputStream: source?.inputStream,
    inputTable: source?.inputTable,
    inputType: source?.inputType,
    inputPort: source?.inputPort,
    inputUser: source?.inputUser,
  }
}

export function assignDatabaseCopyOutputProperties(
  target: DatabaseCopyOutput,
  source?: DatabaseCopyOutput
) {
  return {
    ...target,
    outputConnection: source?.outputConnection,
    outputElasticSearch: source?.outputElasticSearch,
    outputFormat: source?.outputFormat,
    outputFile: source?.outputFile,
    outputHost: source?.outputHost,
    outputKnex: source?.outputKnex,
    outputLeveldb: source?.outputLeveldb,
    outputMongodb: source?.outputMongodb,
    outputName: source?.outputName,
    outputPassword: source?.outputPassword,
    outputShards: source?.outputShards,
    outputStream: source?.outputStream,
    outputTable: source?.outputTable,
    outputType: source?.outputType,
    outputPort: source?.outputPort,
    outputUser: source?.outputUser,
  }
}
