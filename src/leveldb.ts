import { rmrf } from '@wholebuzz/fs/lib/local'
import { streamAsyncFilter, streamSyncFilter } from '@wholebuzz/fs/lib/stream'
import level from 'level'
import { LevelUp } from 'levelup'
import sub from 'subleveldown'
import StreamTree from 'tree-stream'

export const levelIteratorStream = require('level-iterator-stream')

export async function openLevelDbInput(args: {
  inputFile?: string
  inputLeveldb?: level.LevelDB | LevelUp
  inputTable?: string[]
  extra?: Record<string, any>
}) {
  return openLevelDb({
    file: args.inputFile,
    level: args.inputLeveldb,
    tables: args.inputTable,
    extra: args.extra,
  })
}

export async function openLevelDbOutput(args: {
  outputFile?: string
  outputLeveldb?: level.LevelDB | LevelUp
  outputTable?: string[]
  extra?: Record<string, any>
  removeExisting?: boolean
}) {
  return openLevelDb({
    file: args.outputFile,
    level: args.outputLeveldb,
    tables: args.outputTable,
    extra: args.extra,
    removeExisting: args.removeExisting,
  })
}

export async function openLevelDb(args: {
  file?: string
  level?: level.LevelDB | LevelUp
  tables?: string[]
  extra?: Record<string, any>
  removeExisting?: boolean
}) {
  const tables: Record<string, LevelUp> = {}
  if (args.level) {
    return {
      db: args.level,
      close: async () => {
        /**/
      },
      tables,
    }
  }
  if (args.removeExisting && args.file) await rmrf(args.file)
  const levelOptions = {
    valueEncoding: 'json',
    ...args.extra,
  }
  const db: level.LevelDB = level(args.file!, levelOptions)
  args.tables?.map((table) => {
    tables[table] = sub(db, table, levelOptions)
  })
  return {
    close: async () => {
      for (const table of Object.values(tables)) await table.close()
      await db.close()
    },
    db,
    tables,
  }
}

export function streamFromLevelDb(leveldb: level.LevelDB | LevelUp) {
  const iterator = levelIteratorStream(leveldb.iterator())
  return StreamTree.readable(iterator).pipe(streamSyncFilter((x) => x.value))
}

export function streamToLevelDb(
  leveldb: level.LevelDB | LevelUp,
  args: {
    getKey: (item: any) => string
  }
) {
  return StreamTree.writable(
    streamAsyncFilter(async (item: any) => {
      const key = args.getKey(item)
      if (key) await leveldb.put(key, item)
      return undefined
    })
  )
}
