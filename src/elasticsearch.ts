import { Client } from '@elastic/elasticsearch'
import { ResponseError } from '@elastic/elasticsearch/lib/errors'
import { Readable, Transform } from 'stream'
import StreamTree, { ReadableStreamTree, WritableStreamTree } from 'tree-stream'

export const batch2 = require('batch2')

export async function streamFromElasticSearch(
  client: Client,
  options: {
    index: string
    batchSize?: number
  }
): Promise<ReadableStreamTree> {
  const keepAlive = '1m'
  const batchSize = options.batchSize || 4000
  const pointInTime = await client.openPointInTime({ index: options.index, keep_alive: keepAlive })
  const pointInTimeId = pointInTime.body.id
  const state = {
    done: false,
    outstanding: false,
    searchAfter: null,
  }
  const stream = new Readable({
    objectMode: true,
    read() {
      if (state.done || state.outstanding) return
      state.outstanding = true
      client
        .search({
          body: {
            size: batchSize,
            track_total_hits: false,
            query: { match_all: {} },
            pit: {
              id: pointInTimeId,
              keep_alive: keepAlive,
            },
            sort: [{ _shard_doc: 'desc' }],
            ...(state.searchAfter !== null && { search_after: [state.searchAfter] }),
          },
        })
        .then((response) => {
          const { hits } = response.body.hits
          if (hits) {
            for (const hit of hits) stream.push(hit)
          }
          if ((hits?.length ?? 0) < batchSize) {
            state.done = true
            state.outstanding = false
            client
              .closePointInTime({ body: { id: pointInTimeId } })
              .then(() => {
                stream.push(null)
              })
              .catch((_err) => {
                stream.push(null)
              })
            return
          }
          state.searchAfter = hits[hits.length - 1].sort[0]
          state.outstanding = false
        })
        .catch((error) => {
          throw error
        })
    },
  })
  return StreamTree.readable(stream)
}

export function streamToElasticSearch(
  client: Client,
  options: {
    index: string
    batchSize?: number
  }
): WritableStreamTree {
  const stream = StreamTree.writable(
    new Transform({
      objectMode: true,
      transform(data: any[], _: string, callback: () => void) {
        client.helpers
          .bulk({
            datasource: data,
            concurrency: 1,
            retries: 3,
            refreshOnCompletion: true,
            onDocument(_doc) {
              return { index: { _index: options.index } }
            },
            onDrop(doc) {
              console.log('ElastiSearch droppped', doc)
            },
          })
          .then((_result) => {
            // console.log('ElasticSearch result', _result)
            callback()
          })
          .catch((err: ResponseError) => {
            throw err
          })
      },
    })
  )
  return stream.pipeFrom(batch2.obj({ size: options.batchSize ?? 4000 }))
}
