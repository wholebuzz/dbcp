[dbcp](../README.md) / [Exports](../modules.md) / util

# Module: util

## Table of contents

### Functions

- [findObjectProperty](util.md#findobjectproperty)
- [updateObjectProperties](util.md#updateobjectproperties)
- [updateObjectPropertiesAsync](util.md#updateobjectpropertiesasync)

## Functions

### findObjectProperty

▸ **findObjectProperty**<X\>(`x`: X[] \| *Record*<string, X\> \| *undefined* \| ``null``, `key`: *string* \| *number*): X \| *undefined*

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | X[] \| *Record*<string, X\> \| *undefined* \| ``null`` |
| `key` | *string* \| *number* |

**Returns:** X \| *undefined*

Defined in: [util.ts:3](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L3)

___

### updateObjectProperties

▸ **updateObjectProperties**<X\>(`x`: X[] \| *Record*<string, X\> \| *undefined* \| ``null``, `f`: (`x`: X, `key`: *string* \| *number*) => X): *undefined* \| X[] \| {}

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | X[] \| *Record*<string, X\> \| *undefined* \| ``null`` |
| `f` | (`x`: X, `key`: *string* \| *number*) => X |

**Returns:** *undefined* \| X[] \| {}

Defined in: [util.ts:12](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L12)

___

### updateObjectPropertiesAsync

▸ **updateObjectPropertiesAsync**<X\>(`x`: X[] \| *Record*<string, X\> \| *undefined* \| ``null``, `f`: (`x`: X, `key`: *string* \| *number*) => *Promise*<X\>, `options?`: { `concurrency?`: *number*  }): *Promise*<undefined \| X[] \| Record<string, X\>\>

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | X[] \| *Record*<string, X\> \| *undefined* \| ``null`` |
| `f` | (`x`: X, `key`: *string* \| *number*) => *Promise*<X\> |
| `options?` | *object* |
| `options.concurrency?` | *number* |

**Returns:** *Promise*<undefined \| X[] \| Record<string, X\>\>

Defined in: [util.ts:26](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L26)
