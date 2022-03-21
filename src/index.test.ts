import { Client } from '@elastic/elasticsearch'
import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
import { GoogleCloudFileSystem } from '@wholebuzz/fs/lib/gcp'
import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
import { readableToString, writableToString } from '@wholebuzz/fs/lib/stream'
import { shardedFilenames } from '@wholebuzz/fs/lib/util'
import { selectCount } from 'db-json-column/lib/knex'
import fs from 'fs'
import hasha from 'hasha'
import { knex } from 'knex'
import * as mongoDB from 'mongodb'
import { DatabaseCopySchema, DatabaseCopyInputType, DatabaseCopyOutputType } from './format'
import { dbcp, getOutputConnectionString } from './index'
import { knexPoolConfig } from './knex'
import {
  dbcpHashFile,
  execCommand,
  expectCreateFilesWithHashes,
  expectCreateFileWithConvertHash,
  expectCreateFileWithHash,
  hashFile,
} from './test.fixture'

const zlib = require('zlib')

const fileSystem = new AnyFileSystem([
  { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
  { urlPrefix: 's3://', fs: new S3FileSystem() },
  { urlPrefix: '', fs: new LocalFileSystem() },
])
const hashOptions = { algorithm: 'md5' }
const targetJsonUrl = '/tmp/target.json.gz'
const outputShardedJsonUrl = '/tmp/target-SSS-of-NNN.json.gz'
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
const esInput = {
  inputType: DatabaseCopyInputType.elasticsearch,
  inputName: esConnection.node,
  inputUser: esConnection.auth.username,
  inputPassword: esConnection.auth.password,
  inputTable: testSchemaTableName,
}
const esOutput = {
  outputType: DatabaseCopyOutputType.elasticsearch,
  outputName: esConnection.node,
  outputUser: esConnection.auth.username,
  outputPassword: esConnection.auth.password,
  outputTable: testSchemaTableName,
}

const mongodbInput = {
  inputType: DatabaseCopyInputType.mongodb,
  inputHost: process.env.MONGODB_DB_HOST,
  inputPort: parseInt(process.env.MONGODB_DB_PORT ?? '', 10),
  inputName: process.env.MONGODB_DB_NAME,
  inputUser: process.env.MONGODB_DB_USER,
  inputPassword: process.env.MONGODB_DB_PASS,
  inputTable: testSchemaTableName,
}
const mongodbOutput = {
  outputType: DatabaseCopyOutputType.mongodb,
  outputHost: process.env.MONGODB_DB_HOST,
  outputPort: parseInt(process.env.MONGODB_DB_PORT ?? '', 10),
  outputName: process.env.MONGODB_DB_NAME,
  outputUser: process.env.MONGODB_DB_USER,
  outputPassword: process.env.MONGODB_DB_PASS,
  outputTable: testSchemaTableName,
}

const mssqlConnection = {
  database: process.env.MSSQL_DB_NAME ?? '',
  user: process.env.MSSQL_DB_USER ?? '',
  password: process.env.MSSQL_DB_PASS ?? '',
  host: process.env.MSSQL_DB_HOST ?? '',
  port: parseInt(process.env.MSSQL_DB_PORT ?? '', 10),
  options: { trustServerCertificate: true },
}
const mssqlInput = {
  inputType: DatabaseCopyInputType.mssql,
  inputHost: mssqlConnection.host,
  inputPort: mssqlConnection.port,
  inputUser: mssqlConnection.user,
  inputPassword: mssqlConnection.password,
  inputName: mssqlConnection.database,
  inputTable: testSchemaTableName,
}
const mssqlOutput = {
  batchSize: 100,
  outputType: DatabaseCopyOutputType.mssql,
  outputHost: mssqlConnection.host,
  outputPort: mssqlConnection.port,
  outputUser: mssqlConnection.user,
  outputPassword: mssqlConnection.password,
  outputName: mssqlConnection.database,
  outputTable: testSchemaTableName,
}

const mysqlConnection = {
  database: process.env.MYSQL_DB_NAME ?? '',
  user: process.env.MYSQL_DB_USER ?? '',
  password: process.env.MYSQL_DB_PASS ?? '',
  host: process.env.MYSQL_DB_HOST ?? '',
  port: parseInt(process.env.MYSQL_DB_PORT ?? '', 10),
  charset: 'utf8mb4',
}
const mysqlInput = {
  inputType: DatabaseCopyInputType.mysql,
  inputHost: mysqlConnection.host,
  inputPort: mysqlConnection.port,
  inputUser: mysqlConnection.user,
  inputPassword: mysqlConnection.password,
  inputName: mysqlConnection.database,
  inputTable: testSchemaTableName,
}
const mysqlOutput = {
  outputType: DatabaseCopyOutputType.mysql,
  outputHost: mysqlConnection.host,
  outputPort: mysqlConnection.port,
  outputUser: mysqlConnection.user,
  outputPassword: mysqlConnection.password,
  outputName: mysqlConnection.database,
  outputTable: testSchemaTableName,
}

const postgresConnection = {
  database: process.env.POSTGRES_DB_NAME ?? '',
  user: process.env.POSTGRES_DB_USER ?? '',
  password: process.env.POSTGRES_DB_PASS ?? '',
  host: process.env.POSTGRES_DB_HOST ?? '',
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '', 10),
}
const postgresInput = {
  inputType: DatabaseCopyInputType.postgresql,
  inputHost: postgresConnection.host,
  inputPort: postgresConnection.port,
  inputUser: postgresConnection.user,
  inputPassword: postgresConnection.password,
  inputName: postgresConnection.database,
  inputTable: testSchemaTableName,
}
const postgresOutput = {
  outputType: DatabaseCopyOutputType.postgresql,
  outputHost: postgresConnection.host,
  outputPort: postgresConnection.port,
  outputUser: postgresConnection.user,
  outputPassword: postgresConnection.password,
  outputName: postgresConnection.database,
  outputTable: testSchemaTableName,
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
  expect(await hashFile(fileSystem, testNDJsonUrl)).toBe(testNDJsonHash)
  expect(await dbcpHashFile(fileSystem, testNDJsonUrl)).toBe(testNDJsonHash)
  expect(
    await execCommand(
      `node dist/cli.js --inputFile ${testNDJsonUrl} --outputFile=-` +
        ` | ./node_modules/.bin/hasha --algorithm md5`
    )
  ).toBe(testNDJsonHash)
})

