[dbcp](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / DatabaseCopyOptions

# Interface: DatabaseCopyOptions

[index](../modules/index.md).DatabaseCopyOptions

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
- [limit](index.databasecopyoptions.md#limit)
- [orderBy](index.databasecopyoptions.md#orderby)
- [query](index.databasecopyoptions.md#query)
- [schema](index.databasecopyoptions.md#schema)
- [schemaFile](index.databasecopyoptions.md#schemafile)
- [shardBy](index.databasecopyoptions.md#shardby)
- [sourceConnection](index.databasecopyoptions.md#sourceconnection)
- [sourceElasticSearch](index.databasecopyoptions.md#sourceelasticsearch)
- [sourceFiles](index.databasecopyoptions.md#sourcefiles)
- [sourceFormat](index.databasecopyoptions.md#sourceformat)
- [sourceHost](index.databasecopyoptions.md#sourcehost)
- [sourceKnex](index.databasecopyoptions.md#sourceknex)
- [sourceLevel](index.databasecopyoptions.md#sourcelevel)
- [sourceMongodb](index.databasecopyoptions.md#sourcemongodb)
- [sourceName](index.databasecopyoptions.md#sourcename)
- [sourcePassword](index.databasecopyoptions.md#sourcepassword)
- [sourcePort](index.databasecopyoptions.md#sourceport)
- [sourceShards](index.databasecopyoptions.md#sourceshards)
- [sourceStream](index.databasecopyoptions.md#sourcestream)
- [sourceTable](index.databasecopyoptions.md#sourcetable)
- [sourceType](index.databasecopyoptions.md#sourcetype)
- [sourceUser](index.databasecopyoptions.md#sourceuser)
- [targetConnection](index.databasecopyoptions.md#targetconnection)
- [targetElasticSearch](index.databasecopyoptions.md#targetelasticsearch)
- [targetFile](index.databasecopyoptions.md#targetfile)
- [targetFormat](index.databasecopyoptions.md#targetformat)
- [targetHost](index.databasecopyoptions.md#targethost)
- [targetKnex](index.databasecopyoptions.md#targetknex)
- [targetLevel](index.databasecopyoptions.md#targetlevel)
- [targetMongodb](index.databasecopyoptions.md#targetmongodb)
- [targetName](index.databasecopyoptions.md#targetname)
- [targetPassword](index.databasecopyoptions.md#targetpassword)
- [targetPort](index.databasecopyoptions.md#targetport)
- [targetShards](index.databasecopyoptions.md#targetshards)
- [targetStream](index.databasecopyoptions.md#targetstream)
- [targetTable](index.databasecopyoptions.md#targettable)
- [targetType](index.databasecopyoptions.md#targettype)
- [targetUser](index.databasecopyoptions.md#targetuser)
- [tempDirectory](index.databasecopyoptions.md#tempdirectory)
- [transformBytes](index.databasecopyoptions.md#transformbytes)
- [transformBytesStream](index.databasecopyoptions.md#transformbytesstream)
- [transformObject](index.databasecopyoptions.md#transformobject)
- [transformObjectStream](index.databasecopyoptions.md#transformobjectstream)
- [where](index.databasecopyoptions.md#where)

## Properties

### batchSize

• `Optional` **batchSize**: *number*

Defined in: [index.ts:71](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L71)

___

### columnType

• `Optional` **columnType**: *Record*<string, string\>

Defined in: [index.ts:72](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L72)

___

### compoundInsert

• `Optional` **compoundInsert**: *boolean*

Defined in: [index.ts:73](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L73)

___

### contentType

• `Optional` **contentType**: *string*

Defined in: [index.ts:74](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L74)

___

### copySchema

• `Optional` **copySchema**: [*DatabaseCopySchema*](../enums/format.databasecopyschema.md)

Defined in: [index.ts:75](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L75)

___

### engineOptions

• `Optional` **engineOptions**: *any*

Defined in: [index.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L76)

___

### externalSortBy

• `Optional` **externalSortBy**: *string*[]

Defined in: [index.ts:77](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L77)

___

### extra

• `Optional` **extra**: *Record*<string, any\>

Defined in: [index.ts:78](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L78)

___

### extraOutput

• `Optional` **extraOutput**: *boolean*

Defined in: [index.ts:79](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L79)

___

### fileSystem

• `Optional` **fileSystem**: *FileSystem*

Defined in: [index.ts:80](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L80)

___

### group

• `Optional` **group**: *boolean*

Defined in: [index.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L81)

___

### groupLabels

• `Optional` **groupLabels**: *boolean*

Defined in: [index.ts:82](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L82)

___

### limit

• `Optional` **limit**: *number*

Defined in: [index.ts:83](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L83)

___

### orderBy

• `Optional` **orderBy**: *string*[]

Defined in: [index.ts:84](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L84)

___

### query

• `Optional` **query**: *string*

Defined in: [index.ts:85](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L85)

___

### schema

• `Optional` **schema**: [*Column*](schema.column.md)[]

Defined in: [index.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L87)

___

### schemaFile

• `Optional` **schemaFile**: *string*

Defined in: [index.ts:88](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L88)

___

### shardBy

• `Optional` **shardBy**: *string*

Defined in: [index.ts:86](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L86)

___

### sourceConnection

• `Optional` **sourceConnection**: *Record*<string, any\>

Defined in: [index.ts:89](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L89)

___

### sourceElasticSearch

• `Optional` **sourceElasticSearch**: *Client*

Defined in: [index.ts:90](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L90)

___

### sourceFiles

• `Optional` **sourceFiles**: [*DatabaseCopySourceFile*](index.databasecopysourcefile.md)[] \| *Record*<string, [*DatabaseCopySourceFile*](index.databasecopysourcefile.md)\>

Defined in: [index.ts:92](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L92)

___

### sourceFormat

• `Optional` **sourceFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:91](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L91)

___

### sourceHost

• `Optional` **sourceHost**: *string*

Defined in: [index.ts:93](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L93)

___

### sourceKnex

• `Optional` **sourceKnex**: *Knex*<any, unknown[]\>

Defined in: [index.ts:97](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L97)

___

### sourceLevel

• `Optional` **sourceLevel**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:94](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L94)

___

### sourceMongodb

• `Optional` **sourceMongodb**: *MongoClient*

Defined in: [index.ts:95](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L95)

___

### sourceName

• `Optional` **sourceName**: *string*

Defined in: [index.ts:96](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L96)

___

### sourcePassword

• `Optional` **sourcePassword**: *string*

Defined in: [index.ts:98](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L98)

___

### sourcePort

• `Optional` **sourcePort**: *number*

Defined in: [index.ts:103](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L103)

___

### sourceShards

• `Optional` **sourceShards**: *number*

Defined in: [index.ts:99](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L99)

___

### sourceStream

• `Optional` **sourceStream**: ReadableStreamTree

Defined in: [index.ts:100](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L100)

___

### sourceTable

• `Optional` **sourceTable**: *string*

Defined in: [index.ts:101](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L101)

___

### sourceType

• `Optional` **sourceType**: [*DatabaseCopySourceType*](../enums/format.databasecopysourcetype.md)

Defined in: [index.ts:102](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L102)

___

### sourceUser

• `Optional` **sourceUser**: *string*

Defined in: [index.ts:104](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L104)

___

### targetConnection

• `Optional` **targetConnection**: *Record*<string, any\>

Defined in: [index.ts:105](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L105)

___

### targetElasticSearch

• `Optional` **targetElasticSearch**: *Client*

Defined in: [index.ts:106](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L106)

___

### targetFile

• `Optional` **targetFile**: *string*

Defined in: [index.ts:108](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L108)

___

### targetFormat

• `Optional` **targetFormat**: [*DatabaseCopyFormat*](../enums/format.databasecopyformat.md)

Defined in: [index.ts:107](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L107)

___

### targetHost

• `Optional` **targetHost**: *string*

Defined in: [index.ts:109](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L109)

___

### targetKnex

• `Optional` **targetKnex**: *Knex*<any, unknown[]\>

Defined in: [index.ts:110](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L110)

___

### targetLevel

• `Optional` **targetLevel**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Defined in: [index.ts:111](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L111)

___

### targetMongodb

• `Optional` **targetMongodb**: *MongoClient*

Defined in: [index.ts:112](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L112)

___

### targetName

• `Optional` **targetName**: *string*

Defined in: [index.ts:113](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L113)

___

### targetPassword

• `Optional` **targetPassword**: *string*

Defined in: [index.ts:114](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L114)

___

### targetPort

• `Optional` **targetPort**: *number*

Defined in: [index.ts:119](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L119)

___

### targetShards

• `Optional` **targetShards**: *number*

Defined in: [index.ts:115](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L115)

___

### targetStream

• `Optional` **targetStream**: WritableStreamTree[]

Defined in: [index.ts:116](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L116)

___

### targetTable

• `Optional` **targetTable**: *string*

Defined in: [index.ts:117](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L117)

___

### targetType

• `Optional` **targetType**: [*DatabaseCopyTargetType*](../enums/format.databasecopytargettype.md)

Defined in: [index.ts:118](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L118)

___

### targetUser

• `Optional` **targetUser**: *string*

Defined in: [index.ts:120](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L120)

___

### tempDirectory

• `Optional` **tempDirectory**: *string*

Defined in: [index.ts:121](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L121)

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

Defined in: [index.ts:124](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L124)

___

### transformBytesStream

• `Optional` **transformBytesStream**: () => *Duplex*

#### Type declaration

▸ (): *Duplex*

**Returns:** *Duplex*

Defined in: [index.ts:125](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L125)

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

Defined in: [index.ts:122](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L122)

___

### transformObjectStream

• `Optional` **transformObjectStream**: () => *Duplex*

#### Type declaration

▸ (): *Duplex*

**Returns:** *Duplex*

Defined in: [index.ts:123](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L123)

___

### where

• `Optional` **where**: (*string* \| *any*[])[]

Defined in: [index.ts:126](https://github.com/wholebuzz/dbcp/blob/master/src/index.ts#L126)
