[dbcp](../README.md) / [Exports](../modules.md) / mongodb

# Module: mongodb

## Table of contents

### Variables

- [batch2](mongodb.md#batch2)

### Functions

- [openMongoDb](mongodb.md#openmongodb)
- [openMongoDbInput](mongodb.md#openmongodbinput)
- [openMongoDbOutput](mongodb.md#openmongodboutput)
- [streamFromMongoDb](mongodb.md#streamfrommongodb)
- [streamToMongoDb](mongodb.md#streamtomongodb)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [mongodb.ts:6](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L6)

## Functions

### openMongoDb

▸ **openMongoDb**(`args`: { `mongodb?`: mongoDB.MongoClient ; `name?`: *string* ; `tables?`: *string*[] ; `url?`: *string*  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.mongodb?` | mongoDB.MongoClient |
| `args.name?` | *string* |
| `args.tables?` | *string*[] |
| `args.url?` | *string* |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

Defined in: [mongodb.ts:42](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L42)

___

### openMongoDbInput

▸ **openMongoDbInput**(`args`: { `inputHost?`: *string* ; `inputMongodb?`: mongoDB.MongoClient ; `inputName?`: *string* ; `inputPassword?`: *string* ; `inputPort?`: *number* ; `inputTable?`: *string*[] ; `inputUser?`: *string*  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.inputHost?` | *string* |
| `args.inputMongodb?` | mongoDB.MongoClient |
| `args.inputName?` | *string* |
| `args.inputPassword?` | *string* |
| `args.inputPort?` | *number* |
| `args.inputTable?` | *string*[] |
| `args.inputUser?` | *string* |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

Defined in: [mongodb.ts:8](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L8)

___

### openMongoDbOutput

▸ **openMongoDbOutput**(`args`: { `outputHost?`: *string* ; `outputMongodb?`: mongoDB.MongoClient ; `outputName?`: *string* ; `outputPassword?`: *string* ; `outputPort?`: *number* ; `outputTable?`: *string*[] ; `outputUser?`: *string*  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.outputHost?` | *string* |
| `args.outputMongodb?` | mongoDB.MongoClient |
| `args.outputName?` | *string* |
| `args.outputPassword?` | *string* |
| `args.outputPort?` | *number* |
| `args.outputTable?` | *string*[] |
| `args.outputUser?` | *string* |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *MongoClient* ; `tables`: *Record*<string, Collection<Document\>\>  } \| { `close`: () => *Promise*<void\> ; `db`: *Db* ; `tables`: *Record*<string, Collection<Document\>\>  }\>

Defined in: [mongodb.ts:25](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L25)

___

### streamFromMongoDb

▸ **streamFromMongoDb**(`collection`: mongoDB.Collection, `args`: { `query?`: *string*  }): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | mongoDB.Collection |
| `args` | *object* |
| `args.query?` | *string* |

**Returns:** ReadableStreamTree

Defined in: [mongodb.ts:71](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L71)

___

### streamToMongoDb

▸ **streamToMongoDb**(`collection`: mongoDB.Collection, `options?`: { `batchSize?`: *number*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | mongoDB.Collection |
| `options?` | *object* |
| `options.batchSize?` | *number* |

**Returns:** WritableStreamTree

Defined in: [mongodb.ts:77](https://github.com/wholebuzz/dbcp/blob/master/src/mongodb.ts#L77)
