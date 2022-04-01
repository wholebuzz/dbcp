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
import { Transform } from 'stream'
import { ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import { pipeKnexInsertTextTransform } from './knex'
import { parquetFieldFromSchema } from './schema'

const ReadlineTransform = require('readline-transform')

export enum DatabaseCopyInputType {
  athena = 'athena',
  elasticsearch = 'elasticsearch',
  file = 'file',
  http = 'http',
  level = 'level',
  mongodb = 'mongodb',
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  redis = 'redis',
  sqlite = 'sqlite',
}

export enum DatabaseCopyOutputType {
  athena = 'athena',
  elasticsearch = 'elasticsearch',
  file = 'file',
  http = 'http',
  level = 'level',
  mongodb = 'mongodb',
  mssql = 'mssql',
  mysql = 'mysql',
  postgresql = 'postgresql',
  redis = 'redis',
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
  txt = 'txt',
  sql = 'sql',
}

export enum DatabaseCopyShardFunction {
  number = 'number',
  md5lsw = 'md5lsw',
  random = 'random',
  roundrobin = 'roundrobin',
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
  // if (filename.endsWith('.txt')) return DatabaseCopyFormat.txt
  if (filename.endsWith('.sql')) return DatabaseCopyFormat.sql
  return null
}

export function guessInputTypeFromFilename(filename?: string) {
  if (!filename) return null
  if (filename.endsWith('.gz')) filename = filename.substring(0, filename.length - 3)
  if (filename.endsWith('.level')) return DatabaseCopyInputType.level
  if (filename.endsWith('.sqlite')) return DatabaseCopyInputType.sqlite
  return null
}

export function guessOutputTypeFromFilename(filename?: string) {
  if (!filename) return null
  if (filename.endsWith('.gz')) filename = filename.substring(0, filename.length - 3)
  if (filename.endsWith('.level')) return DatabaseCopyOutputType.level
  if (filename.endsWith('.sqlite')) return DatabaseCopyOutputType.sqlite
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
    case DatabaseCopyFormat.txt:
      let lineNumber = 0
      return input.pipe(new ReadlineTransform()).pipe(
        new Transform({
          objectMode: true,
          async transform(value: string, _: string, callback: () => void) {
            this.push({ key: lineNumber++, value })
            callback()
          },
        })
      )
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

export function formatContentType(format?: DatabaseCopyFormat | null) {
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

export function inputHasDatabaseFile(format?: DatabaseCopyInputType | null) {
  switch (format) {
    case DatabaseCopyInputType.level:
    case DatabaseCopyInputType.sqlite:
      return true
    default:
      return false
  }
}

export function outputHasDatabaseFile(format?: DatabaseCopyOutputType | null) {
  switch (format) {
    case DatabaseCopyOutputType.level:
    case DatabaseCopyOutputType.sqlite:
      return true
    default:
      return false
  }
}

export function inputIsSqlDatabase(format?: DatabaseCopyInputType | null) {
  switch (format) {
    case DatabaseCopyInputType.mssql:
    case DatabaseCopyInputType.mysql:
    case DatabaseCopyInputType.postgresql:
    case DatabaseCopyInputType.sqlite:
      return true
    default:
      return false
  }
}

export function outputIsSqlDatabase(format?: DatabaseCopyOutputType | null) {
  switch (format) {
    case DatabaseCopyOutputType.mssql:
    case DatabaseCopyOutputType.mysql:
    case DatabaseCopyOutputType.postgresql:
    case DatabaseCopyOutputType.sqlite:
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
