[dbcp](../README.md) / [Exports](../modules.md) / elasticsearch

# Module: elasticsearch

## Table of contents

### Variables

- [batch2](elasticsearch.md#batch2)

### Functions

- [openElasticSearch](elasticsearch.md#openelasticsearch)
- [openElasticSearchInput](elasticsearch.md#openelasticsearchinput)
- [openElasticSearchOutput](elasticsearch.md#openelasticsearchoutput)
- [streamFromElasticSearch](elasticsearch.md#streamfromelasticsearch)
- [streamToElasticSearch](elasticsearch.md#streamtoelasticsearch)

## Variables

### batch2

• `Const` **batch2**: *any*

Defined in: [elasticsearch.ts:6](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L6)

## Functions

### openElasticSearch

▸ **openElasticSearch**(`args`: { `elasticSearch?`: Client ; `name?`: *string* ; `password?`: *string* ; `user?`: *string*  }): *Promise*<Client\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.elasticSearch?` | Client |
| `args.name?` | *string* |
| `args.password?` | *string* |
| `args.user?` | *string* |

**Returns:** *Promise*<Client\>

Defined in: [elasticsearch.ts:36](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L36)

___

### openElasticSearchInput

▸ **openElasticSearchInput**(`args`: { `inputElasticSearch?`: Client ; `inputName?`: *string* ; `inputPassword?`: *string* ; `inputUser?`: *string*  }): *Promise*<Client\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.inputElasticSearch?` | Client |
| `args.inputName?` | *string* |
| `args.inputPassword?` | *string* |
| `args.inputUser?` | *string* |

**Returns:** *Promise*<Client\>

Defined in: [elasticsearch.ts:8](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L8)

___

### openElasticSearchOutput

▸ **openElasticSearchOutput**(`args`: { `outputElasticSearch?`: Client ; `outputName?`: *string* ; `outputPassword?`: *string* ; `outputUser?`: *string*  }): *Promise*<Client\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.outputElasticSearch?` | Client |
| `args.outputName?` | *string* |
| `args.outputPassword?` | *string* |
| `args.outputUser?` | *string* |

**Returns:** *Promise*<Client\>

Defined in: [elasticsearch.ts:22](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L22)

___

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

Defined in: [elasticsearch.ts:54](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L54)

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

Defined in: [elasticsearch.ts:128](https://github.com/wholebuzz/dbcp/blob/master/src/elasticsearch.ts#L128)
