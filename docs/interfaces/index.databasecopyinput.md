[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopyInput

# Interface: DatabaseCopyInput

[index](../modules/index.md).DatabaseCopyInput

## Hierarchy

- **DatabaseCopyInput**

  ↳ [*DatabaseCopyOptions*](index.databasecopyoptions.md)

## Table of contents

### Properties

- [inputConnection](index.databasecopyinput.md#inputconnection)
- [inputElasticSearch](index.databasecopyinput.md#inputelasticsearch)
- [inputFiles](index.databasecopyinput.md#inputfiles)
- [inputFormat](index.databasecopyinput.md#inputformat)
- [inputHost](index.databasecopyinput.md#inputhost)
- [inputKnex](index.databasecopyinput.md#inputknex)
- [inputLeveldb](index.databasecopyinput.md#inputleveldb)
- [inputMongodb](index.databasecopyinput.md#inputmongodb)
- [inputName](index.databasecopyinput.md#inputname)
- [inputPassword](index.databasecopyinput.md#inputpassword)
- [inputPort](index.databasecopyinput.md#inputport)
- [inputShards](index.databasecopyinput.md#inputshards)
- [inputStream](index.databasecopyinput.md#inputstream)
- [inputTable](index.databasecopyinput.md#inputtable)
- [inputType](index.databasecopyinput.md#inputtype)
- [inputUser](index.databasecopyinput.md#inputuser)

## Properties

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Defined in: [index.ts:73](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L73)

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Defined in: [index.ts:74](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L74)

___

### inputFiles

• `Optional` **inputFiles**: [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)[] \| *Record*<string, [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)\>

Defined in: [index.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L76)

___

### inputFormat

• `Optional` **inputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:75](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L75)

___

### inputHost

• `Optional` **inputHost**: *string*

Defined in: [index.ts:77](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L77)

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Defined in: [index.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L81)

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:78](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L78)

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Defined in: [index.ts:79](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L79)

___

### inputName

• `Optional` **inputName**: *string*

Defined in: [index.ts:80](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L80)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Defined in: [index.ts:82](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L82)

___

### inputPort

• `Optional` **inputPort**: *number*

Defined in: [index.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L87)

___

### inputShards

• `Optional` **inputShards**: *number*

Defined in: [index.ts:83](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L83)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Defined in: [index.ts:84](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L84)

___

### inputTable

• `Optional` **inputTable**: *string*

Defined in: [index.ts:85](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L85)

___

### inputType

• `Optional` **inputType**: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md)

Defined in: [index.ts:86](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L86)

___

### inputUser

• `Optional` **inputUser**: *string*

Defined in: [index.ts:88](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L88)
