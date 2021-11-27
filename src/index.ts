import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readJSON } from '@wholebuzz/fs/lib/json'
import { mergeStreams } from '@wholebuzz/fs/lib/merge'
import { openParquetFiles } from '@wholebuzz/fs/lib/parquet'
import { pipeFilter, pipeFromFilter, shardWritables } from '@wholebuzz/fs/lib/stream'
import { openReadableFiles, openWritableFiles, shardIndex } from '@wholebuzz/fs/lib/util'
import { Knex, knex } from 'knex'
import { Duplex, Readable } from 'stream'
import StreamTree, { pumpWritable, ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import { streamToKnexCompoundInsert } from './compound'
import {
  DatabaseCopyFormat,
  DatabaseCopySchema,
  DatabaseCopySourceType,
  DatabaseCopyTargetType,
  formatContentType,
  formatHasSchema,
  guessFormatFromFilename,
  pipeFromOutputFormatTransform,
  pipeInputFormatTransform,
} from './format'
import {
  knexFormatCreateTableSchema,
  knexInspectTableSchema,
  streamFromKnex,
  streamToKnex,
  streamToKnexRaw,
} from './knex'
import { Column, guessSchemaFromFile } from './schema'

const { PARQUET_LOGICAL_TYPES } = require('parquetjs/lib/types')

export interface DatabaseCopyOptions {
  batchSize?: number
  columnType?: Record<string, string>
  compoundInsert?: boolean
  contentType?: string
  copySchema?: DatabaseCopySchema
  fileSystem?: FileSystem
  limit?: number
  orderBy?: string[]
  query?: string
  shardBy?: string
  schema?: Column[]
  schemaFile?: string
  sourceConnection?: Record<string, any>
  sourceFormat?: DatabaseCopyFormat
  sourceName?: string
  sourceFile?: string
  sourceHost?: string
  sourceKnex?: Knex
  sourcePassword?: string
  sourceShards?: number
  sourceStream?: ReadableStreamTree
  sourceTable?: string
  sourceType?: DatabaseCopySourceType
  sourcePort?: number
  sourceUser?: string
  targetConnection?: Record<string, any>
  targetFormat?: DatabaseCopyFormat
  targetName?: string
  targetFile?: string
  targetHost?: string
  targetKnex?: Knex
  targetPassword?: string
  targetShards?: number
  targetStream?: WritableStreamTree[]
  targetTable?: string
  targetType?: DatabaseCopyTargetType
  targetPort?: number
  targetUser?: string
  transformJson?: (x: unknown) => unknown
  transformJsonStream?: () => Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: () => Duplex
  where?: string[]
}

export function getSourceConnection(args: DatabaseCopyOptions) {
  return {
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
  return {
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

export function getSourceFormat(args: DatabaseCopyOptions) {
  return args.sourceFormat || guessFormatFromFilename(args.sourceFile) || DatabaseCopyFormat.json
}

export function getTargetFormat(args: DatabaseCopyOptions, sourceFormat?: DatabaseCopyFormat) {
  return (
    args.targetFormat ||
    guessFormatFromFilename(args.targetFile) ||
    (args.sourceFile && sourceFormat) ||
    DatabaseCopyFormat.json
  )
}

export async function openSources(args: DatabaseCopyOptions, format?: DatabaseCopyFormat) {
  const directoryStream =
    args.sourceFile!.endsWith('/') && !args.sourceFile!.startsWith('http') && !args.sourceStream
      ? new Readable()
      : undefined
  const inputs: ReadableStreamTree[] = args.sourceStream
    ? [args.sourceStream]
    : args.sourceFile === '-'
    ? [StreamTree.readable(process.stdin)]
    : directoryStream
    ? [StreamTree.readable(directoryStream)]
    : format === DatabaseCopyFormat.parquet && !args.query
    ? await openParquetFiles(args.fileSystem!, args.sourceFile!)
    : await openReadableFiles(args.fileSystem!, args.sourceFile!, {
        query: args.query,
        shards: args.sourceShards,
      })
  // If the source is a directory, read the directory.
  if (directoryStream) {
    directoryStream.push(
      JSON.stringify(await args.fileSystem!.readDirectory(args.sourceFile!), null, 2)
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
  const sourceFormat = getSourceFormat(args)
  const targetFormat = getTargetFormat(args, sourceFormat)
  const sourceConnection = getSourceConnection(args)
  const targetConnection = getTargetConnection(args)
  const orderByFunction = (args.orderBy?.length ?? 0) > 0 ? getOrderByFunction(args) : undefined

  if (
    !args.sourceStream &&
    !args.sourceKnex &&
    (!args.sourceFile || !args.fileSystem) &&
    (!args.sourceType ||
      !sourceConnection.database ||
      !sourceConnection.user ||
      (!args.sourceTable && !args.query))
  ) {
    throw new Error(
      `Missing source parameters ${JSON.stringify(
        {
          sourceType: args.sourceType,
          sourceFile: args.sourceFile,
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
    (!args.targetFile || !args.fileSystem) &&
    (!args.targetType ||
      !targetConnection.database ||
      !targetConnection.user ||
      (!args.targetTable && !args.compoundInsert))
  ) {
    throw new Error(
      `Missing target parameters ${JSON.stringify(
        {
          targetType: args.targetType,
          targetFile: args.targetFile,
          targetDatabase: targetConnection.database,
          targetUser: targetConnection.user,
          targetTable: args.targetTable,
        },
        null,
        2
      )}`
    )
  }
  const shouldInspectSchema =
    (formatHasSchema(targetFormat) || args.copySchema === DatabaseCopySchema.schemaOnly) &&
    args.targetFile &&
    args.copySchema !== DatabaseCopySchema.dataOnly

  // If the copy source is a database.
  if (!args.sourceStream && !args.sourceFile) {
    const sourceKnex =
      args.sourceKnex ??
      knex({
        client: args.sourceType,
        connection: sourceConnection,
        pool: knexPoolConfig,
      } as any)
    const formattingKnex =
      shouldInspectSchema && args.targetType
        ? knex({ client: args.targetType, log: knexLogConfig })
        : sourceKnex
    const schema = shouldInspectSchema
      ? args.schema ||
        (args.schemaFile
          ? ((await readJSON(args.fileSystem!, args.schemaFile)) as Column[])
          : await knexInspectTableSchema(sourceKnex, args.sourceTable ?? ''))
      : undefined
    if (args.targetFile) {
      // If the copy is database->file: JSON-formatting transform.
      const outputs = await openTargets(args, targetFormat)
      await dumpToFile(
        args.copySchema !== DatabaseCopySchema.schemaOnly
          ? queryDatabase(sourceKnex, args.sourceTable!, args)
          : undefined,
        outputs,
        {
          columnType: args.columnType,
          copySchema: args.copySchema,
          format: targetFormat,
          formattingKnex,
          shardFunction: getShardFunction(args),
          schema,
          sourceTable: args.sourceTable,
          targetShards: args.targetShards,
        }
      )
    } else {
      // If the copy is database->database: no transform.
      const input = queryDatabase(sourceKnex, args.sourceTable!, args)
      const targetKnex =
        args.targetKnex ??
        knex({
          client: args.targetType,
          connection: targetConnection,
          pool: knexPoolConfig,
        })
      await dumpToDatabase(input, targetKnex, args.targetTable!, {
        batchSize: args.batchSize,
        compoundInsert: args.compoundInsert,
      })
      await targetKnex.destroy()
    }
    await sourceKnex.destroy()
  } else {
    // Else the copy source is a file.
    if (sourceFormat === DatabaseCopyFormat.parquet) {
      PARQUET_LOGICAL_TYPES.TIMESTAMP_MILLIS.fromPrimitive = (x: any) => new Date(Number(BigInt(x)))
    }
    const inputs = await openSources(args, sourceFormat)
    if (args.targetStream || args.targetFile) {
      // If the copy is file->file: no transform.
      const outputs = await openTargets(args, targetFormat)
      const schema = shouldInspectSchema
        ? args.schema ||
          (args.schemaFile
            ? ((await readJSON(args.fileSystem!, args.schemaFile)) as Column[])
            : args.sourceFile
            ? Object.values(await guessSchemaFromFile(args.fileSystem!, args.sourceFile))
            : undefined)
        : undefined
      for (let i = 0; i < inputs.length; i++) {
        if (sourceFormat !== targetFormat || args.sourceShards || args.targetShards) {
          inputs[i] = await pipeInputFormatTransform(inputs[i], sourceFormat)
          if (args.transformJson) inputs[i] = pipeFilter(inputs[i], args.transformJson)
          if (args.transformJsonStream) inputs[i] = inputs[i].pipe(args.transformJsonStream())
        }
      }
      await dumpToFile(mergeStreams(inputs, { compare: orderByFunction }), outputs, {
        columnType: args.columnType,
        copySchema: args.copySchema,
        format:
          sourceFormat !== targetFormat || args.sourceShards || args.targetShards
            ? targetFormat
            : undefined,
        formattingKnex:
          shouldInspectSchema && args.targetType
            ? knex({ client: args.targetType, log: knexLogConfig })
            : undefined,
        shardFunction: getShardFunction(args),
        schema,
        sourceTable: args.sourceTable,
        targetShards: args.targetShards,
      })
    } else {
      // If the copy is file->database: JSON-parsing transform.
      for (let i = 0; i < inputs.length; i++) {
        if (args.transformBytes) inputs[i] = pipeFilter(inputs[i], args.transformBytes)
        if (args.transformBytesStream) inputs[i] = inputs[i].pipe(args.transformBytesStream())
        inputs[i] = await pipeInputFormatTransform(inputs[i], sourceFormat)
        if (args.transformJson) inputs[i] = pipeFilter(inputs[i], args.transformJson)
        if (args.transformJsonStream) inputs[i] = inputs[i].pipe(args.transformJsonStream())
      }
      const targetKnex =
        args.targetKnex ??
        knex({
          client: args.targetType,
          connection: targetConnection,
          pool: knexPoolConfig,
        })
      await dumpToDatabase(
        mergeStreams(inputs, { compare: orderByFunction }),
        targetKnex,
        sourceFormat === DatabaseCopyFormat.sql ? '' : args.targetTable!,
        { batchSize: args.batchSize, compoundInsert: args.compoundInsert }
      )
      await targetKnex.destroy()
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
  }
) {
  const readable = new Readable()
  if (options.schema) {
    readable.push(
      options.format === DatabaseCopyFormat.sql
        ? knexFormatCreateTableSchema(
            options.formattingKnex!,
            options.table ?? '',
            options.schema,
            options.columnType
          )
        : JSON.stringify(options.schema)
    )
  }
  readable.push(null)
  await pumpWritable(output, undefined, readable)
}

export async function dumpToFile(
  input: ReadableStreamTree | undefined,
  outputs: WritableStreamTree[],
  options: {
    columnType?: Record<string, string>
    copySchema?: DatabaseCopySchema
    format?: DatabaseCopyFormat
    formattingKnex?: Knex
    schema?: Column[]
    shardFunction?: (x: Record<string, any>, modulus: number) => number
    sourceTable?: string
    targetShards?: number
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
      })
    }
  } else {
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
    if (options.format !== undefined) {
      for (let i = 0; i < outputs.length; i++) {
        outputs[i] = await pipeFromOutputFormatTransform(
          outputs[i],
          options.format,
          options.formattingKnex,
          options.sourceTable,
          options.schema ? { schema: options.schema, columnType: options.columnType } : undefined
        )
      }
    }
    return pumpWritable(
      shardWritables(outputs, options.targetShards, options.shardFunction),
      undefined,
      input!.finish()
    )
  }
}

async function dumpToDatabase(
  input: ReadableStreamTree,
  db: Knex,
  table: string,
  options?: { compoundInsert?: boolean; batchSize?: number; returning?: string }
) {
  if (!table && !options?.compoundInsert) input.node.stream.setEncoding('utf8')
  await db.transaction(async (transaction) => {
    const output = options?.compoundInsert
      ? streamToKnexCompoundInsert({ transaction }, { ...options })
      : table
      ? streamToKnex({ transaction }, { table, ...options })
      : streamToKnexRaw({ transaction })
    await pumpWritable(output, undefined, input.finish())
    return transaction.commit().catch(transaction.rollback)
  })
}

function queryDatabase(
  db: Knex,
  table: string,
  options: {
    limit?: number
    orderBy?: string[]
    query?: string
    transformJson?: (x: unknown) => unknown
    transformJsonStream?: () => Duplex
    where?: string[]
  }
) {
  let input
  if (options.query) {
    input = StreamTree.readable(db.raw(options.query).stream())
  } else {
    let query = db(table)
    for (const where of options.where ?? []) {
      query = query.where(db.raw(where))
    }
    for (const orderBy of options.orderBy ?? []) {
      query = query.orderByRaw(orderBy)
    }
    if (options.limit) query.limit(options.limit)
    input = streamFromKnex(query)
  }
  if (options.transformJson) input = pipeFilter(input, options.transformJson)
  if (options.transformJsonStream) input = input.pipe(options.transformJsonStream())
  return input
}

export const knexLogConfig = {
  warn(_message: any) {
    /* */
  },
  error(_message: any) {
    /* */
  },
  deprecate(_message: any) {
    /* */
  },
  debug(_message: any) {
    /* */
  },
}

export const knexPoolConfig = {
  // https://github.com/Vincit/tarn.js/blob/master/src/Pool.ts
  // https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/cloud-sql/postgres/knex/server.js
  acquireTimeoutMillis: 60000,
  createRetryIntervalMillis: 200,
  createTimeoutMillis: 30000,
  idleTimeoutMillis: 600000,
  min: 1,
  max: 1,
}
