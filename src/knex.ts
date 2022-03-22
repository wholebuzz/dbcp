import { pipeFromFilter } from '@wholebuzz/fs/lib/stream'
import byline from 'byline'
import { getClientType } from 'db-json-column/lib/knex'
import {
  defaultSplitterOptions,
  mssqlSplitterOptions,
  mysqlSplitterOptions,
  postgreSplitterOptions,
  sqliteSplitterOptions,
} from 'dbgate-query-splitter/lib/options'
import { SplitQueryStream } from 'dbgate-query-splitter/lib/splitQueryStream'
import { Knex } from 'knex'
import schemaInspector from 'knex-schema-inspector'
import { Column } from 'knex-schema-inspector/dist/types/column'
import { Duplex, Transform } from 'stream'
import StreamTree, { pumpWritable, ReadableStreamTree, WritableStreamTree } from 'tree-stream'
import { streamToKnexCompoundInsert } from './compound'

export const batch2 = require('batch2')

export async function dumpToKnex(
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
    await pumpWritable(output, undefined, input)
    return transaction.commit().catch(transaction.rollback)
  })
}

export function queryKnex(
  db: Knex,
  table: string,
  options: {
    limit?: number
    orderBy?: string[]
    query?: string
    inputShardBy?: string
    inputShardFunction?: 'number' | 'string'
    inputShardIndex?: number
    inputShards?: number
    transformObject?: (x: unknown) => unknown
    transformObjectStream?: () => Duplex
    where?: Array<string | any[]>
  }
) {
  let input
  if (options.query) {
    input = StreamTree.readable(db.raw(options.query).stream())
  } else {
    let query = db(table)
    for (const where of options.where ?? []) {
      query = Array.isArray(where)
        ? query.where(where[0], where[1], where[2])
        : query.where(db.raw(where))
    }
    if (options.inputShardBy && options.inputShards && options.inputShardIndex !== undefined) {
      const clientType = getClientType(db)
      query = query.where(
        db.raw(
          `${(options.inputShardFunction === 'number' ? shardNumberSQL : shardStringSQL)(
            clientType,
            options.inputShardBy,
            options.inputShards
          )} = ${options.inputShardIndex}`
        )
      )
    }
    for (const orderBy of options.orderBy ?? []) {
      query = query.orderByRaw(orderBy)
    }
    if (options.limit) query.limit(options.limit)
    input = streamFromKnex(query)
  }
  return input
}

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
    new Transform({
      objectMode: true,
      transform(data: any[], _: string, callback: () => void) {
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
      },
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
    new Transform({
      objectMode: true,
      transform(data: string, _: string, callback: () => void) {
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
      },
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
        insert[key] = val.toISOString()
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
  inputKnex: Knex,
  outputKnex: Knex,
  tableName: string
) {
  const columnsInfo = await knexInspectTableSchema(inputKnex, tableName)
  return knexFormatCreateTableSchema(outputKnex, tableName, columnsInfo)
}

export async function knexInspectTableSchema(inputKnex: Knex, tableName: string) {
  return schemaInspector(inputKnex).columnInfo(tableName)
}

export function knexFormatCreateTableSchema(
  outputKnex: Knex,
  tableName: string,
  columnsInfo: Column[],
  columnType?: Record<string, string>
) {
  const clientType = getClientType(outputKnex)
  return (
    outputKnex.schema
      .createTableIfNotExists(tableName ?? '', (t) => {
        for (const columnInfo of columnsInfo) {
          const type = columnType?.[columnInfo.name] || columnInfo.data_type
          let column
          switch (type) {
            case 'boolean':
              column = t.boolean(columnInfo.name)
              break
            case 'int':
            case 'integer':
              column = t.integer(columnInfo.name)
              break
            case 'double precision':
            case 'float':
              column = t.float(columnInfo.name)
              break
            case 'datetime':
            case 'datetime2':
            case 'timestamp with time zone':
              column = t.dateTime(columnInfo.name, { precision: 6 })
              break
            case 'json':
              column = clientType === 'mssql' ? t.text(columnInfo.name) : t.json(columnInfo.name)
              break
            case 'jsonb':
              column = clientType === 'mssql' ? t.text(columnInfo.name) : t.jsonb(columnInfo.name)
              break
            case 'character varying':
            case 'nvarchar':
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

export function shardNumberSQL(client: string, column: string, modulus: string | number) {
  switch (client) {
    case 'mssql':
      return `(${column} % ${modulus})`
    case 'mysql':
    case 'postgres':
      return `mod(${column}, ${modulus})`
    default:
      throw new Error(`shardIntegerSQL unsupported ${client}`)
  }
}

export function shardStringSQL(client: string, column: string, modulus: string | number) {
  switch (client) {
    case 'mssql':
      return `((CAST(HASHBYTES('MD5', ${column}) AS int) & 0xffff) % ${column})`
    case 'mysql':
      return `mod(conv(right(md5(${column}), 4), 16, 10), ${column})`
    case 'postgresql':
      return `mod(('x' || right(md5(${column}), 4))::bit(16)::int, ${modulus})`
    default:
      throw new Error(`shardTextSQL unsupported ${client}`)
  }
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
