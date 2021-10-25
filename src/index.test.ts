import { LocalFileSystem } from '@wholebuzz/fs'
import { exec } from 'child_process'
import fs from 'fs'
import hasha from 'hasha'
import rimraf from 'rimraf'
import { Readable, Writable } from 'stream'
import StreamTree, { WritableStreamTree } from 'tree-stream'
import { promisify } from 'util'
import { dbcp } from './index'

const zlib = require('zlib')

const fileSystem = new LocalFileSystem()
const hashOptions = { algorithm: 'md5' }
const rmrf = promisify(rimraf)
const targetJsonUrl = '/tmp/target.json.gz'
const targetNDJsonUrl = '/tmp/target.jsonl.gz'
const testNDJsonUrl = './test/test.jsonl.gz'
const testNDJsonHash = '23952a3a66162d2f7383680db832e02a'
const testJsonHash = '04c891fdb6e037ab2aad3658bcb92d1a'

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
  expect(await hashFile(targetNDJsonUrl)).toBe(testNDJsonHash)
})

it('Should convert to json from jsonl and back', async () => {
  await rmrf(targetJsonUrl)
  expect(await fileSystem.fileExists(targetJsonUrl)).toBe(false)
  await rmrf(targetNDJsonUrl)
  expect(await fileSystem.fileExists(targetNDJsonUrl)).toBe(false)
  await dbcp({ sourceFile: testNDJsonUrl, targetFile: targetJsonUrl, fileSystem })
  expect(await hashFile(targetJsonUrl)).toBe(testJsonHash)
  await dbcp({ sourceFile: targetJsonUrl, targetFile: targetNDJsonUrl, fileSystem })
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
