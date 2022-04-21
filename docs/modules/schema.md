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

Defined in: [schema.ts:192](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L192)

___

### formatDDLType

▸ **formatDDLType**(`columnInfo`: [*Column*](../interfaces/schema.column.md) \| *undefined*, `indent`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnInfo` | [*Column*](../interfaces/schema.column.md) \| *undefined* |
| `indent` | *string* |

**Returns:** *string*

Defined in: [schema.ts:210](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L210)

___

### getDDLColumnType

▸ **getDDLColumnType**(`columnInfo`: [*Column*](../interfaces/schema.column.md)): ``"boolean"`` \| ``"bigint"`` \| ``"float"`` \| ``"string"`` \| ``"array"`` \| ``"struct"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnInfo` | [*Column*](../interfaces/schema.column.md) |

**Returns:** ``"boolean"`` \| ``"bigint"`` \| ``"float"`` \| ``"string"`` \| ``"array"`` \| ``"struct"``

Defined in: [schema.ts:228](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L228)

___

### guessColumnType

▸ **guessColumnType**(`column`: [*Column*](../interfaces/schema.column.md), `value`: *Record*<string, any\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [*Column*](../interfaces/schema.column.md) |
| `value` | *Record*<string, any\> |

**Returns:** *void*

Defined in: [schema.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L81)

___

### guessSchemaFromFile

▸ **guessSchemaFromFile**(`fileSystem`: FileSystem, `file`: [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md), `args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *Promise*<Record<string, [*Column*](../interfaces/schema.column.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `file` | [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md) |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *Promise*<Record<string, [*Column*](../interfaces/schema.column.md)\>\>

Defined in: [schema.ts:50](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L50)

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

Defined in: [schema.ts:31](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L31)

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

Defined in: [schema.ts:121](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L121)

___

### parquetFieldFromSchema

▸ **parquetFieldFromSchema**(`schema`: [*Column*](../interfaces/schema.column.md), `columnType?`: *Record*<string, any\>): { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [*Column*](../interfaces/schema.column.md) |
| `columnType?` | *Record*<string, any\> |

**Returns:** { `compression`: *undefined* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'BOOLEAN' } \| { `compression`: *string* = 'GZIP'; `optional`: *boolean* ; `type`: *string* = 'JSON' }

Defined in: [schema.ts:165](https://github.com/wholebuzz/dbcp/blob/master/src/schema.ts#L165)
