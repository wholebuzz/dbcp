import { FileSystem } from '@wholebuzz/fs/lib/fs'
import {
  pipeFilter,
  pipeFromFilter,
  pipeJSONFormatter,
  pipeJSONLinesFormatter,
  pipeJSONLinesParser,
  pipeJSONParser,
} from '@wholebuzz/fs/lib/json'
import { streamFromKnex, streamToKnex } from 'db-watch/lib/knex'
import Knex from 'knex'
import schemaInspector from 'knex-schema-inspector'
import { Duplex, Readable } from 'stream'
import StreamTree, { pumpWritable, ReadableStreamTree, WritableStreamTree } from 'tree-stream'

export enum DatabaseCopySourceType {
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  smb = 'smb',
  stdin = 'stdin',
}

export enum DatabaseCopyTargetType {
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  smb = 'smb',
  stdout = 'stdout',
}

export enum DatabaseCopyFormat {
  json = 'json',
  jsonl = 'jsonl',
  ndjson = 'ndjson',
  sql = 'sql',
}

export enum DatabaseCopySchema {
  dataOnly,
  schemaOnly,
}

export interface DatabaseCopyOrderBy {
  column: string
  order: DatabaseCopyOrderByDirection
}

export enum DatabaseCopyOrderByDirection {
  asc = 'asc',
  desc = 'desc',
}

export interface DatabaseCopyOptions {
  contentType?: string
  copySchema?: DatabaseCopySchema
  dbname?: string
  fileSystem?: FileSystem
  orderBy?: DatabaseCopyOrderBy[]
  password?: string
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
    (!args.sourceType || !sourceConnection.database || !sourceConnection.user || !args.sourceTable)
  ) {
    throw new Error(`Missing source parameters ${JSON.stringify(args, null, 2)}`)
  }

  if (
    !targetStdout &&
    !args.targetStream &&
    !args.targetKnex &&
    (!args.targetFile || !args.fileSystem) &&
    (!args.targetType || !targetConnection.database || !targetConnection.user || !args.targetTable)
  ) {
    throw new Error(`Missing target parameters ${JSON.stringify(args, null, 2)}`)
  }

  // If the copy source is a database.
  if (!sourceStdin && !args.sourceStream && !args.sourceFile) {
    const sourceKnex =
      args.sourceKnex ??
      Knex({
        client: args.sourceType,
        connection: sourceConnection,
        pool: knexPoolConfig,
      } as any)
    const shouldInspectSchema =
      targetFormat === DatabaseCopyFormat.sql &&
      (targetStdout || args.targetFile) &&
      args.copySchema !== DatabaseCopySchema.dataOnly
    const formattingKnex =
      shouldInspectSchema && args.targetType && args.targetType !== DatabaseCopyTargetType.stdout
        ? Knex({ client: args.targetType, log: knexLogConfig })
        : sourceKnex
    const createTable = shouldInspectSchema
      ? await inspectCreateTableSchema(sourceKnex, formattingKnex, args.sourceTable ?? '')
      : undefined
    if (args.targetFile || targetStdout) {
      // If the copy is database->file: JSON-formatting transform.
      let output = targetStdout
        ? StreamTree.writable(process.stdout)
        : await args.fileSystem!.openWritableFile(args.targetFile!, undefined, {
            contentType: formatContentType(targetFormat),
          })
      if (args.transformBytesStream) output = output.pipeFrom(args.transformBytesStream)
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (args.copySchema === DatabaseCopySchema.schemaOnly) {
        const readable = new Readable()
        if (createTable) readable.push(createTable)
        readable.push(null)
        await pumpWritable(output, undefined, readable)
      } else {
        const input = queryDatabase(sourceKnex, args.sourceTable!, args)
        if (createTable) output.node.stream.write(createTable)
        output = pipeFromOutputFormatTransform(
          output,
          targetFormat,
          formattingKnex,
          args.sourceTable
        )
        await pumpWritable(output, undefined, input.finish())
      }
    } else {
      // If the copy is database->database: no transform.
      const input = queryDatabase(sourceKnex, args.sourceTable!, args)
      const targetKnex =
        args.targetKnex ??
        Knex({
          client: args.targetType,
          connection: targetConnection,
          pool: knexPoolConfig,
        })
      await dumpToDatabase(input, targetKnex, args.targetTable!)
      await targetKnex.destroy()
    }
    await sourceKnex.destroy()
  } else {
    // Else the copy source is a file (or directory).
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
        : await args.fileSystem!.openReadableFile(args.sourceFile!))
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
          : await args.fileSystem!.openWritableFile(args.targetFile!, undefined, {
              contentType: formatContentType(sourceFormat),
            }))
      if (sourceFormat !== targetFormat) input = pipeInputFormatTransform(input, sourceFormat)
      if (args.transformBytesStream) output = output.pipeFrom(args.transformBytesStream)
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (sourceFormat !== targetFormat) {
        output = pipeFromOutputFormatTransform(output, targetFormat)
      }
      return pumpWritable(output, undefined, input.finish())
    } else {
      // If the copy is file->database: JSON-parsing transform.
      input = pipeInputFormatTransform(input, sourceFormat)
      if (args.transformJsonStream) input = input.pipe(args.transformJsonStream)
      if (args.transformJson) input = pipeFilter(input, args.transformJson)
      const targetKnex =
        args.targetKnex ??
        Knex({
          client: args.targetType,
          connection: targetConnection,
          pool: knexPoolConfig,
        })
      await dumpToDatabase(input, targetKnex, args.targetTable!)
      await targetKnex.destroy()
    }
  }
}

