[dbcp](../README.md) / [Exports](../modules.md) / format

# Module: format

## Table of contents

### Enumerations

- [DatabaseCopyFormat](../enums/format.databasecopyformat.md)
- [DatabaseCopyInputType](../enums/format.databasecopyinputtype.md)
- [DatabaseCopyOutputType](../enums/format.databasecopyoutputtype.md)
- [DatabaseCopySchema](../enums/format.databasecopyschema.md)
- [DatabaseCopyShardFunction](../enums/format.databasecopyshardfunction.md)

### Type aliases

- [DatabaseCopyShardFunctionOverride](format.md#databasecopyshardfunctionoverride)
- [DatabaseCopyTransformFactory](format.md#databasecopytransformfactory)

### Functions

- [formatContentType](format.md#formatcontenttype)
- [formatHasSchema](format.md#formathasschema)
- [guessFormatFromFilename](format.md#guessformatfromfilename)
- [guessInputTypeFromFilename](format.md#guessinputtypefromfilename)
- [guessOutputTypeFromFilename](format.md#guessoutputtypefromfilename)
- [inputHasDatabaseFile](format.md#inputhasdatabasefile)
- [inputIsSqlDatabase](format.md#inputissqldatabase)
- [nonCustomFormat](format.md#noncustomformat)
- [outputHasDatabaseFile](format.md#outputhasdatabasefile)
- [outputIsSqlDatabase](format.md#outputissqldatabase)
- [pipeFromOutputFormatTransform](format.md#pipefromoutputformattransform)
- [pipeInputFormatTransform](format.md#pipeinputformattransform)

## Type aliases

### DatabaseCopyShardFunctionOverride

Ƭ **DatabaseCopyShardFunctionOverride**: (`value`: *Record*<string, any\>, `modulus`: *number*) => *number*

#### Type declaration

▸ (`value`: *Record*<string, any\>, `modulus`: *number*): *number*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *Record*<string, any\> |
| `modulus` | *number* |

**Returns:** *number*

Defined in: [format.ts:67](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L67)

___

### DatabaseCopyTransformFactory

Ƭ **DatabaseCopyTransformFactory**: () => Duplex

#### Type declaration

▸ (): Duplex

**Returns:** Duplex

Defined in: [format.ts:77](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L77)

## Functions

### formatContentType

▸ **formatContentType**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null``): *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null`` |

**Returns:** *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

Defined in: [format.ts:183](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L183)

___

### formatHasSchema

▸ **formatHasSchema**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** *boolean*

Defined in: [format.ts:241](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L241)

___

### guessFormatFromFilename

▸ **guessFormatFromFilename**(`filename?`: *string*): ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

Defined in: [format.ts:79](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L79)

___

### guessInputTypeFromFilename

▸ **guessInputTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopyinputtype.md#level) \| [*sqlite*](../enums/format.databasecopyinputtype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopyinputtype.md#level) \| [*sqlite*](../enums/format.databasecopyinputtype.md#sqlite)

Defined in: [format.ts:92](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L92)

___

### guessOutputTypeFromFilename

▸ **guessOutputTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopyoutputtype.md#level) \| [*sqlite*](../enums/format.databasecopyoutputtype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopyoutputtype.md#level) \| [*sqlite*](../enums/format.databasecopyoutputtype.md#sqlite)

Defined in: [format.ts:100](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L100)

___

### inputHasDatabaseFile

▸ **inputHasDatabaseFile**(`format?`: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:197](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L197)

___

### inputIsSqlDatabase

▸ **inputIsSqlDatabase**(`format?`: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:217](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L217)

___

### nonCustomFormat

▸ **nonCustomFormat**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) \| ``null``): [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| *undefined*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) \| ``null`` |

**Returns:** [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| *undefined*

Defined in: [format.ts:251](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L251)

___

### outputHasDatabaseFile

▸ **outputHasDatabaseFile**(`format?`: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:207](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L207)

___

### outputIsSqlDatabase

▸ **outputIsSqlDatabase**(`format?`: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:229](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L229)

___

### pipeFromOutputFormatTransform

▸ **pipeFromOutputFormatTransform**(`output`: WritableStreamTree, `format`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory), `db?`: Knex, `tableName?`: *string*, `options?`: { `columnType?`: *Record*<string, string\> ; `schema?`: Column[]  }): WritableStreamTree \| *Promise*<WritableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | WritableStreamTree |
| `format` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |
| `db?` | Knex |
| `tableName?` | *string* |
| `options?` | *object* |
| `options.columnType?` | *Record*<string, string\> |
| `options.schema?` | Column[] |

**Returns:** WritableStreamTree \| *Promise*<WritableStreamTree\>

Defined in: [format.ts:145](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L145)

___

### pipeInputFormatTransform

▸ **pipeInputFormatTransform**(`input`: ReadableStreamTree, `format`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory)): ReadableStreamTree \| *Promise*<ReadableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree |
| `format` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](format.md#databasecopytransformfactory) |

**Returns:** ReadableStreamTree \| *Promise*<ReadableStreamTree\>

Defined in: [format.ts:108](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L108)
