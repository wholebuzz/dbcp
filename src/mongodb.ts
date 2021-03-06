import { streamAsyncFilter } from '@wholebuzz/fs/lib/stream'
import * as mongoDB from 'mongodb'
import StreamTree from 'tree-stream'
import { getInputConnectionString, getOutputConnectionString } from './index'

export const batch2 = require('batch2')

export async function openMongoDbInput(args: {
  inputHost?: string
  inputMongodb?: mongoDB.MongoClient
  inputName?: string
  inputPassword?: string
  inputPort?: number
  inputTable?: string[]
  inputUser?: string
}) {
  return openMongoDb({
    url: `mongodb://${getInputConnectionString(args)}`,
    mongodb: args.inputMongodb,
    name: args.inputName,
    tables: args.inputTable,
  })
}

export async function openMongoDbOutput(args: {
  outputHost?: string
  outputMongodb?: mongoDB.MongoClient
  outputName?: string
  outputPassword?: string
  outputPort?: number
  outputTable?: string[]
  outputUser?: string
}) {
  return openMongoDb({
    url: `mongodb://${getOutputConnectionString(args)}`,
    mongodb: args.outputMongodb,
    name: args.outputName,
    tables: args.outputTable,
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
