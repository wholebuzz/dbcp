import { streamAsyncFilter } from '@wholebuzz/fs/lib/stream'
import * as mongoDB from 'mongodb'
import StreamTree from 'tree-stream'
import { getSourceConnectionString, getTargetConnectionString } from './index'

export const batch2 = require('batch2')

export async function openMongoDbSource(args: {
  sourceHost?: string
  sourceMongodb?: mongoDB.MongoClient
  sourceName?: string
  sourcePassword?: string
  sourcePort?: number
  sourceTable?: string[]
  sourceUser?: string
}) {
  return openMongoDb({
    url: `mongodb://${getSourceConnectionString(args)}`,
    mongodb: args.sourceMongodb,
    name: args.sourceName,
    tables: args.sourceTable,
  })
}

export async function openMongoDbTarget(args: {
  targetHost?: string
  targetMongodb?: mongoDB.MongoClient
  targetName?: string
  targetPassword?: string
  targetPort?: number
  targetTable?: string[]
  targetUser?: string
}) {
  return openMongoDb({
    url: `mongodb://${getTargetConnectionString(args)}`,
    mongodb: args.targetMongodb,
    name: args.targetName,
    tables: args.targetTable,
  })
}

export async function openMongoDb(args: {
  url?: string
  name?: string
  mongodb?: mongoDB.MongoClient
  tables?: string[]
}) {
  const tables: Record<string, mongoDB.Collection> = {}
  if (args.mongodb) {
    return {
      db: args.mongodb,
      close: async () => {
        /**/
      },
      tables,
    }
  }
  const client = new mongoDB.MongoClient(args.url!)
  await client.connect()
  const db: mongoDB.Db = client.db(args.name)
  args.tables?.map((table) => {
    tables[table] = db.collection(table)
  })
  return {
    close: () => client.close(),
    db,
    tables,
  }
}

export function streamFromMongoDb(collection: mongoDB.Collection, args: { query?: string }) {
  return StreamTree.readable(
    collection.find(args.query ? JSON.parse(args.query) : undefined).stream()
  )
}

export function streamToMongoDb(collection: mongoDB.Collection, options?: { batchSize?: number }) {
  return StreamTree.writable(
    streamAsyncFilter(async (data: any) => {
      await collection.insertMany(data)
    })
  ).pipeFrom(batch2.obj({ size: options?.batchSize ?? 4000 }))
}
