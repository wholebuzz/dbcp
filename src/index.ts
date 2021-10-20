import { AnyFileSystem, GoogleCloudFileSystem, LocalFileSystem, S3FileSystem } from '@wholebuzz/fs'
import { serializeJSONStream } from '@wholebuzz/fs/lib/json'
import { streamKnexRows } from 'db-watch/lib/knex'
import Knex from 'knex'
import { pumpWritable } from 'tree-stream'
import yargs from 'yargs'

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

async function main() {
  const args = await yargs.strict().options({
    dbname: {
      description: 'Database',
      type: 'string',
    },
    host: {
      description: 'Database host',
      type: 'string',
    },
    password: {
      description: 'Database password',
      type: 'string',
    },
    port: {
      description: 'Database port',
      type: 'string',
    },
    sourceName: {
      description: 'Source database',
      type: 'string',
    },
    sourceFile: {
      description: 'Source file',
      type: 'string',
    },
    sourceHost: {
      description: 'Source host',
      type: 'string',
    },
    sourcePassword: {
      description: 'Source database password',
      type: 'string',
    },
    sourceTable: {
      description: 'Source database table',
      type: 'string',
    },
    sourceType: {
      choices: ['postgresql', 'mssql', 'mysql'],
      default: 'postgresql',
      description: 'Source database type',
      type: 'string',
    },
    sourcePort: {
      description: 'Source database port',
      type: 'string',
    },
    sourceUser: {
      description: 'Source database user',
      type: 'string',
    },
    table: {
      description: 'Database table',
      type: 'string',
    },
    targetFile: {
      description: 'Target file',
      type: 'string',
    },
    user: {
      description: 'Database user',
      type: 'string',
    },
  }).argv

  const sourceTable =
    args.sourceTable || process.env.SOURCE_DB_TABLE || args.table || process.env.DB_TABLE
  const sourcePort =
    args.sourcePort || process.env.SOURCE_DB_PORT || args.port || process.env.DB_PORT
  const sourceConnection = {
    database: args.sourceName || process.env.SOURCE_DB_NAME || args.dbname || process.env.DB_NAME,
    user: args.sourceUser || process.env.SOURCE_DB_USER || args.user || process.env.DB_USER,
    password:
      args.sourcePassword ||
      process.env.SOURCE_DB_PASSWORD ||
      args.password ||
      process.env.DB_PASSWORD,
    host:
      args.sourceHost ||
      process.env.SOURCE_DB_HOST ||
      args.host ||
      process.env.DB_HOST ||
      'localhost',
    port: sourcePort ? parseInt(sourcePort, 10) : undefined,
    options: args.sourceType === 'mssql' ? { trustServerCertificate: true } : undefined,
  }

  if (!sourceConnection.database || !sourceConnection.user || !sourceTable) {
    throw new Error('No source')
  }
  if (!args.targetFile) throw new Error('No file')

  const fileSystem = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])

  if (!args.sourceFile) {
    const sourceKnex = Knex({
      client: args.sourceType,
      connection: sourceConnection,
      pool: poolConfig,
    } as any)
    const query = sourceKnex(sourceTable)
    const input = streamKnexRows(sourceKnex, query)
    const output = await fileSystem.openWritableFile(args.targetFile)
    await serializeJSONStream(output, input.finish(), true)
    console.log(`Wrote ${args.targetFile}`)
    await sourceKnex.destroy()
  } else {
    if (args.targetFile) {
      const input = await fileSystem.openReadableFile(args.sourceFile)
      const output = await fileSystem.openWritableFile(args.targetFile)
      return pumpWritable(output, undefined, input.finish())
    } else {
    }
  }
}

// tslint:disable-next-line
main()
