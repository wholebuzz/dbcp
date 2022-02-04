[dbcp](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### Interfaces

- [DatabaseCopyOptions](../interfaces/index.databasecopyoptions.md)
- [DatabaseCopySourceFile](../interfaces/index.databasecopysourcefile.md)

### Type aliases

- [DatabaseCopyFormats](index.md#databasecopyformats)

### Variables

- [knexLogConfig](index.md#knexlogconfig)
- [knexPoolConfig](index.md#knexpoolconfig)

### Functions

- [databaseInspectSchema](index.md#databaseinspectschema)
- [dbcp](index.md#dbcp)
- [dumpToFile](index.md#dumptofile)
- [findObjectProperty](index.md#findobjectproperty)
- [getExternalSortFunction](index.md#getexternalsortfunction)
- [getOrderByFunction](index.md#getorderbyfunction)
- [getShardFunction](index.md#getshardfunction)
- [getSourceConnection](index.md#getsourceconnection)
- [getSourceConnectionString](index.md#getsourceconnectionstring)
- [getSourceFormat](index.md#getsourceformat)
- [getSourceFormats](index.md#getsourceformats)
- [getTargetConnection](index.md#gettargetconnection)
- [getTargetConnectionString](index.md#gettargetconnectionstring)
- [getTargetFormat](index.md#gettargetformat)
- [openSources](index.md#opensources)
- [openTargets](index.md#opentargets)
- [updatePropertiesAsync](index.md#updatepropertiesasync)

## Type aliases

### DatabaseCopyFormats

Ƭ **DatabaseCopyFormats**: *Record*<string, [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null``\>

Defined in: [index.ts:129](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L129)

## Variables

### knexLogConfig

• `Const` **knexLogConfig**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (`_message`: *any*) => *void* |
| `deprecate` | (`_message`: *any*) => *void* |
| `error` | (`_message`: *any*) => *void* |
| `warn` | (`_message`: *any*) => *void* |

Defined in: [index.ts:906](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L906)

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

Defined in: [index.ts:921](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L921)

## Functions

### databaseInspectSchema

▸ **databaseInspectSchema**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *Promise*<Column[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *Promise*<Column[]\>

Defined in: [index.ts:887](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L887)

___

### dbcp

▸ **dbcp**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *Promise*<void\>

Defined in: [index.ts:299](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L299)

___

### dumpToFile

▸ **dumpToFile**(`input`: ReadableStreamTree \| *undefined*, `outputs`: WritableStreamTree[], `options`: { `columnType?`: *Record*<string, string\> ; `copySchema?`: [*DatabaseCopySchema*](../enums/format.databasecopyschema.md) ; `externalSortFunction?`: (`x`: *any*) => *any*[] ; `format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) ; `formattingKnex?`: Knex ; `schema?`: [*Column*](../interfaces/schema.column.md)[] ; `shardFunction?`: (`x`: *Record*<string, any\>, `modulus`: *number*) => *number* ; `sourceTable?`: *string* ; `targetShards?`: *number* ; `targetType?`: *string* ; `tempDirectory?`: *string* ; `transformObject?`: (`x`: *unknown*) => *unknown* ; `transformObjectStream?`: () => Duplex  }): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree \| *undefined* |
| `outputs` | WritableStreamTree[] |
| `options` | *object* |
| `options.columnType?` | *Record*<string, string\> |
| `options.copySchema?` | [*DatabaseCopySchema*](../enums/format.databasecopyschema.md) |
| `options.externalSortFunction?` | (`x`: *any*) => *any*[] |
| `options.format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |
| `options.formattingKnex?` | Knex |
| `options.schema?` | [*Column*](../interfaces/schema.column.md)[] |
| `options.shardFunction?` | (`x`: *Record*<string, any\>, `modulus`: *number*) => *number* |
| `options.sourceTable?` | *string* |
| `options.targetShards?` | *number* |
| `options.targetType?` | *string* |
| `options.tempDirectory?` | *string* |
| `options.transformObject?` | (`x`: *unknown*) => *unknown* |
| `options.transformObjectStream?` | () => Duplex |

**Returns:** *Promise*<void\>

Defined in: [index.ts:585](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L585)

___

### findObjectProperty

▸ **findObjectProperty**<X\>(`x`: X[] \| *Record*<string, X\> \| *undefined*, `key`: *string* \| *number*): X \| *undefined*

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | X[] \| *Record*<string, X\> \| *undefined* |
| `key` | *string* \| *number* |

**Returns:** X \| *undefined*

Defined in: [index.ts:515](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L515)

___

### getExternalSortFunction

▸ **getExternalSortFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): (`x`: *any*) => *any*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** (`x`: *any*) => *any*[]

Defined in: [index.ts:204](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L204)

___

### getOrderByFunction

▸ **getOrderByFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** (`a`: *Record*<string, any\>, `b`: *Record*<string, any\>) => ``1`` \| ``0`` \| ``-1``

Defined in: [index.ts:192](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L192)

___

### getShardFunction

▸ **getShardFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** (`x`: *Record*<string, any\>, `modulus`: *number*) => *number*

Defined in: [index.ts:185](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L185)

___

### getSourceConnection

▸ **getSourceConnection**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): { `database`: *undefined* ; `filename`: *string* ; `timezone`: *string* = 'UTC'; `user`: *undefined*  } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** { `database`: *undefined* ; `filename`: *string* ; `timezone`: *string* = 'UTC'; `user`: *undefined*  } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

Defined in: [index.ts:131](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L131)

___

### getSourceConnectionString

▸ **getSourceConnectionString**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *string*

Defined in: [index.ts:177](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L177)

___

### getSourceFormat

▸ **getSourceFormat**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `sourceFormats`: [*DatabaseCopyFormats*](index.md#databasecopyformats)): *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `sourceFormats` | [*DatabaseCopyFormats*](index.md#databasecopyformats) |

**Returns:** *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:221](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L221)

___

### getSourceFormats

▸ **getSourceFormats**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): [*DatabaseCopyFormats*](index.md#databasecopyformats)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** [*DatabaseCopyFormats*](index.md#databasecopyformats)

Defined in: [index.ts:208](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L208)

___

### getTargetConnection

▸ **getTargetConnection**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): { `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC' } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** { `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC' } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

Defined in: [index.ts:157](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L157)

___

### getTargetConnectionString

▸ **getTargetConnectionString**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *string*

Defined in: [index.ts:181](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L181)

___

### getTargetFormat

▸ **getTargetFormat**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `sourceFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `sourceFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:228](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L228)

___

### openSources

▸ **openSources**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `sourceFiles`: [*string*, [*DatabaseCopySourceFile*](../interfaces/index.databasecopysourcefile.md)][], `sourceFormats`: [*DatabaseCopyFormats*](index.md#databasecopyformats), `sourceFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md), `targetFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): *Promise*<ReadableStreamTree[] \| Record<string, ReadableStreamTree \| ReadableStreamTree[]\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `sourceFiles` | [*string*, [*DatabaseCopySourceFile*](../interfaces/index.databasecopysourcefile.md)][] |
| `sourceFormats` | [*DatabaseCopyFormats*](index.md#databasecopyformats) |
| `sourceFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |
| `targetFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** *Promise*<ReadableStreamTree[] \| Record<string, ReadableStreamTree \| ReadableStreamTree[]\>\>

Defined in: [index.ts:237](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L237)

___

### openTargets

▸ **openTargets**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): *Promise*<WritableStreamTree[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** *Promise*<WritableStreamTree[]\>

Defined in: [index.ts:283](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L283)

___

### updatePropertiesAsync

▸ **updatePropertiesAsync**<X\>(`x`: X[] \| *Record*<string, X\>, `f`: (`x`: X, `key`: *string* \| *number*) => *Promise*<X\>, `options?`: { `concurrency?`: *number*  }): *Promise*<X[] \| Record<string, X\>\>

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | X[] \| *Record*<string, X\> |
| `f` | (`x`: X, `key`: *string* \| *number*) => *Promise*<X\> |
| `options?` | *object* |
| `options.concurrency?` | *number* |

**Returns:** *Promise*<X[] \| Record<string, X\>\>

Defined in: [index.ts:524](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L524)
