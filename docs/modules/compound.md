[dbcp](../README.md) / [Exports](../modules.md) / compound

# Module: compound

## Table of contents

### Variables

- [batch2](compound.md#batch2)

### Functions

- [streamToKnexCompoundInsert](compound.md#streamtoknexcompoundinsert)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [compound.ts:6](https://github.com/wholebuzz/dbcp/blob/master/src/compound.ts#L6)

## Functions

### streamToKnexCompoundInsert

▸ **streamToKnexCompoundInsert**(`source`: { `knex?`: Knex ; `transaction?`: Knex.Transaction  }, `options`: { `batchSize?`: *number* ; `idField?`: *string* ; `idSuffix?`: *string*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | *object* |
| `source.knex?` | Knex |
| `source.transaction?` | Knex.Transaction |
| `options` | *object* |
| `options.batchSize?` | *number* |
| `options.idField?` | *string* |
| `options.idSuffix?` | *string* |

**Returns:** WritableStreamTree

Defined in: [compound.ts:8](https://github.com/wholebuzz/dbcp/blob/master/src/compound.ts#L8)
