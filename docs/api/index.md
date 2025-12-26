**iterflow API Reference v0.10.0** • **Docs**

***

# iterflow API Reference v0.10.0

## Classes

### Asynciterflow\<T\>

A fluent interface wrapper for working with async iterators and async iterables.
Provides chainable methods for transforming, filtering, and analyzing async data streams.

#### Example

```typescript
const result = await new Asynciterflow(asyncIterable)
  .filter(async x => x % 2 === 0)
  .map(async x => x * 2)
  .toArray(); // [4, 8]
```

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the async iterator |

#### Implements

- `AsyncIterable`\<`T`\>

#### Constructors

##### new Asynciterflow()

```ts
new Asynciterflow<T>(source): Asynciterflow<T>
```

Creates a new async iterflow instance from an async iterable or async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `AsyncIterable`\<`T`, `any`, `any`\> \| `AsyncIterator`\<`T`, `any`, `any`\> | The source async iterable or async iterator to wrap |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

###### Example

```typescript
const flow1 = new Asynciterflow(asyncIterable);
const flow2 = new Asynciterflow(asyncIterator);
```

###### Defined in

[src/async-iter-flow.ts:30](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L30)

#### Methods

##### \[asyncIterator\]()

```ts
asyncIterator: AsyncIterator<T, any, any>
```

Returns the async iterator for this iterflow instance.
This allows iterflow to be used in for await...of loops.

###### Returns

`AsyncIterator`\<`T`, `any`, `any`\>

The underlying async iterator

###### Implementation of

`AsyncIterable.[asyncIterator]`

###### Defined in

[src/async-iter-flow.ts:42](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L42)

##### next()

```ts
next(): Promise<IteratorResult<T, any>>
```

Retrieves the next value from the async iterator.

###### Returns

`Promise`\<`IteratorResult`\<`T`, `any`\>\>

A promise of an IteratorResult containing the next value or indicating completion

###### Defined in

[src/async-iter-flow.ts:51](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L51)

##### map()

```ts
map<U>(fn): Asynciterflow<U>
```

Transforms each element using the provided async or sync function.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the transformed elements |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `U` \| `Promise`\<`U`\> | Async or sync function to transform each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`U`\>

A new async iterflow with transformed elements

###### Example

```typescript
await asyncIter([1, 2, 3]).map(async x => x * 2).toArray(); // [2, 4, 6]
```

###### Defined in

[src/async-iter-flow.ts:67](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L67)

##### filter()

```ts
filter(predicate): Asynciterflow<T>
```

Filters elements based on an async or sync predicate function.
Only elements for which the predicate returns true are included.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with only elements that pass the predicate

###### Example

```typescript
await asyncIter([1, 2, 3, 4]).filter(async x => x % 2 === 0).toArray(); // [2, 4]
```

###### Defined in

[src/async-iter-flow.ts:89](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L89)

##### take()

```ts
take(limit): Asynciterflow<T>
```

Takes only the first `limit` elements from the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `limit` | `number` | Maximum number of elements to take |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with at most `limit` elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).take(3).toArray(); // [1, 2, 3]
```

###### Defined in

[src/async-iter-flow.ts:114](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L114)

##### drop()

```ts
drop(count): Asynciterflow<T>
```

Skips the first `count` elements from the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `count` | `number` | Number of elements to skip |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow without the first `count` elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).drop(2).toArray(); // [3, 4, 5]
```

###### Defined in

[src/async-iter-flow.ts:138](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L138)

##### limit()

```ts
limit(maxIterations): Asynciterflow<T>
```

Limits the maximum number of iterations to prevent infinite loops.
Unlike `take()` which silently stops at the limit, this method throws
an OperationError if the limit is exceeded, making infinite loops explicit.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `maxIterations` | `number` | Maximum number of iterations allowed (must be at least 1) |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow that will throw if limit is exceeded

###### Throws

If maxIterations is not a positive integer

###### Throws

If iteration count exceeds maxIterations

###### Example

```typescript
// Safely process potentially infinite async iterator
await asyncIter.range(Infinity).limit(1000).toArray(); // Throws after 1000 iterations

// Regular finite iterator works normally
await asyncIter([1, 2, 3]).limit(10).toArray(); // [1, 2, 3]
```

###### Defined in

[src/async-iter-flow.ts:172](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L172)

##### flatMap()

```ts
flatMap<U>(fn): Asynciterflow<U>
```

Maps each element to an async iterable and flattens the results.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of elements in the resulting iterator |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `AsyncIterable`\<`U`, `any`, `any`\> \| `Iterable`\<`U`, `any`, `any`\> \| `Promise`\<`AsyncIterable`\<`U`, `any`, `any`\> \| `Iterable`\<`U`, `any`, `any`\>\> | Async or sync function that maps each element to an async iterable |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`U`\>

A new async iterflow with all mapped iterables flattened

###### Example

```typescript
await asyncIter([1, 2, 3]).flatMap(async x => [x, x * 2]).toArray(); // [1, 2, 2, 4, 3, 6]
```

###### Defined in

[src/async-iter-flow.ts:206](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L206)

##### concat()

```ts
concat(...iterables): Asynciterflow<T>
```

Concatenates multiple async iterators sequentially.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Additional async iterables to concatenate |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with all elements from all iterables

###### Example

```typescript
await asyncIter([1, 2]).concat([3, 4], [5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

###### Defined in

[src/async-iter-flow.ts:240](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L240)

##### intersperse()

```ts
intersperse(separator): Asynciterflow<T>
```

Inserts a separator element between each item.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `separator` | `T` | The element to insert between items |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with separators interspersed

###### Example

```typescript
await asyncIter([1, 2, 3]).intersperse(0).toArray();
// [1, 0, 2, 0, 3]
```

###### Defined in

[src/async-iter-flow.ts:269](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L269)

##### scan()

```ts
scan<U>(fn, initial): Asynciterflow<U>
```

Like reduce, but emits all intermediate accumulator values.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the accumulated value |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`accumulator`, `value`) => `U` \| `Promise`\<`U`\> | Async or sync function to combine the accumulator with each element |
| `initial` | `U` | The initial value for the accumulator |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`U`\>

A new async iterflow of intermediate accumulator values

###### Example

```typescript
await asyncIter([1, 2, 3, 4]).scan((acc, x) => acc + x, 0).toArray();
// [0, 1, 3, 6, 10]
```

###### Defined in

[src/async-iter-flow.ts:298](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L298)

##### enumerate()

```ts
enumerate(): Asynciterflow<[number, T]>
```

Adds index as tuple with each element [index, value].

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<[`number`, `T`]\>

A new async iterflow of tuples containing [index, value]

###### Example

```typescript
await asyncIter(['a', 'b', 'c']).enumerate().toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

###### Defined in

[src/async-iter-flow.ts:325](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L325)

##### reverse()

```ts
reverse(): Asynciterflow<T>
```

Reverses the async iterator order.
Warning: This operation buffers all elements in memory.

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with elements in reverse order

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).reverse().toArray();
// [5, 4, 3, 2, 1]
```

###### Defined in

[src/async-iter-flow.ts:349](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L349)

##### sort()

```ts
sort(this): Asynciterflow<string | number>
```

Sorts elements using default comparison.
Warning: This operation buffers all elements in memory.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`string` \| `number`\> | async iterflow instance constrained to numbers or strings |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`string` \| `number`\>

A new async iterflow with elements sorted

###### Example

```typescript
await asyncIter([3, 1, 4, 1, 5]).sort().toArray();
// [1, 1, 3, 4, 5]
```

###### Defined in

[src/async-iter-flow.ts:373](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L373)

##### sortBy()

```ts
sortBy(compareFn): Asynciterflow<T>
```

Sorts elements using a custom comparison function.
Warning: This operation buffers all elements in memory.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `compareFn` | (`a`, `b`) => `number` | Function that compares two elements |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with elements sorted

###### Example

```typescript
await asyncIter([3, 1, 4, 1, 5]).sortBy((a, b) => a - b).toArray();
// [1, 1, 3, 4, 5]
```

###### Defined in

[src/async-iter-flow.ts:401](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L401)

##### toArray()

```ts
toArray(maxSize?): Promise<T[]>
```

Collects all elements into an array.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `maxSize`? | `number` | Optional maximum array size. If provided and the iterator produces more elements, collection stops at maxSize (no error thrown). This is useful for safely collecting from potentially large iterators. |

###### Returns

`Promise`\<`T`[]\>

Promise of array containing all elements (up to maxSize if specified)

###### Throws

If maxSize is provided but not a positive integer

###### Example

```typescript
await asyncIter([1, 2, 3]).map(async x => x * 2).toArray(); // [2, 4, 6]

// Safely collect from large async iterator
await asyncIter(infiniteStream).toArray(1000); // First 1000 items
```

###### Defined in

[src/async-iter-flow.ts:430](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L430)

##### count()

```ts
count(): Promise<number>
```

Counts the total number of elements in the async iterator.
This is a terminal operation that consumes the async iterator.

###### Returns

`Promise`\<`number`\>

A promise of the total count of elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).count(); // 5
```

###### Defined in

[src/async-iter-flow.ts:456](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L456)

##### forEach()

```ts
forEach(fn): Promise<void>
```

Executes a function for each element.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `void` \| `Promise`\<`void`\> | Async or sync function to execute for each element |

###### Returns

`Promise`\<`void`\>

A promise that resolves when all elements have been processed

###### Example

```typescript
await asyncIter([1, 2, 3]).forEach(async x => console.log(x));
```

###### Defined in

[src/async-iter-flow.ts:475](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L475)

##### sum()

```ts
sum(this): Promise<number>
```

Calculates the sum of all numeric elements.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`number`\>

A promise of the sum of all elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).sum(); // 15
```

###### Defined in

[src/async-iter-flow.ts:493](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L493)

##### mean()

```ts
mean(this): Promise<undefined | number>
```

Calculates the arithmetic mean (average) of all numeric elements.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the mean value, or undefined if empty

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).mean(); // 3
```

###### Defined in

[src/async-iter-flow.ts:512](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L512)

##### min()

```ts
min(this): Promise<undefined | number>
```

Finds the minimum value among all numeric elements.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the minimum value, or undefined if empty

###### Example

```typescript
await asyncIter([3, 1, 4, 1, 5]).min(); // 1
```

###### Defined in

[src/async-iter-flow.ts:533](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L533)

##### max()

```ts
max(this): Promise<undefined | number>
```

Finds the maximum value among all numeric elements.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the maximum value, or undefined if empty

###### Example

```typescript
await asyncIter([3, 1, 4, 1, 5]).max(); // 5
```

###### Defined in

[src/async-iter-flow.ts:554](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L554)

##### median()

```ts
median(this): Promise<undefined | number>
```

Calculates the median value of all numeric elements.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
for sorting. For large datasets, consider using streaming alternatives or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the median value, or undefined if empty

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([1, 2, 3, 4, 5]).median(); // 3

// SAFE: Limit data before median
await asyncIter(largeAsyncDataset).take(1000).median();

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).median(); // Materializes all records!

// SAFE: Process in chunks
await asyncIter(largeAsyncDataset)
  .chunk(1000)
  .map(async chunk => await asyncIter(chunk).median())
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:591](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L591)

##### variance()

```ts
variance(this): Promise<undefined | number>
```

Calculates the variance of all numeric elements.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
to calculate variance. For large datasets, consider using streaming variance algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the variance, or undefined if empty

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([1, 2, 3, 4, 5]).variance(); // 2

// SAFE: Limit data before variance
await asyncIter(largeAsyncDataset).take(10000).variance();

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).variance(); // Materializes all records!

// SAFE: Process in windows
await asyncIter(largeAsyncDataset)
  .window(1000)
  .map(async window => await asyncIter(window).variance())
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:633](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L633)

##### stdDev()

```ts
stdDev(this): Promise<undefined | number>
```

Calculates the standard deviation of all numeric elements.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
via variance calculation. For large datasets, consider using streaming algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the standard deviation, or undefined if empty

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([2, 4, 4, 4, 5, 5, 7, 9]).stdDev(); // ~2

// SAFE: Limit data before stdDev
await asyncIter(largeAsyncDataset).take(10000).stdDev();

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).stdDev(); // Materializes all records!

// SAFE: Process in chunks
await asyncIter(largeAsyncDataset)
  .chunk(1000)
  .map(async chunk => await asyncIter(chunk).stdDev())
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:677](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L677)

##### percentile()

```ts
percentile(this, p): Promise<undefined | number>
```

Calculates the specified percentile of all numeric elements.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
for sorting. For large datasets, consider using approximate percentile algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |
| `p` | `number` | The percentile to calculate (0-100) |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the percentile value, or undefined if empty

###### Throws

If p is not between 0 and 100

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([1, 2, 3, 4, 5]).percentile(50); // 3

// SAFE: Limit data before percentile
await asyncIter(largeAsyncDataset).take(10000).percentile(95);

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).percentile(99); // Materializes all records!

