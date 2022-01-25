# dbcp [![image](https://img.shields.io/npm/v/dbcp)](https://www.npmjs.com/package/dbcp) [![test](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml) ![Coverage](https://wholebuzz.storage.googleapis.com/dbcp/coverage.svg)

```
$ dbcp foo.parquet foo.jsonl
```

Dump from/to MySQL, PostgreSQL, SQLServer, or ElasticSearch directly to/from Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), Microsoft Azure, SMB, HTTP, another database, or file.

Automatically converts between supported formats JSON, ND-JSON, CSV, SQL, Parquet, and TFRecord (with optional gzip compression).

## CLI

Either `--sourceType` or `--sourceFile` and `--targetType` or `--targetFile` are required. Other options can be shortened, e.g `--user` instead of `--sourceUser`. Only a database-to-database copy requires both `--sourceUser` and `--targetUser`. The file format and compression is inferred from the filename.
`dbcp` pipes Readable Node.JS streams to Writable streams. No intermediate storage is required.

## API

- The `transformJson`/`transformJsonStream` API can be used for streaming transforms of Big Data.
- The CLI uses `transformBytes`/`transformBytesStream` to render progress updates.

## Features 

- `dbcp` supports sharding. It can split or join groups of files.
- `dbcp` can convert files from one format to another.
- `dbcp` supports compound inserts, which can insert groups of associated rows from multiple tables.
- `dbcp` can translate SQL dialects, e.g. dump a Postgres table to .sql file with SQLServer CREATE and INSERT syntax.

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

- [Dump PostgreSQL table to Google Cloud Storage gzipped JSON file](#dump-postgresql-table-to-google-cloud-storage-gzipped-json-file)
- [Dump MySQL table to Amazon Web Services S3 gzipped JSON-Lines file](#dump-mysql-table-to-amazon-web-services-s3-gzipped-json-lines-file)
- [Dump SQLServer table to gzipped JSON file](#dump-sqlserver-table-to-gzipped-json-file)
- [Copy a file from AWS to GCP](#copy-a-file-from-aws-to-gcp)
- [Convert file from ND-JSON to JSON](#convert-file-from-nd-json-to-json)
- [Download a file](#download-a-file)
- [Post a file to HTTP endpoint](#post-a-file-to-http-endpoint)

## Tested

```
 PASS  src/index.test.ts
  ✓ Should hash test data as string
  ✓ Should hash test data stream
  ✓ Should copy local file
  ✓ Should read local directory
  ✓ Should convert to JSON from ND-JSON and back
  ✓ Should convert to sharded JSON from ND-JSON and back
  ✓ Should convert to Parquet from ND-JSON and back
  ✓ Should convert to TFRecord from ND-JSON and back
  ✓ Should restore to and dump compound data
  ✓ Should restore to and dump from Elastic Search to ND-JSON
  ✓ Should restore to and dump from Postgres to ND-JSON
  ✓ Should restore to and dump from Postgres to SQL
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
  fileSystem?: FileSystem
  group?: boolean
  limit?: number
  orderBy?: string[]
  query?: string
  shardBy?: string
  schema?: Column[]
  schemaFile?: string
  sourceConnection?: Record<string, any>
  sourceFormat?: DatabaseCopyFormat
  sourceName?: string
  sourceFiles?: DatabaseCopySourceFile[] | Record<string, DatabaseCopySourceFile>
  sourceHost?: string
  sourceKnex?: Knex
  sourcePassword?: string
  sourceShards?: number
  sourceStream?: ReadableStreamTree
  sourceTable?: string
  sourceType?: DatabaseCopySourceType
  sourcePort?: number
  sourceUser?: string
  targetConnection?: Record<string, any>
  targetFormat?: DatabaseCopyFormat
  targetName?: string
  targetFile?: string
  targetHost?: string
  targetKnex?: Knex
  targetPassword?: string
  targetShards?: number
  targetStream?: WritableStreamTree[]
  targetTable?: string
  targetType?: DatabaseCopyTargetType
  targetPort?: number
  targetUser?: string
  transformJson?: (x: unknown) => unknown
  transformJsonStream?: () => Duplex
  transformBytes?: (x: string) => string
  transformBytesStream?: () => Duplex
  where?: Array<string | any[]>
}
```

## CLI Options

```
$ dbcp --help
Options:
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]
  --compoundInsert  Compound insert mode can insert associated rows from
                    multiple tables.                                   [boolean]
  --contentType     Content type                                        [string]
  --dataOnly        Dump only the data, not the schema (data definitions).
                                                                       [boolean]
  --dbname          Database                                            [string]
  --format    [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
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
              [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
  --sourceHost      Source host                                         [string]
  --sourceName      Source database                                     [string]
  --sourcePassword  Source database password                            [string]
  --sourcePort      Source database port                                [string]
  --sourceShards    Source shards                                       [number]
  --sourceTable     Source database table                               [string]
  --sourceType      Source database type
                        [string] [choices: "es", "mssql", "mysql", "postgresql"]
  --sourceUser      Source database user                                [string]
  --table           Database table                                      [string]
  --targetFile      Target file                                         [string]
  --targetFormat
              [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
  --targetHost      Target host                                         [string]
  --targetName      Target database                                     [string]
  --targetPassword  Target database password                            [string]
  --targetPort      Target database port                                [string]
  --targetShards    Target shards                                       [number]
  --targetTable     Target database table                               [string]
  --targetType      Target database type
                        [string] [choices: "es", "mssql", "mysql", "postgresql"]
  --targetUser      Target database user                                [string]
  --user            Database user                                       [string]
  --where           Database query WHERE                                 [array]
```

## CLI Examples

### Dump PostgreSQL table to Google Cloud Storage gzipped JSON file

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

### Dump MySQL table to Amazon Web Services S3 gzipped JSON-Lines file

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

### Dump SQLServer table to gzipped JSON file

```
$ dbcp \
  --sourceType mssql \
  --host localhost \
  --dbname mymsdb \
  --port 1433 \
  --user SA \
  --password "MyP@ssw0rd#" \
  --table foobar \
  --targetFile file.json.gz
```

### Copy a file from AWS to GCP

```
$ dbcp \
  --sourceFile s3://bucket/object.json.gz \
  --targetFile gs://bucket/file.json.gz
```

### Convert file from ND-JSON to JSON

```
$ dbcp \
  --sourceFile foobar.jsonl \
  --targetFile bazbat.json
```

### Download a file

```
$ dbcp \
  --sourceFile "https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home.png" \
  --targetFile foo.png
```

### Post a file to HTTP endpoint

```
$ dbcp \
  --contentType "image/png" \
  --sourceFile "./foo.png" \
  --targetFile "http://my.api/upload"
```
