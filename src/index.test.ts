import { LocalFileSystem } from '@wholebuzz/fs'
import { exec } from 'child_process'
import fs from 'fs'
import hasha from 'hasha'
import Knex from 'knex'
import rimraf from 'rimraf'
import { Readable, Writable } from 'stream'
import StreamTree, { WritableStreamTree } from 'tree-stream'
import { promisify } from 'util'
import {
  DatabaseCopySchema,
  DatabaseCopySourceType,
  DatabaseCopyTargetType,
  dbcp,
  knexPoolConfig,
} from './index'

const zlib = require('zlib')

const fileSystem = new LocalFileSystem()
const hashOptions = { algorithm: 'md5' }
const rmrf = promisify(rimraf)
const targetJsonUrl = '/tmp/target.json.gz'
const targetNDJsonUrl = '/tmp/target.jsonl.gz'
const targetSQLUrl = '/tmp/target.sql.gz'
const testSchemaTableName = 'dbcptest'
const testSchemaUrl = './test/schema.sql'
const testNDJsonUrl = './test/test.jsonl.gz'
const testNDJsonHash = '9c51a21c2d8a717f3def11864b62378e'
const testJsonHash = 'e64068fcf1837e9e3eced54f198ced32'

const mysqlConnection = {
  database: process.env.MYSQL_DB_NAME ?? '',
  user: process.env.MYSQL_DB_USER ?? '',
  password: process.env.MYSQL_DB_PASS ?? '',
  host: process.env.MYSQL_DB_HOST ?? '',
  port: parseInt(process.env.MYSQL_DB_PORT ?? '', 10),
  charset: 'utf8mb4',
}
const mysqlSource = {
  sourceType: DatabaseCopySourceType.mysql,
  sourceHost: mysqlConnection.host,
  sourcePort: mysqlConnection.port,
  sourceUser: mysqlConnection.user,
  sourcePassword: mysqlConnection.password,
  sourceName: mysqlConnection.database,
  sourceTable: testSchemaTableName,
}
const mysqlTarget = {
  targetType: DatabaseCopyTargetType.mysql,
  targetHost: mysqlConnection.host,
  targetPort: mysqlConnection.port,
  targetUser: mysqlConnection.user,
  targetPassword: mysqlConnection.password,
  targetName: mysqlConnection.database,
  targetTable: testSchemaTableName,
}

const postgresConnection = {
  database: process.env.POSTGRES_DB_NAME ?? '',
  user: process.env.POSTGRES_DB_USER ?? '',
  password: process.env.POSTGRES_DB_PASS ?? '',
  host: process.env.POSTGRES_DB_HOST ?? '',
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '', 10),
}
const postgresSource = {
  sourceType: DatabaseCopySourceType.postgresql,
  sourceHost: postgresConnection.host,
  sourcePort: postgresConnection.port,
  sourceUser: postgresConnection.user,
  sourcePassword: postgresConnection.password,
  sourceName: postgresConnection.database,
  sourceTable: testSchemaTableName,
}
const postgresTarget = {
  targetType: DatabaseCopyTargetType.postgresql,
  targetHost: postgresConnection.host,
  targetPort: postgresConnection.port,
  targetUser: postgresConnection.user,
  targetPassword: postgresConnection.password,
  targetName: postgresConnection.database,
  targetTable: testSchemaTableName,
}

it('Should hash test data as string', async () => {
  expect(
    hasha(
      await readableToString(fs.createReadStream(testNDJsonUrl).pipe(zlib.createGunzip())),
      hashOptions
    )
  ).toBe(testNDJsonHash)
  expect(
    hasha(
      await readableToString((await fileSystem.openReadableFile(testNDJsonUrl)).finish()),
      hashOptions
    )
  ).toBe(testNDJsonHash)
})

it('Should hash test data stream', async () => {
  expect(await hashFile(testNDJsonUrl)).toBe(testNDJsonHash)
  expect(await dbcpHashFile(testNDJsonUrl)).toBe(testNDJsonHash)
  expect(
    await execCommand(
      `node dist/cli.js --sourceFile ${testNDJsonUrl} --targetType stdout` +
        ` | ./node_modules/.bin/hasha --algorithm md5`
    )
  ).toBe(testNDJsonHash)
})

