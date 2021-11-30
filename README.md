# dbcp [![image](https://img.shields.io/npm/v/dbcp)](https://www.npmjs.com/package/dbcp) [![test](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/dbcp/actions/workflows/test.yaml) ![Coverage](https://wholebuzz.storage.googleapis.com/dbcp/coverage.svg)

Dump MySQL, PostgreSQL, or SQLServer database tables directly to Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), another database, or local file.

Either `--sourceType` or `--sourceFile` and `--targetType` or `--targetFile` are required. Other options can be shortened, e.g `--user` instead of `--sourceUser`. Only a database-to-database copy requires both `--sourceUser` and `--targetUser`. The file format (JSON, ND-JSON, Parquet, TFRecord) and compression (gzip, none) is inferred from the filename. The SQL file format is experimentally supported.

`dbcp` pipes Readable Node.JS streams to Writable streams. No intermediate storage is required.

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
  ✓ Should restore to and dump from Postgres to ND-JSON
  ✓ Should restore to and dump from Postgres to SQL
  ✓ Should copy from Postgres to Mysql
  ✓ Should copy from Postgres to SQL Server
  ✓ Should dump from Postgres to Parquet file
  ✓ Should dump from MySQL to Parquet file
  ✓ Should dump from SQL Server to Parquet file
```

## Example

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

## Options

```
$ dbcp --help
Options:
  --help            Show help                                     [boolean]
  --version         Show version number                           [boolean]
  --compoundInsert  Compound insert mode can insert associated rows from
                    multiple tables.                              [boolean]
  --contentType     Content type                                   [string]
  --dataOnly        Dump only the data, not the schema (data definitions).
                                                                  [boolean]
  --dbname          Database                                       [string]
  --format
         [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
  --host            Database host                                  [string]
  --orderBy         Database query ORDER BY                        [string]
  --password        Database password                              [string]
  --port            Database port                                  [string]
  --query           Query                                          [string]
  --schemaFile      Use schema file if required, instead of schema
                    inspection.                                    [string]
  --schemaOnly      Dump only the object definitions (schema), not data.
                                                                  [boolean]
  --shardBy         Shard (or split) the data based on key         [string]
  --shards          The number of shards to split the data into    [number]
  --sourceFile      Source file                                    [string]
  --sourceFormat
         [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
  --sourceHost      Source host                                    [string]
  --sourceName      Source database                                [string]
  --sourcePassword  Source database password                       [string]
  --sourcePort      Source database port                           [string]
  --sourceShards    Source shards                                  [number]
  --sourceTable     Source database table                          [string]
  --sourceType      Source database type
         [string] [choices: "mssql", "mysql", "postgresql", "smb", "stdin"]
  --sourceUser      Source database user                           [string]
  --table           Database table                                 [string]
  --targetFile      Target file                                    [string]
  --targetFormat
         [choices: "json", "jsonl", "ndjson", "parquet", "tfrecord", "sql"]
  --targetHost      Target host                                    [string]
  --targetName      Target database                                [string]
  --targetPassword  Target database password                       [string]
  --targetPort      Target database port                           [string]
  --targetShards    Target shards                                  [number]
  --targetTable     Target database table                          [string]
  --targetType      Target database type
        [string] [choices: "mssql", "mysql", "postgresql", "smb", "stdout"]
  --targetUser      Target database user                           [string]
  --user            Database user                                  [string]
  --where           Database query WHERE                           [string]
```
