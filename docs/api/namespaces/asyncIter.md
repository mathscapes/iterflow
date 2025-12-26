[**iterflow API Reference v0.10.0**](../index.md) • **Docs**

***

# asyncIter

## Functions

### zip()

```ts
function zip<T, U>(iter1, iter2): Asynciterflow<[T, U]>
```

Combines two async iterables into an async iterator of tuples.
Stops when the shorter iterable is exhausted.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the first iterable |
| `U` | The type of elements in the second iterable |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iter1` | `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\> | The first async iterable |
| `iter2` | `AsyncIterable`\<`U`, `any`, `any`\> \| `Iterable`\<`U`, `any`, `any`\> | The second async iterable |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<[`T`, `U`]\>

A new async iterflow of tuples pairing elements from both iterables

#### Example

```typescript
await asyncIter.zip(asyncIter1, asyncIter2).toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### Defined in

[src/async-iter-flow.ts:2353](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2353)

***

### zipWith()

```ts
function zipWith<T, U, R>(
   iter1, 
   iter2, 
fn): Asynciterflow<R>
```

Combines two async iterables using a combining function.
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
| `iter1` | `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\> | The first async iterable |
| `iter2` | `AsyncIterable`\<`U`, `any`, `any`\> \| `Iterable`\<`U`, `any`, `any`\> | The second async iterable |
| `fn` | (`a`, `b`) => `R` \| `Promise`\<`R`\> | Async or sync function to combine elements |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`R`\>

A new async iterflow with combined results

#### Example

```typescript
await asyncIter.zipWith(asyncIter1, asyncIter2, async (a, b) => a + b).toArray();
// [11, 22, 33]
```

#### Defined in

[src/async-iter-flow.ts:2403](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2403)

***

### range()

#### range(stop)

```ts
function range(stop): Asynciterflow<number>
```

Generates an async sequence of numbers.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stop` | `number` | The end value (exclusive) |

##### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`number`\>

A new async iterflow of numbers

##### Example

```typescript
await asyncIter.range(5).toArray(); // [0, 1, 2, 3, 4]
```

##### Defined in

[src/async-iter-flow.ts:2421](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2421)

#### range(start, stop)

```ts
function range(start, stop): Asynciterflow<number>
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `start` | `number` |
| `stop` | `number` |

##### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`number`\>

##### Defined in

[src/async-iter-flow.ts:2422](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2422)

#### range(start, stop, step)

```ts
function range(
   start, 
   stop, 
step): Asynciterflow<number>
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `start` | `number` |
| `stop` | `number` |
| `step` | `number` |

##### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`number`\>

##### Defined in

[src/async-iter-flow.ts:2423](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2423)

***

### repeat()

```ts
function repeat<T>(value, times?): Asynciterflow<T>
```

Repeats a value a specified number of times, or infinitely.

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

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow repeating the value

#### Example

```typescript
await asyncIter.repeat('x', 3).toArray(); // ['x', 'x', 'x']
```

#### Defined in

[src/async-iter-flow.ts:2467](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2467)

***

### interleave()

```ts
function interleave<T>(...iterables): Asynciterflow<T>
```

Alternates elements from multiple async iterables in a round-robin fashion.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Variable number of async iterables to interleave |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow with elements from all iterables interleaved

#### Example

```typescript
await asyncIter.interleave(asyncIter1, asyncIter2).toArray();
// [1, 4, 2, 5, 3, 6]
```

#### Defined in

[src/async-iter-flow.ts:2495](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2495)

***

### merge()

#### merge(iterables)

```ts
function merge<T>(...iterables): Asynciterflow<T>
```

Merges multiple sorted async iterables into a single sorted async iterator.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Variable number of sorted async iterables to merge |

##### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow with all elements merged in sorted order

##### Example

```typescript
await asyncIter.merge(asyncIter1, asyncIter2).toArray();
// [1, 2, 3, 4, 5, 6]
```

##### Defined in

[src/async-iter-flow.ts:2539](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2539)

#### merge(compareFn, iterables)

```ts
function merge<T>(compareFn, ...iterables): Asynciterflow<T>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `compareFn` | (`a`, `b`) => `number` |
| ...`iterables` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] |

##### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

##### Defined in

[src/async-iter-flow.ts:2542](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2542)

***

### chain()

```ts
function chain<T>(...iterables): Asynciterflow<T>
```

Chains multiple async iterables sequentially, one after another.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in all iterables |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Variable number of async iterables to chain |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow with all elements chained sequentially

#### Example

```typescript
await asyncIter.chain(asyncIter1, asyncIter2).toArray();
// [1, 2, 3, 4, 5, 6]
```

#### Defined in

[src/async-iter-flow.ts:2661](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2661)

***

### fromGenerator()

```ts
function fromGenerator<T>(fn): Asynciterflow<T>
```

Creates an async iterator from a generator function.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements to generate |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | () => `AsyncGenerator`\<`T`, `any`, `any`\> | Async generator function |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow

#### Example

```typescript
const fibonacci = asyncIter.fromGenerator(async function* () {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
});
await fibonacci.take(10).toArray(); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

#### Defined in

[src/async-iter-flow.ts:2695](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2695)

***

### fromPromise()

```ts
function fromPromise<T>(promise): Asynciterflow<T>
```

Creates an async iterator from a promise.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the resolved value |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `promise` | `Promise`\<`T`\> | Promise to convert to async iterator |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow

#### Example

```typescript
await asyncIter.fromPromise(fetch('/api/data').then(r => r.json())).toArray();
```

#### Defined in

[src/async-iter-flow.ts:2712](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2712)

***

### fromPromises()

```ts
function fromPromises<T>(promises): Asynciterflow<T>
```

Creates an async iterator from an array of promises, yielding results as they resolve.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the resolved values |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `promises` | `Promise`\<`T`\>[] | Array of promises |

#### Returns

[`Asynciterflow`](../index.md#asynciterflowt)\<`T`\>

A new async iterflow

#### Example

```typescript
const promises = [fetch('/api/1'), fetch('/api/2'), fetch('/api/3')];
await asyncIter.fromPromises(promises).map(r => r.json()).toArray();
```

#### Defined in

[src/async-iter-flow.ts:2732](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2732)
