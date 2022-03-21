[dbcp](../README.md) / [Exports](../modules.md) / leveldb

# Module: leveldb

## Table of contents

### Variables

- [levelIteratorStream](leveldb.md#leveliteratorstream)

### Functions

- [openLevelDb](leveldb.md#openleveldb)
- [openLevelDbInput](leveldb.md#openleveldbinput)
- [openLevelDbOutput](leveldb.md#openleveldboutput)
- [streamFromLevelDb](leveldb.md#streamfromleveldb)
- [streamToLevelDb](leveldb.md#streamtoleveldb)

## Variables

### levelIteratorStream

• `Const` **levelIteratorStream**: *any*

Defined in: [leveldb.ts:8](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L8)

## Functions

### openLevelDb

▸ **openLevelDb**(`args`: { `extra?`: *Record*<string, any\> ; `file?`: *string* ; `level?`: level.LevelDB \| LevelUp ; `removeExisting?`: *boolean* ; `tables?`: *string*[]  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.extra?` | *Record*<string, any\> |
| `args.file?` | *string* |
| `args.level?` | level.LevelDB \| LevelUp |
| `args.removeExisting?` | *boolean* |
| `args.tables?` | *string*[] |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

Defined in: [leveldb.ts:40](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L40)

___

### openLevelDbInput

▸ **openLevelDbInput**(`args`: { `extra?`: *Record*<string, any\> ; `inputFile?`: *string* ; `inputLeveldb?`: level.LevelDB \| LevelUp ; `inputTable?`: *string*[]  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.extra?` | *Record*<string, any\> |
| `args.inputFile?` | *string* |
| `args.inputLeveldb?` | level.LevelDB \| LevelUp |
| `args.inputTable?` | *string*[] |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

Defined in: [leveldb.ts:10](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L10)

___

### openLevelDbOutput

▸ **openLevelDbOutput**(`args`: { `extra?`: *Record*<string, any\> ; `outputFile?`: *string* ; `outputLeveldb?`: level.LevelDB \| LevelUp ; `outputTable?`: *string*[] ; `removeExisting?`: *boolean*  }): *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.extra?` | *Record*<string, any\> |
| `args.outputFile?` | *string* |
| `args.outputLeveldb?` | level.LevelDB \| LevelUp |
| `args.outputTable?` | *string*[] |
| `args.removeExisting?` | *boolean* |

**Returns:** *Promise*<{ `close`: () => *Promise*<void\> ; `db`: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\> ; `tables`: *Record*<string, LevelUp<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>\>  }\>

Defined in: [leveldb.ts:24](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L24)

___

### streamFromLevelDb

▸ **streamFromLevelDb**(`leveldb`: level.LevelDB \| LevelUp): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `leveldb` | level.LevelDB \| LevelUp |

**Returns:** ReadableStreamTree

Defined in: [leveldb.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L76)

___

### streamToLevelDb

▸ **streamToLevelDb**(`leveldb`: level.LevelDB \| LevelUp, `args`: { `getKey`: (`item`: *any*) => *string*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `leveldb` | level.LevelDB \| LevelUp |
| `args` | *object* |
| `args.getKey` | (`item`: *any*) => *string* |

**Returns:** WritableStreamTree

Defined in: [leveldb.ts:81](https://github.com/wholebuzz/dbcp/blob/master/src/leveldb.ts#L81)