it('Should copy local file', async () => {
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({ inputFiles: [{ url: testNDJsonUrl }], outputFile: targetNDJsonUrl, fileSystem })
  )
})

it('Should read local directory', async () => {
  const dir = { value: '' }
  await dbcp({
    inputFiles: [{ url: './test/' }],
    outputStream: [writableToString(dir)],
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
  await expectCreateFileWithHash(fileSystem, targetJsonUrl, testJsonHash, () =>
    dbcp({ inputFiles: [{ url: testNDJsonUrl }], outputFile: targetJsonUrl, fileSystem })
  )
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({ inputFiles: [{ url: targetJsonUrl }], outputFile: targetNDJsonUrl, fileSystem })
  )
})

it('Should convert to sharded JSON from ND-JSON and back', async () => {
  const shards = 4
  await expectCreateFilesWithHashes(
    fileSystem,
    shardedFilenames(outputShardedJsonUrl, shards),
    undefined,
    () =>
      dbcp({
        shardBy: 'id',
        inputFiles: [{ url: testNDJsonUrl }],
        outputFile: outputShardedJsonUrl,
        outputShards: shards,
        fileSystem,
      })
  )
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      orderBy: ['id'],
      inputShards: shards,
      inputFiles: [{ url: outputShardedJsonUrl }],
      outputFile: targetNDJsonUrl,
      fileSystem,
    })
  )
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      orderBy: ['id'],
      inputFiles: shardedFilenames(outputShardedJsonUrl, shards).map((url) => ({ url })),
      outputFile: targetNDJsonUrl,
      fileSystem,
    })
  )
})

