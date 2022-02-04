import { Client } from '@elastic/elasticsearch'
import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
import { GoogleCloudFileSystem } from '@wholebuzz/fs/lib/gcp'
import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
import { readableToString, writableToString } from '@wholebuzz/fs/lib/stream'
import { shardedFilenames } from '@wholebuzz/fs/lib/util'
import { exec } from 'child_process'
import { selectCount } from 'db-json-column/lib/knex'
import fs from 'fs'
import hasha from 'hasha'
import { knex } from 'knex'
import * as mongoDB from 'mongodb'
import rimraf from 'rimraf'
import { promisify } from 'util'
import { DatabaseCopySchema, DatabaseCopySourceType, DatabaseCopyTargetType } from './format'
import { dbcp, getTargetConnectionString, knexPoolConfig } from './index'

const zlib = require('zlib')

const fileSystem = new AnyFileSystem([
  { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
  { urlPrefix: 's3://', fs: new S3FileSystem() },
  { urlPrefix: '', fs: new LocalFileSystem() },
])
const hashOptions = { algorithm: 'md5' }
const rmrf = promisify(rimraf)
const targetJsonUrl = '/tmp/target.json.gz'
const targetShardedJsonUrl = '/tmp/target-SSS-of-NNN.json.gz'
const targetNDJsonUrl = '/tmp/target.jsonl.gz'
const targetParquetUrl = '/tmp/target.parquet'
const targetTfRecordUrl = '/tmp/target.tfrecord'
const targetLevelUrl = '/tmp/target.level'
const targetSQLUrl = '/tmp/target.sql.gz'
const testSchemaTableName = 'dbcptest'
const testSchemaUrl = './test/schema.sql'
const testNDJsonUrl = './test/test.jsonl.gz'
const testNDJsonHash = 'abb7fe0435d553c375c28e52aee28bdb'
const testJsonHash = '30dbd4095c6308b560e449d1fdbf4a82'

const esConnection = {
  node: process.env.ES_ENDPOINT ?? '',
  auth: {
    username: process.env.ES_USER ?? '',
    password: process.env.ES_PASS ?? '',
  },
}
const esSource = {
  sourceType: DatabaseCopySourceType.es,
  sourceName: esConnection.node,
  sourceUser: esConnection.auth.username,
  sourcePassword: esConnection.auth.password,
  sourceTable: testSchemaTableName,
}
const esTarget = {
  targetType: DatabaseCopyTargetType.es,
  targetName: esConnection.node,
  targetUser: esConnection.auth.username,
  targetPassword: esConnection.auth.password,
  targetTable: testSchemaTableName,
}

const mongodbSource = {
  sourceType: DatabaseCopySourceType.mongodb,
  sourceHost: process.env.MONGODB_DB_HOST,
  sourcePort: parseInt(process.env.MONGODB_DB_PORT ?? '', 10),
  sourceName: process.env.MONGODB_DB_NAME,
  sourceUser: process.env.MONGODB_DB_USER,
  sourcePassword: process.env.MONGODB_DB_PASS,
  sourceTable: testSchemaTableName,
}
const mongodbTarget = {
  targetType: DatabaseCopyTargetType.mongodb,
  targetHost: process.env.MONGODB_DB_HOST,
  targetPort: parseInt(process.env.MONGODB_DB_PORT ?? '', 10),
  targetName: process.env.MONGODB_DB_NAME,
  targetUser: process.env.MONGODB_DB_USER,
  targetPassword: process.env.MONGODB_DB_PASS,
  targetTable: testSchemaTableName,
}

const mssqlConnection = {
  database: process.env.MSSQL_DB_NAME ?? '',
  user: process.env.MSSQL_DB_USER ?? '',
  password: process.env.MSSQL_DB_PASS ?? '',
  host: process.env.MSSQL_DB_HOST ?? '',
  port: parseInt(process.env.MSSQL_DB_PORT ?? '', 10),
  options: { trustServerCertificate: true },
}
const mssqlSource = {
  sourceType: DatabaseCopySourceType.mssql,
  sourceHost: mssqlConnection.host,
  sourcePort: mssqlConnection.port,
  sourceUser: mssqlConnection.user,
  sourcePassword: mssqlConnection.password,
  sourceName: mssqlConnection.database,
  sourceTable: testSchemaTableName,
}
const mssqlTarget = {
  batchSize: 100,
  targetType: DatabaseCopyTargetType.mssql,
  targetHost: mssqlConnection.host,
  targetPort: mssqlConnection.port,
  targetUser: mssqlConnection.user,
  targetPassword: mssqlConnection.password,
  targetName: mssqlConnection.database,
  targetTable: testSchemaTableName,
}

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
      `node dist/cli.js --sourceFile ${testNDJsonUrl} --targetFile=-` +
        ` | ./node_modules/.bin/hasha --algorithm md5`
    )
  ).toBe(testNDJsonHash)
})

