[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopyOptions

# Interface: DatabaseCopyOptions

[index](../modules/index.md).DatabaseCopyOptions

## Hierarchy

- [*DatabaseCopyInput*](index.databasecopyinput.md)

- [*DatabaseCopyOutput*](index.databasecopyoutput.md)

  ↳ **DatabaseCopyOptions**

## Table of contents

### Properties

- [batchSize](index.databasecopyoptions.md#batchsize)
- [columnType](index.databasecopyoptions.md#columntype)
- [compoundInsert](index.databasecopyoptions.md#compoundinsert)
- [contentType](index.databasecopyoptions.md#contenttype)
- [copySchema](index.databasecopyoptions.md#copyschema)
- [engineOptions](index.databasecopyoptions.md#engineoptions)
- [externalSortBy](index.databasecopyoptions.md#externalsortby)
- [extra](index.databasecopyoptions.md#extra)
- [extraOutput](index.databasecopyoptions.md#extraoutput)
- [fileSystem](index.databasecopyoptions.md#filesystem)
- [group](index.databasecopyoptions.md#group)
- [groupLabels](index.databasecopyoptions.md#grouplabels)
- [inputConnection](index.databasecopyoptions.md#inputconnection)
- [inputElasticSearch](index.databasecopyoptions.md#inputelasticsearch)
- [inputFiles](index.databasecopyoptions.md#inputfiles)
- [inputFormat](index.databasecopyoptions.md#inputformat)
- [inputHost](index.databasecopyoptions.md#inputhost)
- [inputKnex](index.databasecopyoptions.md#inputknex)
- [inputLeveldb](index.databasecopyoptions.md#inputleveldb)
- [inputMongodb](index.databasecopyoptions.md#inputmongodb)
- [inputName](index.databasecopyoptions.md#inputname)
- [inputPassword](index.databasecopyoptions.md#inputpassword)
- [inputPort](index.databasecopyoptions.md#inputport)
- [inputShardBy](index.databasecopyoptions.md#inputshardby)
- [inputShardFunction](index.databasecopyoptions.md#inputshardfunction)
- [inputShardIndex](index.databasecopyoptions.md#inputshardindex)
- [inputShards](index.databasecopyoptions.md#inputshards)
- [inputStream](index.databasecopyoptions.md#inputstream)
- [inputTable](index.databasecopyoptions.md#inputtable)
- [inputType](index.databasecopyoptions.md#inputtype)
- [inputUser](index.databasecopyoptions.md#inputuser)
- [limit](index.databasecopyoptions.md#limit)
- [logger](index.databasecopyoptions.md#logger)
- [orderBy](index.databasecopyoptions.md#orderby)
- [outputConnection](index.databasecopyoptions.md#outputconnection)
- [outputElasticSearch](index.databasecopyoptions.md#outputelasticsearch)
- [outputFile](index.databasecopyoptions.md#outputfile)
- [outputFormat](index.databasecopyoptions.md#outputformat)
- [outputHost](index.databasecopyoptions.md#outputhost)
- [outputKnex](index.databasecopyoptions.md#outputknex)
- [outputLeveldb](index.databasecopyoptions.md#outputleveldb)
- [outputMongodb](index.databasecopyoptions.md#outputmongodb)
- [outputName](index.databasecopyoptions.md#outputname)
- [outputPassword](index.databasecopyoptions.md#outputpassword)
- [outputPort](index.databasecopyoptions.md#outputport)
- [outputShardFunction](index.databasecopyoptions.md#outputshardfunction)
- [outputShards](index.databasecopyoptions.md#outputshards)
- [outputStream](index.databasecopyoptions.md#outputstream)
- [outputTable](index.databasecopyoptions.md#outputtable)
- [outputType](index.databasecopyoptions.md#outputtype)
- [outputUser](index.databasecopyoptions.md#outputuser)
- [probeBytes](index.databasecopyoptions.md#probebytes)
- [query](index.databasecopyoptions.md#query)
- [schema](index.databasecopyoptions.md#schema)
- [schemaFile](index.databasecopyoptions.md#schemafile)
- [shardBy](index.databasecopyoptions.md#shardby)
- [tempDirectories](index.databasecopyoptions.md#tempdirectories)
- [transformBytes](index.databasecopyoptions.md#transformbytes)
- [transformBytesStream](index.databasecopyoptions.md#transformbytesstream)
- [transformObject](index.databasecopyoptions.md#transformobject)
- [transformObjectStream](index.databasecopyoptions.md#transformobjectstream)
- [where](index.databasecopyoptions.md#where)

## Properties

### batchSize

• `Optional` **batchSize**: *number*

Defined in: [index.ts:125](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L125)

___

### columnType

• `Optional` **columnType**: *Record*<string, string\>

Defined in: [index.ts:126](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L126)

___

### compoundInsert

• `Optional` **compoundInsert**: *boolean*

Defined in: [index.ts:127](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L127)

___

### contentType

• `Optional` **contentType**: *string*

Defined in: [index.ts:128](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L128)

___

### copySchema

• `Optional` **copySchema**: [*DatabaseCopySchema*](../enums/format.databasecopyschema.md)

Defined in: [index.ts:129](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L129)

___

### engineOptions

• `Optional` **engineOptions**: *any*

Defined in: [index.ts:130](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L130)

___

### externalSortBy

• `Optional` **externalSortBy**: *string*[]

Defined in: [index.ts:131](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L131)

___

### extra

• `Optional` **extra**: *Record*<string, any\>

Defined in: [index.ts:132](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L132)

___

### extraOutput

• `Optional` **extraOutput**: *boolean*

Defined in: [index.ts:133](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L133)

___

### fileSystem

• `Optional` **fileSystem**: *FileSystem*

Defined in: [index.ts:134](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L134)

___

### group

• `Optional` **group**: *boolean*

Defined in: [index.ts:135](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L135)

___

### groupLabels

• `Optional` **groupLabels**: *boolean*

Defined in: [index.ts:136](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L136)

___

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputConnection](index.databasecopyinput.md#inputconnection)

Defined in: [index.ts:83](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L83)

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputElasticSearch](index.databasecopyinput.md#inputelasticsearch)

Defined in: [index.ts:84](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L84)

___

### inputFiles

• `Optional` **inputFiles**: [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)[] \| *Record*<string, [*DatabaseCopyInputFile*](index.databasecopyinputfile.md)\>

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputFiles](index.databasecopyinput.md#inputfiles)

Defined in: [index.ts:86](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L86)

___

### inputFormat

• `Optional` **inputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputFormat](index.databasecopyinput.md#inputformat)

Defined in: [index.ts:85](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L85)

___

### inputHost

• `Optional` **inputHost**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputHost](index.databasecopyinput.md#inputhost)

Defined in: [index.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L87)

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputKnex](index.databasecopyinput.md#inputknex)

Defined in: [index.ts:91](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L91)

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputLeveldb](index.databasecopyinput.md#inputleveldb)

Defined in: [index.ts:88](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L88)

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputMongodb](index.databasecopyinput.md#inputmongodb)

Defined in: [index.ts:89](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L89)

___

### inputName

• `Optional` **inputName**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputName](index.databasecopyinput.md#inputname)

Defined in: [index.ts:90](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L90)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputPassword](index.databasecopyinput.md#inputpassword)

Defined in: [index.ts:92](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L92)

___

### inputPort

• `Optional` **inputPort**: *number*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputPort](index.databasecopyinput.md#inputport)

Defined in: [index.ts:100](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L100)

___

### inputShardBy

• `Optional` **inputShardBy**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputShardBy](index.databasecopyinput.md#inputshardby)

Defined in: [index.ts:93](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L93)

___

### inputShardFunction

• `Optional` **inputShardFunction**: [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md)

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputShardFunction](index.databasecopyinput.md#inputshardfunction)

Defined in: [index.ts:94](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L94)

___

### inputShardIndex

• `Optional` **inputShardIndex**: *number*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputShardIndex](index.databasecopyinput.md#inputshardindex)

Defined in: [index.ts:95](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L95)

___

### inputShards

• `Optional` **inputShards**: *number*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputShards](index.databasecopyinput.md#inputshards)

Defined in: [index.ts:96](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L96)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputStream](index.databasecopyinput.md#inputstream)

Defined in: [index.ts:97](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L97)

___

### inputTable

• `Optional` **inputTable**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputTable](index.databasecopyinput.md#inputtable)

Defined in: [index.ts:98](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L98)

___

### inputType

• `Optional` **inputType**: [*DatabaseCopyInputType*](../enums/format.databasecopyinputtype.md)

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputType](index.databasecopyinput.md#inputtype)

Defined in: [index.ts:99](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L99)

___

### inputUser

• `Optional` **inputUser**: *string*

Inherited from: [DatabaseCopyInput](index.databasecopyinput.md).[inputUser](index.databasecopyinput.md#inputuser)

Defined in: [index.ts:101](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L101)

___

### limit

• `Optional` **limit**: *number*

Defined in: [index.ts:137](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L137)

___

### logger

• `Optional` **logger**: Logger

Defined in: [index.ts:138](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L138)

___

### orderBy

• `Optional` **orderBy**: *string*[]

Defined in: [index.ts:139](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L139)

___

### outputConnection

• `Optional` **outputConnection**: *Record*<string, any\>

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputConnection](index.databasecopyoutput.md#outputconnection)

Defined in: [index.ts:105](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L105)

___

### outputElasticSearch

• `Optional` **outputElasticSearch**: *Client*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputElasticSearch](index.databasecopyoutput.md#outputelasticsearch)

Defined in: [index.ts:106](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L106)

___

### outputFile

• `Optional` **outputFile**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputFile](index.databasecopyoutput.md#outputfile)

Defined in: [index.ts:108](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L108)

___

### outputFormat

• `Optional` **outputFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md) \| [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputFormat](index.databasecopyoutput.md#outputformat)

Defined in: [index.ts:107](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L107)

___

### outputHost

• `Optional` **outputHost**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputHost](index.databasecopyoutput.md#outputhost)

Defined in: [index.ts:109](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L109)

___

### outputKnex

• `Optional` **outputKnex**: *Knex*<any, unknown[]\>

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputKnex](index.databasecopyoutput.md#outputknex)

Defined in: [index.ts:110](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L110)

___

### outputLeveldb

• `Optional` **outputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputLeveldb](index.databasecopyoutput.md#outputleveldb)

Defined in: [index.ts:111](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L111)

___

### outputMongodb

• `Optional` **outputMongodb**: *MongoClient*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputMongodb](index.databasecopyoutput.md#outputmongodb)

Defined in: [index.ts:112](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L112)

___

### outputName

• `Optional` **outputName**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputName](index.databasecopyoutput.md#outputname)

Defined in: [index.ts:113](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L113)

___

### outputPassword

• `Optional` **outputPassword**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputPassword](index.databasecopyoutput.md#outputpassword)

Defined in: [index.ts:114](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L114)

___

### outputPort

• `Optional` **outputPort**: *number*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputPort](index.databasecopyoutput.md#outputport)

Defined in: [index.ts:120](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L120)

___

### outputShardFunction

• `Optional` **outputShardFunction**: [*DatabaseCopyShardFunctionOverride*](../modules/format.md#databasecopyshardfunctionoverride) \| [*DatabaseCopyShardFunction*](../enums/format.databasecopyshardfunction.md)

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputShardFunction](index.databasecopyoutput.md#outputshardfunction)

Defined in: [index.ts:115](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L115)

___

### outputShards

• `Optional` **outputShards**: *number*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputShards](index.databasecopyoutput.md#outputshards)

Defined in: [index.ts:116](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L116)

___

### outputStream

• `Optional` **outputStream**: WritableStreamTree[]

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputStream](index.databasecopyoutput.md#outputstream)

Defined in: [index.ts:117](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L117)

___

### outputTable

• `Optional` **outputTable**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputTable](index.databasecopyoutput.md#outputtable)

Defined in: [index.ts:118](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L118)

___

### outputType

• `Optional` **outputType**: [*DatabaseCopyOutputType*](../enums/format.databasecopyoutputtype.md)

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputType](index.databasecopyoutput.md#outputtype)

Defined in: [index.ts:119](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L119)

___

### outputUser

• `Optional` **outputUser**: *string*

Inherited from: [DatabaseCopyOutput](index.databasecopyoutput.md).[outputUser](index.databasecopyoutput.md#outputuser)

Defined in: [index.ts:121](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L121)

___

### probeBytes

• `Optional` **probeBytes**: *number*

Defined in: [index.ts:140](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L140)

___

### query

• `Optional` **query**: *string*

Defined in: [index.ts:141](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L141)

___

### schema

• `Optional` **schema**: [*Column*](schema.column.md)[]

Defined in: [index.ts:143](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L143)

___

### schemaFile

• `Optional` **schemaFile**: *string*

Defined in: [index.ts:144](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L144)

___

### shardBy

• `Optional` **shardBy**: *string*

Defined in: [index.ts:142](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L142)

___

### tempDirectories

• `Optional` **tempDirectories**: *string*[]

Defined in: [index.ts:145](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L145)

___

### transformBytes

• `Optional` **transformBytes**: (`x`: *string*) => *string*

#### Type declaration

▸ (`x`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *string* |

**Returns:** *string*

Defined in: [index.ts:148](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L148)

___

### transformBytesStream

• `Optional` **transformBytesStream**: [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:149](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L149)

___

### transformObject

• `Optional` **transformObject**: (`x`: *unknown*) => *unknown*

#### Type declaration

▸ (`x`: *unknown*): *unknown*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *unknown* |

**Returns:** *unknown*

Defined in: [index.ts:146](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L146)

___

### transformObjectStream

• `Optional` **transformObjectStream**: [*DatabaseCopyTransformFactory*](../modules/format.md#databasecopytransformfactory)

Defined in: [index.ts:147](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L147)

___

### where

• `Optional` **where**: (*string* \| *any*[])[]

Defined in: [index.ts:150](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L150)
