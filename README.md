# dbcp

Dump Mysql and Postgres databases directly to AWS S3 or Google Cloud Storage

## Example

### Copy SQLServer table to gzipped JSON file

```
yarn start --sourceType mssql --host localhost --dbname mymsdb --port 1433 \
  --user SA --password "MyP@ssw0rd#" \
  --table foobar --targetFile file.json.gz
```

### Copy PostgreSQL table to Google Cloud Storage gzipped JSON file

```
yarn start --sourceType postgresql --host localhost --dbname postgres --port 5433 \
  --user postgres --password postgres \
  --table foobar --targetFile gs://bucket/file.json.gz
```

### Copy MySQL table to Amazon Web Services S3 gzipped JSON file

```
yarn start --sourceType mysql --host localhost --dbname mydb --port 8083 \
  --user root --password wp \
  --table foobar --targetFile s3://bucket/object.json.gz
```
