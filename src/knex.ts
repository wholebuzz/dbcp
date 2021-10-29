import { pipeFromFilter } from '@wholebuzz/fs/lib/json'
import Knex from 'knex'
import schemaInspector from 'knex-schema-inspector'
import { WritableStreamTree } from 'tree-stream'

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
