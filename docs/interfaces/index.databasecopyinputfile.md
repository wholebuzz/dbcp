[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopyInputFile

# Interface: DatabaseCopyInputFile

[index](../modules/index.md).DatabaseCopyInputFile

## Table of contents

### Properties

- [columnType](index.databasecopyinputfile.md#columntype)
- [extra](index.databasecopyinputfile.md#extra)
- [extraOutput](index.databasecopyinputfile.md#extraoutput)
- [inputFormat](index.databasecopyinputfile.md#inputformat)
- [inputShardFilter](index.databasecopyinputfile.md#inputshardfilter)
- [inputShards](index.databasecopyinputfile.md#inputshards)
- [inputStream](index.databasecopyinputfile.md#inputstream)
- [query](index.databasecopyinputfile.md#query)
- [schema](index.databasecopyinputfile.md#schema)
- [schemaFile](index.databasecopyinputfile.md#schemafile)
- [transformInputObject](index.databasecopyinputfile.md#transforminputobject)
- [transformInputObjectStream](index.databasecopyinputfile.md#transforminputobjectstream)
- [url](index.databasecopyinputfile.md#url)

## Properties

### columnType

• `Optional` **columnType**: *Record*<string, string\>

Defined in: [index.ts:69](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L69)

___

### extra

• `Optional` **extra**: *Record*<string, any\>

Defined in: [index.ts:70](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L70)

___

### extraOutput

• `Optional` **extraOutput**: *boolean*

Defined in: [index.ts:71](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L71)

___

### inputFormat

• `Optional` **inputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:74](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L74)

___

### inputShardFilter

• `Optional` **inputShardFilter**: (`index`: *number*) => *boolean*

#### Type declaration

▸ (`index`: *number*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | *number* |

**Returns:** *boolean*

Defined in: [index.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L76)

___

### inputShards

• `Optional` **inputShards**: *number*

Defined in: [index.ts:75](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L75)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree[]

Defined in: [index.ts:77](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L77)

___

### query

• `Optional` **query**: *string*

Defined in: [index.ts:68](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L68)

___

### schema

• `Optional` **schema**: [*Column*](schema.column.md)[]

Defined in: [index.ts:72](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L72)

___

### schemaFile

• `Optional` **schemaFile**: *string*

Defined in: [index.ts:73](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L73)

___

### transformInputObject

• `Optional` **transformInputObject**: (`x`: *unknown*) => *unknown*

#### Type declaration

▸ (`x`: *unknown*): *unknown*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *unknown* |

**Returns:** *unknown*

Defined in: [index.ts:78](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L78)

___

### transformInputObjectStream

• `Optional` **transformInputObjectStream**: [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:79](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L79)

___

### url

• `Optional` **url**: *string*

Defined in: [index.ts:67](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L67)
