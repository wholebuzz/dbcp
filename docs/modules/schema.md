[dbcp](../README.md) / [Exports](../modules.md) / schema

# Module: schema

## Table of contents

### Interfaces

- [Column](../interfaces/schema.column.md)

### Functions

- [formatDDLCreateTableSchema](schema.md#formatddlcreatetableschema)
- [guessSchemaFromFile](schema.md#guessschemafromfile)
- [newSchemaColumn](schema.md#newschemacolumn)
- [normalizeToSchema](schema.md#normalizetoschema)
- [parquetFieldFromSchema](schema.md#parquetfieldfromschema)

## Functions

### formatDDLCreateTableSchema

▸ **formatDDLCreateTableSchema**(`tableName`: *string*, `_columnsInfo`: [*Column*](../interfaces/schema.column.md)[], `_columnType?`: *Record*<string, string\>): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | *string* |
| `_columnsInfo` | [*Column*](../interfaces/schema.column.md)[] |
| `_columnType?` | *Record*<string, string\> |

**Returns:** *string*

Defined in: [schema.ts:166](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L166)

___

### guessSchemaFromFile

▸ **guessSchemaFromFile**(`fileSystem`: FileSystem, `filename`: *string*, `probeBytes?`: *number*): *Promise*<Record<string, [*Column*](../interfaces/schema.column.md)\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileSystem` | FileSystem | - |
| `filename` | *string* | - |
| `probeBytes` | *number* | 65536 |

**Returns:** *Promise*<Record<string, [*Column*](../interfaces/schema.column.md)\>\>

Defined in: [schema.ts:46](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L46)

___

### newSchemaColumn

▸ **newSchemaColumn**(`table`: *string*, `name`: *string*, `type`: *string*): [*Column*](../interfaces/schema.column.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | *string* |
| `name` | *string* |
| `type` | *string* |

**Returns:** [*Column*](../interfaces/schema.column.md)

Defined in: [schema.ts:27](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L27)

___

### normalizeToSchema

▸ **normalizeToSchema**(`record`: *any*, `columns`: [*Column*](../interfaces/schema.column.md)[], `columnType?`: *Record*<string, any\>): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | *any* |
| `columns` | [*Column*](../interfaces/schema.column.md)[] |
| `columnType?` | *Record*<string, any\> |

**Returns:** *any*

Defined in: [schema.ts:95](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L95)

___

### parquetFieldFromSchema

▸ **parquetFieldFromSchema**(`schema`: [*Column*](../interfaces/schema.column.md), `columnType?`: *Record*<string, any\>): { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [*Column*](../interfaces/schema.column.md) |
| `columnType?` | *Record*<string, any\> |

**Returns:** { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

Defined in: [schema.ts:139](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L139)
