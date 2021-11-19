import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { pipeFilter } from '@wholebuzz/fs/lib/stream'
import { pumpReadable } from 'tree-stream'
import { guessFormatFromFilename, pipeInputFormatTransform } from './format'
export interface Column {
  name: string
  table: string
  data_type: string
  default_value: any | null
  max_length: number | null
  numeric_precision: number | null
  numeric_scale: number | null
  is_nullable: boolean
  is_unique: boolean
  is_primary_key: boolean
  is_generated: boolean
  generation_expression?: string | null
  has_auto_increment: boolean
  foreign_key_table: string | null
  foreign_key_column: string | null
  comment?: string | null
  schema?: string
  foreign_key_schema?: string | null
}

export function newSchemaColumn(table: string, name: string, type: string): Column {
  return {
    data_type: type,
    default_value: null,
    foreign_key_column: null,
    foreign_key_table: null,
    has_auto_increment: false,
    is_generated: false,
    is_nullable: false,
    is_primary_key: false,
    is_unique: false,
    max_length: null,
    name,
    numeric_precision: null,
    numeric_scale: null,
    table,
  }
}

export async function guessSchemaFromFile(
  fileSystem: FileSystem,
  filename: string,
  probeBytes = 65536
) {
  const schema: Record<string, Column> = {}
  const format = guessFormatFromFilename(filename)
  if (!format) throw new Error(`Unknown format: ${filename}`)
  let input = await fileSystem.openReadableFile(
    filename,
    probeBytes
      ? {
          byteOffset: 0,
          byteLength: probeBytes,
        }
      : undefined
  )
  input = pipeInputFormatTransform(input, format)
  input = pipeFilter(input, (x: Record<string, any>) => {
    for (const [key, value] of Object.entries(x)) {
      if (!schema[key]) schema[key] = newSchemaColumn('', key, '')
      if (value === null || value === undefined) {
        schema[key].is_nullable = true
      } else if (value instanceof Date) {
        schema[key].data_type = 'date'
      } else {
        let valueType
        switch (typeof value) {
          case 'boolean':
            valueType = 'boolean'
            break
          case 'number':
            valueType = 'integer'
            break
          case 'object':
            valueType = 'json'
            break
          default:
            valueType = 'text'
            break
        }
        schema[key].data_type = valueType
      }
    }
  })
  await pumpReadable(input, schema).catch((_x) => _x)
  return schema
}

export function parquetFieldFromSchema(schema: Column, columnType?: Record<string, any>) {
  const type = columnType?.[schema.name] || schema.data_type
  const optional = schema.is_nullable !== false
  switch (type) {
    case 'boolean':
      return { type: 'BOOLEAN', optional }
    case 'int':
    case 'integer':
      return { type: 'INT32', optional }
    case 'double precision':
    case 'float':
      return { type: 'DOUBLE', optional }
    case 'datetime':
    case 'datetime2':
    case 'timestamp with time zone':
      return { type: 'TIMESTAMP_MILLIS', optional }
    case 'json':
    case 'jsonb':
      return { type: 'JSON', optional, compression: 'GZIP' }
    case 'character varying':
    case 'nvarchar':
    case 'text':
    default:
      return { type: 'UTF8', optional, compression: 'GZIP' }
  }
}
