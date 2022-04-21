[dbcp](../README.md) / [Exports](../modules.md) / knex

# Module: knex

## Table of contents

### Variables

- [batch2](knex.md#batch2)
- [knexLogConfig](knex.md#knexlogconfig)
- [knexPoolConfig](knex.md#knexpoolconfig)

### Functions

- [dumpToKnex](knex.md#dumptoknex)
- [knexFormatCreateTableSchema](knex.md#knexformatcreatetableschema)
- [knexInspectCreateTableSchema](knex.md#knexinspectcreatetableschema)
- [knexInspectTableSchema](knex.md#knexinspecttableschema)
- [newDBGateQuerySplitterStream](knex.md#newdbgatequerysplitterstream)
- [pipeKnexInsertTextTransform](knex.md#pipeknexinserttexttransform)
- [queryKnex](knex.md#queryknex)
- [shardMd5LswSQL](knex.md#shardmd5lswsql)
- [shardNumberSQL](knex.md#shardnumbersql)
- [streamFromKnex](knex.md#streamfromknex)
- [streamToKnex](knex.md#streamtoknex)
- [streamToKnexRaw](knex.md#streamtoknexraw)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [knex.ts:20](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L20)

___

### knexLogConfig

• `Const` **knexLogConfig**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (`_message`: *any*) => *void* |
| `deprecate` | (`_message`: *any*) => *void* |
| `error` | (`_message`: *any*) => *void* |
| `warn` | (`_message`: *any*) => *void* |

Defined in: [knex.ts:290](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L290)

___

### knexPoolConfig

• `Const` **knexPoolConfig**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acquireTimeoutMillis` | *number* |
| `createRetryIntervalMillis` | *number* |
| `createTimeoutMillis` | *number* |
| `idleTimeoutMillis` | *number* |
| `max` | *number* |
| `min` | *number* |

Defined in: [knex.ts:305](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L305)

## Functions

### dumpToKnex

▸ **dumpToKnex**(`input`: ReadableStreamTree, `db`: Knex, `table`: *string*, `options?`: { `batchSize?`: *number* ; `compoundInsert?`: *boolean* ; `returning?`: *string*  }): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree |
| `db` | Knex |
| `table` | *string* |
| `options?` | *object* |
| `options.batchSize?` | *number* |
| `options.compoundInsert?` | *boolean* |
| `options.returning?` | *string* |

**Returns:** *Promise*<void\>

Defined in: [knex.ts:22](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L22)

___

### knexFormatCreateTableSchema

▸ **knexFormatCreateTableSchema**(`outputKnex`: Knex, `tableName`: *string*, `columnsInfo`: Column[], `columnType?`: *Record*<string, string\>): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputKnex` | Knex |
| `tableName` | *string* |
| `columnsInfo` | Column[] |
| `columnType?` | *Record*<string, string\> |

**Returns:** *string*

Defined in: [knex.ts:197](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L197)

___

### knexInspectCreateTableSchema

▸ **knexInspectCreateTableSchema**(`inputKnex`: Knex, `outputKnex`: Knex, `tableName`: *string*): *Promise*<string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKnex` | Knex |
| `outputKnex` | Knex |
| `tableName` | *string* |

**Returns:** *Promise*<string\>

Defined in: [knex.ts:184](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L184)

___

### knexInspectTableSchema

▸ **knexInspectTableSchema**(`inputKnex`: Knex, `tableName`: *string*): *Promise*<Column[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKnex` | Knex |
| `tableName` | *string* |

**Returns:** *Promise*<Column[]\>

Defined in: [knex.ts:193](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L193)

___

### newDBGateQuerySplitterStream

▸ **newDBGateQuerySplitterStream**(`type?`: *any*): *SplitQueryStream*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | *any* |

**Returns:** *SplitQueryStream*

Defined in: [knex.ts:250](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L250)

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

Defined in: [knex.ts:158](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L158)

___

### queryKnex

▸ **queryKnex**(`db`: Knex, `table`: *string*, `options`: { `inputShardBy?`: *string* ; `inputShardFunction?`: [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md) ; `inputShardIndex?`: *number* ; `inputShards?`: *number* ; `limit?`: *number* ; `orderBy?`: *string*[] ; `query?`: *string* ; `transformObject?`: (`x`: *unknown*) => *unknown* ; `transformObjectStream?`: [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) ; `where?`: (*string* \| *any*[])[]  }): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | Knex |
| `table` | *string* |
| `options` | *object* |
| `options.inputShardBy?` | *string* |
| `options.inputShardFunction?` | [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md) |
| `options.inputShardIndex?` | *number* |
| `options.inputShards?` | *number* |
| `options.limit?` | *number* |
| `options.orderBy?` | *string*[] |
| `options.query?` | *string* |
| `options.transformObject?` | (`x`: *unknown*) => *unknown* |
| `options.transformObjectStream?` | [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `options.where?` | (*string* \| *any*[])[] |

**Returns:** ReadableStreamTree

Defined in: [knex.ts:40](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L40)

___

### shardMd5LswSQL

▸ **shardMd5LswSQL**(`client`: *string*, `column`: *string*, `modulus`: *string* \| *number*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | *string* |
| `column` | *string* |
| `modulus` | *string* \| *number* |

**Returns:** *string*

Defined in: [knex.ts:277](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L277)

___

### shardNumberSQL

▸ **shardNumberSQL**(`client`: *string*, `column`: *string*, `modulus`: *string* \| *number*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | *string* |
| `column` | *string* |
| `modulus` | *string* \| *number* |

**Returns:** *string*

Defined in: [knex.ts:265](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L265)

___

### streamFromKnex

▸ **streamFromKnex**(`query`: Knex.QueryBuilder): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | Knex.QueryBuilder |

**Returns:** ReadableStreamTree

Defined in: [knex.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L87)

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

Defined in: [knex.ts:91](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L91)

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

Defined in: [knex.ts:125](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L125)
