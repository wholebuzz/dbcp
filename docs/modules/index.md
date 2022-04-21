[dbcp](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### Interfaces

- [DatabaseCopyInput](../interfaces/index.databasecopyinput.md)
- [DatabaseCopyInputFile](../interfaces/index.databasecopyinputfile.md)
- [DatabaseCopyOptions](../interfaces/index.databasecopyoptions.md)
- [DatabaseCopyOutput](../interfaces/index.databasecopyoutput.md)

### Type aliases

- [DatabaseCopyFormats](index.md#databasecopyformats)

### Functions

- [assignDatabaseCopyInputProperties](index.md#assigndatabasecopyinputproperties)
- [assignDatabaseCopyOutputProperties](index.md#assigndatabasecopyoutputproperties)
- [databaseInspectSchema](index.md#databaseinspectschema)
- [dbcp](index.md#dbcp)
- [dumpToFile](index.md#dumptofile)
- [getExternalSortFunction](index.md#getexternalsortfunction)
- [getInputConnection](index.md#getinputconnection)
- [getInputConnectionString](index.md#getinputconnectionstring)
- [getInputFormat](index.md#getinputformat)
- [getInputFormats](index.md#getinputformats)
- [getOrderByFunction](index.md#getorderbyfunction)
- [getOutputConnection](index.md#getoutputconnection)
- [getOutputConnectionString](index.md#getoutputconnectionstring)
- [getOutputFormat](index.md#getoutputformat)
- [getShardFunction](index.md#getshardfunction)
- [guessFormatFromInput](index.md#guessformatfrominput)
- [openInputs](index.md#openinputs)
- [openOutputs](index.md#openoutputs)

## Type aliases

### DatabaseCopyFormats

Ƭ **DatabaseCopyFormats**: *Record*<string, [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) \| ``null``\>

Defined in: [index.ts:153](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L153)

## Functions

### assignDatabaseCopyInputProperties

▸ **assignDatabaseCopyInputProperties**(`target`: [*DatabaseCopyInput*](../interfaces/index.databasecopyinput.md), `source?`: [*DatabaseCopyInput*](../interfaces/index.databasecopyinput.md)): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [*DatabaseCopyInput*](../interfaces/index.databasecopyinput.md) |
| `source?` | [*DatabaseCopyInput*](../interfaces/index.databasecopyinput.md) |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `inputConnection` | *undefined* \| *Record*<string, any\> |
| `inputElasticSearch` | *undefined* \| *Client* |
| `inputFiles` | *undefined* \| [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md)[] \| *Record*<string, [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md)\> |
| `inputFormat` | *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `inputHost` | *undefined* \| *string* |
| `inputKnex` | *undefined* \| *Knex*<any, unknown[]\> |
| `inputLeveldb` | *undefined* \| *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> |
| `inputMongodb` | *undefined* \| *MongoClient* |
| `inputName` | *undefined* \| *string* |
| `inputPassword` | *undefined* \| *string* |
| `inputPort` | *undefined* \| *number* |
| `inputShardBy` | *undefined* \| *string* |
| `inputShardFunction` | *undefined* \| [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md) |
| `inputShardIndex` | *undefined* \| *number* |
| `inputShards` | *undefined* \| *number* |
| `inputStream` | *undefined* \| ReadableStreamTree |
| `inputTable` | *undefined* \| *string* |
| `inputType` | *undefined* \| [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) |
| `inputUser` | *undefined* \| *string* |

Defined in: [index.ts:853](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L853)

___

### assignDatabaseCopyOutputProperties

▸ **assignDatabaseCopyOutputProperties**(`target`: [*DatabaseCopyOutput*](../interfaces/index.databasecopyoutput.md), `source?`: [*DatabaseCopyOutput*](../interfaces/index.databasecopyoutput.md)): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [*DatabaseCopyOutput*](../interfaces/index.databasecopyoutput.md) |
| `source?` | [*DatabaseCopyOutput*](../interfaces/index.databasecopyoutput.md) |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `outputConnection` | *undefined* \| *Record*<string, any\> |
| `outputElasticSearch` | *undefined* \| *Client* |
| `outputFile` | *undefined* \| *string* |
| `outputFormat` | *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `outputHost` | *undefined* \| *string* |
| `outputKnex` | *undefined* \| *Knex*<any, unknown[]\> |
| `outputLeveldb` | *undefined* \| *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> |
| `outputMongodb` | *undefined* \| *MongoClient* |
| `outputName` | *undefined* \| *string* |
| `outputPassword` | *undefined* \| *string* |
| `outputPort` | *undefined* \| *number* |
| `outputShardFunction?` | [*DatabaseCopyShardFunctionOverride*](format.md#databasecopyshardfunctionoverride) \| [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md) |
| `outputShards` | *undefined* \| *number* |
| `outputStream` | *undefined* \| WritableStreamTree[] |
| `outputTable` | *undefined* \| *string* |
| `outputType` | *undefined* \| [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) |
| `outputUser` | *undefined* \| *string* |

Defined in: [index.ts:881](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L881)

___

### databaseInspectSchema

▸ **databaseInspectSchema**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *Promise*<Column[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *Promise*<Column[]\>

Defined in: [index.ts:834](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L834)

___

### dbcp

▸ **dbcp**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** *Promise*<void\>

Defined in: [index.ts:382](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L382)

___

### dumpToFile

▸ **dumpToFile**(`input`: ReadableStreamTree \| *undefined*, `outputs`: WritableStreamTree[], `options`: { `columnType?`: *Record*<string, string\> ; `copySchema?`: [*DatabaseCopySchema*](../enums/format.databasecopyschema.md) ; `externalSortFunction?`: (`x`: *any*) => *any*[] ; `format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) ; `formattingKnex?`: Knex ; `inputTable?`: *string* ; `outputShards?`: *number* ; `outputType?`: *string* ; `schema?`: [*Column*](../interfaces/schema.column.md)[] ; `shardFunction?`: (`x`: *Record*<string, any\>, `modulus`: *number*) => *number* ; `tempDirectories?`: *string*[] ; `transformObject?`: (`x`: *unknown*) => *unknown* ; `transformObjectStream?`: [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)  }): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree \| *undefined* |
| `outputs` | WritableStreamTree[] |
| `options` | *object* |
| `options.columnType?` | *Record*<string, string\> |
| `options.copySchema?` | [*DatabaseCopySchema*](../enums/format.databasecopyschema.md) |
| `options.externalSortFunction?` | (`x`: *any*) => *any*[] |
| `options.format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `options.formattingKnex?` | Knex |
| `options.inputTable?` | *string* |
| `options.outputShards?` | *number* |
| `options.outputType?` | *string* |
| `options.schema?` | [*Column*](../interfaces/schema.column.md)[] |
| `options.shardFunction?` | (`x`: *Record*<string, any\>, `modulus`: *number*) => *number* |
| `options.tempDirectories?` | *string*[] |
| `options.transformObject?` | (`x`: *unknown*) => *unknown* |
| `options.transformObjectStream?` | [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** *Promise*<void\>

Defined in: [index.ts:622](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L622)

___

### getExternalSortFunction

▸ **getExternalSortFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): (`x`: *any*) => *any*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** (`x`: *any*) => *any*[]

Defined in: [index.ts:258](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L258)

___

### getInputConnection

▸ **getInputConnection**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): { `database`: *undefined* ; `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC'; `user`: *undefined*  } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** { `database`: *undefined* ; `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC'; `user`: *undefined*  } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

Defined in: [index.ts:162](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L162)

___

### getInputConnectionString

▸ **getInputConnectionString**(`args`: { `inputHost?`: *string* ; `inputPassword?`: *string* ; `inputPort?`: *string* \| *number* ; `inputUser?`: *string*  }): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.inputHost?` | *string* |
| `args.inputPassword?` | *string* |
| `args.inputPort?` | *string* \| *number* |
| `args.inputUser?` | *string* |

**Returns:** *string*

Defined in: [index.ts:208](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L208)

___

### getInputFormat

▸ **getInputFormat**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `inputFormats`: [*DatabaseCopyFormats*](index.md#databasecopyformats)): *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `inputFormats` | [*DatabaseCopyFormats*](index.md#databasecopyformats) |

**Returns:** *undefined* \| [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)

Defined in: [index.ts:287](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L287)

___

### getInputFormats

▸ **getInputFormats**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): [*DatabaseCopyFormats*](index.md#databasecopyformats)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** [*DatabaseCopyFormats*](index.md#databasecopyformats)

Defined in: [index.ts:262](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L262)

___

### getOrderByFunction

▸ **getOrderByFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** (`a`: *Record*<string, any\>, `b`: *Record*<string, any\>) => ``1`` \| ``0`` \| ``-1``

Defined in: [index.ts:246](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L246)

___

### getOutputConnection

▸ **getOutputConnection**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): { `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC' } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** { `filename`: *undefined* \| *string* ; `timezone`: *string* = 'UTC' } \| { `charset`: *undefined* \| *string* ; `database`: *undefined* \| *string* ; `filename`: *undefined* ; `host`: *undefined* \| *string* ; `options`: *undefined* \| { `trustServerCertificate`: *boolean* = true } ; `password`: *undefined* \| *string* ; `port`: *undefined* \| *number* ; `timezone`: *string* = 'UTC'; `user`: *undefined* \| *string*  }

Defined in: [index.ts:188](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L188)

___

### getOutputConnectionString

▸ **getOutputConnectionString**(`args`: { `outputHost?`: *string* ; `outputPassword?`: *string* ; `outputPort?`: *string* \| *number* ; `outputUser?`: *string*  }): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.outputHost?` | *string* |
| `args.outputPassword?` | *string* |
| `args.outputPort?` | *string* \| *number* |
| `args.outputUser?` | *string* |

**Returns:** *string*

Defined in: [index.ts:217](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L217)

___

### getOutputFormat

▸ **getOutputFormat**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `inputFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)): [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `inputFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)

Defined in: [index.ts:294](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L294)

___

### getShardFunction

▸ **getShardFunction**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md)): [*DatabaseCopyShardFunctionOverride*](format.md#databasecopyshardfunctionoverride)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |

**Returns:** [*DatabaseCopyShardFunctionOverride*](format.md#databasecopyshardfunctionoverride)

Defined in: [index.ts:226](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L226)

___

### guessFormatFromInput

▸ **guessFormatFromInput**(`input`: [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md)): ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*object*](../enums/format.databasecopyformat.md#object) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md) |

**Returns:** ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*object*](../enums/format.databasecopyformat.md#object) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

Defined in: [index.ts:158](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L158)

___

### openInputs

▸ **openInputs**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `inputFiles`: [*string*, [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md)][], `inputFormats`: [*DatabaseCopyFormats*](index.md#databasecopyformats), `inputFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory), `outputFormat?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)): *Promise*<ReadableStreamTree[] \| Record<string, ReadableStreamTree \| ReadableStreamTree[]\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `inputFiles` | [*string*, [*DatabaseCopyInputFile*](../interfaces/index.databasecopyinputfile.md)][] |
| `inputFormats` | [*DatabaseCopyFormats*](index.md#databasecopyformats) |
| `inputFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `outputFormat?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** *Promise*<ReadableStreamTree[] \| Record<string, ReadableStreamTree \| ReadableStreamTree[]\>\>

Defined in: [index.ts:306](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L306)

___

### openOutputs

▸ **openOutputs**(`args`: [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md), `format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)): *Promise*<WritableStreamTree[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*DatabaseCopyOptions*](../interfaces/index.databasecopyoptions.md) |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** *Promise*<WritableStreamTree[]\>

Defined in: [index.ts:359](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L359)
