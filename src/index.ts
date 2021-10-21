import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { pipeJSONFormatter, pipeJSONLinesFormatter, pipeJSONParser } from '@wholebuzz/fs/lib/json'
import { streamFromKnex, streamToKnex } from 'db-watch/lib/knex'
import Knex from 'knex'
import { pumpWritable } from 'tree-stream'

export interface DatabaseCopyOptions {
  dbname?: string
  fileSystem?: FileSystem
  format?: string
  host?: string
  password?: string
  port?: string
  sourceName?: string
  sourceFile?: string
  sourceHost?: string
  sourceKnex?: Knex
  sourcePassword?: string
  sourceTable?: string
  sourceType?: string
  sourcePort?: number
  sourceUser?: string
  table?: string
  targetName?: string
  targetFile?: string
  targetHost?: string
  targetKnex?: Knex
  targetPassword?: string
  targetTable?: string
  targetType?: string
  targetPort?: number
  targetUser?: string
  user?: string
}

export async function dbcp(args: DatabaseCopyOptions) {
  const sourceConnection = {
    database: args.sourceName,
    user: args.sourceUser,
    password: args.sourcePassword,
    host: args.sourceHost,
    port: args.sourcePort,
    options: args.sourceType === 'mssql' ? { trustServerCertificate: true } : undefined,
  }
  if ((!args.sourceFile || !args.fileSystem) && !args.sourceKnex &&
    (!sourceConnection.database || !sourceConnection.user || !args.sourceTable)) {
    throw new Error('No source')
  }

  const targetConnection = {
    database: args.targetName,
    user: args.targetUser,
    password: args.targetPassword,
    host: args.targetHost,
    port: args.targetPort,
    options: args.targetType === 'mssql' ? { trustServerCertificate: true } : undefined,
  }
  if ((!args.targetFile || !args.fileSystem) && !args.targetKnex &&
    (!targetConnection.database || !targetConnection.user || !args.targetTable)) {
    throw new Error('No target')
  }

  if (!args.sourceFile) {
    const sourceKnex = args.sourceKnex ?? Knex({
      client: args.sourceType,
      connection: sourceConnection,
      pool: poolConfig,
    } as any)
    const query = sourceKnex(args.sourceTable)
    const input = streamFromKnex(sourceKnex, query)
    if (args.targetFile) {
      let output = await args.fileSystem!.openWritableFile(args.targetFile)
      if (args.format === 'ndjson') {
        output = pipeJSONFormatter(output, true)
      } else {
        output = pipeJSONLinesFormatter(output)
      }
      await pumpWritable(output, undefined, input.finish())
      console.log(`Wrote ${args.targetFile}`)
    } else {
    }
    await sourceKnex.destroy()
  } else {
    const input = await args.fileSystem!.openReadableFile(args.sourceFile)
    if (args.targetFile) {
      const output = await args.fileSystem!.openWritableFile(args.targetFile)
      return pumpWritable(output, undefined, input.finish())
    } else {
      const targetKnex = args.targetKnex ?? Knex({
        client: args.targetType,
        connection: targetConnection,
        pool: poolConfig,
      } as any)
      await targetKnex.transaction(async (transaction) => {
        const output = streamToKnex({ transaction }, { table: args.targetTable!, returning: '*' })
        await pumpWritable(output, undefined, pipeJSONParser(input, true).finish())
        return transaction.commit().catch(transaction.rollback)
      })
      await targetKnex.destroy()
    }
  }
}

const poolConfig = {
  // https://github.com/Vincit/tarn.js/blob/master/src/Pool.ts
  // https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/cloud-sql/postgres/knex/server.js
  acquireTimeoutMillis: 60000,
  createRetryIntervalMillis: 200,
  createTimeoutMillis: 30000,
  idleTimeoutMillis: 600000,
  min: 1,
  max: 1,
}
