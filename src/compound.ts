import { Knex } from 'knex'
import through2 from 'through2'
import toposort from 'toposort'
import StreamTree from 'tree-stream'

export const batch2 = require('batch2')

export function streamToKnexCompoundInsert(
  source: {
    knex?: Knex
    transaction?: Knex.Transaction
  },
  options: {
    batchSize?: number
    idField?: string
    idSuffix?: string
  }
) {
  const stream = StreamTree.writable(
    through2.obj(async (data: any[], _: string, callback: () => void) => {
      const idField = options.idField || 'id'
      const idSuffix = options.idSuffix || '_id'
      const compoundInsertProbe = data[0]
      const inputTables = Object.keys(compoundInsertProbe)
      const tablesSet = new Set(inputTables)
      const tableRefGraph: Record<string, string[]> = {}
      const tableDependencyGraph: Array<[string, string]> = []
      for (const table of inputTables) {
        for (const key of Object.keys(compoundInsertProbe[table])) {
          if (!key.endsWith(idSuffix)) continue
          const tableRef = key.substring(0, key.length - idSuffix.length)
          // console.log(`found dependency ${table}.${key} -> ${tableRef}`)
          if (!tablesSet.has(tableRef)) {
            continue
          }
          ;(tableRefGraph[table] ?? (tableRefGraph[table] = [])).push(tableRef)
          tableDependencyGraph.push([tableRef, table])
        }
      }
      const tables = toposort.array(inputTables, tableDependencyGraph)
      // console.log('toposort tables', tables, inputTables)
      const insertBatch: Record<string, Array<Record<string, any>>> = {}
      for (const compoundInsert of data) {
        for (const table of tables) {
          const item = { ...compoundInsert[table] }
          delete item[idField]
          ;(insertBatch[table] ?? (insertBatch[table] = [])).push(item)
        }
      }
      for (const table of tables) {
        const batch = insertBatch[table]
        batch.forEach((item, i) => {
          for (const ref of tableRefGraph[table] ?? []) {
            item[ref + idSuffix] = insertBatch[ref][i][idField]
          }
        })
        let query = source.transaction
          ? source.transaction.batchInsert(table, batch)
          : source.knex!.batchInsert(table, batch)
        query = query.returning(idField)
        if (source.transaction) query = query.transacting(source.transaction)
        const results = await query
        if (results.length !== insertBatch[table]?.length) {
          throw new Error(
            `Unexpected result rows ${results.length} != ${insertBatch[table]?.length}`
          )
        }
        batch.forEach((item, i) => (item[idField] = results[i]))
      }
      callback()
    })
  )
  return stream.pipeFrom(batch2.obj({ size: options.batchSize ?? 4000 }))
}