export async function inspectCreateTableSchema(
  sourceKnex: Knex,
  targetKnex: Knex,
  tableName: string
) {
  const inspector = schemaInspector(sourceKnex)
  const columnsInfo = await inspector.columnInfo(tableName)
  return (
    targetKnex.schema
      .createTableIfNotExists(tableName ?? '', (t) => {
        for (const columnInfo of columnsInfo) {
          let column
          switch (columnInfo.data_type) {
            case 'timestamp with time zone':
              column = t.dateTime(columnInfo.name, { precision: 6 })
              break
            case 'float':
              column = t.float(columnInfo.name)
              break
            case 'integer':
              column = t.integer(columnInfo.name)
              break
            case 'json':
              column = t.json(columnInfo.name)
              break
            case 'jsonb':
              column = t.jsonb(columnInfo.name)
              break
            case 'character varying':
            case 'text':
              column = t.text(columnInfo.name)
              break
          }
          if (!column) continue
          if (columnInfo.is_primary_key) column = column.primary()
          if (columnInfo.is_unique) column = column.unique()
          // if (columnInfo.is_nullable) column = column.nullable()
          if (columnInfo.is_nullable === false) column = column.notNullable()
        }
      })
      .toString() + ';\n'
  )
}

export function guessFormatFromFilename(filename?: string) {
  if (!filename) return null
  if (filename.endsWith('.gz')) filename = filename.substring(0, filename.length - 3)
  if (filename.endsWith('.json')) return DatabaseCopyFormat.json
  if (filename.endsWith('.jsonl') || filename.endsWith('.ndjson')) return DatabaseCopyFormat.jsonl
  if (filename.endsWith('.sql')) return DatabaseCopyFormat.sql
  return null
}

export function pipeInputFormatTransform(input: ReadableStreamTree, format: DatabaseCopyFormat) {
  switch (format) {
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return pipeJSONLinesParser(input)
    case DatabaseCopyFormat.json:
      return pipeJSONParser(input, true)
    case DatabaseCopyFormat.sql:
      return input
  }
}

export function pipeFromOutputFormatTransform(
  output: WritableStreamTree,
  format: DatabaseCopyFormat,
  knex?: Knex,
  tableName?: string
) {
  switch (format) {
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return pipeJSONLinesFormatter(output)
    case DatabaseCopyFormat.json:
      return pipeJSONFormatter(output, true)
    case DatabaseCopyFormat.sql:
      return pipeFromFilter(
        output,
        (x) =>
          knex
            ?.table(tableName ?? '')
            .insert(x)
            .toString() + ';\n'
      )
  }
}

export function formatContentType(format: DatabaseCopyFormat) {
  switch (format) {
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return 'application/x-ndjson'
    case DatabaseCopyFormat.json:
      return 'application/json'
    case DatabaseCopyFormat.sql:
      return 'application/sql'
  }
}

function queryDatabase(
  knex: Knex,
  table: string,
  options: {
    orderBy?: DatabaseCopyOrderBy[]
    transformJson?: (x: unknown) => unknown
    transformJsonStream?: Duplex
  }
) {
  let query = knex(table)
  if (options.orderBy) {
    for (const order of options.orderBy) query = query.orderBy(order.column, order.order)
  }
  let input = streamFromKnex(knex, query)
  if (options.transformJsonStream) input = input.pipe(options.transformJsonStream)
  if (options.transformJson) input = pipeFilter(input, options.transformJson)
  return input
}

async function dumpToDatabase(input: ReadableStreamTree, knex: Knex, table: string) {
  await knex.transaction(async (transaction) => {
    const output = streamToKnex({ transaction }, { table })
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
