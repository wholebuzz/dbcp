[dbcp](../README.md) / [Exports](../modules.md) / knex

# Module: knex

## Table of contents

### Variables

- [batch2](knex.md#batch2)

### Functions

- [knexFormatCreateTableSchema](knex.md#knexformatcreatetableschema)
- [knexInspectCreateTableSchema](knex.md#knexinspectcreatetableschema)
- [knexInspectTableSchema](knex.md#knexinspecttableschema)
- [newDBGateQuerySplitterStream](knex.md#newdbgatequerysplitterstream)
- [pipeKnexInsertTextTransform](knex.md#pipeknexinserttexttransform)
- [streamFromKnex](knex.md#streamfromknex)
- [streamToKnex](knex.md#streamtoknex)
- [streamToKnexRaw](knex.md#streamtoknexraw)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [knex.ts:18](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L18)

## Functions

### knexFormatCreateTableSchema

▸ **knexFormatCreateTableSchema**(`targetKnex`: Knex, `tableName`: *string*, `columnsInfo`: Column[], `columnType?`: *Record*<string, string\>): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetKnex` | Knex |
| `tableName` | *string* |
| `columnsInfo` | Column[] |
| `columnType?` | *Record*<string, string\> |

**Returns:** *string*

Defined in: [knex.ts:130](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L130)

___

### knexInspectCreateTableSchema

▸ **knexInspectCreateTableSchema**(`sourceKnex`: Knex, `targetKnex`: Knex, `tableName`: *string*): *Promise*<string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceKnex` | Knex |
| `targetKnex` | Knex |
| `tableName` | *string* |

**Returns:** *Promise*<string\>

Defined in: [knex.ts:117](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L117)

___

### knexInspectTableSchema

▸ **knexInspectTableSchema**(`sourceKnex`: Knex, `tableName`: *string*): *Promise*<Column[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceKnex` | Knex |
| `tableName` | *string* |

**Returns:** *Promise*<Column[]\>

Defined in: [knex.ts:126](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L126)

___

### newDBGateQuerySplitterStream

▸ **newDBGateQuerySplitterStream**(`type?`: *any*): *SplitQueryStream*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | *any* |

**Returns:** *SplitQueryStream*

Defined in: [knex.ts:183](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L183)

___

### pipeKnexInsertTextTransform

▸ **pipeKnexInsertTextTransform**(`output`: WritableStreamTree, `knex?`: Knex, `tableName?`: *string*): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | WritableStreamTree |
| `knex?` | Knex |
| `tableName?` | *string* |

**Returns:** WritableStreamTree

Defined in: [knex.ts:91](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L91)

___

### streamFromKnex

▸ **streamFromKnex**(`query`: Knex.QueryBuilder): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | Knex.QueryBuilder |

**Returns:** ReadableStreamTree

Defined in: [knex.ts:20](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L20)

___

### streamToKnex

▸ **streamToKnex**(`source`: { `knex?`: Knex ; `transaction?`: Knex.Transaction  }, `options`: { `batchSize?`: *number* ; `returning?`: *string* ; `table`: *string*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | *object* |
| `source.knex?` | Knex |
| `source.transaction?` | Knex.Transaction |
| `options` | *object* |
| `options.batchSize?` | *number* |
| `options.returning?` | *string* |
| `options.table` | *string* |

**Returns:** WritableStreamTree

Defined in: [knex.ts:24](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L24)

___

### streamToKnexRaw

▸ **streamToKnexRaw**(`source`: { `knex?`: Knex ; `transaction?`: Knex.Transaction  }, `options?`: { `returning?`: *boolean*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | *object* |
| `source.knex?` | Knex |
| `source.transaction?` | Knex.Transaction |
| `options?` | *object* |
| `options.returning?` | *boolean* |

**Returns:** WritableStreamTree

Defined in: [knex.ts:58](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L58)
