# dbcp [![image](https://img.shields.io/npm/v/dbcp)](https://www.npmjs.com/package/dbcp) [![test](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml) ![Coverage](https://wholebuzz.storage.googleapis.com/dbcp/coverage.svg)

```
$ dbcp foo.parquet foo.jsonl
```

Copy from or to MySQL, PostgreSQL, SQLServer, LevelDB, and ElasticSearch directly to/from files on Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), Microsoft Azure, SMB, HTTP, or another database.

Automatically converts between supported formats JSON, ND-JSON, CSV, SQL, Parquet, and TFRecord (with optional gzip compression).

## CLI

Either `--sourceType` or `--sourceFile` and `--targetType` or `--targetFile` are required. Other options can be shortened, e.g `--user` instead of `--sourceUser`. Only a database-to-database copy requires both `--sourceUser` and `--targetUser`. The file format and compression is inferred from the filename.
`dbcp` pipes Readable Node.JS streams to Writable streams. No intermediate storage is required.

## API

- The `transformObject`/`transformObjectStream` API can be used for streaming transforms of Big Data.
- The CLI uses `transformBytes`/`transformBytesStream` to render progress updates.

## Features 

- `dbcp` supports sharding. It can split or join groups of files.
- `dbcp` can convert files from one format to another.
- `dbcp` supports compound inserts, which can insert groups of associated rows from multiple tables.
- `dbcp` can translate SQL dialects, e.g. dump a Postgres table to .sql file with SQLServer CREATE and INSERT syntax.

## Credits

