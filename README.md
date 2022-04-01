# dbcp [![image](https://img.shields.io/npm/v/dbcp)](https://www.npmjs.com/package/dbcp) [![test](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml) ![Coverage](https://wholebuzz.storage.googleapis.com/dbcp/coverage.svg)

```console
$ dbcp --help
cli.js [inputFile] [outputFile]
$ dbcp data.parquet data.jsonl.gz
$ dbcp data.jsonl.gz s3://bucket/data.csv.gz
```

Copy from or to MySQL, PostgreSQL, SQLServer, LevelDB, MongoDB, and ElasticSearch directly to/from files on Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), Microsoft Azure, SMB, HTTP, or another database.

Automatically converts between supported formats JSON, ND-JSON, CSV, SQL, Parquet, and TFRecord (with optional gzip compression).

## CLI

Either `--inputType` or `--inputFile` and `--outputType` or `--outputFile` are required. Other options can be shortened, e.g `--user` instead of `--inputUser`. Only a database-to-database copy requires both `--inputUser` and `--outputUser`. The file format and compression is inferred from the filename.
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

- Database powered by [knex](https://www.npmjs.com/package/knex) and [knex-schema-inspector](https://www.npmjs.com/package/knex-schema-inspector)
- File system, file formats, and sharding provided by [@wholebuzz/fs](https://www.npmjs.com/package/@wholebuzz/fs)
- External file sorting with [external-sorting](https://github.com/ldubos/external-sorting)
- Connected using the [tree-stream](https://www.npmjs.com/package/tree-stream) primitives `ReadableStreamTree` and `WritableStreamTree`
- Used to implement [@wholebuzz/mapreduce](https://www.npmjs.com/package/@wholebuzz/mapreduce)

## Modules

- [cli](docs/modules/cli.md)
- [compound](docs/modules/compound.md)
- [elasticsearch](docs/modules/elasticsearch.md)
- [format](docs/modules/format.md)
- [index](docs/modules/index.md)
- [knex](docs/modules/knex.md)
- [schema](docs/modules/schema.md)

## Setup

### Global install

```console
$ npm install -g dbcp
$ dbcp --help
```

### Local setup

```console
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
    outputFile: 's3://foo/bar.jsonl',
    // e.g. from level (https://www.npmjs.com/package/level)) database
    inputStream: StreamTree.readable(levelIteratorStream(leveldb.iterator())),
  })
```

### Read object stream from any source and format

```typescript
  import { openNullWritable } from '@wholebuzz/fs/lib/stream'
  import { dbcp } from 'dbcp'
  import { Transform } from 'stream'

  // Supply transformObject and a do-nothing Writable for outputStream.
  await dbcp({
    fileSystem,
    inputFiles: [ { url: '/tmp/foobar.csv.gz' } ],
    outputStream: [ openNullWritable() ],
    transformObject: (x) => { console.log('test', x) },
  })

  // Or alternatively supply outputStream with outputFormat = object
  await dbcp({
    fileSystem,
    inputFiles: [ { url: '/tmp/foobar.csv.gz' } ],
    // Without outputFormat = object, transform() would receive Buffer
    outputFormat: DatabaseCopyFormat.object,
    outputStream: [
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
- [Copy MongoDB table to four gzipped JSON-Lines shards](#copy-mongodb-table-to-four-gzipped-json-lines-shards)
- [Copy SQLServer table to stdout](#copy-sqlserver-table-to-stdout)
- [Output a file or database to stdout](#output-a-file-or-database-to-stdout)
- [Copy a file from AWS to GCP](#copy-a-file-from-aws-to-gcp)
- [Convert file from ND-JSON to JSON](#convert-file-from-nd-json-to-json)
- [Download a file](#download-a-file)
- [Post a file to HTTP endpoint](#post-a-file-to-http-endpoint)
- [Create Athena DDL from JSON sample](#create-athena-ddl-from-json-sample)
- [Create Postgres CREATE TABLE from JSON sample](#create-postgres-create-table-from-json-sample)
- [Split the test data file into four shards](#split-the-test-data-file-into-four-shards)
- [Join the split files back into one](#join-the-split-files-back-into-one)

## Tested

```console
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
  ✓ Should restore to and dump from MongoDB to ND-JSON
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
  probeBytes?: number
  query?: string
  shardBy?: string
  schema?: Column[]
  schemaFile?: string
  tempDirectories?: string[]
  transformObject?: (x: unknown) => unknown | Promise<unknown>
  transformObjectStream?: () => Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: () => Duplex
  where?: Array<string | any[]>
}
```

## CLI Options

```console
$ dbcp --help
cli.js [inputFile] [outputFile]

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
  --inputFile       Input file                                           [array]
  --inputFormat
    [choices: "csv", "json", "jsonl", "ndjson", "object", "parquet", "tfrecord",
                                                                          "sql"]
  --inputHost       Input host                                          [string]
  --inputName       Input database                                      [string]
  --inputPassword   Input database password                             [string]
  --inputPort       Input database port                                 [string]
  --inputShards     Input shards                                        [number]
  --inputTable      Input database table                                [string]
  --inputType       Input database type
          [string] [choices: "athena", "elasticsearch", "file", "http", "level",
                   "mongodb", "mssql", "mysql", "postgresql", "redis", "sqlite"]
  --inputUser       Input database user                                 [string]
  --limit           Database query LIMIT                                [number]
  --orderBy         Database query ORDER BY                              [array]
  --outputFile      Output file                                         [string]
  --outputFormat
    [choices: "csv", "json", "jsonl", "ndjson", "object", "parquet", "tfrecord",
                                                                          "sql"]
  --outputHost      Output host                                         [string]
  --outputName      Output database                                     [string]
  --outputPassword  Output database password                            [string]
  --outputPort      Output database port                                [string]
  --outputShards    Output shards                                       [number]
  --outputTable     Output database table                               [string]
  --outputType      Output database type
          [string] [choices: "athena", "elasticsearch", "file", "http", "level",
                   "mongodb", "mssql", "mysql", "postgresql", "redis", "sqlite"]
  --outputUser      Output database user                                [string]
  --password        Database password                                   [string]
  --port            Database port                                       [string]
  --probeBytes      Probe bytes                                         [number]
  --query           Query                                               [string]
  --schemaFile      Use schema file if required, instead of schema inspection.
                                                                        [string]
  --schemaOnly      Dump only the object definitions (schema), not data.
                                                                       [boolean]
  --shardBy         Shard (or split) the data based on key              [string]
  --shards          The number of shards to split or join the data      [number]
  --table           Database table                                      [string]
  --user            Database user                                       [string]
  --where           Database query WHERE                                 [array]
  --whereDate       Database query WHERE, final argument parsed as Javascript
                    date                                                 [array]
```

## CLI Examples

### Copy PostgreSQL table to Google Cloud Storage gzipped JSON file

```console
$ dbcp \
  --inputType postgresql \
  --host localhost \
  --dbname postgres \
  --port 5433 \
  --user postgres \
  --password postgres \
  --table foobar \
  --outputFile gs://bucket/file.json.gz
```

### Copy MySQL table to Amazon Web Services S3 gzipped JSON-Lines file

```console
$ dbcp \
  --inputType mysql \
  --host localhost \
  --dbname mydb \
  --port 8083 \
  --user root \
  --password wp \
  --table foobar \
  --format jsonl \
  --outputFile s3://bucket/object.jsonl.gz
```

### Copy Amazon Web Services S3 gzipped JSON-Lines to MySQL table

```console
$ dbcp \
  --outputType mysql \
  --host localhost \
  --dbname mydb \
  --port 8083 \
  --user root \
  --password wp \
  --table foobar \
  --inputFile s3://bucket/object.jsonl.gz
```

### Copy SQLServer table to stdout

```console
$ dbcp \
  --inputType mssql \
  --host localhost \
  --dbname mymsdb \
  --port 1433 \
  --user SA \
  --password "MyP@ssw0rd#" \
  --table foobar \
  --outputFile=-
```

### Copy MongoDB table to four gzipped JSON-Lines shards

```console
$ dbcp \
  --inputType mongodb \
  --host localhost \
  --port 27017 \
  --user root \
  --password example \
  --dbname test_db \
  --table dbcptest \
  --outputFile output-SSSS-of-NNNN.jsonl.gz \
  --outputShards 4 \
  --shardBy id

$ ls output*
-rw-r--r--    1 user    staff    782701 Feb  4 10:59 output-0001-of-0004.jsonl.gz
-rw-r--r--    1 user    staff    771980 Feb  4 10:59 output-0003-of-0004.jsonl.gz
-rw-r--r--    1 user    staff    794959 Feb  4 10:59 output-0000-of-0004.jsonl.gz
-rw-r--r--    1 user    staff    788720 Feb  4 10:59 output-0002-of-0004.jsonl.gz
```

### Output a file to stdout

```console
$ dbcp gs://bucket/archive.csv.gz | jq . | less
```

### Copy a file from AWS to GCP

```console
$ dbcp s3://bucket/object.json.gz gs://bucket/file.json.gz
```

### Convert file from ND-JSON to JSON

```console
$ dbcp foobar.jsonl bazbat.json
```

### Download a file

```console
$ dbcp "https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home.png" foo.png
```

### Post a file to HTTP endpoint

```console
$ dbcp "./foo.png" "http://my.api/upload" --contentType "image/png"
```

### Create Athena DDL from JSON sample:

```console
$ dbcp --schemaOnly --inputFile ./sample.jsonl.gz --outputType athena --outputFile ddl.sql
```

### Create Postgres CREATE TABLE from JSON sample:

```console
$ dbcp --schemaOnly --inputFile ./sample.jsonl.gz --outputType postgresql --outputFile ddl.sql
```

### Split the [test data file](https://github.com/wholebuzz/dbcp/tree/master/test) into four shards:

```console
$ dbcp ./test/test.jsonl.gz ./split-SSSS-of-NNNN.jsonl.gz --outputShards 4 --shardBy guid
```

### Join the split files back into one:

```console
$ dbcp ./split-SSSS-of-NNNN.jsonl.gz ./joined.jsonl.gz --inputShards 4 --orderBy id
```

[dbcp](docs/README.md) / Exports

# dbcp

## Table of contents

### Modules

- [cli](docs/modules/cli.md)
- [compound](docs/modules/compound.md)
- [elasticsearch](docs/modules/elasticsearch.md)
- [format](docs/modules/format.md)
- [index](docs/modules/index.md)
- [knex](docs/modules/knex.md)
- [leveldb](docs/modules/leveldb.md)
- [mongodb](docs/modules/mongodb.md)
- [schema](docs/modules/schema.md)
- [test.fixture](docs/modules/test_fixture.md)
- [util](docs/modules/util.md)
