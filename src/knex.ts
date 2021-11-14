import { pipeFromFilter } from '@wholebuzz/fs/lib/stream'
import byline from 'byline'
import {
  defaultSplitterOptions,
  mssqlSplitterOptions,
  mysqlSplitterOptions,
  postgreSplitterOptions,
  sqliteSplitterOptions,
} from 'dbgate-query-splitter/lib/options'
import { SplitQueryStream } from 'dbgate-query-splitter/lib/splitQueryStream'
import Knex from 'knex'
import schemaInspector from 'knex-schema-inspector'
import { Column } from 'knex-schema-inspector/dist/types/column'
import through2 from 'through2'
import StreamTree, { ReadableStreamTree, WritableStreamTree } from 'tree-stream'

export const batch2 = require('batch2')

export function streamFromKnex(query: Knex.QueryBuilder): ReadableStreamTree {
  return StreamTree.readable(query.stream())
}

export function streamToKnex(
  source: {
    knex?: Knex
    transaction?: Knex.Transaction
  },
  options: {
    table: string
    batchSize?: number
    returning?: string
  }
) {
  const stream = StreamTree.writable(
    through2.obj(function (data: any[], _: string, callback: () => void) {
      let query = source.transaction
        ? source.transaction.batchInsert(options.table, data)
        : source.knex!.batchInsert(options.table, data)
      if (options.returning) query = query.returning(options.returning)
      if (source.transaction) query = query.transacting(source.transaction)
      query
        .then((result) => {
          if (options.returning) this.push(result)
          callback()
        })
        .catch((err) => {
          throw err
        })
    })
  )
  return stream.pipeFrom(batch2.obj({ size: options.batchSize ?? 4000 }))
}

export function streamToKnexRaw(
  source: {
    knex?: Knex
    transaction?: Knex.Transaction
  },
  options?: { returning?: boolean }
) {
  let stream = StreamTree.writable(
    through2.obj(function (data: string, _: string, callback: () => void) {
      const text = data.replace(/\?/g, '\\?')
      const query = source.transaction ? source.transaction.raw(text) : source.knex!.raw(text)
      query
        .then((result) => {
          if (options?.returning) this.push(result)
          callback()
        })
        .catch((err) => {
          throw err
        })
    })
  )
  stream = stream.pipeFrom(
    newDBGateQuerySplitterStream(
      ((source.transaction || source.knex) as any).context.client.config.client
    )
  )
  stream = stream.pipeFrom(byline.createStream())
  return stream
}

export function pipeKnexInsertTextTransform(
  output: WritableStreamTree,
  knex?: Knex,
  tableName?: string
) {
  return pipeFromFilter(output, (x) => {
    const insert = { ...x }
    for (const key of Object.keys(insert)) {
      const val = insert[key]
      if (val === null || val === undefined) {
        continue
      } else if (val instanceof Date) {
        insert[key] = new Date(val.getTime() + val.getTimezoneOffset() * 60 * 1000)
      } else if (typeof val === 'object') {
        insert[key] = JSON.stringify(val)
      }
    }
    const ret =
      knex
        ?.table(tableName ?? '')
        .insert(insert)
        .toString() + ';\n'
    return ret
  })
}

export async function knexInspectCreateTableSchema(
  sourceKnex: Knex,
  targetKnex: Knex,
  tableName: string
) {
  const columnsInfo = await knexInspectTableSchema(sourceKnex, tableName)
  return knexFormatCreateTableSchema(targetKnex, tableName, columnsInfo)
}

export async function knexInspectTableSchema(sourceKnex: Knex, tableName: string) {
  return schemaInspector(sourceKnex).columnInfo(tableName)
}

export function knexFormatCreateTableSchema(
  targetKnex: Knex,
  tableName: string,
  columnsInfo: Column[]
) {
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

export function newDBGateQuerySplitterStream(type?: any) {
  switch (type) {
    case 'postgresql':
      return new SplitQueryStream(postgreSplitterOptions)
    case 'mysql':
      return new SplitQueryStream(mysqlSplitterOptions)
    case 'mssql':
      return new SplitQueryStream(mssqlSplitterOptions)
    case 'sqlite':
      return new SplitQueryStream(sqliteSplitterOptions)
    default:
      return new SplitQueryStream(defaultSplitterOptions)
  }
}