// SAFE: Sample for approximate percentile
await asyncIter(largeAsyncDataset)
  .filter(async () => Math.random() < 0.01) // 1% sample
  .percentile(95);
```

###### Defined in

[src/async-iter-flow.ts:711](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L711)

##### mode()

```ts
mode(this): Promise<undefined | number[]>
```

Finds the most frequent value(s) in the dataset.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
to count frequencies. For large datasets with many unique values, memory usage can be significant.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`[]\>

A promise of an array of the most frequent value(s), or undefined if empty

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([1, 2, 2, 3, 3, 3]).mode(); // [3]

// SAFE: Limit data before mode
await asyncIter(largeAsyncDataset).take(10000).mode();

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).mode(); // Materializes all records!

// SAFE: Process in chunks
await asyncIter(largeAsyncDataset)
  .chunk(1000)
  .map(async chunk => await asyncIter(chunk).mode())
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:764](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L764)

##### quartiles()

```ts
quartiles(this): Promise<undefined | object>
```

Calculates the quartiles (Q1, Q2, Q3) of all numeric elements.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
for sorting and percentile calculation. For large datasets, consider using streaming
quantile algorithms or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `object`\>

A promise of an object with Q1, Q2, and Q3 values, or undefined if empty

###### Example

```typescript
// SAFE: Small dataset
await asyncIter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }

// SAFE: Limit data before quartiles
await asyncIter(largeAsyncDataset).take(10000).quartiles();

// UNSAFE: Large dataset may cause memory issues
await asyncIter(millionRecords).quartiles(); // Materializes all records!

// SAFE: Sample for approximate quartiles
await asyncIter(largeAsyncDataset)
  .filter(async () => Math.random() < 0.01) // 1% sample
  .quartiles();
```

###### Defined in

[src/async-iter-flow.ts:815](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L815)

##### span()

```ts
span(this): Promise<undefined | number>
```

Calculates the span (range from minimum to maximum value).
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the span (max - min), or undefined if empty

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).span(); // 4
```

###### Defined in

[src/async-iter-flow.ts:857](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L857)

##### product()

```ts
product(this): Promise<number>
```

Calculates the product of all numeric elements.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |

###### Returns

`Promise`\<`number`\>

A promise of the product of all elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).product(); // 120
```

###### Defined in

[src/async-iter-flow.ts:886](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L886)

##### covariance()

```ts
covariance(this, other): Promise<undefined | number>
```

Calculates the covariance between two numeric sequences.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes both async iterators into memory
to calculate covariance. For large datasets, this doubles memory usage.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |
| `other` | `AsyncIterable`\<`number`, `any`, `any`\> \| `Iterable`\<`number`, `any`, `any`\> | An async iterable of numbers to compare with |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the covariance, or undefined if sequences are empty or have different lengths

###### Example

```typescript
// SAFE: Small datasets
await asyncIter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]); // 4

// SAFE: Limit both sequences
await asyncIter(largeAsyncDataset1).take(10000).covariance(
  await asyncIter(largeAsyncDataset2).take(10000).toArray()
);

// UNSAFE: Large datasets may cause memory issues
await asyncIter(millionRecords1).covariance(millionRecords2); // Materializes both!

// SAFE: Process in windows
await asyncIter(largeAsyncDataset1)
  .window(1000)
  .map(async (window, i) =>
    await asyncIter(window).covariance(
      await asyncIter(largeAsyncDataset2).drop(i * 1000).take(1000).toArray()
    )
  )
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:928](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L928)

##### correlation()

```ts
correlation(this, other): Promise<undefined | number>
```

Calculates the Pearson correlation coefficient between two numeric sequences.
This is a terminal operation that consumes the async iterator.

WARNING - Memory Intensive: This operation eagerly materializes both async iterators into memory
to calculate correlation. For large datasets, this doubles memory usage.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`Asynciterflow`](index.md#asynciterflowt)\<`number`\> | async iterflow instance constrained to numbers |
| `other` | `AsyncIterable`\<`number`, `any`, `any`\> \| `Iterable`\<`number`, `any`, `any`\> | An async iterable of numbers to compare with |

###### Returns

`Promise`\<`undefined` \| `number`\>

A promise of the correlation coefficient, or undefined if sequences are empty or have different lengths

###### Example

```typescript
// SAFE: Small datasets
await asyncIter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1

// SAFE: Limit both sequences
await asyncIter(largeAsyncDataset1).take(10000).correlation(
  await asyncIter(largeAsyncDataset2).take(10000).toArray()
);

// UNSAFE: Large datasets may cause memory issues
await asyncIter(millionRecords1).correlation(millionRecords2); // Materializes both!

// SAFE: Sample for approximate correlation
await asyncIter(largeAsyncDataset1)
  .filter(async () => Math.random() < 0.01)
  .correlation(
    await asyncIter(largeAsyncDataset2)
      .filter(async () => Math.random() < 0.01)
      .toArray()
  );
```

###### Defined in

[src/async-iter-flow.ts:997](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L997)

##### window()

```ts
window(size): Asynciterflow<T[]>
```

Creates a sliding window of the specified size over the elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | The size of each window |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`[]\>

A new async iterflow of arrays, each containing `size` consecutive elements

###### Throws

If size is less than 1

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).window(3).toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

###### Defined in

[src/async-iter-flow.ts:1060](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1060)

##### chunk()

```ts
chunk(size): Asynciterflow<T[]>
```

Splits elements into chunks of the specified size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | The size of each chunk |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`[]\>

A new async iterflow of arrays, each containing up to `size` elements

###### Throws

If size is less than 1

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).chunk(2).toArray();
// [[1, 2], [3, 4], [5]]
```

###### Defined in

[src/async-iter-flow.ts:1101](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1101)

##### pairwise()

```ts
pairwise(): Asynciterflow<[T, T]>
```

Creates pairs of consecutive elements.

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<[`T`, `T`]\>

A new async iterflow of tuples, each containing two consecutive elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4]).pairwise().toArray();
// [[1, 2], [2, 3], [3, 4]]
```

###### Defined in

[src/async-iter-flow.ts:1139](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1139)

##### distinct()

```ts
distinct(): Asynciterflow<T>
```

Removes duplicate elements, keeping only the first occurrence.

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with duplicate elements removed

###### Example

```typescript
await asyncIter([1, 2, 2, 3, 1, 4]).distinct().toArray();
// [1, 2, 3, 4]
```

###### Defined in

[src/async-iter-flow.ts:1154](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1154)

##### distinctBy()

```ts
distinctBy<K>(keyFn): Asynciterflow<T>
```

Removes duplicate elements based on a key function.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `K` | The type of the key used for comparison |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keyFn` | (`value`) => `K` \| `Promise`\<`K`\> | Async or sync function to extract the comparison key |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with duplicate elements (by key) removed

###### Example

```typescript
const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
await asyncIter(users).distinctBy(async u => u.id).toArray();
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

###### Defined in

[src/async-iter-flow.ts:1183](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1183)

##### tap()

```ts
tap(fn): Asynciterflow<T>
```

Executes a side-effect function on each element without modifying the stream.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `void` \| `Promise`\<`void`\> | Async or sync function to execute for each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with the same elements

###### Example

```typescript
await asyncIter([1, 2, 3])
  .tap(async x => console.log('Processing:', x))
  .map(async x => x * 2)
  .toArray(); // logs each value, returns [2, 4, 6]
```

###### Defined in

[src/async-iter-flow.ts:1214](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1214)

##### takeWhile()

```ts
takeWhile(predicate): Asynciterflow<T>
```

Takes elements while the predicate returns true, then stops.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with elements up to the first failing predicate

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 1, 2]).takeWhile(async x => x < 4).toArray();
// [1, 2, 3]
```

###### Defined in

[src/async-iter-flow.ts:1237](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1237)

##### dropWhile()

```ts
dropWhile(predicate): Asynciterflow<T>
```

Skips elements while the predicate returns true, then yields all remaining.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow starting from the first element that fails the predicate

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 1, 2]).dropWhile(async x => x < 3).toArray();
// [3, 4, 1, 2]
```

###### Defined in

[src/async-iter-flow.ts:1262](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1262)

##### partition()

```ts
partition(predicate): Promise<[T[], T[]]>
```

Splits elements into two arrays based on a predicate.
This is a terminal operation that consumes the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

`Promise`\<[`T`[], `T`[]]\>

A promise of a tuple of two arrays

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).partition(async x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

###### Defined in

[src/async-iter-flow.ts:1293](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1293)

##### groupBy()

```ts
groupBy<K>(keyFn): Promise<Map<K, T[]>>
```

Groups elements by a key function into a Map.
This is a terminal operation that consumes the async iterator.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `K` | The type of the grouping key |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keyFn` | (`value`) => `K` \| `Promise`\<`K`\> | Async or sync function to extract the grouping key |

###### Returns

`Promise`\<`Map`\<`K`, `T`[]\>\>

A promise of a Map where keys are the result of keyFn and values are arrays of elements

###### Example

```typescript
await asyncIter(['alice', 'bob', 'charlie', 'dave'])
  .groupBy(async name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
```

###### Defined in

[src/async-iter-flow.ts:1324](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1324)

##### reduce()

```ts
reduce<U>(fn, initial): Promise<U>
```

Reduces the async iterator to a single value using an accumulator function.
This is a terminal operation that consumes the async iterator.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the accumulated value |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`accumulator`, `value`) => `U` \| `Promise`\<`U`\> | Async or sync function to combine the accumulator with each element |
| `initial` | `U` | The initial value for the accumulator |

###### Returns

`Promise`\<`U`\>

A promise of the final accumulated value

###### Example

```typescript
await asyncIter([1, 2, 3, 4]).reduce(async (acc, x) => acc + x, 0); // 10
```

###### Defined in

[src/async-iter-flow.ts:1352](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1352)

##### find()

```ts
find(predicate): Promise<undefined | T>
```

Finds the first element that matches the predicate.
This is a terminal operation that may consume part of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

`Promise`\<`undefined` \| `T`\>

A promise of the first matching element, or undefined if none found

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).find(async x => x > 3); // 4
```

###### Defined in

[src/async-iter-flow.ts:1374](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1374)

##### findIndex()

```ts
findIndex(predicate): Promise<number>
```

Finds the index of the first element that matches the predicate.
This is a terminal operation that may consume part of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

`Promise`\<`number`\>

A promise of the index of the first matching element, or -1 if none found

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).findIndex(async x => x > 3); // 3
```

###### Defined in

[src/async-iter-flow.ts:1396](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1396)

##### some()

```ts
some(predicate): Promise<boolean>
```

Tests whether at least one element matches the predicate.
This is a terminal operation that may consume part of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

`Promise`\<`boolean`\>

A promise of true if any element matches, false otherwise

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).some(async x => x > 3); // true
```

###### Defined in

[src/async-iter-flow.ts:1420](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1420)

##### every()

```ts
every(predicate): Promise<boolean>
```

Tests whether all elements match the predicate.
This is a terminal operation that may consume part or all of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` \| `Promise`\<`boolean`\> | Async or sync function to test each element |

###### Returns

`Promise`\<`boolean`\>

A promise of true if all elements match, false otherwise

###### Example

```typescript
await asyncIter([2, 4, 6]).every(async x => x % 2 === 0); // true
```

###### Defined in

[src/async-iter-flow.ts:1442](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1442)

##### first()

```ts
first(defaultValue?): Promise<undefined | T>
```

Gets the first element from the async iterator.
This is a terminal operation that consumes the first element.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defaultValue`? | `T` | Optional default value to return if iterator is empty |

###### Returns

`Promise`\<`undefined` \| `T`\>

A promise of the first element, the default value, or undefined if empty and no default

###### Example

```typescript
await asyncIter([1, 2, 3]).first(); // 1
```

###### Defined in

[src/async-iter-flow.ts:1464](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1464)

##### last()

```ts
last(defaultValue?): Promise<undefined | T>
```

Gets the last element from the async iterator.
This is a terminal operation that consumes the entire async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defaultValue`? | `T` | Optional default value to return if iterator is empty |

###### Returns

`Promise`\<`undefined` \| `T`\>

A promise of the last element, the default value, or undefined if empty and no default

###### Example

```typescript
await asyncIter([1, 2, 3]).last(); // 3
```

###### Defined in

[src/async-iter-flow.ts:1480](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1480)

##### nth()

```ts
nth(index): Promise<undefined | T>
```

Gets the element at the specified index.
This is a terminal operation that may consume part of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Zero-based index of the element to retrieve |

###### Returns

`Promise`\<`undefined` \| `T`\>

A promise of the element at the index, or undefined if index is out of bounds

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).nth(2); // 3
```

###### Defined in

[src/async-iter-flow.ts:1501](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1501)

##### isEmpty()

```ts
isEmpty(): Promise<boolean>
```

Checks if the async iterator is empty.
This is a terminal operation that may consume the first element.

###### Returns

`Promise`\<`boolean`\>

A promise of true if the iterator has no elements, false otherwise

###### Example

```typescript
await asyncIter([]).isEmpty(); // true
```

###### Defined in

[src/async-iter-flow.ts:1525](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1525)

##### includes()

```ts
includes(searchValue): Promise<boolean>
```

Checks if the async iterator includes a specific value.
This is a terminal operation that may consume part or all of the async iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `searchValue` | `T` | The value to search for |

###### Returns

`Promise`\<`boolean`\>

A promise of true if the value is found, false otherwise

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).includes(3); // true
```