it('Should copy local file', async () => {
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({ sourceFiles: [{ url: testNDJsonUrl }], targetFile: targetNDJsonUrl, fileSystem })
  )
})

it('Should read local directory', async () => {
  const dir = { value: '' }
  await dbcp({
    sourceFiles: [{ url: './test/' }],
    targetStream: [writableToString(dir)],
    fileSystem,
  })
  expect(JSON.parse(dir.value)).toEqual([
    { url: 'test/compound-data.sql' },
    { url: 'test/compound.sql' },
    { url: 'test/schema.sql' },
    { url: 'test/test.jsonl.gz' },
  ])
})

it('Should convert to JSON from ND-JSON and back', async () => {
  await expectCreateFileWithHash(targetJsonUrl, testJsonHash, () =>
    dbcp({ sourceFiles: [{ url: testNDJsonUrl }], targetFile: targetJsonUrl, fileSystem })
  )
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({ sourceFiles: [{ url: targetJsonUrl }], targetFile: targetNDJsonUrl, fileSystem })
  )
})

it('Should convert to sharded JSON from ND-JSON and back', async () => {
  const shards = 4
  await expectCreateFilesWithHashes(shardedFilenames(targetShardedJsonUrl, shards), undefined, () =>
    dbcp({
      shardBy: 'id',
      sourceFiles: [{ url: testNDJsonUrl }],
      targetFile: targetShardedJsonUrl,
      targetShards: shards,
      fileSystem,
    })
  )
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      orderBy: ['id'],
      sourceShards: shards,
      sourceFiles: [{ url: targetShardedJsonUrl }],
      targetFile: targetNDJsonUrl,
      fileSystem,
    })
  )
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      orderBy: ['id'],
      sourceFiles: shardedFilenames(targetShardedJsonUrl, shards).map((url) => ({ url })),
      targetFile: targetNDJsonUrl,
      fileSystem,
    })
  )
})

it('Should convert to Parquet from ND-JSON and back', async () => {
  await expectCreateFileWithConvertHash(targetParquetUrl, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      sourceFiles: [{ url: testNDJsonUrl }],
      targetFile: targetParquetUrl,
    })
  )
})

it('Should convert to TFRecord from ND-JSON and back', async () => {
  await expectCreateFileWithConvertHash(
    targetTfRecordUrl,
    targetNDJsonUrl,
    testNDJsonHash,
    () =>
      dbcp({
        fileSystem,
        sourceFiles: [{ url: testNDJsonUrl }],
        targetFile: targetTfRecordUrl,
      }),
    (x: any) => {
      x.props = JSON.parse(x.props)
      x.tags = JSON.parse(x.tags)
      return x
    }
  )
})

it('Should load to level from ND-JSON and dump to JSON after external sort', async () => {
  await expectCreateFileWithHash(targetLevelUrl, undefined, () =>
    dbcp({
      fileSystem,
      sourceFiles: [{ url: testNDJsonUrl }],
      targetFile: targetLevelUrl,
      targetType: DatabaseCopyTargetType.level,
    })
  )
  await expectCreateFileWithHash(targetJsonUrl, testJsonHash, () =>
    dbcp({
      sourceType: DatabaseCopySourceType.level,
      sourceFiles: [{ url: targetLevelUrl }],
      targetFile: targetJsonUrl,
      externalSortBy: ['id'],
      fileSystem,
    })
  )
})

it('Should restore to and dump compound data', async () => {
  const query =
    'select ' +
    'to_json(a.*) as compoundA, ' +
    'to_json(b.*) as compoundB, ' +
    'to_json(c.*) as compoundC ' +
    'from compoundA a ' +
    'left join compoundB b on b.id = a.compoundB_id ' +
    'left join compoundC c on c.id = b.compoundC_id;'

  // Load schema
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFiles: [{ url: './test/compound.sql' }],
  })

  // Load data
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFiles: [{ url: './test/compound-data.sql' }],
  })

  // Dump to data
  await dbcp({
    fileSystem,
    ...postgresSource,
    query,
    targetFile: targetJsonUrl,
  })

  // Reload schema
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFiles: [{ url: './test/compound.sql' }],
  })

  // Copy from targetJsonUrl to PostgreSQL
  await expectFillDatabaseTable(
    'postgresql',
    postgresConnection,
    'compoundA',
    () =>
      dbcp({
        fileSystem,
        ...postgresTarget,
        compoundInsert: true,
        sourceFiles: [{ url: targetJsonUrl }],
      }),
    undefined,
    2
  )

  // Dump again and verify
  await expectCreateFileWithHash(targetJsonUrl, 'b97dec85da649680fc8206fd08c25624', () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      query,
      targetFile: targetJsonUrl,
    })
  )
})

