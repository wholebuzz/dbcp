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
  DatabaseCopyInputType,
  DatabaseCopyOutputType,
  DatabaseCopySchema,
  DatabaseCopyShardFunction,
} = require('./format')
const { dbcp } = require('./index')

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  const formats = Object.values(DatabaseCopyFormat)
  const args = yargs
    .strict()
    .command('* [inputFile] [outputFile]', '')
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
      inputFile: {
        description: 'Input file',
        type: 'array',
      },
      inputFormat: {
        choices: formats,
      },
      inputHost: {
        description: 'Input host',
        type: 'string',
      },
      inputName: {
        description: 'Input database',
        type: 'string',
      },
      inputPassword: {
        description: 'Input database password',
        type: 'string',
      },
      inputPort: {
        description: 'Input database port',
        type: 'string',
      },
      inputShards: {
        description: 'Input shards',
        type: 'number',
      },
      inputTable: {
        description: 'Input database table',
        type: 'string',
      },
      inputType: {
        choices: Object.values(DatabaseCopyInputType),
        description: 'Input database type',
        type: 'string',
      },
      inputUser: {
        description: 'Input database user',
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
      outputFile: {
        description: 'Output file',
        type: 'string',
      },
      outputFormat: {
        choices: formats,
      },
      outputHost: {
        description: 'Output host',
        type: 'string',
      },
      outputName: {
        description: 'Output database',
        type: 'string',
      },
      outputPassword: {
        description: 'Output database password',
        type: 'string',
      },
      outputPort: {
        description: 'Output database port',
        type: 'string',
      },
      outputShardFunction: {
        choices: Object.values(DatabaseCopyShardFunction),
        description: 'Output shard function',
        type: 'string',
      },
      outputShards: {
        description: 'Output shards',
        type: 'number',
      },
      outputTable: {
        description: 'Output database table',
        type: 'string',
      },
      outputType: {
        choices: Object.values(DatabaseCopyOutputType),
        description: 'Output database type',
        type: 'string',
      },
      outputUser: {
        description: 'Output database user',
        type: 'string',
      },
      parquetRowGroupRange: {
        description: 'Parquet row group range',
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
      table: {
        description: 'Database table',
        type: 'string',
      },
      user: {
        description: 'Database user',
        type: 'string',
      },
      verbose: {
        alias: 'v',
        description: 'Verbose',
        type: 'boolean',
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
    args.outputFile = '-'
  }

  const inputPort = args.inputPort || args.port || process.env.INPUT_DB_PORT || process.env.DB_PORT
  const outputPort =
    args.outputPort || args.port || process.env.OUTPUT_DB_PORT || process.env.DB_PORT

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
    inputFiles: args.inputFile
      ? args.inputFile.map((url) => ({
          parquetOptions: args.parquetRowGroupRange
            ? { rowGroupRange: args.parquetRowGroupRange }
            : undefined,
          url,
        }))
      : undefined,
    inputFormat: args.inputFormat || args.format,
    inputHost:
      args.inputHost ||
      args.host ||
      process.env.INPUT_DB_HOST ||
      process.env.DB_HOST ||
      'localhost',
    inputName: args.inputName || args.dbname || process.env.INPUT_DB_NAME || process.env.DB_NAME,
    inputPassword:
      args.inputPassword ||
      args.password ||
      process.env.INPUT_DB_PASSWORD ||
      process.env.DB_PASSWORD,
    inputPort: inputPort ? parseInt(inputPort, 10) : undefined,
    inputShards: args.inputShards || args.shards,
    inputTable: args.inputTable || args.table || process.env.INPUT_DB_TABLE || process.env.DB_TABLE,
    inputType: args.inputType || process.env.INPUT_DB_TYPE || process.env.DB_TYPE,
    inputUser: args.inputUser || args.user || process.env.INPUT_DB_USER || process.env.DB_USER,
    outputFormat: args.outputFormat || args.format,
    outputHost:
      args.outputHost ||
      args.host ||
      process.env.OUTPUT_DB_HOST ||
      process.env.DB_HOST ||
      'localhost',
    outputName: args.outputName || args.dbname || process.env.OUTPUT_DB_NAME || process.env.DB_NAME,
    outputPassword:
      args.outputPassword ||
      args.password ||
      process.env.OUTPUT_DB_PASSWORD ||
      process.env.DB_PASSWORD,
    outputPort: outputPort ? parseInt(outputPort, 10) : undefined,
    outputShards: args.outputShards || args.shards,
    outputTable:
      args.outputTable || args.table || process.env.OUTPUT_DB_TABLE || process.env.DB_TABLE,
    outputType: args.outputType || process.env.OUTPUT_DB_TYPE || process.env.DB_TYPE,
    outputUser: args.outputUser || args.user || process.env.OUTPUT_DB_USER || process.env.DB_USER,
    transformBytesStream: args.outputFile !== '-' ? newBytesTransform : undefined,
  }

  if (args.whereDate && args.whereDate.length === 3) {
    if (!options.where) {
      options.where = []
    }
    options.where.push([args.whereDate[0], args.whereDate[1], new Date(args.whereDate[2])])
  }

  try {
    await dbcp(options)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('dbcp error:', err.message)
    if (args.verbose) {
      // tslint:disable-next-line:no-console
      console.error(err)
    }
    process.exit(-1)
  }

  const inputName = options.inputFile || `${options.inputName}.${options.inputTable}`
  const outputName = options.outputFile || `${options.outputName}.${options.outputTable}`
  if (args.outputFile !== '-') {
    spinner.succeed(`Wrote ${totalBytes} bytes to "${outputName}" from "${inputName}"`)
  }
}

// tslint:disable-next-line
main()
