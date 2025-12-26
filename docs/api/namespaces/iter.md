[**iterflow API Reference v0.10.0**](../index.md) • **Docs**

***

# iter

## Functions

### zip()

```ts
function zip<T, U>(iter1, iter2): iterflow<[T, U]>
```

Combines two iterables into an iterator of tuples.
Stops when the shorter iterable is exhausted.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the first iterable |
| `U` | The type of elements in the second iterable |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iter1` | `Iterable`\<`T`, `any`, `any`\> | The first iterable |
| `iter2` | `Iterable`\<`U`, `any`, `any`\> | The second iterable |

#### Returns

[`iterflow`](../index.md#iterflowt)\<[`T`, `U`]\>

A new iterflow of tuples pairing elements from both iterables

#### Example

```typescript
iter.zip([1, 2, 3], ['a', 'b', 'c']).toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### Defined in

[src/index.ts:40](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L40)

***

### zipWith()

```ts
function zipWith<T, U, R>(
   iter1, 
   iter2, 
fn): iterflow<R>
```

Combines two iterables using a combining function.
Stops when the shorter iterable is exhausted.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the first iterable |
| `U` | The type of elements in the second iterable |
| `R` | The type of the result |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iter1` | `Iterable`\<`T`, `any`, `any`\> | The first iterable |
| `iter2` | `Iterable`\<`U`, `any`, `any`\> | The second iterable |
| `fn` | (`a`, `b`) => `R` | Function to combine elements from both iterables |

#### Returns

[`iterflow`](../index.md#iterflowt)\<`R`\>

A new iterflow with combined results

#### Example

```typescript
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b).toArray();
// [11, 22, 33]
```

#### Defined in

[src/index.ts:80](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L80)

***

### range()

#### range(stop)

```ts
function range(stop): iterflow<number>
```

Generates a sequence of numbers.
Supports three call signatures:
- range(stop): generates [0, stop) with step 1
- range(start, stop): generates [start, stop) with step 1
- range(start, stop, step): generates [start, stop) with custom step

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stop` | `number` | The end value (exclusive) when called with one argument |

##### Returns

[`iterflow`](../index.md#iterflowt)\<`number`\>

A new iterflow of numbers

##### Throws

If step is zero

##### Example

```typescript
iter.range(5).toArray(); // [0, 1, 2, 3, 4]
iter.range(2, 5).toArray(); // [2, 3, 4]
iter.range(0, 10, 2).toArray(); // [0, 2, 4, 6, 8]
iter.range(5, 0, -1).toArray(); // [5, 4, 3, 2, 1]
```

##### Defined in

[src/index.ts:106](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L106)

#### range(start, stop)

```ts
function range(start, stop): iterflow<number>
```

Generates a sequence of numbers from start to stop (exclusive).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The starting value (inclusive) |
| `stop` | `number` | The end value (exclusive) |

##### Returns

[`iterflow`](../index.md#iterflowt)\<`number`\>

A new iterflow of numbers

##### Defined in

[src/index.ts:114](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L114)

#### range(start, stop, step)

```ts
function range(
   start, 
   stop, 
step): iterflow<number>
```

Generates a sequence of numbers from start to stop (exclusive) with a custom step.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The starting value (inclusive) |
| `stop` | `number` | The end value (exclusive) |
| `step` | `number` | The increment between values |

##### Returns

[`iterflow`](../index.md#iterflowt)\<`number`\>

A new iterflow of numbers

##### Defined in

[src/index.ts:123](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L123)

***

### repeat()

```ts
function repeat<T>(value, times?): iterflow<T>
```

Repeats a value a specified number of times, or infinitely.
If times is not specified, creates an infinite iterator.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the value to repeat |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | The value to repeat |
| `times`? | `number` | Optional number of times to repeat (infinite if omitted) |

#### Returns

[`iterflow`](../index.md#iterflowt)\<`T`\>

A new iterflow repeating the value

#### Example

```typescript
iter.repeat('x', 3).toArray(); // ['x', 'x', 'x']
iter.repeat(0, 5).toArray(); // [0, 0, 0, 0, 0]
iter.repeat(1).take(3).toArray(); // [1, 1, 1] (infinite, limited by take)
```

#### Defined in

[src/index.ts:168](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L168)

***

### interleave()

```ts
function interleave<T>(...iterables): iterflow<T>
```

Alternates elements from multiple iterables in a round-robin fashion.
Continues until all iterables are exhausted.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | `Iterable`\<`T`, `any`, `any`\>[] | Variable number of iterables to interleave |

#### Returns

[`iterflow`](../index.md#iterflowt)\<`T`\>

A new iterflow with elements from all iterables interleaved

#### Example

```typescript
iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
// [1, 4, 2, 5, 3, 6]
iter.interleave([1, 2], [3, 4, 5], [6]).toArray();
// [1, 3, 6, 2, 4, 5]
```

#### Defined in

[src/index.ts:199](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L199)

***

### merge()

#### merge(iterables)

```ts
function merge<T>(...iterables): iterflow<T>
```

Merges multiple sorted iterables into a single sorted iterator.
Assumes input iterables are already sorted in ascending order.
Uses a custom comparator if provided, otherwise uses default < comparison.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`iterables` | `Iterable`\<`T`, `any`, `any`\>[] |

##### Returns

[`iterflow`](../index.md#iterflowt)\<`T`\>

A new iterflow with all elements merged in sorted order

##### Example

```typescript
iter.merge([1, 3, 5], [2, 4, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
iter.merge([1, 5, 9], [2, 6, 10], [3, 7, 11]).toArray();
// [1, 2, 3, 5, 6, 7, 9, 10, 11]
```

##### Defined in

[src/index.ts:238](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L238)

#### merge(compareFn, iterables)

```ts
function merge<T>(compareFn, ...iterables): iterflow<T>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `compareFn` | (`a`, `b`) => `number` |
| ...`iterables` | `Iterable`\<`T`, `any`, `any`\>[] |

##### Returns

[`iterflow`](../index.md#iterflowt)\<`T`\>

##### Defined in

[src/index.ts:239](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L239)

***

### chain()

```ts
function chain<T>(...iterables): iterflow<T>
```

Chains multiple iterables sequentially, one after another.
Yields all elements from the first iterable, then all from the second, etc.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | `Iterable`\<`T`, `any`, `any`\>[] | Variable number of iterables to chain |

#### Returns

[`iterflow`](../index.md#iterflowt)\<`T`\>

A new iterflow with all elements chained sequentially

#### Example

```typescript
iter.chain([1, 2], [3, 4], [5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
iter.chain([1], [2, 3], [], [4, 5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

#### Defined in

[src/index.ts:354](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L354)
