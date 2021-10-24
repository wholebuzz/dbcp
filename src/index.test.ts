import { LocalFileSystem } from '@wholebuzz/fs'
import fs from 'fs'
import hasha from 'hasha'
import { Readable } from 'stream'
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
})

it('Should copy local file', async () => {a
  await rmrf(targetDataUrl)
  await dbcp({ sourceFile: testDataUrl, targetFile: targetDataUrl, fileSystem })
  expect(await hashFile(targetDataUrl)).toBe(testDataHash)
})

async function hashFile(path: string) {
  return readableToString(
    (await fileSystem.openReadableFile(path)).pipe(hasha.stream(hashOptions)).finish()
  )
}

function readableToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: Error) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

/*function writableToString(stream: Writable): Promise<string> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: Error) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}*/
