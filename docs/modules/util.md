[dbcp](../README.md) / [Exports](../modules.md) / util

# Module: util

## Table of contents

### Functions

- [findObjectProperty](util.md#findobjectproperty)
- [rmrf](util.md#rmrf)
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

Defined in: [util.ts:7](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L7)

___

### rmrf

▸ `Const` **rmrf**(`arg1`: *string*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg1` | *string* |

**Returns:** *Promise*<void\>

Defined in: [util.ts:5](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L5)

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

Defined in: [util.ts:16](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L16)

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

Defined in: [util.ts:30](https://github.com/wholebuzz/dbcp/blob/master/src/util.ts#L30)
