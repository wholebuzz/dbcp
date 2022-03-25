import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { rmrf } from '@wholebuzz/fs/lib/local'
import { readableToString, writableToString } from '@wholebuzz/fs/lib/stream'
import { exec } from 'child_process'
import hasha from 'hasha'
import { dbcp } from './index'

const hashOptions = { algorithm: 'md5' }

export async function expectCreateFileWithConvertHash(
  fileSystem: FileSystem,
  targetUrl: string,
  convertToUrl: string,
  convertToHash: string,
  fn: () => Promise<void>,
  convertToTransform: (x: any) => any = (x) => x
) {
  await expectCreateFileWithHash(fileSystem, targetUrl, undefined, fn)

  // Convert and verify
  await expectCreateFileWithHash(fileSystem, convertToUrl, convertToHash, () =>
    dbcp({
      inputFiles: [{ url: targetUrl }],
      outputFile: convertToUrl,
      fileSystem,
      transformObject: (x: any) =>
        convertToTransform({
          id: x.id,
          date: x.date,
          guid: x.guid,
          link: x.link || null,
          feed: x.feed,
          props: x.props,
          tags: x.tags,
        }),
    })
  )
}

export async function expectCreateFilesWithHashes(
  fileSystem: FileSystem,
  fileUrl: string[],
  fileHash: string[] | undefined,
  fn: () => Promise<void>
) {
  for (const url of fileUrl) {
    await rmrf(url)
    expect(await fileSystem.fileExists(url)).toBe(false)
  }
  await fn()
  for (let i = 0; i < fileUrl.length; i++) {
    expect(await fileSystem.fileExists(fileUrl[i])).toBe(true)
    if (fileHash) expect(await hashFile(fileSystem, fileUrl[i])).toBe(fileHash[i])
  }
}

export async function expectCreateFileWithHash(
  fileSystem: FileSystem,
  fileUrl: string,
  fileHash: string | undefined,
  fn: () => Promise<void>
) {
  await rmrf(fileUrl)
  expect(await fileSystem.fileExists(fileUrl)).toBe(false)
  await fn()
  expect(await fileSystem.fileExists(fileUrl)).toBe(true)
  if (fileHash) expect(await hashFile(fileSystem, fileUrl)).toBe(fileHash)
}

export async function hashFile(fileSystem: FileSystem, path: string) {
  return readableToString(
    (await fileSystem.openReadableFile(path)).pipe(hasha.stream(hashOptions)).finish()
  )
}

export async function dbcpHashFile(fileSystem: FileSystem, path: string) {
  const target = { value: '' }
  await dbcp({
    inputFiles: [{ url: path }],
    // inputStream: await fileSystem.openReadableFile(path),
    outputStream: [writableToString(target).pipeFrom(hasha.stream(hashOptions))],
    fileSystem,
  })
  return target.value
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
