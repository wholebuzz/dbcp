# dbcp

Dump MySQL, PostgreSQL, or SQLServer database tables directly to Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), another database, or local file.

Either `--sourceType` or `--sourceFile` and `--targetType` or `--targetFile` are required. Other options can be shortened, e.g `--user` instead of `--sourceUser`. Unless a database-to-database requires both `--sourceUser` and `--targetUser` are required.

`dbcp` pipes Readable Node.JS streams to Writable streams. No intermediate storage is required.

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
```

### Dump SQLServer table to gzipped JSON file

```
$ ./node_modules/.bin/dbcp \
  --sourceType mssql \
  --host localhost \
  --dbname mymsdb \
  --port 1433 \
  --user SA \
  --password "MyP@ssw0rd#" \
  --table foobar \
  --targetFile file.json.gz
```

### Dump PostgreSQL table to Google Cloud Storage gzipped JSON file

```
$ ./node_modules/.bin/dbcp \
  --sourceType postgresql \
  --host localhost \
  --dbname postgres \
  --port 5433 \
  --user postgres \
  --password postgres \
  --table foobar \
  --targetFile gs://bucket/file.json.gz
```

### Dump MySQL table to Amazon Web Services S3 gzipped JSON file

```
$ ./node_modules/.bin/dbcp \
  --sourceType mysql \
  --host localhost \
  --dbname mydb \
  --port 8083 \
  --user root \
  --password wp \
  --table foobar \
  --targetFile s3://bucket/object.json.gz
```

### Download a file

```
$ ./node_modules/.bin/dbcp \
  --sourceFile "https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home.png" \
  --targetFile foo.png
```

## Options

```
$ ./node_modules/.bin/dbcp --help
Options:
  --help            Show help                                     [boolean]
  --version         Show version number                           [boolean]
  --dbname          Database                                       [string]
  --format           [choices: "json", "jsonl", "ndjson"] [default: "json"]
  --host            Database host                                  [string]
  --password        Database password                              [string]
  --port            Database port                                  [string]
  --sourceFile      Source file                                    [string]
  --sourceHost      Source host                                    [string]
  --sourceName      Source database                                [string]
  --sourcePassword  Source database password                       [string]
  --sourcePort      Source database port                           [string]
  --sourceTable     Source database table                          [string]
  --sourceType      Source database type
                         [string] [choices: "postgresql", "mssql", "mysql"]
  --sourceUser      Source database user                           [string]
  --table           Database table                                 [string]
  --targetFile      Target file                                    [string]
  --targetHost      Target host                                    [string]
  --targetName      Target database                                [string]
  --targetPassword  Target database password                       [string]
  --targetPort      Target database port                           [string]
  --targetTable     Target database table                          [string]
  --targetType      Target database type
                         [string] [choices: "postgresql", "mssql", "mysql"]
  --targetUser      Target database user                           [string]
  --user            Database user                                  [string]
```
