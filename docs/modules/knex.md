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
- [shardNumberSQL](knex.md#shardnumbersql)
- [shardStringSQL](knex.md#shardstringsql)
- [streamFromKnex](knex.md#streamfromknex)
- [streamToKnex](knex.md#streamtoknex)
- [streamToKnexRaw](knex.md#streamtoknexraw)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [knex.ts:19](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L19)

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

Defined in: [knex.ts:289](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L289)

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

Defined in: [knex.ts:304](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L304)

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

Defined in: [knex.ts:21](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L21)

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

Defined in: [knex.ts:196](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L196)

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

Defined in: [knex.ts:183](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L183)

___

### knexInspectTableSchema

▸ **knexInspectTableSchema**(`inputKnex`: Knex, `tableName`: *string*): *Promise*<Column[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKnex` | Knex |
| `tableName` | *string* |

**Returns:** *Promise*<Column[]\>

Defined in: [knex.ts:192](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L192)

___

### newDBGateQuerySplitterStream

▸ **newDBGateQuerySplitterStream**(`type?`: *any*): *SplitQueryStream*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | *any* |

**Returns:** *SplitQueryStream*

Defined in: [knex.ts:249](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L249)

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

Defined in: [knex.ts:157](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L157)

___

### queryKnex

▸ **queryKnex**(`db`: Knex, `table`: *string*, `options`: { `inputShardBy?`: *string* ; `inputShardFunction?`: ``"number"`` \| ``"string"`` ; `inputShardIndex?`: *number* ; `inputShards?`: *number* ; `limit?`: *number* ; `orderBy?`: *string*[] ; `query?`: *string* ; `transformObject?`: (`x`: *unknown*) => *unknown* ; `transformObjectStream?`: () => Duplex ; `where?`: (*string* \| *any*[])[]  }): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | Knex |
| `table` | *string* |
| `options` | *object* |
| `options.inputShardBy?` | *string* |
| `options.inputShardFunction?` | ``"number"`` \| ``"string"`` |
| `options.inputShardIndex?` | *number* |
| `options.inputShards?` | *number* |
| `options.limit?` | *number* |
| `options.orderBy?` | *string*[] |
| `options.query?` | *string* |
| `options.transformObject?` | (`x`: *unknown*) => *unknown* |
| `options.transformObjectStream?` | () => Duplex |
| `options.where?` | (*string* \| *any*[])[] |

**Returns:** ReadableStreamTree

Defined in: [knex.ts:39](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L39)

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

Defined in: [knex.ts:264](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L264)

___

### shardStringSQL

▸ **shardStringSQL**(`client`: *string*, `column`: *string*, `modulus`: *string* \| *number*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | *string* |
| `column` | *string* |
| `modulus` | *string* \| *number* |

**Returns:** *string*

Defined in: [knex.ts:276](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L276)

___

### streamFromKnex

▸ **streamFromKnex**(`query`: Knex.QueryBuilder): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | Knex.QueryBuilder |

**Returns:** ReadableStreamTree

Defined in: [knex.ts:86](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L86)

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

Defined in: [knex.ts:90](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L90)

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

Defined in: [knex.ts:124](https://github.com/wholebuzz/dbcp/blob/master/src/knex.ts#L124)