it('Should convert to Parquet from ND-JSON and back', async () => {
  await expectCreateFileWithConvertHash(
    fileSystem,
    targetParquetUrl,
    targetNDJsonUrl,
    testNDJsonHash,
    () =>
      dbcp({
        fileSystem,
        inputFiles: [{ url: testNDJsonUrl }],
        outputFile: targetParquetUrl,
      })
  )
})

it('Should convert to TFRecord from ND-JSON and back', async () => {
  await expectCreateFileWithConvertHash(
    fileSystem,
    targetTfRecordUrl,
    targetNDJsonUrl,
    testNDJsonHash,
    () =>
      dbcp({
        fileSystem,
        inputFiles: [{ url: testNDJsonUrl }],
        outputFile: targetTfRecordUrl,
      }),
    (x: any) => {
      x.props = JSON.parse(x.props)
      x.tags = JSON.parse(x.tags)
      return x
    }
  )
})

it('Should load to level from ND-JSON and dump to JSON after external sort', async () => {
  await expectCreateFileWithHash(fileSystem, targetLevelUrl, undefined, () =>
    dbcp({
      fileSystem,
      inputFiles: [{ url: testNDJsonUrl }],
      outputFile: targetLevelUrl,
      outputType: DatabaseCopyOutputType.level,
    })
  )
  await expectCreateFileWithHash(fileSystem, targetJsonUrl, testJsonHash, () =>
    dbcp({
      inputType: DatabaseCopyInputType.level,
      inputFiles: [{ url: targetLevelUrl }],
      outputFile: targetJsonUrl,
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
    ...postgresOutput,
    inputFiles: [{ url: './test/compound.sql' }],
  })

  // Load data
  await dbcp({
    fileSystem,
    ...postgresOutput,
    inputFiles: [{ url: './test/compound-data.sql' }],
  })

  // Dump to data
  await dbcp({
    fileSystem,
    ...postgresInput,
    query,
    outputFile: targetJsonUrl,
  })

  // Reload schema
  await dbcp({
    fileSystem,
    ...postgresOutput,
    inputFiles: [{ url: './test/compound.sql' }],
  })

  // Copy from targetJsonUrl to PostgreSQL
  await expectFillDatabaseTable(
    'postgresql',
    postgresConnection,
    'compoundA',
    () =>
      dbcp({
        fileSystem,
        ...postgresOutput,
        compoundInsert: true,
        inputFiles: [{ url: targetJsonUrl }],
      }),
    undefined,
    2
  )

  // Dump again and verify
  await expectCreateFileWithHash(
    fileSystem,
    targetJsonUrl,
    'b97dec85da649680fc8206fd08c25624',
    () =>
      dbcp({
        fileSystem,
        ...postgresInput,
        query,
        outputFile: targetJsonUrl,
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
    ...esOutput,
    inputFiles: [{ url: testNDJsonUrl }],
  })
  expect((await client.count({ index: testSchemaTableName })).body.count).toBe(10000)
  await client.close()
  expect(extra.results?.length).toBeGreaterThan(0)
  expect(extra.results.reduce((total: number, x: any) => (total += x.successful), 0)).toBe(10000)

  // Dump and verify Elastic Search
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...esInput,
      outputFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should restore to and dump from MongoDB to ND-JSON', async () => {
  const client = new mongoDB.MongoClient('mongodb://' + getOutputConnectionString(mongodbOutput))
  await client.connect()
  const db: mongoDB.Db = client.db(mongodbOutput.outputName)
  try {
    await db.dropCollection(mongodbOutput.outputTable ?? '')
  } catch (_err) {
    /* */
  }
  await client.close()

  // Copy from testNDJsonUrl to MongoDB
  await dbcp({
    fileSystem,
    ...mongodbOutput,
    inputFiles: [{ url: testNDJsonUrl }],
  })

  // Dump and verify MongoDB
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mongodbInput,
      outputFile: targetNDJsonUrl,
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
    ...postgresOutput,
    inputFiles: [{ url: testSchemaUrl }],
  })

  // Copy from testNDJsonUrl to PostgreSQL
  await expectFillDatabaseTable('postgresql', postgresConnection, testSchemaTableName, () =>
    dbcp({
      fileSystem,
      ...postgresOutput,
      inputFiles: [{ url: testNDJsonUrl }],
    })
  )

  // Dump and verify PostgreSQL
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...postgresInput,
      outputFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should restore to and dump from Postgres to SQL', async () => {
  // Dump database to targetSQLUrl
  await expectCreateFileWithHash(fileSystem, targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresInput,
      copySchema: DatabaseCopySchema.dataOnly,
      outputFile: targetSQLUrl,
      outputType: DatabaseCopyOutputType.postgresql,
    })
  )

  // Load schema and copy from testSchemaUrl to Postgres
  await dbcp({
    fileSystem,
    ...postgresOutput,
    inputFiles: [{ url: testSchemaUrl }],
  })

  // Copy from targetSQLUrl to PostgreSQL
  await expectFillDatabaseTable('postgresql', postgresConnection, testSchemaTableName, () =>
    dbcp({
      fileSystem,
      ...postgresOutput,
      inputFiles: [{ url: targetSQLUrl }],
    })
  )

  // Dump and verify PostgreSQL
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...postgresInput,
      outputFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  )
})

