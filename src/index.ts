import { FileSystem } from '@wholebuzz/fs/lib/fs'
import {
  pipeJSONFormatter,
  pipeJSONLinesFormatter,
  pipeJSONLinesParser,
  pipeJSONParser,
} from '@wholebuzz/fs/lib/json'
import { streamFromKnex, streamToKnex } from 'db-watch/lib/knex'
import Knex from 'knex'
import { pumpWritable, ReadableStreamTree } from 'tree-stream'

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
  if (
    (!args.sourceFile || !args.fileSystem) &&
    !args.sourceKnex &&
    (!sourceConnection.database || !sourceConnection.user || !args.sourceTable)
  ) {
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
  if (
    (!args.targetFile || !args.fileSystem) &&
    !args.targetKnex &&
    (!targetConnection.database || !targetConnection.user || !args.targetTable)
  ) {
    throw new Error('No target')
  }

  // If the copy source is a database.
  if (!args.sourceFile) {
    const sourceKnex =
      args.sourceKnex ??
      Knex({
        client: args.sourceType,
        connection: sourceConnection,
        pool: poolConfig,
      } as any)
    const query = sourceKnex(args.sourceTable)
    const input = streamFromKnex(sourceKnex, query)
    if (args.targetFile) {
      // If the copy is database->file: JSON-formatting transform.
      let output = await args.fileSystem!.openWritableFile(args.targetFile)
      output =
        args.format === 'ndjson' ? pipeJSONFormatter(output, true) : pipeJSONLinesFormatter(output)
      await pumpWritable(output, undefined, input.finish())
      console.log(`Wrote ${args.targetFile}`)
    } else {
      // If the copy is database->database: no transform.
      const targetKnex =
        args.targetKnex ??
        Knex({
          client: args.targetType,
          connection: targetConnection,
          pool: poolConfig,
        })
      await dumpToDatabase(input, targetKnex, args.targetTable!)
      await targetKnex.destroy()
    }
    await sourceKnex.destroy()
  } else {
    // Else the copy source is a file.
    let input = await args.fileSystem!.openReadableFile(args.sourceFile)
    if (args.targetFile) {
      // If the copy is file->file: no transform.
      const output = await args.fileSystem!.openWritableFile(args.targetFile)
      return pumpWritable(output, undefined, input.finish())
    } else {
      // If the copy is file->database: JSON-parsing transform.
      input = args.format === 'ndjson' ? pipeJSONLinesParser(input) : pipeJSONParser(input, true)
      const targetKnex =
        args.targetKnex ??
        Knex({
          client: args.targetType,
          connection: targetConnection,
          pool: poolConfig,
        })
      await dumpToDatabase(input, targetKnex, args.targetTable!)
      await targetKnex.destroy()
    }
  }
}

async function dumpToDatabase(input: ReadableStreamTree, knex: Knex, table: string) {
  await knex.transaction(async (transaction) => {
    const output = streamToKnex({ transaction }, { table })
    await pumpWritable(output, undefined, input.finish())
    return transaction.commit().catch(transaction.rollback)
  })
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
