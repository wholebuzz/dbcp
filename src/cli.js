#!/usr/bin/env node

const {
  AnyFileSystem,
  GoogleCloudFileSystem,
  HTTPFileSystem,
  LocalFileSystem,
  S3FileSystem,
  SMBFileSystem,
} = require('@wholebuzz/fs')
const dotenv = require('dotenv')
const ora = require('ora')
const progressStream = require('progress-stream')
const yargs = require('yargs')
const {
  DatabaseCopyFormat,
  DatabaseCopySourceType,
  DatabaseCopyTargetType,
  DatabaseCopySchema,
} = require('./format')
const { dbcp } = require('./index')

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  const formats = Object.values(DatabaseCopyFormat)
  const args = yargs
    .strict()
    .command('* [sourceFile] [targetFile]', '')
    .options({
      compoundInsert: {
        description: 'Compound insert mode can insert associated rows from multiple tables.',
        type: 'boolean',
      },
      contentType: {
        description: 'Content type',
        type: 'string',
      },
      dataOnly: {
        description: 'Dump only the data, not the schema (data definitions).',
        type: 'boolean',
      },
      dbname: {
        description: 'Database',
        type: 'string',
      },
      externalSortBy: {
        description: 'Sort data by property(s) with external-sorting',
        type: 'array',
      },
      format: {
        choices: formats,
      },
      group: {
        description: 'Group inputs with equinvalent orderBy',
        type: 'boolean',
      },
      host: {
        description: 'Database host',
        type: 'string',
      },
      limit: {
        description: 'Database query LIMIT',
        type: 'number',
      },
      orderBy: {
        description: 'Database query ORDER BY',
        type: 'array',
      },
      password: {
        description: 'Database password',
        type: 'string',
      },
      port: {
        description: 'Database port',
        type: 'string',
      },
      probeBytes: {
        description: 'Probe bytes',
        type: 'number',
      },
      query: {
        description: 'Query',
        type: 'string',
      },
      schemaFile: {
        description: 'Use schema file if required, instead of schema inspection.',
        type: 'string',
      },
      schemaOnly: {
        description: 'Dump only the object definitions (schema), not data.',
        type: 'boolean',
      },
      shardBy: {
        description: 'Shard (or split) the data based on key',
        type: 'string',
      },
      shards: {
        description: 'The number of shards to split or join the data',
        type: 'number',
      },
      sourceFile: {
        description: 'Source file',
        type: 'array',
      },
      sourceFormat: {
        choices: formats,
      },
      sourceHost: {
        description: 'Source host',
        type: 'string',
      },
      sourceName: {
        description: 'Source database',
        type: 'string',
      },
      sourcePassword: {
        description: 'Source database password',
        type: 'string',
      },
      sourcePort: {
        description: 'Source database port',
        type: 'string',
      },
      sourceShards: {
        description: 'Source shards',
        type: 'number',
      },
      sourceTable: {
        description: 'Source database table',
        type: 'string',
      },
      sourceType: {
        choices: Object.values(DatabaseCopySourceType),
        description: 'Source database type',
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
      targetFormat: {
        choices: formats,
      },
      targetHost: {
        description: 'Target host',
        type: 'string',
      },
      targetName: {
        description: 'Target database',
        type: 'string',
      },
      targetPassword: {
        description: 'Target database password',
        type: 'string',
      },
      targetPort: {
        description: 'Target database port',
        type: 'string',
      },
      targetShards: {
        description: 'Target shards',
        type: 'number',
      },
      targetTable: {
        description: 'Target database table',
        type: 'string',
      },
      targetType: {
        choices: Object.values(DatabaseCopyTargetType),
        description: 'Target database type',
        type: 'string',
      },
      targetUser: {
        description: 'Target database user',
        type: 'string',
      },
      user: {
        description: 'Database user',
        type: 'string',
      },
      where: {
        description: 'Database query WHERE',
        type: 'array',
      },
      whereDate: {
        description: 'Database query WHERE, final argument parsed as Javascript date',
        type: 'array',
      },
    }).argv

  if (process.argv.length < 3) {
    yargs.showHelp()
    process.exit(1)
  } else if (process.argv.length === 3) {
    args.targetFile = '-'
  }

  const sourcePort =
    args.sourcePort || args.port || process.env.SOURCE_DB_PORT || process.env.DB_PORT
  const targetPort =
    args.targetPort || args.port || process.env.TARGET_DB_PORT || process.env.DB_PORT

  const httpFileSystem = new HTTPFileSystem()
  const fileSystem = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: 'http://', fs: httpFileSystem },
    { urlPrefix: 'https://', fs: httpFileSystem },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])

  let totalBytes = 0
  const spinner = ora('Wrote 0 bytes')
  const newBytesTransform = () => {
    const copyProgress = progressStream({ time: 100 })
    copyProgress.on('progress', (progress) => {
      totalBytes += progress.delta
      spinner.text = `Wrote ${totalBytes} bytes`
      spinner.frame()
      spinner.render()
    })
    return copyProgress
  }

  const options = {
    ...args,
    copySchema: args.schemaOnly
      ? DatabaseCopySchema.schemaOnly
      : args.dataOnly
      ? DatabaseCopySchema.dataOnly
      : undefined,
    fileSystem,
    sourceFiles: args.sourceFile ? args.sourceFile.map((url) => ({ url })) : undefined,
    sourceFormat: args.sourceFormat || args.format,
    sourceHost:
      args.sourceHost ||
      args.host ||
      process.env.SOURCE_DB_HOST ||
      process.env.DB_HOST ||
      'localhost',
    sourceName: args.sourceName || args.dbname || process.env.SOURCE_DB_NAME || process.env.DB_NAME,
    sourcePassword:
      args.sourcePassword ||
      args.password ||
      process.env.SOURCE_DB_PASSWORD ||
      process.env.DB_PASSWORD,
    sourcePort: sourcePort ? parseInt(sourcePort, 10) : undefined,
    sourceShards: args.sourceShards || args.shards,
    sourceTable:
      args.sourceTable || args.table || process.env.SOURCE_DB_TABLE || process.env.DB_TABLE,
    sourceType: args.sourceType || process.env.SOURCE_DB_TYPE || process.env.DB_TYPE,
    sourceUser: args.sourceUser || args.user || process.env.SOURCE_DB_USER || process.env.DB_USER,
    targetFormat: args.targetFormat || args.format,
    targetHost:
      args.targetHost ||
      args.host ||
      process.env.TARGET_DB_HOST ||
      process.env.DB_HOST ||
      'localhost',
    targetName: args.targetName || args.dbname || process.env.TARGET_DB_NAME || process.env.DB_NAME,
    targetPassword:
      args.targetPassword ||
      args.password ||
      process.env.TARGET_DB_PASSWORD ||
      process.env.DB_PASSWORD,
    targetPort: targetPort ? parseInt(targetPort, 10) : undefined,
    targetShards: args.targetShards || args.shards,
    targetTable:
      args.targetTable || args.table || process.env.TARGET_DB_TABLE || process.env.DB_TABLE,
    targetType: args.targetType || process.env.TARGET_DB_TYPE || process.env.DB_TYPE,
    targetUser: args.targetUser || args.user || process.env.TARGET_DB_USER || process.env.DB_USER,
    transformBytesStream: args.targetFile !== '-' ? newBytesTransform : undefined,
  }

  if (args.whereDate && args.whereDate.length === 3) {
    if (!options.where) { options.where = [] }
    options.where.push([args.whereDate[0], args.whereDate[1], new Date(args.whereDate[2])])
  }

  try {
    await dbcp(options)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('dbcp error:', err.message)
    process.exit(-1)
  }

  const sourceName = options.sourceFile || `${options.sourceName}.${options.sourceTable}`
  const targetName = options.targetFile || `${options.targetName}.${options.targetTable}`
  if (args.targetFile !== '-') {
    spinner.succeed(`Wrote ${totalBytes} bytes to "${targetName}" from "${sourceName}"`)
  }
}

// tslint:disable-next-line
main()