it('Should copy local file', async () => {
  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({ sourceFile: testNDJsonUrl, targetFile: targetNDJsonUrl, fileSystem })
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(true)
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

it('Should read local directory', async () => {
  const dir = { value: '' }
  await dbcp({ sourceFile: './test/', targetStream: writableToString(dir), fileSystem })
  expect(JSON.parse(dir.value)).toEqual(['test/schema.sql', 'test/test.jsonl.gz'])
})

it('Should convert to JSON from ND-JSON and back', async () => {
  await rmrf(targetJsonUrl)
  expect(await fileSystem.fileExists(targetJsonUrl)).toBe(false)
  await dbcp({ sourceFile: testNDJsonUrl, targetFile: targetJsonUrl, fileSystem })
  expect(await fileSystem.fileExists(targetJsonUrl)).toBe(true)
  expect(await hashFile(targetJsonUrl)).toBe(testJsonHash)

  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({ sourceFile: targetJsonUrl, targetFile: targetNDJsonUrl, fileSystem })
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(true)
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

it('Should restore to and dump from Postgres to ND-JSON', async () => {
  // Load schema
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFile: testSchemaUrl,
  })

  // Copy from testNDJsonUrl to PostgreSQL
  const knex = Knex({
    client: 'postgresql',
    connection: postgresConnection,
    pool: knexPoolConfig,
  } as any)
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe('0')
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFile: testNDJsonUrl,
  })
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe(
    '10000'
  )
  await knex.destroy()

  // Dump and verify PostgreSQL
  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({
    fileSystem,
    ...postgresSource,
    targetFile: targetNDJsonUrl,
    orderBy: 'id ASC',
  })
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(true)
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

it('Should restore to and dump from Postgres to SQL', async () => {
  // Dump database to targetSQLUrl
  await rmrf(targetSQLUrl)
  expect(await fileSystem.fileExists(targetSQLUrl)).toBe(false)
  await dbcp({
    fileSystem,
    ...postgresSource,
    copySchema: DatabaseCopySchema.dataOnly,
    targetFile: targetSQLUrl,
    targetType: DatabaseCopyTargetType.postgresql,
  })
  expect(await fileSystem.fileExists(targetSQLUrl)).toBe(true)

  // Load schema and copy from testSchemaUrl to Postgres
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFile: testSchemaUrl,
  })

  // Copy from targetSQLUrl to PostgreSQL
  const knex = Knex({
    client: 'postgresql',
    connection: postgresConnection,
    pool: knexPoolConfig,
  } as any)
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe('0')
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFile: targetSQLUrl,
  })
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe(
    '10000'
  )
  await knex.destroy()

  // Dump and verify PostgreSQL
  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({
    fileSystem,
    ...postgresSource,
    targetFile: targetNDJsonUrl,
    orderBy: 'id ASC',
  })
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(true)
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

it('Should copy from Postgres to Mysql', async () => {
  // Dump schema to targetSQLUrl
  await rmrf(targetSQLUrl)
  expect(await fileSystem.fileExists(targetSQLUrl)).toBe(false)
  await dbcp({
    fileSystem,
    ...postgresSource,
    copySchema: DatabaseCopySchema.schemaOnly,
    targetFile: targetSQLUrl,
    targetType: DatabaseCopyTargetType.mysql,
  })
  expect(await fileSystem.fileExists(targetSQLUrl)).toBe(true)

  // Load schema and copy from PostgreSQL to MySQL
  const knex = Knex({
    client: 'mysql',
    connection: {
      ...mysqlConnection,
      multipleStatements: true,
    },
    pool: knexPoolConfig,
  } as any)
  const sql =
    `DROP TABLE IF EXISTS dbcptest;\n` +
    (await readableToString((await fileSystem.openReadableFile(targetSQLUrl)).finish()))
  await knex.raw(sql)
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`))[0][0]['COUNT(*)']).toBe(0)
  await dbcp({
    fileSystem,
    ...mysqlTarget,
    ...postgresSource,
    transformJson: (x: any) => {
      x.props = JSON.stringify(x.props)
      x.tags = JSON.stringify(x.tags)
      return x
    },
  })
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`))[0][0]['COUNT(*)']).toBe(
    10000
  )
  await knex.destroy()

  // Dump and verify MySQL
  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({
    fileSystem,
    ...mysqlSource,
    orderBy: 'id ASC',
    targetFile: targetNDJsonUrl,
    transformJson: (x: any) => {
      x.props = JSON.parse(x.props)
      x.tags = JSON.parse(x.tags)
      return x
    },
  })
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(true)
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

async function hashFile(path: string) {
  return readableToString(
    (await fileSystem.openReadableFile(path)).pipe(hasha.stream(hashOptions)).finish()
  )
}

async function dbcpHashFile(path: string) {
  const target = { value: '' }
  await dbcp({
    sourceFile: path,
    targetStream: writableToString(target).pipeFrom(hasha.stream(hashOptions)),
    fileSystem,
  })
  return target.value
}

function readableToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: Error) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

function writableToString(target: { value: string }): WritableStreamTree {
  const chunks: Buffer[] = []
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk))
      callback()
    },
  })
  stream.on('finish', () => (target.value = Buffer.concat(chunks).toString('utf8')))
  return StreamTree.writable(stream)
}

function execCommand(cmd: string, execOptions: any = {}): Promise<string> {
  return new Promise((resolve, reject) =>
    exec(cmd, { maxBuffer: 1024 * 10000, ...execOptions }, (err, stdout, stderr) => {
      if (err) {
        reject([err, stdout.toString(), stderr.toString()])
      } else {
        resolve(stdout.toString().trim())
      }
    })
  )
}
