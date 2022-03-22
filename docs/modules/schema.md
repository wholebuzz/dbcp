[dbcp](../README.md) / [Exports](../modules.md) / schema

# Module: schema

## Table of contents

### Interfaces

- [Column](../interfaces/schema.column.md)

### Functions

- [formatDDLCreateTableSchema](schema.md#formatddlcreatetableschema)
- [formatDDLType](schema.md#formatddltype)
- [getDDLColumnType](schema.md#getddlcolumntype)
- [guessColumnType](schema.md#guesscolumntype)
- [guessSchemaFromFile](schema.md#guessschemafromfile)
- [newSchemaColumn](schema.md#newschemacolumn)
- [normalizeToSchema](schema.md#normalizetoschema)
- [parquetFieldFromSchema](schema.md#parquetfieldfromschema)

## Functions

### formatDDLCreateTableSchema

▸ **formatDDLCreateTableSchema**(`tableName`: *string*, `columnsInfo`: [*Column*](../interfaces/schema.column.md)[], `columnType?`: *Record*<string, string\>): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | *string* |
| `columnsInfo` | [*Column*](../interfaces/schema.column.md)[] |
| `columnType?` | *Record*<string, string\> |

**Returns:** *string*

Defined in: [schema.ts:187](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L187)

___

### formatDDLType

▸ **formatDDLType**(`columnInfo`: [*Column*](../interfaces/schema.column.md) \| *undefined*, `indent`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnInfo` | [*Column*](../interfaces/schema.column.md) \| *undefined* |
| `indent` | *string* |

**Returns:** *string*

Defined in: [schema.ts:205](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L205)

___

### getDDLColumnType

▸ **getDDLColumnType**(`columnInfo`: [*Column*](../interfaces/schema.column.md)): ``"string"`` \| ``"boolean"`` \| ``"bigint"`` \| ``"float"`` \| ``"array"`` \| ``"struct"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnInfo` | [*Column*](../interfaces/schema.column.md) |

**Returns:** ``"string"`` \| ``"boolean"`` \| ``"bigint"`` \| ``"float"`` \| ``"array"`` \| ``"struct"``

Defined in: [schema.ts:223](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L223)

___

### guessColumnType

▸ **guessColumnType**(`column`: [*Column*](../interfaces/schema.column.md), `value`: *Record*<string, any\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [*Column*](../interfaces/schema.column.md) |
| `value` | *Record*<string, any\> |

**Returns:** *void*

Defined in: [schema.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L76)

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

Defined in: [schema.ts:48](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L48)

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

Defined in: [schema.ts:29](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L29)

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

Defined in: [schema.ts:116](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L116)

___

### parquetFieldFromSchema

▸ **parquetFieldFromSchema**(`schema`: [*Column*](../interfaces/schema.column.md), `columnType?`: *Record*<string, any\>): { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [*Column*](../interfaces/schema.column.md) |
| `columnType?` | *Record*<string, any\> |

**Returns:** { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

Defined in: [schema.ts:160](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L160)
