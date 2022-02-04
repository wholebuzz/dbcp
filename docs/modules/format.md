[dbcp](../README.md) / [Exports](../modules.md) / format

# Module: format

## Table of contents

### Enumerations

- [DatabaseCopyFormat](../enums/format.databasecopyformat.md)
- [DatabaseCopySchema](../enums/format.databasecopyschema.md)
- [DatabaseCopySourceType](../enums/format.databasecopysourcetype.md)
- [DatabaseCopyTargetType](../enums/format.databasecopytargettype.md)

### Functions

- [formatContentType](format.md#formatcontenttype)
- [formatHasSchema](format.md#formathasschema)
- [guessFormatFromFilename](format.md#guessformatfromfilename)
- [guessSourceTypeFromFilename](format.md#guesssourcetypefromfilename)
- [guessTargetTypeFromFilename](format.md#guesstargettypefromfilename)
- [pipeFromOutputFormatTransform](format.md#pipefromoutputformattransform)
- [pipeInputFormatTransform](format.md#pipeinputformattransform)
- [sourceHasDatabaseFile](format.md#sourcehasdatabasefile)
- [targetHasDatabaseFile](format.md#targethasdatabasefile)

## Functions

### formatContentType

▸ **formatContentType**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null``): *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| ``null`` |

**Returns:** *undefined* \| ``"application/x-ndjson"`` \| ``"application/json"`` \| ``"application/sql"``

Defined in: [format.ts:142](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L142)

___

### formatHasSchema

▸ **formatHasSchema**(`format?`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** *boolean*

Defined in: [format.ts:176](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L176)

___

### guessFormatFromFilename

▸ **guessFormatFromFilename**(`filename?`: *string*): ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*csv*](../enums/format.databasecopyformat.md#csv) \| [*json*](../enums/format.databasecopyformat.md#json) \| [*jsonl*](../enums/format.databasecopyformat.md#jsonl) \| [*parquet*](../enums/format.databasecopyformat.md#parquet) \| [*tfrecord*](../enums/format.databasecopyformat.md#tfrecord) \| [*sql*](../enums/format.databasecopyformat.md#sql)

Defined in: [format.ts:55](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L55)

___

### guessSourceTypeFromFilename

▸ **guessSourceTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopysourcetype.md#level) \| [*sqlite*](../enums/format.databasecopysourcetype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopysourcetype.md#level) \| [*sqlite*](../enums/format.databasecopysourcetype.md#sqlite)

Defined in: [format.ts:67](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L67)

___

### guessTargetTypeFromFilename

▸ **guessTargetTypeFromFilename**(`filename?`: *string*): ``null`` \| [*level*](../enums/format.databasecopytargettype.md#level) \| [*sqlite*](../enums/format.databasecopytargettype.md#sqlite)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | *string* |

**Returns:** ``null`` \| [*level*](../enums/format.databasecopytargettype.md#level) \| [*sqlite*](../enums/format.databasecopytargettype.md#sqlite)

Defined in: [format.ts:75](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L75)

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

Defined in: [format.ts:105](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L105)

___

### pipeInputFormatTransform

▸ **pipeInputFormatTransform**(`input`: ReadableStreamTree, `format`: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)): ReadableStreamTree \| *Promise*<ReadableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ReadableStreamTree |
| `format` | [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) |

**Returns:** ReadableStreamTree \| *Promise*<ReadableStreamTree\>

Defined in: [format.ts:83](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L83)

___

### sourceHasDatabaseFile

▸ **sourceHasDatabaseFile**(`format?`: [*DatabaseCopySourceType*](../enums/format.databasecopysourcetype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopySourceType*](../enums/format.databasecopysourcetype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:156](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L156)

___

### targetHasDatabaseFile

▸ **targetHasDatabaseFile**(`format?`: [*DatabaseCopyTargetType*](../enums/format.databasecopytargettype.md) \| ``null``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `format?` | [*DatabaseCopyTargetType*](../enums/format.databasecopytargettype.md) \| ``null`` |

**Returns:** *boolean*

Defined in: [format.ts:166](https://github.com/wholebuzz/dbcp/blob/master/src/format.ts#L166)