###### Defined in

[src/async-iter-flow.ts:1541](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1541)

##### mapParallel()

```ts
mapParallel<U>(fn, concurrency): Asynciterflow<U>
```

Maps elements in parallel with a concurrency limit.
Processes multiple elements simultaneously while respecting the concurrency limit.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the transformed elements |

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `fn` | (`value`) => `Promise`\<`U`\> | `undefined` | Async function to transform each element |
| `concurrency` | `number` | `10` | Maximum number of concurrent operations (default: 10) |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`U`\>

A new async iterflow with transformed elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5])
  .mapParallel(async x => {
    await sleep(100);
    return x * 2;
  }, 3)
  .toArray(); // Processes 3 items at a time
```

###### Defined in

[src/async-iter-flow.ts:1569](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1569)

##### filterParallel()

```ts
filterParallel(predicate, concurrency): Asynciterflow<T>
```

Filters elements in parallel with a concurrency limit.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `predicate` | (`value`) => `Promise`\<`boolean`\> | `undefined` | Async function to test each element |
| `concurrency` | `number` | `10` | Maximum number of concurrent operations (default: 10) |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with only elements that pass the predicate

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5])
  .filterParallel(async x => {
    await sleep(100);
    return x % 2 === 0;
  }, 3)
  .toArray(); // [2, 4]
```

###### Defined in

[src/async-iter-flow.ts:1645](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1645)

##### flatMapParallel()

```ts
flatMapParallel<U>(fn, concurrency): Asynciterflow<U>
```

FlatMaps elements in parallel with a concurrency limit.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of elements in the resulting iterator |

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `fn` | (`value`) => `Promise`\<`AsyncIterable`\<`U`, `any`, `any`\> \| `Iterable`\<`U`, `any`, `any`\>\> | `undefined` | Async function that maps each element to an async iterable |
| `concurrency` | `number` | `10` | Maximum number of concurrent operations (default: 10) |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`U`\>

A new async iterflow with all mapped iterables flattened

###### Example

```typescript
await asyncIter([1, 2, 3])
  .flatMapParallel(async x => [x, x * 2], 2)
  .toArray(); // [1, 2, 2, 4, 3, 6]
```

###### Defined in

[src/async-iter-flow.ts:1734](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1734)

##### buffer()

```ts
buffer(size): Asynciterflow<T[]>
```

Buffers elements up to a specified size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | Maximum buffer size |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`[]\>

A new async iterflow with buffered elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).buffer(2).toArray();
// [[1, 2], [3, 4], [5]]
```

###### Defined in

[src/async-iter-flow.ts:1818](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1818)

##### throttle()

```ts
throttle(intervalMs): Asynciterflow<T>
```

Throttles the stream to emit at most one value per time interval.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `intervalMs` | `number` | Minimum time between emissions in milliseconds |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with throttled elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).throttle(100).toArray();
// Emits one value every 100ms
```

###### Defined in

[src/async-iter-flow.ts:1833](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1833)

##### debounce()

```ts
debounce(waitMs): Asynciterflow<T>
```

Debounces the stream, only emitting values after a period of silence.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `waitMs` | `number` | Time to wait for silence in milliseconds |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with debounced elements

###### Example

```typescript
await asyncIter([1, 2, 3, 4, 5]).debounce(100).toArray();
// Only emits values after 100ms of no new values
```

###### Defined in

[src/async-iter-flow.ts:1867](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1867)

##### catchError()

```ts
catchError(handler): Asynciterflow<T>
```

Catches errors and continues with a fallback value or stream.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handler` | (`error`) => `T` \| `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\> \| `Promise`\<`T` \| `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>\> | Function to handle errors and return a fallback value or async iterable |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with error handling

###### Example

```typescript
await asyncIter([1, 2, 3])
  .map(async x => {
    if (x === 2) throw new Error('Error!');
    return x;
  })
  .catchError(async (error) => [-1])
  .toArray(); // [1, -1, 3]
```

###### Defined in

[src/async-iter-flow.ts:1915](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1915)

##### retry()

```ts
retry(maxRetries, delayMs): Asynciterflow<T>
```

Retries failed operations a specified number of times.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `maxRetries` | `number` | `undefined` | Maximum number of retry attempts |
| `delayMs` | `number` | `0` | Optional delay between retries in milliseconds |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with retry logic

###### Example

```typescript
await asyncIter([1, 2, 3])
  .map(async x => {
    if (Math.random() > 0.5) throw new Error('Random error');
    return x;
  })
  .retry(3, 100)
  .toArray(); // Retries up to 3 times with 100ms delay
```

###### Defined in

[src/async-iter-flow.ts:1968](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L1968)

##### onError()

```ts
onError(handler): Asynciterflow<T>
```

Handles errors for each element individually.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handler` | (`error`, `value`?) => `void` \| `Promise`\<`void`\> | Async or sync function to handle errors for each element |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with error handling

###### Example

```typescript
await asyncIter([1, 2, 3])
  .map(async x => {
    if (x === 2) throw new Error('Error!');
    return x;
  })
  .onError(async (error, value) => console.error('Error:', error))
  .toArray(); // [1, 3] (2 is skipped)
```

###### Defined in

[src/async-iter-flow.ts:2013](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2013)

##### timeout()

```ts
timeout(ms): Asynciterflow<T>
```

Adds a timeout to async iteration operations.
If any single iteration (next() call) takes longer than the specified timeout,
a TimeoutError is thrown. Each iteration gets its own timeout window.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ms` | `number` | Timeout duration in milliseconds (must be positive) |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with timeout protection

###### Throws

If ms is not a positive number

###### Throws

If any iteration exceeds the timeout

###### Example

```typescript
// Protect against slow async operations
await asyncIter([1, 2, 3])
  .map(async x => {
    await slowOperation(x); // Each must complete within 5000ms
    return x;
  })
  .timeout(5000)
  .toArray();
```

###### Defined in

[src/async-iter-flow.ts:2052](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2052)

##### withSignal()

```ts
withSignal(signal): Asynciterflow<T>
```

Adds AbortSignal support to the async iteration.
If the signal is aborted, iteration stops immediately with an AbortError.
Checks the signal before each iteration and listens for abort events.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `signal` | `AbortSignal` | AbortSignal to control iteration cancellation |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with abort support

###### Throws

If the signal is aborted

###### Example

```typescript
const controller = new AbortController();

// Cancel after 5 seconds
setTimeout(() => controller.abort('Timeout reached'), 5000);

try {
  await asyncIter(largeDataset)
    .withSignal(controller.signal)
    .map(processItem)
    .toArray();
} catch (error) {
  if (error instanceof AbortError) {
    console.log('Operation cancelled:', error.reason);
  }
}
```

###### Defined in

[src/async-iter-flow.ts:2105](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2105)

##### interleave()

```ts
interleave(...others): Asynciterflow<T>
```

Interleaves elements from this async iterator with elements from other async/sync iterables.
Takes one element from each iterable in round-robin fashion.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`others` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Variable number of async/sync iterables to interleave with |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with elements from all iterables interleaved

###### Example

```typescript
await asyncIter([1, 2, 3]).interleave([4, 5, 6]).toArray(); // [1, 4, 2, 5, 3, 6]
```

###### Defined in

[src/async-iter-flow.ts:2165](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2165)

##### merge()

```ts
merge(...others): Asynciterflow<T>
```

