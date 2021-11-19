import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readJSON } from '@wholebuzz/fs/lib/json'
import { openParquetFile } from '@wholebuzz/fs/lib/parquet'
import { pipeFilter, pipeFromFilter } from '@wholebuzz/fs/lib/stream'
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
  dbname?: string
  fileSystem?: FileSystem
  orderBy?: string
  password?: string
  query?: string
  schemaFile?: string
  sourceConnection?: Record<string, any>
  sourceFormat?: DatabaseCopyFormat
  sourceName?: string
  sourceFile?: string
  sourceHost?: string
  sourceKnex?: Knex
  sourcePassword?: string
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
  targetStream?: WritableStreamTree
  targetTable?: string
  targetType?: DatabaseCopyTargetType
  targetPort?: number
  targetUser?: string
  transformJson?: (x: unknown) => unknown
  transformJsonStream?: Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: Duplex
  where?: string
}

export async function dbcp(args: DatabaseCopyOptions) {
  const sourceStdin = args.sourceType === DatabaseCopySourceType.stdin
  const targetStdout = args.targetType === DatabaseCopyTargetType.stdout
  const sourceFormat =
    args.sourceFormat || guessFormatFromFilename(args.sourceFile) || DatabaseCopyFormat.json
  const targetFormat =
    args.targetFormat ||
    guessFormatFromFilename(args.targetFile) ||
    (args.sourceFile && sourceFormat) ||
    DatabaseCopyFormat.json
  const sourceConnection = {
    database: args.sourceName,
    user: args.sourceUser,
    password: args.sourcePassword,
    host: args.sourceHost,
    port: args.sourcePort,
    options: args.sourceType === 'mssql' ? { trustServerCertificate: true } : undefined,
    charset: args.sourceType === 'mysql' ? 'utf8mb4' : undefined,
    ...args.sourceConnection,
  }
  const targetConnection = {
    database: args.targetName,
    user: args.targetUser,
    password: args.targetPassword,
    host: args.targetHost,
    port: args.targetPort,
    options: args.targetType === 'mssql' ? { trustServerCertificate: true } : undefined,
    charset: args.targetType === 'mysql' ? 'utf8mb4' : undefined,
    ...args.targetConnection,
  }

  if (
    !sourceStdin &&
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
    !targetStdout &&
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
    (targetStdout || args.targetFile) &&
    args.copySchema !== DatabaseCopySchema.dataOnly

  // If the copy source is a database.
  if (!sourceStdin && !args.sourceStream && !args.sourceFile) {
    const sourceKnex =
      args.sourceKnex ??
      knex({
        client: args.sourceType,
        connection: sourceConnection,
        pool: knexPoolConfig,
      } as any)
    const formattingKnex =
      shouldInspectSchema && args.targetType && args.targetType !== DatabaseCopyTargetType.stdout
        ? knex({ client: args.targetType, log: knexLogConfig })
        : sourceKnex
    const schema = shouldInspectSchema
      ? args.schemaFile
        ? ((await readJSON(args.fileSystem!, args.schemaFile)) as Column[])
        : await knexInspectTableSchema(sourceKnex, args.sourceTable ?? '')
      : undefined
    if (args.targetFile || targetStdout) {
      // If the copy is database->file: JSON-formatting transform.
      let output = targetStdout
        ? StreamTree.writable(process.stdout)
        : await args.fileSystem!.openWritableFile(args.targetFile!, {
            contentType: formatContentType(targetFormat),
          })
      if (args.transformBytesStream) output = output.pipeFrom(args.transformBytesStream)
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (args.copySchema === DatabaseCopySchema.schemaOnly) {
        const readable = new Readable()
        if (schema) {
          readable.push(
            targetFormat === DatabaseCopyFormat.sql
              ? knexFormatCreateTableSchema(
                  formattingKnex,
                  args.sourceTable ?? '',
                  schema,
                  args.columnType
                )
              : JSON.stringify(schema)
          )
        }
        readable.push(null)
        await pumpWritable(output, undefined, readable)
      } else {
        // If not schemaOnly
        const input = queryDatabase(sourceKnex, args.sourceTable!, args)
        if (schema && targetFormat === DatabaseCopyFormat.sql) {
          output.node.stream.write(
            knexFormatCreateTableSchema(
              formattingKnex,
              args.sourceTable ?? '',
              schema,
              args.columnType
            )
          )
        }
        output = pipeFromOutputFormatTransform(
          output,
          targetFormat,
          formattingKnex,
          args.sourceTable,
          { schema, columnType: args.columnType }
        )
        await pumpWritable(output, undefined, input.finish())
      }
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
    // Else the copy source is a file (or directory).
    if (sourceFormat === DatabaseCopyFormat.parquet) {
      PARQUET_LOGICAL_TYPES.TIMESTAMP_MILLIS.fromPrimitive = (x: any) => new Date(Number(BigInt(x)))
    }
    const directoryStream =
      args.sourceFile!.endsWith('/') &&
      !args.sourceFile!.startsWith('http') &&
      !args.sourceStream &&
      !sourceStdin
        ? new Readable()
        : undefined
    let input =
      args.sourceStream ||
      (sourceStdin
        ? StreamTree.readable(process.stdin)
        : directoryStream
        ? StreamTree.readable(directoryStream)
        : sourceFormat === DatabaseCopyFormat.parquet
        ? await openParquetFile(args.fileSystem!, args.sourceFile!)
        : await args.fileSystem!.openReadableFile(args.sourceFile!, { query: args.query }))
    // If the source is a directory, read the directory.
    if (directoryStream) {
      directoryStream.push(
        JSON.stringify(await args.fileSystem!.readDirectory(args.sourceFile!), null, 2)
      )
      directoryStream.push(null)
    }
    if (args.targetStream || args.targetFile || targetStdout) {
      // If the copy is file->file: no transform.
      let output =
        args.targetStream ||
        (targetStdout
          ? StreamTree.writable(process.stdout)
          : await args.fileSystem!.openWritableFile(args.targetFile!, {
              contentType: formatContentType(sourceFormat),
            }))
      if (sourceFormat !== targetFormat) {
        input = pipeInputFormatTransform(input, sourceFormat)
        if (args.transformJson) input = pipeFilter(input, args.transformJson)
        if (args.transformJsonStream) input = input.pipe(args.transformJsonStream)
      }
      if (args.transformBytesStream) output = output.pipeFrom(args.transformBytesStream)
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (sourceFormat !== targetFormat) {
        output = pipeFromOutputFormatTransform(
          output,
          targetFormat,
          args.targetType ? knex({ client: args.targetType, log: knexLogConfig }) : undefined,
          args.targetTable,
          shouldInspectSchema && args.sourceFile
            ? {
                schema: Object.values(await guessSchemaFromFile(args.fileSystem!, args.sourceFile)),
                columnType: args.columnType,
              }
            : undefined
        )
      }
      return pumpWritable(output, undefined, input.finish())
    } else {
      // If the copy is file->database: JSON-parsing transform.
      if (args.transformBytes) input = pipeFilter(input, args.transformBytes)
      if (args.transformBytesStream) input = input.pipe(args.transformBytesStream)
      input = pipeInputFormatTransform(input, sourceFormat)
      if (args.transformJson) input = pipeFilter(input, args.transformJson)
      if (args.transformJsonStream) input = input.pipe(args.transformJsonStream)
      const targetKnex =
        args.targetKnex ??
        knex({
          client: args.targetType,
          connection: targetConnection,
          pool: knexPoolConfig,
        })
      await dumpToDatabase(
        input,
        targetKnex,
        sourceFormat === DatabaseCopyFormat.sql ? '' : args.targetTable!,
        { batchSize: args.batchSize, compoundInsert: args.compoundInsert }
      )
      await targetKnex.destroy()
    }
  }
}

function queryDatabase(
  db: Knex,
  table: string,
  options: {
    orderBy?: string
    query?: string
    transformJson?: (x: unknown) => unknown
    transformJsonStream?: Duplex
    where?: string
  }
) {
  let input
  if (options.query) {
    input = StreamTree.readable(db.raw(options.query).stream())
  } else {
    let query = db(table)
    if (options.where) {
      query = query.where(db.raw(options.where))
    }
    if (options.orderBy) {
      query = query.orderByRaw(options.orderBy)
    }
    input = streamFromKnex(query)
  }
  if (options.transformJson) input = pipeFilter(input, options.transformJson)
  if (options.transformJsonStream) input = input.pipe(options.transformJsonStream)
  return input
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
