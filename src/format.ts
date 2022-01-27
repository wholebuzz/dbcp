import { pipeCSVFormatter, pipeCSVParser } from '@wholebuzz/fs/lib/csv'
import {
  pipeJSONFormatter,
  pipeJSONLinesFormatter,
  pipeJSONLinesParser,
  pipeJSONParser,
} from '@wholebuzz/fs/lib/json'
import { pipeParquetFormatter } from '@wholebuzz/fs/lib/parquet'
import { pipeTfRecordFormatter, pipeTfRecordParser } from '@wholebuzz/fs/lib/tfrecord'
import { Knex } from 'knex'
import { Column } from 'knex-schema-inspector/dist/types/column'
import { ParquetSchema } from 'parquetjs'
import { ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import { pipeKnexInsertTextTransform } from './knex'
import { parquetFieldFromSchema } from './schema'

export enum DatabaseCopySourceType {
  athena = 'athena',
  es = 'es',
  level = 'level',
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  sqlite = 'sqlite',
}

export enum DatabaseCopyTargetType {
  athena = 'athena',
  es = 'es',
  level = 'level',
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  sqlite = 'sqlite',
}

export enum DatabaseCopyFormat {
  csv = 'csv',
  json = 'json',
  jsonl = 'jsonl',
  ndjson = 'ndjson',
  object = 'object',
  parquet = 'parquet',
  tfrecord = 'tfrecord',
  sql = 'sql',
}

export enum DatabaseCopySchema {
  dataOnly = 'dataOnly',
  schemaOnly = 'schemaOnly',
}

export function guessFormatFromFilename(filename?: string) {
  if (!filename) return null
  if (filename.endsWith('.gz')) filename = filename.substring(0, filename.length - 3)
  if (filename.endsWith('.csv')) return DatabaseCopyFormat.csv
  if (filename.endsWith('.json')) return DatabaseCopyFormat.json
  if (filename.endsWith('.jsonl') || filename.endsWith('.ndjson')) return DatabaseCopyFormat.jsonl
  if (filename.endsWith('.parquet')) return DatabaseCopyFormat.parquet
  if (filename.endsWith('.tfrecord')) return DatabaseCopyFormat.tfrecord
  if (filename.endsWith('.sql')) return DatabaseCopyFormat.sql
  return null
}

export function pipeInputFormatTransform(input: ReadableStreamTree, format: DatabaseCopyFormat) {
  switch (format) {
    case DatabaseCopyFormat.csv:
      return pipeCSVParser(input, { columns: true })
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return pipeJSONLinesParser(input)
    case DatabaseCopyFormat.json:
      return pipeJSONParser(input, true)
    case DatabaseCopyFormat.tfrecord:
      return pipeTfRecordParser(input)
    case DatabaseCopyFormat.object:
      return input
    case DatabaseCopyFormat.parquet:
      return input
    case DatabaseCopyFormat.sql:
      return input
    default:
      throw new Error(`Unsupported input format: ${format}`)
  }
}

export function pipeFromOutputFormatTransform(
  output: WritableStreamTree,
  format: DatabaseCopyFormat,
  db?: Knex,
  tableName?: string,
  options?: {
    schema?: Column[]
    columnType?: Record<string, string>
  }
) {
  switch (format) {
    case DatabaseCopyFormat.csv:
      return pipeCSVFormatter(output, { header: true })
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return pipeJSONLinesFormatter(output)
    case DatabaseCopyFormat.json:
      return pipeJSONFormatter(output, true)
    case DatabaseCopyFormat.object:
      return output
    case DatabaseCopyFormat.parquet:
      const parquetSchema = new ParquetSchema(
        (options?.schema ?? []).reduce((fields: Record<string, any>, column) => {
          fields[column.name] = parquetFieldFromSchema(column, options?.columnType)
          return fields
        }, {})
      )
      return pipeParquetFormatter(output, parquetSchema)
    case DatabaseCopyFormat.tfrecord:
      return pipeTfRecordFormatter(output)
    case DatabaseCopyFormat.sql:
      return pipeKnexInsertTextTransform(output, db, tableName)
    default:
      throw new Error(`Unsupported output format: ${format}`)
  }
}

export function formatContentType(format?: DatabaseCopyFormat) {
  switch (format) {
    case DatabaseCopyFormat.ndjson:
    case DatabaseCopyFormat.jsonl:
      return 'application/x-ndjson'
    case DatabaseCopyFormat.json:
      return 'application/json'
    case DatabaseCopyFormat.sql:
      return 'application/sql'
    default:
      return undefined
  }
}

export function sourceHasDatabaseFile(format?: DatabaseCopySourceType) {
  switch (format) {
    case DatabaseCopySourceType.level:
    case DatabaseCopySourceType.sqlite:
      return true
    default:
      return false
  }
}

export function targetHasDatabaseFile(format?: DatabaseCopyTargetType) {
  switch (format) {
    case DatabaseCopyTargetType.level:
    case DatabaseCopyTargetType.sqlite:
      return true
    default:
      return false
  }
}

export function formatHasSchema(format?: DatabaseCopyFormat) {
  switch (format) {
    case DatabaseCopyFormat.parquet:
    case DatabaseCopyFormat.sql:
      return true
    default:
      return false
  }
}