Merges this async iterator with other sorted async/sync iterables into a single sorted async iterator.
Assumes all input iterables are already sorted in ascending order.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`others` | (`AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\>)[] | Variable number of sorted async/sync iterables to merge with |

###### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow with all elements merged in sorted order

###### Example

```typescript
await asyncIter([1, 3, 5]).merge([2, 4, 6]).toArray(); // [1, 2, 3, 4, 5, 6]
```

###### Defined in

[src/async-iter-flow.ts:2208](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2208)

***

### iterflowError

Base error class for all iterflow errors

Provides a foundation for all library-specific errors with additional context
including the operation name and custom metadata for debugging.

#### Example

```typescript
throw new iterflowError(
  "Invalid configuration",
  "setupStream",
  { config: { timeout: -1 } }
);
```

#### Extends

- `Error`

#### Extended by

- [`ValidationError`](index.md#validationerror)
- [`OperationError`](index.md#operationerror)
- [`EmptySequenceError`](index.md#emptysequenceerror)
- [`IndexOutOfBoundsError`](index.md#indexoutofboundserror)
- [`TypeConversionError`](index.md#typeconversionerror)
- [`TimeoutError`](index.md#timeouterror)
- [`AbortError`](index.md#aborterror)

#### Constructors

##### new iterflowError()

```ts
new iterflowError(
   message, 
   operation?, 
   context?): iterflowError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `operation`? | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`iterflowError`](index.md#iterflowerror)

###### Overrides

`Error.constructor`

###### Defined in

[src/errors.ts:25](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L25)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `Error.stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | `Error.cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | `Error.name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | `Error.message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | `Error.stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | - | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | - | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

`Error.prepareStackTrace`

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### ValidationError

Error thrown when operation parameters are invalid

Indicates that input validation failed due to incorrect parameter types,
out-of-range values, or other constraint violations.

#### Example

```typescript
// Thrown when validating a negative value that must be positive
throw new ValidationError(
  "count must be positive, got -5",
  "take",
  { paramName: "count", value: -5 }
);
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new ValidationError()

```ts
new ValidationError(
   message, 
   operation?, 
   context?): ValidationError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `operation`? | `string` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`ValidationError`](index.md#validationerror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:103](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L103)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### OperationError

Error thrown when an operation fails during execution

Wraps underlying errors that occur during stream processing or transformations,
preserving the original error as the cause while adding operation context.

#### Example

```typescript
try {
  await processItem(item);
} catch (error) {
  throw new OperationError(
    "Failed to process item",
    "map",
    error as Error,
    { item, index: 5 }
  );
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new OperationError()

```ts
new OperationError(
   message, 
   operation?, 
   cause?, 
   context?): OperationError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `operation`? | `string` |
| `cause`? | `Error` |
| `context`? | `Record`\<`string`, `unknown`\> |

###### Returns

[`OperationError`](index.md#operationerror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:136](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L136)

#### Properties

| Property | Modifier | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `name` | `public` | `string` | - | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |
| `cause?` | `readonly` | `Error` | - | [`iterflowError`](index.md#iterflowerror).`cause` | - | [src/errors.ts:134](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L134) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message including the original cause

Extends the base toDetailedString() to include information about the
underlying error that caused this operation to fail.

###### Returns

`string`

A formatted string with operation details and cause information

###### Example

```typescript
const originalError = new Error("Network timeout");
const opError = new OperationError(
  "Failed to fetch data",
  "fetchAsync",
  originalError
);
console.log(opError.toDetailedString());
// OperationError: Failed to fetch data
//   Operation: fetchAsync
//   Caused by: Network timeout
//   [stack traces...]
```

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:169](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L169)

***

### EmptySequenceError

Error thrown when an operation requires a non-empty sequence

Indicates that an operation like first(), last(), or min() was called on an
empty iterable where at least one element is required to produce a result.

#### Example

```typescript
import { from } from 'iterflow';

const empty = from([]);
try {
  empty.first(); // Throws EmptySequenceError
} catch (error) {
  console.error(error.message);
  // "Operation 'first' requires a non-empty sequence"
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new EmptySequenceError()

```ts
new EmptySequenceError(operation, message?): EmptySequenceError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `operation` | `string` |
| `message`? | `string` |

###### Returns

[`EmptySequenceError`](index.md#emptysequenceerror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:203](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L203)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### IndexOutOfBoundsError

Error thrown when accessing an invalid index

Indicates that an index-based operation attempted to access an element
outside the valid range of the collection (negative index or index >= size).

#### Example

```typescript
import { from } from 'iterflow';

const items = from([1, 2, 3]);
try {
  items.elementAt(10); // Only 3 elements, index 10 is out of bounds
} catch (error) {
  console.error(error.message);
  // "Index 10 is out of bounds (size: 3)"
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new IndexOutOfBoundsError()

```ts
new IndexOutOfBoundsError(
   index, 
   size?, 
   operation?): IndexOutOfBoundsError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` |
| `size`? | `number` |
| `operation`? | `string` |

###### Returns

[`IndexOutOfBoundsError`](index.md#indexoutofboundserror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:235](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L235)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |
| `index` | `readonly` | `number` | - | - | [src/errors.ts:232](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L232) |
| `size?` | `readonly` | `number` | - | - | [src/errors.ts:233](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L233) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### TypeConversionError

Error thrown when a type conversion or coercion fails

Indicates that an attempt to convert a value to a specific type failed,
such as converting a non-numeric string to a number or a decimal to an integer.

#### Example

```typescript
import { toNumber } from 'iterflow';

try {
  const num = toNumber("not-a-number");
} catch (error) {
  console.error(error.message);
  // 'Cannot convert value "not-a-number" to type number'
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new TypeConversionError()

```ts
new TypeConversionError(
   value, 
   expectedType, 
   operation?): TypeConversionError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |
| `expectedType` | `string` |
| `operation`? | `string` |

###### Returns

[`TypeConversionError`](index.md#typeconversionerror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:269](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L269)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |
| `value` | `readonly` | `unknown` | - | - | [src/errors.ts:266](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L266) |
| `expectedType` | `readonly` | `string` | - | - | [src/errors.ts:267](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L267) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### TimeoutError

Error thrown when an operation exceeds its timeout duration

Indicates that an async operation took longer than the specified timeout
and was terminated to prevent indefinite waiting.

#### Example

```typescript
import { fromAsync } from 'iterflow';

async function* slowGenerator() {
  yield await new Promise(resolve => setTimeout(() => resolve(1), 5000));
}

try {
  // Timeout after 1 second
  await fromAsync(slowGenerator())
    .withTimeout(1000)
    .toArray();
} catch (error) {
  console.error(error.message);
  // "Operation timed out after 1000ms"
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new TimeoutError()

```ts
new TimeoutError(timeoutMs, operation?): TimeoutError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `timeoutMs` | `number` |
| `operation`? | `string` |

###### Returns

[`TimeoutError`](index.md#timeouterror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:309](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L309)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |
| `timeoutMs` | `readonly` | `number` | - | - | [src/errors.ts:307](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L307) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### AbortError

Error thrown when an operation is aborted via AbortSignal

Indicates that an async operation was cancelled using an AbortController,
typically for user-initiated cancellation or cleanup during component unmounting.

#### Example

```typescript
import { fromAsync } from 'iterflow';

const controller = new AbortController();

setTimeout(() => controller.abort("User cancelled"), 1000);

try {
  await fromAsync(longRunningGenerator())
    .withAbortSignal(controller.signal)
    .toArray();
} catch (error) {
  console.error(error.message);
  // "Operation aborted: User cancelled"
}
```

#### Extends

- [`iterflowError`](index.md#iterflowerror)

#### Constructors

##### new AbortError()

```ts
new AbortError(operation?, reason?): AbortError
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `operation`? | `string` |
| `reason`? | `string` |

###### Returns

[`AbortError`](index.md#aborterror)

###### Overrides

[`iterflowError`](index.md#iterflowerror).[`constructor`](index.md#constructors-1)

###### Defined in

[src/errors.ts:347](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L347)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | [`iterflowError`](index.md#iterflowerror).`stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |
| `cause?` | `public` | `unknown` | - | [`iterflowError`](index.md#iterflowerror).`cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| `name` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`name` | node\_modules/typescript/lib/lib.es5.d.ts:1076 |
| `message` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| `stack?` | `public` | `string` | - | [`iterflowError`](index.md#iterflowerror).`stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| `operation?` | `readonly` | `string` | - | [`iterflowError`](index.md#iterflowerror).`operation` | [src/errors.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L22) |
| `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`iterflowError`](index.md#iterflowerror).`context` | [src/errors.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L23) |
| `reason?` | `readonly` | `string` | - | - | [src/errors.ts:345](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L345) |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

###### Returns

`void`

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`captureStackTrace`](index.md#capturestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:52

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`prepareStackTrace`](index.md#preparestacktrace)

###### Defined in

node\_modules/@types/node/globals.d.ts:56

##### toDetailedString()

```ts
toDetailedString(): string
```

Returns a detailed error message with context

Formats the error as a multi-line string including operation name, context data,
and stack trace for comprehensive debugging information.

###### Returns

`string`

A formatted string containing all error details

###### Example

```typescript
const error = new iterflowError(
  "Processing failed",
  "transform",
  { index: 42, value: null }
);
console.log(error.toDetailedString());
// iterflowError: Processing failed
//   Operation: transform
//   Context:
//     index: 42
//     value: null
//   Stack: ...
```

###### Inherited from

[`iterflowError`](index.md#iterflowerror).[`toDetailedString`](index.md#todetailedstring)

###### Defined in

[src/errors.ts:64](https://github.com/mathscapes/iterflow/blob/main/src/errors.ts#L64)

***

### iterflow\<T\>

A fluent interface wrapper for working with iterators and iterables.
Provides chainable methods for transforming, filtering, and analyzing data streams.

#### Example

```typescript
const result = new iterflow([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray(); // [4, 8]
```

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the iterator |

#### Implements

- `Iterable`\<`T`\>

#### Constructors

##### new iterflow()

```ts
new iterflow<T>(source): iterflow<T>
```

Creates a new iterflow instance from an iterable or iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `Iterable`\<`T`, `any`, `any`\> \| `Iterator`\<`T`, `any`, `any`\> | The source iterable or iterator to wrap |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

###### Example

```typescript
const flow1 = new iterflow([1, 2, 3]);
const flow2 = new iterflow(someIterator);
```

###### Defined in

[src/iter-flow.ts:31](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L31)

#### Methods

##### \[iterator\]()

```ts
iterator: Iterator<T, any, any>
```

Returns the iterator for this iterflow instance.
This allows iterflow to be used in for...of loops.

###### Returns

`Iterator`\<`T`, `any`, `any`\>

The underlying iterator

###### Implementation of

`Iterable.[iterator]`

###### Defined in

[src/iter-flow.ts:49](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L49)

##### next()

```ts
next(): IteratorResult<T, any>
```

Retrieves the next value from the iterator.

###### Returns

`IteratorResult`\<`T`, `any`\>

An IteratorResult containing the next value or indicating completion

###### Defined in

[src/iter-flow.ts:58](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L58)

##### map()

```ts
map<U>(fn): iterflow<U>
```

Transforms each element using the provided function.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the transformed elements |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `U` | Function to transform each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`U`\>

A new iterflow with transformed elements

###### Example

```typescript
iter([1, 2, 3]).map(x => x * 2).toArray(); // [2, 4, 6]
```

###### Defined in

[src/iter-flow.ts:74](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L74)

##### filter()

```ts
filter(predicate): iterflow<T>
```

Filters elements based on a predicate function.
Only elements for which the predicate returns true are included.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with only elements that pass the predicate

###### Example

```typescript
iter([1, 2, 3, 4]).filter(x => x % 2 === 0).toArray(); // [2, 4]
```

###### Defined in

[src/iter-flow.ts:96](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L96)

##### take()

```ts
take(limit): iterflow<T>
```

Takes only the first `limit` elements from the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `limit` | `number` | Maximum number of elements to take |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with at most `limit` elements

###### Example

```typescript
iter([1, 2, 3, 4, 5]).take(3).toArray(); // [1, 2, 3]
```

###### Defined in

[src/iter-flow.ts:119](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L119)

##### limit()

```ts
limit(maxIterations): iterflow<T>
```

Limits the maximum number of iterations to prevent infinite loops.
Unlike `take()` which silently stops at the limit, this method throws
an OperationError if the limit is exceeded, making infinite loops explicit.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `maxIterations` | `number` | Maximum number of iterations allowed (must be at least 1) |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow that will throw if limit is exceeded

###### Throws

If maxIterations is not a positive integer

###### Throws

If iteration count exceeds maxIterations

###### Example

```typescript
// Safely process potentially infinite iterator
iter.range(Infinity).limit(1000).toArray(); // Throws after 1000 iterations

// Regular finite iterator works normally
iter([1, 2, 3]).limit(10).toArray(); // [1, 2, 3]
```

###### Defined in

[src/iter-flow.ts:154](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L154)

##### drop()

```ts
drop(count): iterflow<T>
```

Skips the first `count` elements from the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `count` | `number` | Number of elements to skip |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow without the first `count` elements

###### Example

```typescript
iter([1, 2, 3, 4, 5]).drop(2).toArray(); // [3, 4, 5]
```

###### Defined in

[src/iter-flow.ts:201](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L201)

##### flatMap()

```ts
flatMap<U>(fn): iterflow<U>
```

Maps each element to an iterable and flattens the results into a single iterator.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of elements in the resulting iterator |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `Iterable`\<`U`, `any`, `any`\> | Function that maps each element to an iterable |

###### Returns

[`iterflow`](index.md#iterflowt)\<`U`\>

A new iterflow with all mapped iterables flattened

###### Example

```typescript
iter([1, 2, 3]).flatMap(x => [x, x * 2]).toArray(); // [1, 2, 2, 4, 3, 6]
```

###### Defined in

[src/iter-flow.ts:231](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L231)

##### concat()

```ts
concat(...iterables): iterflow<T>
```

Concatenates multiple iterators sequentially.
Yields all elements from this iterator, then from each provided iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`iterables` | `Iterable`\<`T`, `any`, `any`\>[] | Additional iterables to concatenate |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with all elements from all iterables

###### Example

```typescript
iter([1, 2]).concat([3, 4], [5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

###### Defined in

[src/iter-flow.ts:254](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L254)

##### intersperse()

```ts
intersperse(separator): iterflow<T>
```

Inserts a separator element between each item.
The separator is not added before the first element or after the last.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `separator` | `T` | The element to insert between items |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with separators interspersed

###### Example

```typescript
iter([1, 2, 3]).intersperse(0).toArray();
// [1, 0, 2, 0, 3]
iter(['a', 'b', 'c']).intersperse('-').toArray();
// ['a', '-', 'b', '-', 'c']
```

###### Defined in

[src/iter-flow.ts:280](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L280)

##### scan()

```ts
scan<U>(fn, initial): iterflow<U>
```

Like reduce, but emits all intermediate accumulator values.
Similar to reduce but returns an iterator of partial results.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the accumulated value |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`accumulator`, `value`) => `U` | Function to combine the accumulator with each element |
| `initial` | `U` | The initial value for the accumulator |

###### Returns

[`iterflow`](index.md#iterflowt)\<`U`\>

A new iterflow of intermediate accumulator values

###### Example

```typescript
iter([1, 2, 3, 4]).scan((acc, x) => acc + x, 0).toArray();
// [0, 1, 3, 6, 10]
iter([1, 2, 3]).scan((acc, x) => acc * x, 1).toArray();
// [1, 1, 2, 6]
```

###### Defined in

[src/iter-flow.ts:312](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L312)

##### enumerate()

```ts
enumerate(): iterflow<[number, T]>
```

Adds index as tuple with each element [index, value].
Creates tuples pairing each element with its zero-based index.

###### Returns

[`iterflow`](index.md#iterflowt)\<[`number`, `T`]\>

A new iterflow of tuples containing [index, value]

###### Example

```typescript
iter(['a', 'b', 'c']).enumerate().toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

###### Defined in

[src/iter-flow.ts:337](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L337)

##### reverse()

```ts
reverse(): iterflow<T>
```

Reverses the iterator order.
Warning: This operation buffers all elements in memory and may cause
performance issues with large iterables. Consider using only when necessary.

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with elements in reverse order

###### Example

```typescript
iter([1, 2, 3, 4, 5]).reverse().toArray();
// [5, 4, 3, 2, 1]
```

###### Defined in

[src/iter-flow.ts:362](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L362)

##### sort()

```ts
sort(this): iterflow<string | number>
```

Sorts elements using default comparison.
Numbers are sorted numerically, strings lexicographically.
Warning: This operation buffers all elements in memory. Avoid chaining
with other buffering operations (reverse, sort, sortBy) for better performance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`string` \| `number`\> | iterflow instance constrained to numbers or strings |

###### Returns

[`iterflow`](index.md#iterflowt)\<`string` \| `number`\>

A new iterflow with elements sorted

###### Example

```typescript
iter([3, 1, 4, 1, 5]).sort().toArray();
// [1, 1, 3, 4, 5]
iter(['c', 'a', 'b']).sort().toArray();
// ['a', 'b', 'c']
```

###### Defined in

[src/iter-flow.ts:393](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L393)

##### sortBy()

```ts
sortBy(compareFn): iterflow<T>
```

Sorts elements using a custom comparison function.
Warning: This operation buffers all elements in memory. Avoid chaining
with other buffering operations (reverse, sort, sortBy) for better performance.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `compareFn` | (`a`, `b`) => `number` | Function that compares two elements (returns negative if a < b, 0 if equal, positive if a > b) |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with elements sorted

###### Example

```typescript
iter([3, 1, 4, 1, 5]).sortBy((a, b) => a - b).toArray();
// [1, 1, 3, 4, 5]
iter([3, 1, 4, 1, 5]).sortBy((a, b) => b - a).toArray();
// [5, 4, 3, 1, 1]
iter(['alice', 'bob', 'charlie']).sortBy((a, b) => a.length - b.length).toArray();
// ['bob', 'alice', 'charlie']
```

###### Defined in

[src/iter-flow.ts:436](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L436)

##### toArray()

```ts
toArray(maxSize?): T[]
```

Collects all elements into an array.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `maxSize`? | `number` | Optional maximum array size. If provided and the iterator produces more elements, collection stops at maxSize (no error thrown). This is useful for safely collecting from potentially large iterators. |

###### Returns

`T`[]

Array containing all elements (up to maxSize if specified)

###### Throws

If maxSize is provided but not a positive integer

###### Example

```typescript
iter([1, 2, 3]).map(x => x * 2).toArray(); // [2, 4, 6]

// Safely collect from large/infinite iterator
iter.range(Infinity).toArray(1000); // [0, 1, 2, ..., 999]

// Works with finite iterators too
iter([1, 2, 3]).toArray(10); // [1, 2, 3] (stops early)
```

###### Defined in

[src/iter-flow.ts:471](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L471)

##### count()

```ts
count(): number
```

Counts the total number of elements in the iterator.
This is a terminal operation that consumes the iterator.

###### Returns

`number`

The total count of elements

###### Example

```typescript
iter([1, 2, 3, 4, 5]).count(); // 5
```

###### Defined in

[src/iter-flow.ts:511](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L511)

##### sum()

```ts
sum(this): number
```

Calculates the sum of all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`number`

The sum of all elements

###### Example

```typescript
iter([1, 2, 3, 4, 5]).sum(); // 15
```

###### Defined in

[src/iter-flow.ts:535](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L535)

##### mean()

```ts
mean(this): undefined | number
```

Calculates the arithmetic mean (average) of all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The mean value, or undefined if the iterator is empty

###### Example

```typescript
iter([1, 2, 3, 4, 5]).mean(); // 3
iter([]).mean(); // undefined
```

###### Defined in

[src/iter-flow.ts:563](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L563)

##### min()

```ts
min(this): undefined | number
```

Finds the minimum value among all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The minimum value, or undefined if the iterator is empty

###### Example

```typescript
iter([3, 1, 4, 1, 5]).min(); // 1
iter([]).min(); // undefined
```

###### Defined in

[src/iter-flow.ts:586](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L586)

##### max()

```ts
max(this): undefined | number
```

Finds the maximum value among all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The maximum value, or undefined if the iterator is empty

###### Example

```typescript
iter([3, 1, 4, 1, 5]).max(); // 5
iter([]).max(); // undefined
```

###### Defined in

[src/iter-flow.ts:609](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L609)

##### median()

```ts
median(this): undefined | number
```

Calculates the median value of all numeric elements.
The median is the middle value when elements are sorted.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
for sorting. For large datasets, consider using streaming alternatives or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The median value, or undefined if the iterator is empty

###### Example

```typescript
// SAFE: Small dataset
iter([1, 2, 3, 4, 5]).median(); // 3
iter([1, 2, 3, 4]).median(); // 2.5

// SAFE: Limit data before median
iter(largeDataset).take(1000).median();

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).median(); // Materializes all records!

// SAFE: Process in chunks
iter(largeDataset)
  .chunk(1000)
  .map(chunk => iter(chunk).median())
  .toArray();
```

###### Defined in

[src/iter-flow.ts:649](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L649)

##### variance()

```ts
variance(this): undefined | number
```

Calculates the variance of all numeric elements.
Variance measures how far each number in the set is from the mean.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
to calculate variance. For large datasets, consider using streaming variance algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The variance, or undefined if the iterator is empty

###### Example

```typescript
// SAFE: Small dataset
iter([1, 2, 3, 4, 5]).variance(); // 2

// SAFE: Limit data before variance
iter(largeDataset).take(10000).variance();

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).variance(); // Materializes all records!

// SAFE: Process in windows
iter(largeDataset)
  .window(1000)
  .map(window => iter(window).variance())
  .toArray();
```

###### Defined in

[src/iter-flow.ts:693](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L693)

##### stdDev()

```ts
stdDev(this): undefined | number
```

Calculates the standard deviation of all numeric elements.
Standard deviation is the square root of variance and measures dispersion.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
via variance calculation. For large datasets, consider using streaming algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The standard deviation, or undefined if the iterator is empty

###### Example

```typescript
// SAFE: Small dataset
iter([2, 4, 4, 4, 5, 5, 7, 9]).stdDev(); // ~2

// SAFE: Limit data before stdDev
iter(largeDataset).take(10000).stdDev();

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).stdDev(); // Materializes all records!

// SAFE: Process in chunks
iter(largeDataset)
  .chunk(1000)
  .map(chunk => iter(chunk).stdDev())
  .toArray();
```

###### Defined in

[src/iter-flow.ts:740](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L740)

##### percentile()

```ts
percentile(this, p): undefined | number
```

Calculates the specified percentile of all numeric elements.
Uses linear interpolation between closest ranks.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
for sorting. For large datasets, consider using approximate percentile algorithms
or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |
| `p` | `number` | The percentile to calculate (0-100) |

###### Returns

`undefined` \| `number`

The percentile value, or undefined if the iterator is empty

###### Throws

If p is not between 0 and 100

###### Example

```typescript
// SAFE: Small dataset
iter([1, 2, 3, 4, 5]).percentile(50); // 3 (median)
iter([1, 2, 3, 4, 5]).percentile(75); // 4

// SAFE: Limit data before percentile
iter(largeDataset).take(10000).percentile(95);

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).percentile(99); // Materializes all records!

// SAFE: Sample for approximate percentile
iter(largeDataset)
  .filter(() => Math.random() < 0.01) // 1% sample
  .percentile(95);
```

###### Defined in

[src/iter-flow.ts:777](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L777)

##### mode()

```ts
mode(this): undefined | number[]
```

Finds the most frequent value(s) in the dataset.
Returns an array of all values that appear most frequently.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
to count frequencies. For large datasets with many unique values, memory usage can be significant.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`[]

An array of the most frequent value(s), or undefined if the iterator is empty

###### Example

```typescript
// SAFE: Small dataset
iter([1, 2, 2, 3, 3, 3]).mode(); // [3]
iter([1, 1, 2, 2, 3]).mode(); // [1, 2] (bimodal)

// SAFE: Limit data before mode
iter(largeDataset).take(10000).mode();

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).mode(); // Materializes all records!

// SAFE: Process in chunks
iter(largeDataset)
  .chunk(1000)
  .map(chunk => iter(chunk).mode())
  .toArray();
```

###### Defined in

[src/iter-flow.ts:830](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L830)

##### quartiles()

```ts
quartiles(this): undefined | object
```

Calculates the quartiles (Q1, Q2, Q3) of all numeric elements.
Q1 is the 25th percentile, Q2 is the median (50th percentile), Q3 is the 75th percentile.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
for sorting and percentile calculation. For large datasets, consider using streaming
quantile algorithms or limiting data size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `object`

An object with Q1, Q2, and Q3 values, or undefined if the iterator is empty

###### Example

```typescript
// SAFE: Small dataset
iter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }

// SAFE: Limit data before quartiles
iter(largeDataset).take(10000).quartiles();

// UNSAFE: Large dataset may cause memory issues
iter(millionRecords).quartiles(); // Materializes all records!

// SAFE: Sample for approximate quartiles
iter(largeDataset)
  .filter(() => Math.random() < 0.01) // 1% sample
  .quartiles();
```

###### Defined in

[src/iter-flow.ts:883](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L883)

##### span()

```ts
span(this): undefined | number
```

Calculates the span (range from minimum to maximum value) of all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`undefined` \| `number`

The span (max - min), or undefined if the iterator is empty

###### Example

```typescript
iter([1, 2, 3, 4, 5]).span(); // 4
iter([10]).span(); // 0
iter([]).span(); // undefined
```

###### Defined in

[src/iter-flow.ts:928](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L928)

##### product()

```ts
product(this): number
```

Calculates the product of all numeric elements.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |

###### Returns

`number`

The product of all elements, or 1 if the iterator is empty

###### Example

```typescript
iter([1, 2, 3, 4, 5]).product(); // 120
iter([2, 3, 4]).product(); // 24
iter([]).product(); // 1
```

###### Defined in

[src/iter-flow.ts:960](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L960)

##### covariance()

```ts
covariance(this, other): undefined | number
```

Calculates the covariance between two numeric sequences.
Covariance measures the joint variability of two random variables.
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes both iterators into memory
to calculate covariance. For large datasets, this doubles memory usage.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |
| `other` | `Iterable`\<`number`, `any`, `any`\> | An iterable of numbers to compare with |

###### Returns

`undefined` \| `number`

The covariance, or undefined if either sequence is empty or sequences have different lengths

###### Example

```typescript
// SAFE: Small datasets
iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]); // 4

// SAFE: Limit both sequences
iter(largeDataset1).take(10000).covariance(
  iter(largeDataset2).take(10000).toArray()
);

// UNSAFE: Large datasets may cause memory issues
iter(millionRecords1).covariance(millionRecords2); // Materializes both!

// SAFE: Process in windows
iter(largeDataset1)
  .window(1000)
  .map((window, i) =>
    iter(window).covariance(
      iter(largeDataset2).drop(i * 1000).take(1000).toArray()
    )
  )
  .toArray();
```

###### Defined in

[src/iter-flow.ts:1004](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1004)

##### correlation()

```ts
correlation(this, other): undefined | number
```

Calculates the Pearson correlation coefficient between two numeric sequences.
Correlation measures the strength and direction of the linear relationship between two variables.
Values range from -1 (perfect negative correlation) to 1 (perfect positive correlation).
This method is only available when T is number.
This is a terminal operation that consumes the iterator.

WARNING - Memory Intensive: This operation eagerly materializes both iterators into memory
to calculate correlation. For large datasets, this doubles memory usage.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> | iterflow instance constrained to numbers |
| `other` | `Iterable`\<`number`, `any`, `any`\> | An iterable of numbers to compare with |

###### Returns

`undefined` \| `number`

The correlation coefficient, or undefined if either sequence is empty or sequences have different lengths

###### Example

```typescript
// SAFE: Small datasets
iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1 (perfect positive)
iter([1, 2, 3]).correlation([3, 2, 1]); // -1 (perfect negative)

// SAFE: Limit both sequences
iter(largeDataset1).take(10000).correlation(
  iter(largeDataset2).take(10000).toArray()
);

// UNSAFE: Large datasets may cause memory issues
iter(millionRecords1).correlation(millionRecords2); // Materializes both!

// SAFE: Sample for approximate correlation
iter(largeDataset1)
  .filter(() => Math.random() < 0.01)
  .correlation(
    iter(largeDataset2).filter(() => Math.random() < 0.01).toArray()
  );
```

###### Defined in

[src/iter-flow.ts:1065](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1065)

##### window()

```ts
window(size): iterflow<T[]>
```

Creates a sliding window of the specified size over the elements.
Each window contains `size` consecutive elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | The size of each window (must be at least 1) |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`[]\>

A new iterflow of arrays, each containing `size` consecutive elements

###### Throws

If size is less than 1

###### Example

```typescript
iter([1, 2, 3, 4, 5]).window(3).toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

###### Defined in

[src/iter-flow.ts:1119](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1119)

##### chunk()

```ts
chunk(size): iterflow<T[]>
```

Splits elements into chunks of the specified size.
Unlike window, chunks don't overlap. The last chunk may be smaller.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `size` | `number` | The size of each chunk (must be at least 1) |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`[]\>

A new iterflow of arrays, each containing up to `size` elements

###### Throws

If size is less than 1

###### Example

```typescript
iter([1, 2, 3, 4, 5]).chunk(2).toArray();
// [[1, 2], [3, 4], [5]]
```

###### Defined in

[src/iter-flow.ts:1161](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1161)

##### pairwise()

```ts
pairwise(): iterflow<[T, T]>
```

Creates pairs of consecutive elements.
Equivalent to window(2) but returns tuples instead of arrays.

###### Returns

[`iterflow`](index.md#iterflowt)\<[`T`, `T`]\>

A new iterflow of tuples, each containing two consecutive elements

###### Example

```typescript
iter([1, 2, 3, 4]).pairwise().toArray();
// [[1, 2], [2, 3], [3, 4]]
```

###### Defined in

[src/iter-flow.ts:1200](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1200)

##### distinct()

```ts
distinct(): iterflow<T>
```

Removes duplicate elements, keeping only the first occurrence of each.
Uses strict equality (===) to compare elements.

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with duplicate elements removed

###### Example

```typescript
iter([1, 2, 2, 3, 1, 4]).distinct().toArray();
// [1, 2, 3, 4]
```

###### Defined in

[src/iter-flow.ts:1216](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1216)

##### distinctBy()

```ts
distinctBy<K>(keyFn): iterflow<T>
```

Removes duplicate elements based on a key function.
Keeps only the first occurrence of each unique key.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `K` | The type of the key used for comparison |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keyFn` | (`value`) => `K` | Function to extract the comparison key from each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with duplicate elements (by key) removed

###### Example

```typescript
const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
iter(users).distinctBy(u => u.id).toArray();
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

###### Defined in

[src/iter-flow.ts:1246](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1246)

##### tap()

```ts
tap(fn): iterflow<T>
```

Executes a side-effect function on each element without modifying the stream.
Useful for debugging or performing operations like logging.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `void` | Function to execute for each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with the same elements

###### Example

```typescript
iter([1, 2, 3])
  .tap(x => console.log('Processing:', x))
  .map(x => x * 2)
  .toArray(); // logs each value, returns [2, 4, 6]
```

###### Defined in

[src/iter-flow.ts:1278](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1278)

##### takeWhile()

```ts
takeWhile(predicate): iterflow<T>
```

Takes elements while the predicate returns true, then stops.
Stops at the first element that fails the predicate.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with elements up to the first failing predicate

###### Example

```typescript
iter([1, 2, 3, 4, 1, 2]).takeWhile(x => x < 4).toArray();
// [1, 2, 3]
```

###### Defined in

[src/iter-flow.ts:1302](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1302)

##### dropWhile()

```ts
dropWhile(predicate): iterflow<T>
```

Skips elements while the predicate returns true, then yields all remaining elements.
Starts yielding from the first element that fails the predicate.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow starting from the first element that fails the predicate

###### Example

```typescript
iter([1, 2, 3, 4, 1, 2]).dropWhile(x => x < 3).toArray();
// [3, 4, 1, 2]
```

###### Defined in

[src/iter-flow.ts:1326](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1326)

##### partition()

```ts
partition(predicate): [T[], T[]]
```

Splits elements into two arrays based on a predicate.
This is a terminal operation that consumes the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

[`T`[], `T`[]]

A tuple of two arrays: [elements passing predicate, elements failing predicate]

###### Example

```typescript
iter([1, 2, 3, 4, 5]).partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

###### Defined in

[src/iter-flow.ts:1355](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1355)

##### groupBy()

```ts
groupBy<K>(keyFn): Map<K, T[]>
```

Groups elements by a key function into a Map.
This is a terminal operation that consumes the iterator.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `K` | The type of the grouping key |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keyFn` | (`value`) => `K` | Function to extract the grouping key from each element |

###### Returns

`Map`\<`K`, `T`[]\>

A Map where keys are the result of keyFn and values are arrays of elements

###### Example

```typescript
iter(['alice', 'bob', 'charlie', 'dave'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
```

###### Defined in

[src/iter-flow.ts:1384](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1384)

##### reduce()

```ts
reduce<U>(fn, initial): U
```

Reduces the iterator to a single value using an accumulator function.
This is a terminal operation that consumes the iterator.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `U` | The type of the accumulated value |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`accumulator`, `value`) => `U` | Function to combine the accumulator with each element |
| `initial` | `U` | The initial value for the accumulator |

###### Returns

`U`

The final accumulated value

###### Example

```typescript
iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0); // 10
iter(['a', 'b', 'c']).reduce((acc, x) => acc + x, ''); // 'abc'
```

###### Defined in

[src/iter-flow.ts:1413](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1413)

##### find()

```ts
find(predicate): undefined | T
```

Finds the first element that matches the predicate.
This is a terminal operation that may consume part of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

`undefined` \| `T`

The first matching element, or undefined if none found

###### Example

```typescript
iter([1, 2, 3, 4, 5]).find(x => x > 3); // 4
iter([1, 2, 3]).find(x => x > 10); // undefined
```

###### Defined in

[src/iter-flow.ts:1433](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1433)

##### findIndex()

```ts
findIndex(predicate): number
```

Finds the index of the first element that matches the predicate.
This is a terminal operation that may consume part of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

`number`

The index of the first matching element, or -1 if none found

###### Example

```typescript
iter([1, 2, 3, 4, 5]).findIndex(x => x > 3); // 3
iter([1, 2, 3]).findIndex(x => x > 10); // -1
```

###### Defined in

[src/iter-flow.ts:1454](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1454)

##### some()

```ts
some(predicate): boolean
```

Tests whether at least one element matches the predicate.
This is a terminal operation that may consume part of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

`boolean`

true if any element matches, false otherwise

###### Example

```typescript
iter([1, 2, 3, 4, 5]).some(x => x > 3); // true
iter([1, 2, 3]).some(x => x > 10); // false
```

###### Defined in

[src/iter-flow.ts:1477](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1477)

##### every()

```ts
every(predicate): boolean
```

Tests whether all elements match the predicate.
This is a terminal operation that may consume part or all of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`) => `boolean` | Function to test each element |

###### Returns

`boolean`

true if all elements match, false otherwise

###### Example

```typescript
iter([2, 4, 6]).every(x => x % 2 === 0); // true
iter([1, 2, 3]).every(x => x % 2 === 0); // false
```

###### Defined in

[src/iter-flow.ts:1498](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1498)

##### forEach()

```ts
forEach(fn): void
```

Executes a function for each element in the iterator.
This is a terminal operation that consumes the entire iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `void` | Function to execute for each element |

###### Returns

`void`

###### Example

```typescript
iter([1, 2, 3]).forEach(x => console.log(x));
// Logs: 1, 2, 3
```

###### Defined in

[src/iter-flow.ts:1518](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1518)

##### first()

```ts
first(defaultValue?): undefined | T
```

Gets the first element from the iterator.
This is a terminal operation that consumes the first element.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defaultValue`? | `T` | Optional default value to return if iterator is empty |

###### Returns

`undefined` \| `T`

The first element, the default value, or undefined if empty and no default

###### Example

```typescript
iter([1, 2, 3]).first(); // 1
iter([]).first(); // undefined
iter([]).first(0); // 0
```

###### Defined in

[src/iter-flow.ts:1537](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1537)

##### last()

```ts
last(defaultValue?): undefined | T
```

Gets the last element from the iterator.
This is a terminal operation that consumes the entire iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defaultValue`? | `T` | Optional default value to return if iterator is empty |

###### Returns

`undefined` \| `T`

The last element, the default value, or undefined if empty and no default

###### Example

```typescript
iter([1, 2, 3]).last(); // 3
iter([]).last(); // undefined
iter([]).last(0); // 0
```

###### Defined in

[src/iter-flow.ts:1558](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1558)

##### nth()

```ts
nth(index): undefined | T
```

Gets the element at the specified index.
This is a terminal operation that may consume part of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Zero-based index of the element to retrieve |

###### Returns

`undefined` \| `T`

The element at the index, or undefined if index is out of bounds

###### Example

```typescript
iter([1, 2, 3, 4, 5]).nth(2); // 3
iter([1, 2, 3]).nth(10); // undefined
iter([1, 2, 3]).nth(-1); // undefined
```

###### Defined in

[src/iter-flow.ts:1586](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1586)

##### isEmpty()

```ts
isEmpty(): boolean
```

Checks if the iterator is empty.
This is a terminal operation that may consume the first element.

###### Returns

`boolean`

true if the iterator has no elements, false otherwise

###### Example

```typescript
iter([]).isEmpty(); // true
iter([1, 2, 3]).isEmpty(); // false
```

###### Defined in

[src/iter-flow.ts:1616](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1616)

##### includes()

```ts
includes(searchValue): boolean
```

Checks if the iterator includes a specific value.
Uses strict equality (===) for comparison.
This is a terminal operation that may consume part or all of the iterator.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `searchValue` | `T` | The value to search for |

###### Returns

`boolean`

true if the value is found, false otherwise

###### Example

```typescript
iter([1, 2, 3, 4, 5]).includes(3); // true
iter([1, 2, 3]).includes(10); // false
iter(['a', 'b', 'c']).includes('b'); // true
```

###### Defined in

[src/iter-flow.ts:1638](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1638)

##### ~~stddev()~~

```ts
stddev(this): undefined | number
```

Alias for stdDev() method for compatibility.
Calculates the standard deviation of all numeric elements.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | [`iterflow`](index.md#iterflowt)\<`number`\> |

###### Returns

`undefined` \| `number`

###### Deprecated

Use stdDev() instead. This alias will be removed in v1.0.0.

###### Defined in

[src/iter-flow.ts:1657](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1657)

##### ~~skip()~~

```ts
skip(count): iterflow<T>
```

Alias for drop() method for compatibility.
Skips the first `count` elements from the iterator.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `count` | `number` |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

###### Deprecated

Use drop() instead. This alias will be removed in v1.0.0.

###### Defined in

[src/iter-flow.ts:1667](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1667)

##### interleave()

```ts
interleave(...others): iterflow<T>
```

Interleaves elements from this iterator with elements from other iterables.
Takes one element from each iterable in round-robin fashion.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`others` | `Iterable`\<`T`, `any`, `any`\>[] | Variable number of iterables to interleave with |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with elements from all iterables interleaved

###### Example

```typescript
iter([1, 2, 3]).interleave([4, 5, 6]).toArray(); // [1, 4, 2, 5, 3, 6]
```

###### Defined in

[src/iter-flow.ts:1682](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1682)

##### merge()

```ts
merge(...others): iterflow<T>
```

Merges this iterator with other sorted iterables into a single sorted iterator.
Assumes all input iterables are already sorted in ascending order.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`others` | `Iterable`\<`T`, `any`, `any`\>[] | Variable number of sorted iterables to merge with |

###### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow with all elements merged in sorted order

###### Example

```typescript
iter([1, 3, 5]).merge([2, 4, 6]).toArray(); // [1, 2, 3, 4, 5, 6]
```

###### Defined in

[src/iter-flow.ts:1719](https://github.com/mathscapes/iterflow/blob/main/src/iter-flow.ts#L1719)

## Interfaces

### TraceEntry

Trace entry representing a single operation execution

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `operation` | `string` | [src/debug.ts:10](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L10) |
| `timestamp` | `number` | [src/debug.ts:11](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L11) |
| `input?` | `unknown` | [src/debug.ts:12](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L12) |
| `output?` | `unknown` | [src/debug.ts:13](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L13) |
| `error?` | `Error` | [src/debug.ts:14](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L14) |
| `duration?` | `number` | [src/debug.ts:15](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L15) |
| `metadata?` | `Record`\<`string`, `unknown`\> | [src/debug.ts:16](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L16) |

***

### DebugConfig

Debug configuration options

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `enabled` | `boolean` | [src/debug.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L23) |
| `traceOperations` | `boolean` | [src/debug.ts:24](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L24) |
| `traceInput` | `boolean` | [src/debug.ts:25](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L25) |
| `traceOutput` | `boolean` | [src/debug.ts:26](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L26) |
| `logToConsole` | `boolean` | [src/debug.ts:27](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L27) |
| `maxTraceEntries?` | `number` | [src/debug.ts:28](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L28) |

***

### RetryOptions

Options for retry behavior

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `maxAttempts?` | `number` | [src/recovery.ts:21](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L21) |
| `delay?` | `number` | [src/recovery.ts:22](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L22) |
| `backoff?` | `boolean` | [src/recovery.ts:23](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L23) |
| `onRetry?` | (`attempt`: `number`, `error`: `Error`) => `void` | [src/recovery.ts:24](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L24) |

## Type Aliases

### ErrorHandler()\<T, R\>

```ts
type ErrorHandler<T, R>: (error, element?, index?) => R;
```

Error handler function type

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `R` | `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `Error` |
| `element`? | `T` |
| `index`? | `number` |

#### Returns

`R`

#### Defined in

[src/recovery.ts:11](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L11)

***

### Result\<T, E\>

```ts
type Result<T, E>: object | object;
```

Result type for safe operations

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `E` | `Error` |

#### Defined in

[src/recovery.ts:335](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L335)

## Functions

### asyncIter()

```ts
function asyncIter<T>(source): Asynciterflow<T>
```

Creates an async iterflow instance from an async iterable or iterable.
This is the main entry point for working with async iterables in a fluent API style.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the iterable |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\> | The async iterable or iterable to wrap |

#### Returns

[`Asynciterflow`](index.md#asynciterflowt)\<`T`\>

A new async iterflow instance

#### Example

```typescript
await asyncIter(asyncIterable)
  .filter(async x => x % 2 === 0)
  .map(async x => x * 2)
  .toArray(); // [4, 8]
```

#### Defined in

[src/async-iter-flow.ts:2322](https://github.com/mathscapes/iterflow/blob/main/src/async-iter-flow.ts#L2322)

***

### enableDebug()

```ts
function enableDebug(config?): void
```

Enable debug mode

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config`? | `Partial`\<[`DebugConfig`](index.md#debugconfig)\> |

#### Returns

`void`

#### Defined in

[src/debug.ts:220](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L220)

***

### disableDebug()

```ts
function disableDebug(): void
```

Disable debug mode

#### Returns

`void`

#### Defined in

[src/debug.ts:227](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L227)

***

### isDebugEnabled()

```ts
function isDebugEnabled(): boolean
```

Check if debug mode is enabled

#### Returns

`boolean`

#### Defined in

[src/debug.ts:234](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L234)

***

### getDebugConfig()

```ts
function getDebugConfig(): Readonly<DebugConfig>
```

Get debug configuration

#### Returns

`Readonly`\<[`DebugConfig`](index.md#debugconfig)\>

#### Defined in

[src/debug.ts:241](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L241)

***

### addTrace()

```ts
function addTrace(entry): void
```

Add a trace entry

Manually records an operation trace entry for debugging purposes.
Traces are only recorded when debug mode is enabled with traceOperations: true.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entry` | [`TraceEntry`](index.md#traceentry) | The trace entry to add |

#### Returns

`void`

#### Example

```typescript
import { enableDebug, addTrace } from 'iterflow';

enableDebug({ traceOperations: true });

addTrace({
  operation: 'customOp',
  timestamp: Date.now(),
  duration: 42.5,
  metadata: { itemsProcessed: 100 }
});
```

#### Defined in

[src/debug.ts:266](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L266)

***

### getTraces()

```ts
function getTraces(): readonly TraceEntry[]
```

Get all trace entries

Retrieves all recorded trace entries for analysis. Each trace entry contains
operation name, timestamp, duration, and optional input/output/error data.

#### Returns

readonly [`TraceEntry`](index.md#traceentry)[]

An immutable array of all trace entries

#### Example

```typescript
import { from, enableDebug, getTraces } from 'iterflow';

enableDebug({ traceOperations: true, traceInput: true, traceOutput: true });

from([1, 2, 3]).map(x => x * 2).toArray();

const traces = getTraces();
traces.forEach(trace => {
  console.log(`${trace.operation} took ${trace.duration}ms`);
});
```

#### Defined in

[src/debug.ts:291](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L291)

***

### clearTraces()

```ts
function clearTraces(): void
```

Clear all traces

Removes all recorded trace entries from memory. Useful for resetting debug state
between test runs or freeing memory after analyzing traces.

#### Returns

`void`

#### Example

```typescript
import { enableDebug, getTraces, clearTraces } from 'iterflow';

enableDebug({ traceOperations: true });

// ... run some operations ...

const traces = getTraces();
analyzePerformance(traces);

clearTraces(); // Reset for next benchmark
```

#### Defined in

[src/debug.ts:315](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L315)

***

### getTracesForOperation()

```ts
function getTracesForOperation(operation): TraceEntry[]
```

Get traces for a specific operation

Filters trace entries to return only those for the specified operation name.
Useful for analyzing performance of a specific method or transformation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `operation` | `string` | The operation name to filter by (e.g., "map", "filter") |

#### Returns

[`TraceEntry`](index.md#traceentry)[]

An array of trace entries for the specified operation

#### Example

```typescript
import { from, enableDebug, getTracesForOperation } from 'iterflow';

enableDebug({ traceOperations: true });

from([1, 2, 3])
  .map(x => x * 2)
  .filter(x => x > 3)
  .toArray();

const mapTraces = getTracesForOperation('map');
console.log(`map was called ${mapTraces.length} times`);
```

#### Defined in

[src/debug.ts:342](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L342)

***

### getTraceSummary()

```ts
function getTraceSummary(): Record<string, object>
```

Get trace summary statistics

Computes aggregated statistics for each operation including call count,
average duration, and error count. Useful for identifying performance
bottlenecks and error-prone operations.

#### Returns

`Record`\<`string`, `object`\>

An object mapping operation names to their statistics

#### Example

```typescript
import { from, enableDebug, getTraceSummary } from 'iterflow';

enableDebug({ traceOperations: true });

from([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .toArray();

const summary = getTraceSummary();
Object.entries(summary).forEach(([op, stats]) => {
  console.log(`${op}: ${stats.count} calls, avg ${stats.avgDuration.toFixed(2)}ms`);
});
// Output:
// map: 5 calls, avg 0.02ms
// filter: 5 calls, avg 0.01ms
```

#### Defined in

[src/debug.ts:374](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L374)

***

### traceOperation()

```ts
function traceOperation<T>(
   operation, 
   fn, 
   metadata?): T
```

Wrapper function to trace operation execution

Wraps a synchronous function to automatically record execution timing and errors.
Only records traces when debug mode is enabled.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `operation` | `string` | The operation name for the trace entry |
| `fn` | () => `T` | The function to execute and trace |
| `metadata`? | `Record`\<`string`, `unknown`\> | Optional metadata to include in the trace entry |

#### Returns

`T`

The result of executing fn

#### Example

```typescript
import { enableDebug, traceOperation } from 'iterflow';

enableDebug({ traceOperations: true });

const result = traceOperation(
  'computeExpensive',
  () => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += i;
    return sum;
  },
  { iterations: 1000000 }
);
```

#### Defined in

[src/debug.ts:409](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L409)

***

### traceOperationAsync()

```ts
function traceOperationAsync<T>(
   operation, 
   fn, 
metadata?): Promise<T>
```

Async version of traceOperation

Wraps an async function to automatically record execution timing and errors.
Only records traces when debug mode is enabled.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `operation` | `string` | The operation name for the trace entry |
| `fn` | () => `Promise`\<`T`\> | The async function to execute and trace |
| `metadata`? | `Record`\<`string`, `unknown`\> | Optional metadata to include in the trace entry |

#### Returns

`Promise`\<`T`\>

A promise resolving to the result of executing fn

#### Example

```typescript
import { enableDebug, traceOperationAsync } from 'iterflow';

enableDebug({ traceOperations: true });

const data = await traceOperationAsync(
  'fetchUserData',
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  },
  { endpoint: '/api/users' }
);
```

#### Defined in

[src/debug.ts:476](https://github.com/mathscapes/iterflow/blob/main/src/debug.ts#L476)

***

### iter()

```ts
function iter<T>(source): iterflow<T>
```

Creates an iterflow instance from an iterable.
This is the main entry point for working with iterables in a fluent API style.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of elements in the iterable |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `Iterable`\<`T`, `any`, `any`\> | The iterable to wrap |

#### Returns

[`iterflow`](index.md#iterflowt)\<`T`\>

A new iterflow instance

#### Example

```typescript
iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray(); // [4, 8]
```

#### Defined in

[src/index.ts:19](https://github.com/mathscapes/iterflow/blob/main/src/index.ts#L19)

***

### withErrorRecovery()

```ts
function withErrorRecovery<T, R>(fn, errorHandler): (value, index?) => R
```

Wraps a function with error recovery

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `R` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`value`, `index`?) => `R` |
| `errorHandler` | [`ErrorHandler`](index.md#errorhandlert-r)\<`T`, `R`\> |

#### Returns

`Function`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |
| `index`? | `number` |

##### Returns

`R`

#### Defined in

[src/recovery.ts:30](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L30)

***

### withRetry()

```ts
function withRetry<T, R>(fn, options): (...args) => R
```

Wraps a function with retry logic

Automatically retries a function on failure with configurable attempts, delays,
and exponential backoff. Useful for handling transient failures in operations
that may succeed on subsequent attempts.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `any`[] | The function's argument types as a tuple |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (...`args`) => `R` | The function to wrap with retry logic |
| `options` | [`RetryOptions`](index.md#retryoptions) | Configuration object with maxAttempts (default: 3), delay in ms (default: 0), backoff flag (default: false), and optional onRetry callback |

#### Returns

`Function`

A wrapped function that retries on failure

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `T` |

##### Returns

`R`

#### Throws

When all retry attempts are exhausted

#### Example

```typescript
const fetchWithRetry = withRetry(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    onRetry: (attempt, error) => console.log(`Retry ${attempt}: ${error.message}`)
  }
);

const data = fetchWithRetry();
```

#### Defined in

[src/recovery.ts:71](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L71)

***

### withRetryAsync()

```ts
function withRetryAsync<T, R>(fn, options): (...args) => Promise<R>
```

Async version of withRetry

Wraps an async function with retry logic, using proper async delays instead of
busy-waiting. Ideal for network requests, database operations, or other async
operations that may fail transiently.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `any`[] | The function's argument types as a tuple |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (...`args`) => `Promise`\<`R`\> | The async function to wrap with retry logic |
| `options` | [`RetryOptions`](index.md#retryoptions) | Configuration object with maxAttempts (default: 3), delay in ms (default: 0), backoff flag (default: false), and optional onRetry callback |

#### Returns

`Function`

A wrapped async function that retries on failure

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `T` |

##### Returns

`Promise`\<`R`\>

#### Throws

When all retry attempts are exhausted

#### Example

```typescript
const fetchDataWithRetry = withRetryAsync(
  async (id: string) => {
    const response = await fetch(`/api/items/${id}`);
    return response.json();
  },
  {
    maxAttempts: 5,
    delay: 500,
    backoff: true
  }
);

const item = await fetchDataWithRetry('123');
```

#### Defined in

[src/recovery.ts:145](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L145)

***

### withDefault()

```ts
function withDefault<T, R>(fn, defaultValue): (value) => R
```

Returns a default value if an error occurs

Wraps a function to catch any errors and return a fallback value instead,
preventing exceptions from propagating. Useful for providing safe defaults
in transformations or mappings.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The return/default value type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `R` | The function that may throw |
| `defaultValue` | `R` | The value to return if fn throws |

#### Returns

`Function`

A wrapped function that returns defaultValue on error

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

##### Returns

`R`

#### Example

```typescript
const parseIntSafe = withDefault(
  (str: string) => {
    const num = parseInt(str, 10);
    if (isNaN(num)) throw new Error("Not a number");
    return num;
  },
  0
);

parseIntSafe("123");  // returns 123
parseIntSafe("abc");  // returns 0 (default)
```

#### Defined in

[src/recovery.ts:212](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L212)

***

### tryOr()

```ts
function tryOr<T, R>(fn, fallback): (value) => R
```

Returns a fallback value if an error occurs (swallows errors)

Similar to withDefault, this function wraps another function and returns a fallback
value on error. Provides error-safe execution for operations that should never throw.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The return/fallback value type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `R` | The function that may throw |
| `fallback` | `R` | The value to return if fn throws |

#### Returns

`Function`

A wrapped function that returns fallback on error

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

##### Returns

`R`

#### Example

```typescript
const safeDivide = tryOr(
  (x: number) => 100 / x,
  Infinity
);

safeDivide(10);  // returns 10
safeDivide(0);   // returns Infinity (fallback)
```

#### Defined in

[src/recovery.ts:247](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L247)

***

### tryCatch()

```ts
function tryCatch<T, R>(fn, value): [R | undefined, Error | undefined]
```

Executes a function and returns [result, error] tuple

Provides Go-style error handling by returning both the result and error as a tuple.
Allows explicit error handling without try-catch blocks.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `R` | The function to execute |
| `value` | `T` | The value to pass to fn |

#### Returns

[`R` \| `undefined`, `Error` \| `undefined`]

A tuple of [result, undefined] on success or [undefined, error] on failure

#### Example

```typescript
const [result, error] = tryCatch(
  (str: string) => JSON.parse(str),
  '{"name": "Alice"}'
);

if (error) {
  console.error("Parse failed:", error);
} else {
  console.log("Parsed:", result);
}
```

#### Defined in

[src/recovery.ts:282](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L282)

***

### tryCatchAsync()

```ts
function tryCatchAsync<T, R>(fn, value): Promise<[R | undefined, Error | undefined]>
```

Async version of tryCatch

Executes an async function and returns [result, error] tuple, providing
Go-style error handling for async operations.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `Promise`\<`R`\> | The async function to execute |
| `value` | `T` | The value to pass to fn |

#### Returns

`Promise`\<[`R` \| `undefined`, `Error` \| `undefined`]\>

A promise resolving to [result, undefined] on success or [undefined, error] on failure

#### Example

```typescript
const [data, error] = await tryCatchAsync(
  async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  '/api/users'
);

if (error) {
  console.error("Request failed:", error);
} else {
  console.log("Data:", data);
}
```

#### Defined in

[src/recovery.ts:321](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L321)

***

### toResult()

```ts
function toResult<T, R>(fn): (value) => Result<R>
```

Wraps a function to return a Result type

Transforms a throwing function into one that returns a discriminated union
Result type ({ success: true, value } | { success: false, error }).
Enables type-safe error handling with exhaustive checking.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `R` | The function that may throw |

#### Returns

`Function`

A wrapped function that returns a Result type

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

##### Returns

[`Result`](index.md#resultt-e)\<`R`\>

#### Example

```typescript
const parseJson = toResult((str: string) => JSON.parse(str));

const result = parseJson('{"name": "Alice"}');
if (result.success) {
  console.log(result.value.name); // Type-safe access
} else {
  console.error(result.error.message); // Type-safe error handling
}
```

#### Defined in

[src/recovery.ts:362](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L362)

***

### toResultAsync()

```ts
function toResultAsync<T, R>(fn): (value) => Promise<Result<R>>
```

Async version of toResult

Wraps an async function to return a Result type instead of throwing.
Provides type-safe error handling for async operations.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The input value type |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`) => `Promise`\<`R`\> | The async function that may throw |

#### Returns

`Function`

A wrapped async function that returns a Result type

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

##### Returns

`Promise`\<[`Result`](index.md#resultt-e)\<`R`\>\>

#### Example

```typescript
const fetchUser = toResultAsync(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});

const result = await fetchUser('123');
if (result.success) {
  console.log(result.value.name);
} else {
  console.error("Fetch failed:", result.error);
}
```

#### Defined in

[src/recovery.ts:397](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L397)

***

### safePredicate()

```ts
function safePredicate<T>(predicate, defaultValue): (value, index?) => boolean
```

Guards a predicate function to return false on error instead of throwing

Wraps a predicate to prevent errors from breaking filter/find operations.
Returns the default value (false by default) when the predicate throws.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The value type being tested |

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `predicate` | (`value`, `index`?) => `boolean` | `undefined` | The predicate function that may throw |
| `defaultValue` | `boolean` | `false` | The value to return on error (default: false) |

#### Returns

`Function`

A safe predicate that never throws

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |
| `index`? | `number` |

##### Returns

`boolean`

#### Example

```typescript
const hasValidId = safePredicate(
  (user: any) => user.id > 0,
  false
);

[{ id: 1 }, { id: null }, { id: 3 }].filter(hasValidId);
// Returns [{ id: 1 }, { id: 3 }] - null.id doesn't throw
```

#### Defined in

[src/recovery.ts:430](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L430)

***

### safeComparator()

```ts
function safeComparator<T>(comparator, defaultComparison): (a, b) => number
```

Guards a comparator function to handle errors gracefully

Wraps a comparator to prevent errors from breaking sort operations.
Returns the default comparison value (0 by default) when the comparator throws.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The value type being compared |

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `comparator` | (`a`, `b`) => `number` | `undefined` | The comparator function that may throw |
| `defaultComparison` | `number` | `0` | The value to return on error (default: 0, meaning equal) |

#### Returns

`Function`

A safe comparator that never throws

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `T` |
| `b` | `T` |

##### Returns

`number`

#### Example

```typescript
const byAge = safeComparator(
  (a: any, b: any) => a.age - b.age,
  0
);

[{ age: 30 }, { age: null }, { age: 25 }].sort(byAge);
// Doesn't throw when comparing with null
```

#### Defined in

[src/recovery.ts:464](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L464)

***

### errorBoundary()

```ts
function errorBoundary<T, R>(fn, options): (...args) => R | undefined
```

Creates an error boundary that catches and logs errors

Wraps a function with configurable error handling, allowing custom error logging,
optional re-throwing, and default value fallbacks. Ideal for top-level error
boundaries or instrumentation.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `any`[] | The function's argument types as a tuple |
| `R` | The function's return type |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (...`args`) => `R` | The function to wrap with error boundary |
| `options` | `object` | Error handling configuration |
| `options.onError`? | (`error`, `args`) => `void` | Callback invoked when an error occurs, before rethrowing or returning default |
| `options.rethrow`? | `boolean` | Whether to rethrow the error after logging (default: true) |
| `options.defaultValue`? | `R` | Value to return instead of rethrowing (only used if rethrow is false) |

#### Returns

`Function`

A wrapped function with error boundary

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `T` |

##### Returns

`R` \| `undefined`

#### Throws

The original error if rethrow is true (default behavior)

#### Example

```typescript
const processWithLogging = errorBoundary(
  (data: unknown) => JSON.parse(data as string),
  {
    onError: (error, [data]) => {
      console.error("Parse failed for:", data, error);
      sendToErrorTracking(error);
    },
    rethrow: false,
    defaultValue: {}
  }
);

const result = processWithLogging('invalid json');
// Logs error but returns {} instead of throwing
```

#### Defined in

[src/recovery.ts:511](https://github.com/mathscapes/iterflow/blob/main/src/recovery.ts#L511)

***

### validatePositiveInteger()

```ts
function validatePositiveInteger(
   value, 
   paramName, 
   operation?): void
```

Validates that a value is a positive integer

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |
| `paramName` | `string` |
| `operation`? | `string` |

#### Returns

`void`

#### Defined in

[src/validation.ts:11](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L11)

***

### validateNonNegativeInteger()

```ts
function validateNonNegativeInteger(
   value, 
   paramName, 
   operation?): void
```

Validates that a value is a non-negative integer (zero or greater)

This function ensures the value is both an integer and non-negative, making it
suitable for array indices, counts, and offsets that can start from zero.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The value to validate |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When value is not an integer

#### Throws

When value is negative

#### Example

```typescript
validateNonNegativeInteger(0, "index");      // OK - zero is allowed
validateNonNegativeInteger(5, "offset");     // OK
validateNonNegativeInteger(-1, "index");     // throws ValidationError
validateNonNegativeInteger(1.5, "count");    // throws ValidationError
```

#### Defined in

[src/validation.ts:52](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L52)

***

### validateRange()

```ts
function validateRange(
   value, 
   min, 
   max, 
   paramName, 
   operation?): void
```

Validates that a value is within a specific range (inclusive)

Checks that a numeric value falls within the specified bounds, including
both minimum and maximum values. Useful for percentages, bounded parameters,
and range-constrained inputs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The value to validate |
| `min` | `number` | The minimum allowed value (inclusive) |
| `max` | `number` | The maximum allowed value (inclusive) |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When value is less than min or greater than max

#### Example

```typescript
validateRange(50, 0, 100, "percent");     // OK
validateRange(0, 0, 100, "percent");      // OK - min boundary
validateRange(100, 0, 100, "percent");    // OK - max boundary
validateRange(150, 0, 100, "percent");    // throws ValidationError
validateRange(-10, 0, 100, "percent");    // throws ValidationError
```

#### Defined in

[src/validation.ts:96](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L96)

***

### validateFiniteNumber()

```ts
function validateFiniteNumber(
   value, 
   paramName, 
   operation?): void
```

Validates that a value is a finite number (not NaN or Infinity)

Ensures the value is a real, finite number that can be used in mathematical
operations. Rejects NaN, Infinity, and -Infinity which could cause undefined
behavior in calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The value to validate |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When value is NaN, Infinity, or -Infinity

#### Example

```typescript
validateFiniteNumber(42, "weight");           // OK
validateFiniteNumber(-3.14, "temperature");   // OK
validateFiniteNumber(0, "value");             // OK
validateFiniteNumber(NaN, "result");          // throws ValidationError
validateFiniteNumber(Infinity, "max");        // throws ValidationError
```

#### Defined in

[src/validation.ts:132](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L132)

***

### validateNonZero()

```ts
function validateNonZero(
   value, 
   paramName, 
   operation?): void
```

Validates that a value is not zero

Prevents division by zero errors and other operations where zero is invalid.
Detects both positive and negative zero.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The value to validate |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When value equals zero (including -0)

#### Example

```typescript
validateNonZero(1, "divisor");       // OK
validateNonZero(-5, "denominator");  // OK
validateNonZero(0.1, "scale");       // OK
validateNonZero(0, "divisor");       // throws ValidationError
validateNonZero(-0, "divisor");      // throws ValidationError
```

#### Defined in

[src/validation.ts:165](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L165)

***

### validateFunction()

```ts
function validateFunction(
   value, 
   paramName, 
   operation?): asserts value is Function
```

Validates that a value is a function

Type guard that ensures the value is callable. Accepts arrow functions, regular
functions, async functions, generator functions, and class constructors.
Uses TypeScript assertion to narrow the type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to validate |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`asserts value is Function`

#### Throws

When value is not a function

#### Example

```typescript
validateFunction((x) => x * 2, "mapper");           // OK
validateFunction(Math.max, "comparator");           // OK
async function fetch() {}
validateFunction(fetch, "loader");                  // OK
validateFunction(null, "callback");                 // throws ValidationError
validateFunction("not a function", "fn");           // throws ValidationError
```

#### Defined in

[src/validation.ts:199](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L199)

***

### validateIterable()

```ts
function validateIterable<T>(
   value, 
   paramName, 
   operation?): asserts value is Iterable<T, any, any>
```

Validates that a value is iterable

Type guard ensuring the value implements the iterable protocol (has Symbol.iterator).
Accepts arrays, strings, Maps, Sets, generators, and custom iterables.
Uses TypeScript assertion to narrow the type.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to validate |
| `paramName` | `string` | The parameter name for error messages |
| `operation`? | `string` | The operation name for error context |

#### Returns

`asserts value is Iterable<T, any, any>`

#### Throws

When value is null, undefined, or lacks Symbol.iterator

#### Example

```typescript
validateIterable([1, 2, 3], "items");                // OK
validateIterable("hello", "text");                   // OK
validateIterable(new Set([1, 2]), "uniqueIds");      // OK
function* gen() { yield 1; }
validateIterable(gen(), "sequence");                 // OK
validateIterable(null, "items");                     // throws ValidationError
validateIterable({ a: 1 }, "obj");                   // throws ValidationError
```

#### Defined in

[src/validation.ts:235](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L235)

***

### validateComparator()

```ts
function validateComparator<T>(fn, operation?): asserts fn is Function
```

Validates that a value is a valid comparator function

Type guard ensuring the value is a function suitable for sorting and comparison
operations. A comparator should return a negative number if a < b, zero if a === b,
and a positive number if a > b. Uses TypeScript assertion to narrow the type.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | `unknown` | The value to validate as a comparator |
| `operation`? | `string` | The operation name for error context |

#### Returns

`asserts fn is Function`

#### Throws

When fn is not a function

#### Example

```typescript
const numCompare = (a: number, b: number) => a - b;
validateComparator(numCompare);                      // OK

const strCompare = (a: string, b: string) => a.localeCompare(b);
validateComparator(strCompare, "sortBy");            // OK

validateComparator(null, "sort");                    // throws ValidationError
validateComparator("not a function", "sort");        // throws ValidationError
```

#### Defined in

[src/validation.ts:270](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L270)

***

### validateNonEmpty()

```ts
function validateNonEmpty<T>(arr, operation?): void
```

Validates that an array is not empty

Ensures an array has at least one element. Useful for operations that require
at least one item to function properly (e.g., finding min/max, first/last).

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `arr` | `T`[] | The array to validate |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When the array is empty (length === 0)

#### Example

```typescript
validateNonEmpty([1, 2, 3]);         // OK
validateNonEmpty(["a"]);             // OK
validateNonEmpty([]);                // throws ValidationError

// Usage in operations requiring elements
function findMax(arr: number[]): number {
  validateNonEmpty(arr, "findMax");
  return Math.max(...arr);
}
```

#### Defined in

[src/validation.ts:302](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L302)

***

### toNumber()

```ts
function toNumber(value, operation?): number
```

Safely converts a value to a number

Attempts to convert any value to a number using JavaScript's Number() constructor.
Throws a specific error if the conversion results in NaN, providing clear feedback
about type conversion failures.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to convert to a number |
| `operation`? | `string` | The operation name for error context |

#### Returns

`number`

The numeric representation of the value

#### Throws

When conversion results in NaN

#### Example

```typescript
toNumber("123");              // returns 123
toNumber("45.6");             // returns 45.6
toNumber(100);                // returns 100
toNumber(true);               // returns 1
toNumber("not a number");     // throws TypeConversionError
toNumber(undefined);          // throws TypeConversionError
```

#### Defined in

[src/validation.ts:329](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L329)

***

### toInteger()

```ts
function toInteger(value, operation?): number
```

Safely converts a value to an integer

Converts a value to a number and ensures it's an integer (no decimal part).
Uses Math.trunc to identify the integer portion and validates that no precision
is lost during conversion.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | The value to convert to an integer |
| `operation`? | `string` | The operation name for error context |

#### Returns

`number`

The integer representation of the value

#### Throws

When conversion to number fails (NaN)

#### Throws

When the number has a fractional part

#### Example

```typescript
toInteger("123");             // returns 123
toInteger(456);               // returns 456
toInteger("0");               // returns 0
toInteger("-50");             // returns -50
toInteger("123.45");          // throws TypeConversionError
toInteger(789.12);            // throws TypeConversionError
toInteger("abc");             // throws TypeConversionError
```

#### Defined in

[src/validation.ts:365](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L365)

***

### validateIndex()

```ts
function validateIndex(
   index, 
   size, 
   operation?): void
```

Validates an array index is within bounds

Ensures an index is a non-negative integer and falls within the valid range
for an array or collection of the given size. Valid indices are 0 to size-1.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | The index to validate |
| `size` | `number` | The size of the array or collection |
| `operation`? | `string` | The operation name for error context |

#### Returns

`void`

#### Throws

When index is not a non-negative integer

#### Throws

When index is greater than or equal to size

#### Example

```typescript
validateIndex(0, 10);         // OK
validateIndex(5, 10);         // OK
validateIndex(9, 10);         // OK - last valid index
validateIndex(10, 10);        // throws ValidationError - out of bounds
validateIndex(-1, 10);        // throws ValidationError - negative
validateIndex(1.5, 10);       // throws ValidationError - not integer
```

#### Defined in

[src/validation.ts:400](https://github.com/mathscapes/iterflow/blob/main/src/validation.ts#L400)

## Namespaces

- [asyncIter](namespaces/asyncIter.md)
- [iter](namespaces/iter.md)
