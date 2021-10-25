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
const targetDataUrl = '/tmp/target.json.gz'
const testDataUrl = './test/test.json.gz'
const testDataHash = '23952a3a66162d2f7383680db832e02a'

it('Should hash test data as string', async () => {
  expect(
    hasha(
      await readableToString(fs.createReadStream(testDataUrl).pipe(zlib.createGunzip())),
      hashOptions
    )
  ).toBe(testDataHash)
  expect(
    hasha(
      await readableToString((await fileSystem.openReadableFile(testDataUrl)).finish()),
      hashOptions
    )
  ).toBe(testDataHash)
})

it('Should hash test data stream', async () => {
  expect(await hashFile(testDataUrl)).toBe(testDataHash)
  expect(await dbcpHashFile(testDataUrl)).toBe(testDataHash)
  expect(
    await execCommand(
      'node dist/cli.js --sourceFile ./test/test.json.gz --targetType stdout' +
        ' | ./node_modules/.bin/hasha --algorithm md5'
    )
  ).toBe(testDataHash)
})

it('Should copy local file', async () => {
  await rmrf(targetDataUrl)
  await dbcp({ sourceFile: testDataUrl, targetFile: targetDataUrl, fileSystem })
  expect(await hashFile(targetDataUrl)).toBe(testDataHash)
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

export function execCommand(cmd: string, execOptions: any = {}): Promise<string> {
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
