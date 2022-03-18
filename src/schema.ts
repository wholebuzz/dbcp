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
  is_array?: boolean
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
  sub_columns?: Record<string, Column> | null
}

export function newSchemaColumn(table: string, name: string, type: string): Column {
  return {
    data_type: type,
    default_value: null,
    foreign_key_column: null,
    foreign_key_table: null,
    has_auto_increment: false,
    is_generated: false,
    is_nullable: true,
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
  input = await pipeInputFormatTransform(input, format)
  input = pipeFilter(input, (x: Record<string, any>) => {
    for (const [key, value] of Object.entries(x)) {
      if (!schema[key]) schema[key] = newSchemaColumn('', key, '')
      guessColumnType(schema[key], value)
    }
  })
  await pumpReadable(input, schema).catch((_x) => _x)
  return schema
}

export function guessColumnType(column: Column, value: Record<string, any>) {
  if (value === null || value === undefined) {
    column.is_nullable = true
  } else if (value instanceof Date) {
    column.data_type = 'date'
  } else if (Array.isArray(value)) {
    column.data_type = 'json'
    column.is_array = true
    if (!column.sub_columns) column.sub_columns = {}
    if (!column.sub_columns['0']) column.sub_columns['0'] = newSchemaColumn('', '0', '')
    if (value.length > 0) guessColumnType(column.sub_columns['0'], value[0])
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
        if (!column.sub_columns) column.sub_columns = {}
        for (const [subkey, subvalue] of Object.entries(value)) {
          if (!column.sub_columns[subkey])
            column.sub_columns[subkey] = newSchemaColumn('', subkey, '')
          guessColumnType(column.sub_columns[subkey], subvalue)
        }
        break
      default:
        valueType = 'text'
        break
    }
    column.data_type = valueType
  }
}

export function normalizeToSchema(
  record: any,
  columns: Column[],
  columnType?: Record<string, any>
) {
  for (const column of columns) {
    const type = columnType?.[column.name] || column.data_type
    const v = record[column.name]
    switch (type) {
      case 'boolean':
        if (v != null && typeof v !== 'boolean') record[column.name] = !!v
        break
      case 'int':
      case 'integer':
        if (v != null && typeof v !== 'number') {
          record[column.name] = parseInt(v.toString(), 10)
        }
        break
      case 'double precision':
      case 'float':
        if (v != null && typeof v !== 'number') {
          record[column.name] = parseFloat(v.toString())
        }
        break
      case 'datetime':
      case 'datetime2':
      case 'timestamp with time zone':
        break
      case 'json':
      case 'jsonb':
        break
      case 'character varying':
      case 'nvarchar':
      case 'text':
      default:
        if (v != null && typeof v !== 'string') {
          record[column.name] = v.toString()
        }
        break
    }
  }
  return record
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

export function formatDDLCreateTableSchema(
  tableName: string,
  columnsInfo: Column[],
  columnType?: Record<string, string>
) {
  let ddl = ''
  for (const columnInfo of columnsInfo) {
    const type = columnType?.[columnInfo.name] ?? getDDLColumnType(columnInfo)
    if (ddl) ddl += ',\n'
    if (type === 'array' || type === 'struct') {
      ddl += `  ${columnInfo.name} ${formatDDLType(columnInfo, '  ')}`
    } else {
      ddl += `  ${columnInfo.name} ${type}`
    }
  }
  return `CREATE EXTERNAL TABLE IF NOT EXISTS ${tableName}(\n${ddl}\n)\n`
}

export function formatDDLType(columnInfo: Column | undefined, indent: string): string {
  if (!columnInfo) return ''
  const type = getDDLColumnType(columnInfo)
  if (type === 'array') {
    const ddl = `${indent}  ${formatDDLType(columnInfo.sub_columns?.['0'], indent + '  ')}`
    return `array<\n${ddl}\n${indent}>`
  } else if (type === 'struct') {
    let ddl = ''
    for (const [key, value] of Object.entries(columnInfo.sub_columns ?? {})) {
      if (ddl) ddl += ',\n'
      ddl += `${indent}  ${key}: ${formatDDLType(value, indent + '  ')}`
    }
    return `struct<\n${ddl}\n${indent}>`
  } else {
    return type
  }
}

export function getDDLColumnType(columnInfo: Column) {
  switch (columnInfo.data_type) {
    case 'boolean':
      return 'boolean'
    case 'int':
    case 'integer':
      return 'int'
    case 'double precision':
    case 'float':
      return 'float'
    case 'datetime':
    case 'datetime2':
    case 'timestamp with time zone':
      return 'string'
    case 'json':
    case 'jsonb':
      return columnInfo.is_array ? 'array' : 'struct'
    case 'character varying':
    case 'nvarchar':
    case 'text':
    default:
      return 'string'
  }
}
