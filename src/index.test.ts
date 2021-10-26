import { LocalFileSystem } from '@wholebuzz/fs'
import { exec } from 'child_process'
import fs from 'fs'
import hasha from 'hasha'
import Knex from 'knex'
import rimraf from 'rimraf'
import { Readable, Writable } from 'stream'
import StreamTree, { WritableStreamTree } from 'tree-stream'
import { promisify } from 'util'
import { DatabaseCopySourceType, DatabaseCopyTargetType, dbcp, knexPoolConfig } from './index'

const zlib = require('zlib')

const fileSystem = new LocalFileSystem()
const hashOptions = { algorithm: 'md5' }
const rmrf = promisify(rimraf)
const targetJsonUrl = '/tmp/target.json.gz'
const targetNDJsonUrl = '/tmp/target.jsonl.gz'
const testSchemaTableName = 'dbcptest'
const textSchemaUrl = './test/schema.sql'
const testNDJsonUrl = './test/test.jsonl.gz'
const testNDJsonHash = '5142f12354d0762bcde690afd960a51b'
const testJsonHash = 'bb16b2a3d4c8b94c6650ec29de20a884'
const postgresConnection = {
  database: process.env.POSTGRES_DB_NAME ?? '',
  user: process.env.POSTGRES_DB_USER ?? '',
  password: process.env.POSTGRES_DB_PASS ?? '',
  host: process.env.POSTGRES_DB_HOST ?? '',
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '', 10),
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

it('Should convert to json from jsonl and back', async () => {
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

it('Should restore to and dump from Postgres', async () => {
  const knex = Knex({
    client: 'postgresql',
    connection: postgresConnection,
    pool: knexPoolConfig,
  } as any)
  const sql = await readableToString((await fileSystem.openReadableFile(textSchemaUrl)).finish())
  await knex.raw(sql)
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe('0')
  await dbcp({
    sourceFile: testNDJsonUrl,
    targetType: DatabaseCopyTargetType.postgresql,
    targetHost: postgresConnection.host,
    targetPort: postgresConnection.port,
    targetUser: postgresConnection.user,
    targetPassword: postgresConnection.password,
    targetName: postgresConnection.database,
    targetTable: testSchemaTableName,
    fileSystem,
  })
  expect((await knex.raw(`SELECT COUNT(*) from ${testSchemaTableName};`)).rows[0].count).toBe(
    '10000'
  )
  await knex.destroy()

  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({
    targetFile: targetNDJsonUrl,
    sourceType: DatabaseCopySourceType.postgresql,
    sourceHost: postgresConnection.host,
    sourcePort: postgresConnection.port,
    sourceUser: postgresConnection.user,
    sourcePassword: postgresConnection.password,
    sourceName: postgresConnection.database,
    sourceTable: testSchemaTableName,
    fileSystem,
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
