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
- [inputShardBy](index.databasecopyinput.md#inputshardby)
- [inputShardFunction](index.databasecopyinput.md#inputshardfunction)
- [inputShardIndex](index.databasecopyinput.md#inputshardindex)
- [inputShards](index.databasecopyinput.md#inputshards)
- [inputStream](index.databasecopyinput.md#inputstream)
- [inputTable](index.databasecopyinput.md#inputtable)
- [inputType](index.databasecopyinput.md#inputtype)
- [inputUser](index.databasecopyinput.md#inputuser)

## Properties

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Defined in: [index.ts:78](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L78)

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Defined in: [index.ts:79](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L79)

___

### inputFiles

• `Optional` **inputFiles**: [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)[] \| *Record*<string, [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)\>

Defined in: [index.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L81)

___

### inputFormat

• `Optional` **inputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:80](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L80)

___

### inputHost

• `Optional` **inputHost**: *string*

Defined in: [index.ts:82](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L82)

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Defined in: [index.ts:86](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L86)

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:83](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L83)

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Defined in: [index.ts:84](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L84)

___

### inputName

• `Optional` **inputName**: *string*

Defined in: [index.ts:85](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L85)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Defined in: [index.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L87)

___

### inputPort

• `Optional` **inputPort**: *number*

Defined in: [index.ts:95](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L95)

___

### inputShardBy

• `Optional` **inputShardBy**: *string*

Defined in: [index.ts:88](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L88)

___

### inputShardFunction

• `Optional` **inputShardFunction**: [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md)

Defined in: [index.ts:89](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L89)

___

### inputShardIndex

• `Optional` **inputShardIndex**: *number*

Defined in: [index.ts:90](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L90)

___

### inputShards

• `Optional` **inputShards**: *number*

Defined in: [index.ts:91](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L91)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Defined in: [index.ts:92](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L92)

___

### inputTable

• `Optional` **inputTable**: *string*

Defined in: [index.ts:93](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L93)

___

### inputType

• `Optional` **inputType**: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md)

Defined in: [index.ts:94](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L94)

___

### inputUser

• `Optional` **inputUser**: *string*

Defined in: [index.ts:96](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L96)
