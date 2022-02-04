[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopySourceFile

# Interface: DatabaseCopySourceFile

[index](../modules/index.md).DatabaseCopySourceFile

## Table of contents

### Properties

- [columnType](index.databasecopysourcefile.md#columntype)
- [query](index.databasecopysourcefile.md#query)
- [schema](index.databasecopysourcefile.md#schema)
- [schemaFile](index.databasecopysourcefile.md#schemafile)
- [sourceFormat](index.databasecopysourcefile.md#sourceformat)
- [sourceShardFilter](index.databasecopysourcefile.md#sourceshardfilter)
- [sourceShards](index.databasecopysourcefile.md#sourceshards)
- [transformInputObject](index.databasecopysourcefile.md#transforminputobject)
- [transformInputObjectStream](index.databasecopysourcefile.md#transforminputobjectstream)
- [url](index.databasecopysourcefile.md#url)

## Properties

### columnType

• `Optional` **columnType**: *Record*<string, string\>

Defined in: [index.ts:59](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L59)

___

### query

• `Optional` **query**: *string*

Defined in: [index.ts:60](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L60)

___

### schema

• `Optional` **schema**: [*Column*](schema.column.md)[]

Defined in: [index.ts:61](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L61)

___

### schemaFile

• `Optional` **schemaFile**: *string*

Defined in: [index.ts:62](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L62)

___

### sourceFormat

• `Optional` **sourceFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:63](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L63)

___

### sourceShardFilter

• `Optional` **sourceShardFilter**: (`index`: *number*) => *boolean*

#### Type declaration

▸ (`index`: *number*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | *number* |

**Returns:** *boolean*

Defined in: [index.ts:65](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L65)

___

### sourceShards

• `Optional` **sourceShards**: *number*

Defined in: [index.ts:64](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L64)

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

Defined in: [index.ts:66](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L66)

___

### transformInputObjectStream

• `Optional` **transformInputObjectStream**: () => *Duplex*

#### Type declaration

▸ (): *Duplex*

**Returns:** *Duplex*

Defined in: [index.ts:67](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L67)

___

### url

• **url**: *string*

Defined in: [index.ts:58](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L58)