it('Should not hang on error', async () => {
  await expect(
    dbcp({
      fileSystem,
      ...postgresInput,
      inputPassword: 'BadPasswordWontWork',
      outputFile: targetNDJsonUrl,
      orderBy: ['id ASC'],
    })
  ).rejects.toThrow(Error)
  await expect(
    dbcp({
      fileSystem,
      ...postgresInput,
      outputFile: 'gs://not-existent-bucket-wont-work/fail.jsonl.gz',
      orderBy: ['id ASC'],
    })
  ).rejects.toThrow(Error)
})

it('Should copy from Postgres to Mysql', async () => {
  // Dump schema to targetSQLUrl
  await expectCreateFileWithHash(fileSystem, targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresInput,
      copySchema: DatabaseCopySchema.schemaOnly,
      outputFile: targetSQLUrl,
      outputType: DatabaseCopyOutputType.mysql,
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
        ...mysqlOutput,
        ...postgresInput,
        transformObject: (x: any) => {
          x.props = JSON.stringify(x.props)
          x.tags = JSON.stringify(x.tags)
          return x
        },
      }),
    sql
  )

  // Dump and verify MySQL
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mysqlInput,
      orderBy: ['id ASC'],
      outputFile: targetNDJsonUrl,
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
  await expectCreateFileWithHash(fileSystem, targetSQLUrl, undefined, () =>
    dbcp({
      fileSystem,
      ...postgresInput,
      copySchema: DatabaseCopySchema.schemaOnly,
      outputFile: targetSQLUrl,
      outputType: DatabaseCopyOutputType.mssql,
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
        ...mssqlOutput,
        ...postgresInput,
        transformObject: (x: any) => {
          x.props = JSON.stringify(x.props)
          x.tags = JSON.stringify(x.tags)
          return x
        },
      }),
    sql
  )

  // Dump and verify SQL Server
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, testNDJsonHash, () =>
    dbcp({
      fileSystem,
      ...mssqlInput,
      orderBy: ['id ASC'],
      outputFile: targetNDJsonUrl,
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
  await expectCreateFileWithConvertHash(
    fileSystem,
    targetParquetUrl,
    targetNDJsonUrl,
    testNDJsonHash,
    () =>
      dbcp({
        fileSystem,
        ...postgresInput,
        outputFile: targetParquetUrl,
        orderBy: ['id ASC'],
      })
  )
})

it('Should dump from MySQL to Parquet file', async () => {
  // Dump database to targetParquetUrl and verify
  await expectCreateFileWithConvertHash(
    fileSystem,
    targetParquetUrl,
    targetJsonUrl,
    testJsonHash,
    () =>
      dbcp({
        fileSystem,
        ...mysqlInput,
        outputFile: targetParquetUrl,
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
  await expectCreateFileWithConvertHash(
    fileSystem,
    targetParquetUrl,
    targetNDJsonUrl,
    testNDJsonHash,
    () =>
      dbcp({
        fileSystem,
        ...mssqlInput,
        outputFile: targetParquetUrl,
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
