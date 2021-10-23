import { FileSystem } from '@wholebuzz/fs/lib/fs'
import {
  pipeFilter,
  pipeFromFilter,
  pipeJSONFormatter,
  pipeJSONLinesFormatter,
  pipeJSONLinesParser,
  pipeJSONParser,
} from '@wholebuzz/fs/lib/json'
import { streamFromKnex, streamToKnex } from 'db-watch/lib/knex'
import Knex from 'knex'
import { Duplex } from 'stream'
import { pumpWritable, ReadableStreamTree } from 'tree-stream'

export interface DatabaseCopyOptions {
  contentType?: string
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
  transformJson?: (x: unknown) => unknown
  transformJsonStream?: Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: Duplex
  user?: string
}

export async function dbcp(args: DatabaseCopyOptions) {
  let contentType = args.contentType

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
    (!args.sourceType || !sourceConnection.database || !sourceConnection.user || !args.sourceTable)
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
    (!args.targetType || !targetConnection.database || !targetConnection.user || !args.targetTable)
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
    let input = streamFromKnex(sourceKnex, query)
    if (args.transformJsonStream) input = input.pipe(args.transformJsonStream)
    if (args.transformJson) input = pipeFilter(input, args.transformJson)
    if (args.targetFile) {
      // If the copy is database->file: JSON-formatting transform.
      let output = await args.fileSystem!.openWritableFile(args.targetFile, undefined, {
        contentType,
      })
      const isJsonl = isNDJson(args.format)
      output = isJsonl ? pipeJSONLinesFormatter(output) : pipeJSONFormatter(output, true)
      if (!contentType) contentType = isJsonl ? 'application/x-ndjson' : 'application/json'
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (args.transformBytesStream) input = input.pipe(args.transformBytesStream)
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
      let output = await args.fileSystem!.openWritableFile(args.targetFile, undefined, {
        contentType,
      })
      if (args.transformBytes) output = pipeFromFilter(output, args.transformBytes)
      if (args.transformBytesStream) input = input.pipe(args.transformBytesStream)
      return pumpWritable(output, undefined, input.finish())
    } else {
      // If the copy is file->database: JSON-parsing transform.
      input = isNDJson(args.format) ? pipeJSONLinesParser(input) : pipeJSONParser(input, true)
      if (args.transformJsonStream) input = input.pipe(args.transformJsonStream)
      if (args.transformJson) input = pipeFilter(input, args.transformJson)
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

const isNDJson = (x?: string) => x === 'ndjson' || x === 'jsonl'

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
