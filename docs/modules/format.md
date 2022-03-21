[dbcp](../README.md) / [Exports](../modules.md) / format

# Module: format

## Table of contents

### Enumerations

- [DatabaseCopyFormat](../enums/format.databasecopyformat.md)
- [DatabaseCopyInputType](../enums/format.databasecopyinputtype.md)
- [DatabaseCopyOutputType](../enums/format.databasecopyoutputtype.md)
- [DatabaseCopySchema](../enums/format.databasecopyschema.md)

### Functions

- [formatContentType](format.md#formatcontenttype)
- [formatHasSchema](format.md#formathasschema)
- [guessFormatFromFilename](format.md#guessformatfromfilename)
- [guessInputTypeFromFilename](format.md#guessinputtypefromfilename)
- [guessOutputTypeFromFilename](format.md#guessoutputtypefromfilename)
- [inputHasDatabaseFile](format.md#inputhasdatabasefile)
- [inputIsSqlDatabase](format.md#inputissqldatabase)
- [outputHasDatabaseFile](format.md#outputhasdatabasefile)
- [outputIsSqlDatabase](format.md#outputissqldatabase)
- [pipeFromOutputFormatTransform](format.md#pipefromoutputformattransform)
- [pipeInputFormatTransform](format.md#pipeinputformattransform)

## Functions

### formatContentType

▸ **formatContentType**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null``): *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null`` |

**Returns:** *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

Defined in: [format.ts:148](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L148)

___

### formatHasSchema

▸ **formatHasSchema**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** *boolean*

Defined in: [format.ts:206](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L206)

___

### guessFormatFromFilename

▸ **guessFormatFromFilename**(`filename?`: *string*): ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

Defined in: [format.ts:61](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L61)

___

### guessInputTypeFromFilename

▸ **guessInputTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopyinputtype.md#level) \| [*sqlite*](../enums/format.databasecopyinputtype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopyinputtype.md#level) \| [*sqlite*](../enums/format.databasecopyinputtype.md#sqlite)

Defined in: [format.ts:73](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L73)

___

### guessOutputTypeFromFilename

▸ **guessOutputTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopyoutputtype.md#level) \| [*sqlite*](../enums/format.databasecopyoutputtype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopyoutputtype.md#level) \| [*sqlite*](../enums/format.databasecopyoutputtype.md#sqlite)

Defined in: [format.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L81)

___

### inputHasDatabaseFile

▸ **inputHasDatabaseFile**(`format?`: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:162](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L162)

___

### inputIsSqlDatabase

▸ **inputIsSqlDatabase**(`format?`: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:182](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L182)

___

### outputHasDatabaseFile

▸ **outputHasDatabaseFile**(`format?`: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:172](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L172)

___

### outputIsSqlDatabase

▸ **outputIsSqlDatabase**(`format?`: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:194](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L194)

___

### pipeFromOutputFormatTransform

▸ **pipeFromOutputFormatTransform**(`output`: WritableStreamTree, `format`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md), `db?`: Knex, `tableName?`: *string*, `options?`: { `columnType?`: *Record*<string, string\> ; `schema?`: Column[]  }): WritableStreamTree \| *Promise*<WritableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | WritableStreamTree |
| `format` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |
| `db?` | Knex |
| `tableName?` | *string* |
| `options?` | *object* |
| `options.columnType?` | *Record*<string, string\> |
| `options.schema?` | Column[] |

**Returns:** WritableStreamTree \| *Promise*<WritableStreamTree\>

Defined in: [format.ts:111](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L111)

___

### pipeInputFormatTransform

▸ **pipeInputFormatTransform**(`input`: ReadableStreamTree, `format`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): ReadableStreamTree \| *Promise*<ReadableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree |
| `format` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** ReadableStreamTree \| *Promise*<ReadableStreamTree\>

Defined in: [format.ts:89](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L89)
