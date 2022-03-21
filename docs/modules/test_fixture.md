[dbcp](../README.md) / [Exports](../modules.md) / test.fixture

# Module: test.fixture

## Table of contents

### Functions

- [dbcpHashFile](test_fixture.md#dbcphashfile)
- [execCommand](test_fixture.md#execcommand)
- [expectCreateFileWithConvertHash](test_fixture.md#expectcreatefilewithconverthash)
- [expectCreateFileWithHash](test_fixture.md#expectcreatefilewithhash)
- [expectCreateFilesWithHashes](test_fixture.md#expectcreatefileswithhashes)
- [hashFile](test_fixture.md#hashfile)

## Functions

### dbcpHashFile

▸ **dbcpHashFile**(`fileSystem`: FileSystem, `path`: *string*): *Promise*<string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `path` | *string* |

**Returns:** *Promise*<string\>

Defined in: [test.fixture.ts:76](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L76)

___

### execCommand

▸ **execCommand**(`cmd`: *string*, `execOptions?`: *any*): *Promise*<string\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cmd` | *string* | - |
| `execOptions` | *any* | {} |

**Returns:** *Promise*<string\>

Defined in: [test.fixture.ts:87](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L87)

___

### expectCreateFileWithConvertHash

▸ **expectCreateFileWithConvertHash**(`fileSystem`: FileSystem, `targetUrl`: *string*, `convertToUrl`: *string*, `convertToHash`: *string*, `fn`: () => *Promise*<void\>, `convertToTransform?`: (`x`: *any*) => *any*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `targetUrl` | *string* |
| `convertToUrl` | *string* |
| `convertToHash` | *string* |
| `fn` | () => *Promise*<void\> |
| `convertToTransform` | (`x`: *any*) => *any* |

**Returns:** *Promise*<void\>

Defined in: [test.fixture.ts:10](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L10)

___

### expectCreateFileWithHash

▸ **expectCreateFileWithHash**(`fileSystem`: FileSystem, `fileUrl`: *string*, `fileHash`: *string* \| *undefined*, `fn`: () => *Promise*<void\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `fileUrl` | *string* |
| `fileHash` | *string* \| *undefined* |
| `fn` | () => *Promise*<void\> |

**Returns:** *Promise*<void\>

Defined in: [test.fixture.ts:57](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L57)

___

### expectCreateFilesWithHashes

▸ **expectCreateFilesWithHashes**(`fileSystem`: FileSystem, `fileUrl`: *string*[], `fileHash`: *string*[] \| *undefined*, `fn`: () => *Promise*<void\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `fileUrl` | *string*[] |
| `fileHash` | *string*[] \| *undefined* |
| `fn` | () => *Promise*<void\> |

**Returns:** *Promise*<void\>

Defined in: [test.fixture.ts:40](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L40)

___

### hashFile

▸ **hashFile**(`fileSystem`: FileSystem, `path`: *string*): *Promise*<string\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `path` | *string* |

**Returns:** *Promise*<string\>

Defined in: [test.fixture.ts:70](https://github.com/wholebuzz/dbcp/blob/master/src/test.fixture.ts#L70)
