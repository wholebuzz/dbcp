#!/usr/bin/env node

const {
  AnyFileSystem,
  GoogleCloudFileSystem,
  LocalFileSystem,
  S3FileSystem,
} = require('@wholebuzz/fs')
const yargs = require('yargs')
const { dbcp } = require('./index')

async function main() {
  const args = await yargs.strict().options({
    dbname: {
      description: 'Database',
      type: 'string',
    },
    format: {
      choices: ['json', 'jsonl', 'ndjson'],
      default: 'json',
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
    sourceFile: {
      description: 'Source file',
      type: 'string',
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
    sourceTable: {
      description: 'Source database table',
      type: 'string',
    },
    sourceType: {
      choices: ['postgresql', 'mssql', 'mysql'],
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
    targetTable: {
      description: 'Target database table',
      type: 'string',
    },
    targetType: {
      choices: ['postgresql', 'mssql', 'mysql'],
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
  }).argv

  const sourcePort =
    args.sourcePort || process.env.SOURCE_DB_PORT || args.port || process.env.DB_PORT
  const targetPort =
    args.targetPort || process.env.TARGET_DB_PORT || args.port || process.env.DB_PORT

  const fileSystem = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])

  return dbcp({
    ...args,
    fileSystem,
    sourceHost:
      args.sourceHost ||
      process.env.SOURCE_DB_HOST ||
      args.host ||
      process.env.DB_HOST ||
      'localhost',
    sourceName:
      args.sourceName || process.env.SOURCE_DB_NAME || args.password || process.env.DB_NAME,
    sourcePassword:
      args.sourcePassword ||
      process.env.SOURCE_DB_PASSWORD ||
      args.password ||
      process.env.DB_PASSWORD,
    sourcePort: sourcePort ? parseInt(sourcePort, 10) : undefined,
    sourceTable:
      args.sourceTable || process.env.SOURCE_DB_TABLE || args.table || process.env.DB_TABLE,
    sourceType:
      args.sourceType || process.env.SOURCE_DB_TYPE || args.password || process.env.DB_TYPE,
    sourceUser:
      args.sourceUser || process.env.SOURCE_DB_USER || args.password || process.env.DB_USER,
    targetHost:
      args.targetHost ||
      process.env.TARGET_DB_HOST ||
      args.host ||
      process.env.DB_HOST ||
      'localhost',
    targetName:
      args.targetName || process.env.TARGET_DB_NAME || args.password || process.env.DB_NAME,
    targetPassword:
      args.targetPassword ||
      process.env.TARGET_DB_PASSWORD ||
      args.password ||
      process.env.DB_PASSWORD,
    targetPort: targetPort ? parseInt(targetPort, 10) : undefined,
    targetTable:
      args.targetTable || process.env.TARGET_DB_TABLE || args.table || process.env.DB_TABLE,
    targetType:
      args.targetType || process.env.TARGET_DB_TYPE || args.password || process.env.DB_TYPE,
    targetUser:
      args.targetUser || process.env.TARGET_DB_USER || args.password || process.env.DB_USER,
  })
}

// tslint:disable-next-line
main()