- Built with [@wholebuzz/fs](https://www.npmjs.com/package/@wholebuzz/fs) using the [tree-stream](https://www.npmjs.com/package/tree-stream) primitives `ReadableStreamTree` and `WritableStreamTree`

## Setup

### Global install

```
$ npm install -g dbcp
$ dbcp --help
```

### Local setup

```
$ npm init
$ npm install dbcp
$ ./node_modules/.bin/dbcp --help
```

## Examples

### API

#### Write object stream to any source and format

```typescript
  import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
  import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
  import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
  import { dbcp } from 'dbcp'
  import StreamTree from 'tree-stream'
  
  const fileSystem = new AnyFileSystem([
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: '', fs: new LocalFileSystem() }
  ])
  
  await dbcp({
    fileSystem,
    targetFile: 's3://foo/bar.jsonl',
    // e.g. from level (https://www.npmjs.com/package/level)) database
    sourceStream: StreamTree.readable(levelIteratorStream(leveldb.iterator())),
  })
```

### Read object stream from any source and format

```typescript
  import { dbcp, openNullWritable } from 'dbcp'
  import { Transform } from 'stream'

  // Supply transformObject and a do-nothing Writable for targetStream.
  await dbcp({
    fileSystem,
    sourceFiles: [ { url: '/tmp/foobar.csv.gz' } ],
    targetStream: [ openNullWritable() ],
    transformObject: (x) => { console.log('test', x) },
  })

  // Or alternatively supply targetStream with targetFormat = object
  await dbcp({
    fileSystem,
    sourceFiles: [ { url: '/tmp/foobar.csv.gz' } ],
    // Without targetFormat = object, transform() would receive Buffer
    targetFormat: DatabaseCopyFormat.object,
    targetStream: [
      StreamTree.writable(new Transform({
        objectMode: true,
        transform(data, _, cb) {
          console.log('test', data)
          cb()
        },
      }))
    ],
  })
```

### CLI

- [Copy PostgreSQL table to Google Cloud Storage gzipped JSON file](#copy-postgresql-table-to-google-cloud-storage-gzipped-json-file)
- [Copy MySQL table to Amazon Web Services S3 gzipped JSON-Lines file](#copy-mysql-table-to-amazon-web-services-s3-gzipped-json-lines-file)
- [Copy Amazon Web Services S3 gzipped JSON-Lines to MySQL table](#copy-amazon-web-services-s3-gzipped-json-lines-to-mysql-table)
- [Copy SQLServer table to stdout](#copy-sqlserver-table-to-stdout)
- [Output a file or database to stdout](#output-a-file-or-database-to-stdout)
- [Copy a file from AWS to GCP](#copy-a-file-from-aws-to-gcp)
- [Convert file from ND-JSON to JSON](#convert-file-from-nd-json-to-json)
- [Download a file](#download-a-file)
- [Post a file to HTTP endpoint](#post-a-file-to-http-endpoint)

## Tested

```
PASS src/index.test.ts (85.9 s)
  ✓ Should hash test data as string
  ✓ Should hash test data stream
  ✓ Should copy local file 
  ✓ Should read local directory
  ✓ Should convert to JSON from ND-JSON and back
  ✓ Should convert to sharded JSON from ND-JSON and back
  ✓ Should convert to Parquet from ND-JSON and back
  ✓ Should convert to TFRecord from ND-JSON and back
  ✓ Should load to level from ND-JSON and dump to JSON after external sort
  ✓ Should restore to and dump compound data
  ✓ Should restore to and dump from Elastic Search to ND-JSON
  ✓ Should restore to and dump from Postgres to ND-JSON
  ✓ Should restore to and dump from Postgres to SQL
  ✓ Should not hang on error
  ✓ Should copy from Postgres to Mysql
  ✓ Should copy from Postgres to SQL Server
  ✓ Should dump from Postgres to Parquet file
  ✓ Should dump from MySQL to Parquet file
  ✓ Should dump from SQL Server to Parquet file
```

## API Interface

```typescript
export async function dbcp(args: DatabaseCopyOptions)

export interface DatabaseCopyOptions {
  batchSize?: number
  columnType?: Record<string, string>
  compoundInsert?: boolean
  contentType?: string
  copySchema?: DatabaseCopySchema
  engineOptions?: any
  externalSortBy?: string[]
  extra?: Record<string, any>
  extraOutput?: boolean
  fileSystem?: FileSystem
  group?: boolean
  groupLabels?: boolean
  limit?: number
  orderBy?: string[]
  query?: string
  shardBy?: string
  schema?: Column[]
  schemaFile?: string
  sourceConnection?: Record<string, any>
  sourceElasticSearch?: Client
  sourceFormat?: DatabaseCopyFormat
  sourceFiles?: DatabaseCopySourceFile[] | Record<string, DatabaseCopySourceFile>
  sourceHost?: string
  sourceLevel?: level.LevelDB | LevelUp
  sourceName?: string
  sourceKnex?: Knex
  sourcePassword?: string
  sourceShards?: number
  sourceStream?: ReadableStreamTree
  sourceTable?: string
  sourceType?: DatabaseCopySourceType
  sourcePort?: number
  sourceUser?: string
  targetConnection?: Record<string, any>
  targetElasticSearch?: Client
  targetFormat?: DatabaseCopyFormat
  targetFile?: string
  targetHost?: string
  targetKnex?: Knex
  targetLevel?: level.LevelDB | LevelUp
  targetName?: string
  targetPassword?: string
  targetShards?: number
  targetStream?: WritableStreamTree[]
  targetTable?: string
  targetType?: DatabaseCopyTargetType
  targetPort?: number
  targetUser?: string
  tempDirectory?: string
  transformObject?: (x: unknown) => unknown
  transformObjectStream?: () => Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: () => Duplex
  where?: Array<string | any[]>
}
```

## CLI Options

```
$ dbcp --help
cli.js [sourceFile] [targetFile]

Options:
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]
  --compoundInsert  Compound insert mode can insert associated rows from
                    multiple tables.                                   [boolean]
  --contentType     Content type                                        [string]
  --dataOnly        Dump only the data, not the schema (data definitions).
                                                                       [boolean]
  --dbname          Database                                            [string]
  --externalSortBy  Sort data by property(s) with external-sorting       [array]
  --format
    [choices: "csv", "json", "jsonl", "ndjson", "object", "parquet", "tfrecord",
                                                                          "sql"]
  --group           Group inputs with equinvalent orderBy              [boolean]
  --host            Database host                                       [string]
  --limit           Database query LIMIT                                [number]
  --orderBy         Database query ORDER BY                              [array]
  --password        Database password                                   [string]
  --port            Database port                                       [string]
  --query           Query                                               [string]
  --schemaFile      Use schema file if required, instead of schema inspection.
                                                                        [string]
  --schemaOnly      Dump only the object definitions (schema), not data.
                                                                       [boolean]
  --shardBy         Shard (or split) the data based on key              [string]
  --shards          The number of shards to split or join the data      [number]
  --sourceFile      Source file                                          [array]
  --sourceFormat
    [choices: "csv", "json", "jsonl", "ndjson", "object", "parquet", "tfrecord",
                                                                          "sql"]
  --sourceHost      Source host                                         [string]
  --sourceName      Source database                                     [string]
  --sourcePassword  Source database password                            [string]
  --sourcePort      Source database port                                [string]
  --sourceShards    Source shards                                       [number]
  --sourceTable     Source database table                               [string]
  --sourceType      Source database type
     [string] [choices: "athena", "es", "level", "mssql", "mysql", "postgresql",
                                                                       "sqlite"]
  --sourceUser      Source database user                                [string]
  --table           Database table                                      [string]
  --targetFile      Target file                                         [string]
  --targetFormat
    [choices: "csv", "json", "jsonl", "ndjson", "object", "parquet", "tfrecord",
                                                                          "sql"]
  --targetHost      Target host                                         [string]
  --targetName      Target database                                     [string]
  --targetPassword  Target database password                            [string]
  --targetPort      Target database port                                [string]
  --targetShards    Target shards                                       [number]
  --targetTable     Target database table                               [string]
  --targetType      Target database type
     [string] [choices: "athena", "es", "level", "mssql", "mysql", "postgresql",
                                                                       "sqlite"]
  --targetUser      Target database user                                [string]
  --user            Database user                                       [string]
  --where           Database query WHERE                                 [array]
```

## CLI Examples

### Copy PostgreSQL table to Google Cloud Storage gzipped JSON file

```
$ dbcp \
  --sourceType postgresql \
  --host localhost \
  --dbname postgres \
  --port 5433 \
  --user postgres \
  --password postgres \
  --table foobar \
  --targetFile gs://bucket/file.json.gz
```

### Copy MySQL table to Amazon Web Services S3 gzipped JSON-Lines file

```
$ dbcp \
  --sourceType mysql \
  --host localhost \
  --dbname mydb \
  --port 8083 \
  --user root \
  --password wp \
  --table foobar \
  --format jsonl \
  --targetFile s3://bucket/object.jsonl.gz
```

### Copy Amazon Web Services S3 gzipped JSON-Lines to MySQL table

```
$ dbcp \
  --targetType mysql \
  --host localhost \
  --dbname mydb \
  --port 8083 \
  --user root \
  --password wp \
  --table foobar \
  --sourceFile s3://bucket/object.jsonl.gz
```

### Copy SQLServer table to stdout

```
$ dbcp \
  --sourceType mssql \
  --host localhost \
  --dbname mymsdb \
  --port 1433 \
  --user SA \
  --password "MyP@ssw0rd#" \
  --table foobar \
  --targetFile=-
```

### Output a file to stdout

```
$ dbcp gs://bucket/archive.csv.gz | jq . | less
```

### Copy a file from AWS to GCP

```
$ dbcp s3://bucket/object.json.gz gs://bucket/file.json.gz
```

### Convert file from ND-JSON to JSON

```
$ dbcp foobar.jsonl bazbat.json
```

### Download a file

```
$ dbcp "https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home.png" foo.png
```

### Post a file to HTTP endpoint

```
$ dbcp "./foo.png" "http://my.api/upload" --contentType "image/png"
```
