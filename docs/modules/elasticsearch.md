[dbcp](../README.md) / [Exports](../modules.md) / elasticsearch

# Module: elasticsearch

## Table of contents

### Variables

- [batch2](elasticsearch.md#batch2)

### Functions

- [streamFromElasticSearch](elasticsearch.md#streamfromelasticsearch)
- [streamToElasticSearch](elasticsearch.md#streamtoelasticsearch)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [elasticsearch.ts:6](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L6)

## Functions

### streamFromElasticSearch

▸ **streamFromElasticSearch**(`client`: Client, `options`: { `batchSize?`: *number* ; `index`: *string* ; `orderBy?`: *string*[]  }): *Promise*<ReadableStreamTree\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | Client |
| `options` | *object* |
| `options.batchSize?` | *number* |
| `options.index` | *string* |
| `options.orderBy?` | *string*[] |

**Returns:** *Promise*<ReadableStreamTree\>

Defined in: [elasticsearch.ts:8](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L8)

___

### streamToElasticSearch

▸ **streamToElasticSearch**(`client`: Client, `options`: { `batchSize?`: *number* ; `bulkOptions?`: *any* ; `extra?`: *Record*<string, any\> ; `extraOutput?`: *boolean* ; `index`: *string*  }): WritableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | Client |
| `options` | *object* |
| `options.batchSize?` | *number* |
| `options.bulkOptions?` | *any* |
| `options.extra?` | *Record*<string, any\> |
| `options.extraOutput?` | *boolean* |
| `options.index` | *string* |

**Returns:** WritableStreamTree

Defined in: [elasticsearch.ts:82](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L82)