it('Should restore to and dump from Elastic Search to ND-JSON', async () => {
  // Reset data
  const client = new Client(esConnection)
  try {
    await client.indices.delete({ index: testSchemaTableName })
  } catch (_err) {
    /* */
  }
  await client.indices.create({ index: testSchemaTableName })

  // Copy from testNDJsonUrl to Elastic Search
  const extra: Record<string, any> = {}
  await dbcp({
    extra,
    extraOutput: true,
    fileSystem,
    ...esTarget,
    sourceFiles: [{ url: testNDJsonUrl }],
  })
  expect((await client.count({ index: testSchemaTableName })).body.count).toBe(10000)
  await client.close()
  expect(extra.results?.length).toBeGreaterThan(0)
  expect(extra.results.reduce((total: number, x: any) => (total += x.successful), 0)).toBe(10000)

  // Dump and verify Elastic Search
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...esSource,
      targetFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should restore to and dump from MongoDB to ND-JSON', async () => {
  const client = new mongoDB.MongoClient('mongodb://' + getTargetConnectionString(mongodbTarget))
  await client.connect()
  const db: mongoDB.Db = client.db(mongodbTarget.targetName)
  await db.dropCollection(mongodbTarget.targetTable ?? '')
  await client.close()

  // Copy from testNDJsonUrl to MongoDB
  await dbcp({
    fileSystem,
    ...mongodbTarget,
    sourceFiles: [{ url: testNDJsonUrl }],
  })

  // Dump and verify MongoDB
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mongodbSource,
      targetFile: targetNDJsonUrl,
      transformObject: (x: any) => {
        delete x._id
        return x
      },
    })
  )
})

it('Should restore to and dump from Postgres to ND-JSON', async () => {
  // Load schema
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFiles: [{ url: testSchemaUrl }],
  })

  // Copy from testNDJsonUrl to PostgreSQL
  await expectFillDatabaseTable('postgresql', postgresConnection, testSchemaTableName, () =>
    dbcp({
      fileSystem,
      ...postgresTarget,
      sourceFiles: [{ url: testNDJsonUrl }],
    })
  )

  // Dump and verify PostgreSQL
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      targetFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should restore to and dump from Postgres to SQL', async () => {
  // Dump database to targetSQLUrl
  await expectCreateFileWithHash(targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      copySchema: DatabaseCopySchema.dataOnly,
      targetFile: targetSQLUrl,
      targetType: DatabaseCopyTargetType.postgresql,
    })
  )

  // Load schema and copy from testSchemaUrl to Postgres
  await dbcp({
    fileSystem,
    ...postgresTarget,
    sourceFiles: [{ url: testSchemaUrl }],
  })

  // Copy from targetSQLUrl to PostgreSQL
  await expectFillDatabaseTable('postgresql', postgresConnection, testSchemaTableName, () =>
    dbcp({
      fileSystem,
      ...postgresTarget,
      sourceFiles: [{ url: targetSQLUrl }],
    })
  )

  // Dump and verify PostgreSQL
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      targetFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should not hang on error', async () => {
  await expect(
    dbcp({
      fileSystem,
      ...postgresSource,
      sourcePassword: 'BadPasswordWontWork',
      targetFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  ).rejects.toThrow(Error)
  await expect(
    dbcp({
      fileSystem,
      ...postgresSource,
      targetFile: 'gs://not-existent-bucket-wont-work/fail.jsonl.gz',
      orderBy: ['id ASC'],
    })
  ).rejects.toThrow(Error)
})

it('Should copy from Postgres to Mysql', async () => {
  // Dump schema to targetSQLUrl
  await expectCreateFileWithHash(targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      copySchema: DatabaseCopySchema.schemaOnly,
      targetFile: targetSQLUrl,
      targetType: DatabaseCopyTargetType.mysql,
    })
  )

  // Load schema and copy from PostgreSQL to MySQL
  const sql =
    `DROP TABLE IF EXISTS dbcptest;\n` +
    (await readableToString((await fileSystem.openReadableFile(targetSQLUrl)).finish()))
  await expectFillDatabaseTable(
    'mysql',
    {
      ...mysqlConnection,
      multipleStatements: true,
    },
    testSchemaTableName,
    () =>
      dbcp({
        fileSystem,
        ...mysqlTarget,
        ...postgresSource,
        transformObject: (x: any) => {
          x.props = JSON.stringify(x.props)
          x.tags = JSON.stringify(x.tags)
          return x
        },
      }),
    sql
  )

  // Dump and verify MySQL
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mysqlSource,
      orderBy: ['id ASC'],
      targetFile: targetNDJsonUrl,
      transformObject: (x: any) => {
        x.props = JSON.parse(x.props)
        x.tags = JSON.parse(x.tags)
        return x
      },
    })
  )
})

