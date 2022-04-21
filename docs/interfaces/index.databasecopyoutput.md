[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopyOutput

# Interface: DatabaseCopyOutput

[index](../modules/index.md).DatabaseCopyOutput

## Hierarchy

- **DatabaseCopyOutput**

  ↳ [*DatabaseCopyOptions*](index.databasecopyoptions.md)

## Table of contents

### Properties

- [outputConnection](index.databasecopyoutput.md#outputconnection)
- [outputElasticSearch](index.databasecopyoutput.md#outputelasticsearch)
- [outputFile](index.databasecopyoutput.md#outputfile)
- [outputFormat](index.databasecopyoutput.md#outputformat)
- [outputHost](index.databasecopyoutput.md#outputhost)
- [outputKnex](index.databasecopyoutput.md#outputknex)
- [outputLeveldb](index.databasecopyoutput.md#outputleveldb)
- [outputMongodb](index.databasecopyoutput.md#outputmongodb)
- [outputName](index.databasecopyoutput.md#outputname)
- [outputPassword](index.databasecopyoutput.md#outputpassword)
- [outputPort](index.databasecopyoutput.md#outputport)
- [outputShardFunction](index.databasecopyoutput.md#outputshardfunction)
- [outputShards](index.databasecopyoutput.md#outputshards)
- [outputStream](index.databasecopyoutput.md#outputstream)
- [outputTable](index.databasecopyoutput.md#outputtable)
- [outputType](index.databasecopyoutput.md#outputtype)
- [outputUser](index.databasecopyoutput.md#outputuser)

## Properties

### outputConnection

• `Optional` **outputConnection**: *Record*<string, any\>

Defined in: [index.ts:105](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L105)

___

### outputElasticSearch

• `Optional` **outputElasticSearch**: *Client*

Defined in: [index.ts:106](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L106)

___

### outputFile

• `Optional` **outputFile**: *string*

Defined in: [index.ts:108](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L108)

___

### outputFormat

• `Optional` **outputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:107](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L107)

___

### outputHost

• `Optional` **outputHost**: *string*

Defined in: [index.ts:109](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L109)

___

### outputKnex

• `Optional` **outputKnex**: *Knex*<any, unknown[]\>

Defined in: [index.ts:110](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L110)

___

### outputLeveldb

• `Optional` **outputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:111](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L111)

___

### outputMongodb

• `Optional` **outputMongodb**: *MongoClient*

Defined in: [index.ts:112](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L112)

___

### outputName

• `Optional` **outputName**: *string*

Defined in: [index.ts:113](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L113)

___

### outputPassword

• `Optional` **outputPassword**: *string*

Defined in: [index.ts:114](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L114)

___

### outputPort

• `Optional` **outputPort**: *number*

Defined in: [index.ts:120](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L120)

___

### outputShardFunction

• `Optional` **outputShardFunction**: [*DatabaseCopyShardFunctionOverride*](../modules/format.md#databasecopyshardfunctionoverride) \| [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md)

Defined in: [index.ts:115](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L115)

___

### outputShards

• `Optional` **outputShards**: *number*

Defined in: [index.ts:116](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L116)

___

### outputStream

• `Optional` **outputStream**: WritableStreamTree[]

Defined in: [index.ts:117](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L117)

___

### outputTable

• `Optional` **outputTable**: *string*

Defined in: [index.ts:118](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L118)

___

### outputType

• `Optional` **outputType**: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md)

Defined in: [index.ts:119](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L119)

___

### outputUser

• `Optional` **outputUser**: *string*

Defined in: [index.ts:121](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L121)
