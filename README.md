# dbcp

Dump MySQL, PostgreSQL, or SQLServer database tables directly to Amazon Web Services (AWS) S3, Google Cloud Storage (GCS), another database, or local file.

Either `--sourceType` or `--sourceFile` and `--targetType` or `--targetFile` are required. Other options can be shortened, e.g `--user` instead of `--sourceUser`. Only a database-to-database copy requires both `--sourceUser` and `--targetUser`. The file format (JSON, ND-JSON, SQL) and compression (gzip, none) is inferred from the filename.

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
  --help            Show help                                     [boolean]
  --version         Show version number                           [boolean]
  --contentType     Content type                                   [string]
  --dbname          Database                                       [string]
  --format                      [choices: "json", "jsonl", "ndjson", "sql"]
  --host            Database host                                  [string]
  --password        Database password                              [string]
  --port            Database port                                  [string]
  --sourceFile      Source file                                    [string]
  --sourceFormat                [choices: "json", "jsonl", "ndjson", "sql"]
  --sourceHost      Source host                                    [string]
  --sourceName      Source database                                [string]
  --sourcePassword  Source database password                       [string]
  --sourcePort      Source database port                           [string]
  --sourceTable     Source database table                          [string]
  --sourceType      Source database type
         [string] [choices: "mssql", "mysql", "postgresql", "smb", "stdin"]
  --sourceUser      Source database user                           [string]
  --table           Database table                                 [string]
  --targetFile      Target file                                    [string]
  --targetFormat                [choices: "json", "jsonl", "ndjson", "sql"]
  --targetHost      Target host                                    [string]
  --targetName      Target database                                [string]
  --targetPassword  Target database password                       [string]
  --targetPort      Target database port                           [string]
  --targetTable     Target database table                          [string]
  --targetType      Target database type
        [string] [choices: "mssql", "mysql", "postgresql", "smb", "stdout"]
  --targetUser      Target database user                           [string]
  --user            Database user                                  [string]
```