it('Should copy from Postgres to SQL Server', async () => {
  // Dump schema to targetSQLUrl
  await expectCreateFileWithHash(targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      copySchema: DatabaseCopySchema.schemaOnly,
      targetFile: targetSQLUrl,
      targetType: DatabaseCopyTargetType.mssql,
    })
  )

  // Load schema and copy from PostgreSQL to SQL Server
  const sql =
    `DROP TABLE IF EXISTS dbcptest;\n` +
    (await readableToString((await fileSystem.openReadableFile(targetSQLUrl)).finish()))
  await expectFillDatabaseTable(
    'mssql',
    {
      ...mssqlConnection,
      multipleStatements: true,
    },
    testSchemaTableName,
    () =>
      dbcp({
        fileSystem,
        ...mssqlTarget,
        ...postgresSource,
        transformObject: (x: any) => {
          x.props = JSON.stringify(x.props)
          x.tags = JSON.stringify(x.tags)
          return x
        },
      }),
    sql
  )

  // Dump and verify SQL Server
  await expectCreateFileWithHash(targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mssqlSource,
      orderBy: ['id ASC'],
      targetFile: targetNDJsonUrl,
      transformObject: (x: any) => {
        x.props = JSON.parse(x.props)
        x.tags = JSON.parse(x.tags)
        return x
      },
    })
  )
})

it('Should dump from Postgres to Parquet file', async () => {
  // Dump database to targetParquetUrl and verify
  await expectCreateFileWithConvertHash(targetParquetUrl, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...postgresSource,
      targetFile: targetParquetUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should dump from MySQL to Parquet file', async () => {
  // Dump database to targetParquetUrl and verify
  await expectCreateFileWithConvertHash(targetParquetUrl, targetJsonUrl, testJsonHash, () =>
    dbcp({
      fileSystem,
      ...mysqlSource,
      targetFile: targetParquetUrl,
      orderBy: ['id ASC'],
      transformObject: (x: any) => {
        x.props = JSON.parse(x.props)
        x.tags = JSON.parse(x.tags)
        return x
      },
    })
  )
})

it('Should dump from SQL Server to Parquet file', async () => {
  // Dump database to targetParquetUrl and verify
  await expectCreateFileWithConvertHash(targetParquetUrl, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mssqlSource,
      targetFile: targetParquetUrl,
      orderBy: ['id ASC'],
      columnType: { props: 'json', tags: 'json' },
      transformObject: (x: any) => {
        x.props = JSON.parse(x.props)
        x.tags = JSON.parse(x.tags)
        return x
      },
    })
  )
})

async function expectCreateFileWithConvertHash(
  targetUrl: string,
  convertToUrl: string,
  convertToHash: string,
  fn: () => Promise<void>,
  convertToTransform: (x: any) => any = (x) => x
) {
  await expectCreateFileWithHash(targetUrl, undefined, fn)

  // Convert and verify
  await expectCreateFileWithHash(convertToUrl, convertToHash, () =>
    dbcp({
      sourceFiles: [{ url: targetUrl }],
      targetFile: convertToUrl,
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

async function expectFillDatabaseTable(
  client: 'mssql' | 'mysql' | 'postgresql',
  connection: Record<string, any>,
  tableName: string,
  fn: () => Promise<void>,
  preambleSql?: string,
  expectedCount = 10000
) {
  const db = knex({
    client,
    connection,
    pool: knexPoolConfig,
  } as any)
  if (preambleSql) await db.raw(preambleSql)
  expect(await selectCount(db, tableName)).toBe(0)
  await fn()
  expect(await selectCount(db, tableName)).toBe(expectedCount)
  await db.destroy()
}

async function expectCreateFilesWithHashes(
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
    if (fileHash) expect(await hashFile(fileUrl[i])).toBe(fileHash[i])
  }
}

async function expectCreateFileWithHash(
  fileUrl: string,
  fileHash: string | undefined,
  fn: () => Promise<void>
) {
  await rmrf(fileUrl)
  expect(await fileSystem.fileExists(fileUrl)).toBe(false)
  await fn()
  expect(await fileSystem.fileExists(fileUrl)).toBe(true)
  if (fileHash) expect(await hashFile(fileUrl)).toBe(fileHash)
}

async function hashFile(path: string) {
  return readableToString(
    (await fileSystem.openReadableFile(path)).pipe(hasha.stream(hashOptions)).finish()
  )
}

async function dbcpHashFile(path: string) {
  const target = { value: '' }
  await dbcp({
    sourceFiles: [{ url: path }],
    // sourceStream: await fileSystem.openReadableFile(path),
    targetStream: [writableToString(target).pipeFrom(hasha.stream(hashOptions))],
    fileSystem,
  })
  return target.value
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
