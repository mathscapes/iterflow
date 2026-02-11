# Iterflow

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18610143.svg)](https://doi.org/10.5281/zenodo.18610143)

Composable streaming statistics pipelines for JavaScript. Zero dependencies.

```typescript
import { iter } from '@mathscapes/iterflow';

// Rolling average of stock prices
const prices = [100, 102, 101, 105, 107, 110];
iter(prices)
  .window(5)
  .map(w => iter(w).mean())
  .toArray();

// Process millions of records with constant memory
function* hugeDataset() {
  for (let i = 0; i < 1000000; i++) {
    yield { valid: i % 2 === 0, value: i };
  }
}
iter(hugeDataset())
  .filter(x => x.valid)
  .map(x => x.value)
  .take(1000)
  .sum();
```

## Install

```bash
npm install @mathscapes/iterflow
```

## Why?

ES2025 Iterator Helpers provide lazy transforms (`map`, `filter`, `take`), but lack statistical operations. Libraries like `@stdlib/stats/incr` provide streaming accumulators, but not as composable pipeline stages. **iterflow combines both**: lazy pipelines + integrated streaming statistics for memory-efficient multi-stage statistical workflows.

## API Reference

### Factory Function

- `iter<T>(src: Iterable<T>): Iterflow<T>` Wrap any iterable.

---

### Transform Methods

Transform methods return a new `Iterflow<T>` and are lazily evaluated. No computation happens until a terminal method is called.

- `.map<U>(fn: (v: T, i: number) => U): Iterflow<U>` Transform each element.
- `.filter(fn: (v: T, i: number) => boolean): Iterflow<T>` Keep matching elements.
- `.flatMap<U>(fn: (v: T, i: number) => Iterable<U>): Iterflow<U>` Map and flatten.
- `.take(n: number): Iterflow<T>` First n elements.
- `.drop(n: number): Iterflow<T>` Skip first n elements.
- `.takeWhile(fn: (v: T, i: number) => boolean): Iterflow<T>` Take while predicate is true.
- `.dropWhile(fn: (v: T, i: number) => boolean): Iterflow<T>` Skip while predicate is true.
- `.distinct(): Iterflow<T>` Remove duplicates.
- `.enumerate(): Iterflow<[number, T]>` Yield [index, value] pairs.
- `.concat<U>(...others: Iterable<U>[]): Iterflow<T | U>` Append iterables.
- `.window(size: number): Iterflow<T[]>` Sliding windows.
- `.chunk(size: number): Iterflow<T[]>` Fixed-size chunks.
- `.zip<U>(other: Iterable<U>): Iterflow<[T, U]>` Combine with another iterable into tuples.
- `.zip<U, V>(other1: Iterable<U>, other2: Iterable<V>): Iterflow<[T, U, V]>` Combine with two iterables.

---

### Streaming Transform Methods

Streaming methods are transforms that yield intermediate statistical values at each step. Work only on `Iterflow<number>`.

- `.streamingMean(): Iterflow<number>` Yield running mean at each step.
- `.streamingVariance(): Iterflow<number>` Yield running variance at each step (Welford's algorithm).
- `.ewma(alpha: number): Iterflow<number>` Yield exponentially weighted moving average with decay factor α ∈ (0,1].
- `.streamingZScore(): Iterflow<number>` Yield z-scores using running mean/variance from prior observations. NaN for first two elements.
- `.streamingCovariance(): Iterflow<number>` Yield running covariance for paired streams (requires `Iterable<[number, number]>`).
- `.streamingCorrelation(): Iterflow<number>` Yield running Pearson correlation coefficient for paired streams.
- `.windowedMin(size: number): Iterflow<number>` Sliding window minimum via monotonic deque. O(1) amortized.
- `.windowedMax(size: number): Iterflow<number>` Sliding window maximum via monotonic deque. O(1) amortized.

---

### Terminal Methods

Terminal methods consume the iterator and return concrete values.

- `.toArray(): T[]` Collect to array.
- `.reduce<U>(fn: (acc: U, v: T, i: number) => U, init: U): U` Fold to single value.
- `.find(fn: (v: T, i: number) => boolean): T | undefined` First matching element.
- `.forEach(fn: (v: T, i: number) => void): void` Execute function for each.
- `.first(): T | undefined` First element.
- `.last(): T | undefined` Last element.
- `.count(): number` Count elements.
- `.some(fn: (v: T, i: number) => boolean): boolean` Any match?
- `.every(fn: (v: T, i: number) => boolean): boolean` All match?

---

### Statistical Methods

Statistical methods only work on `Iterflow<number>` and throw `EmptySequenceError` on empty sequences.

- `.sum(): number` Sum.
- `.mean(): number` Arithmetic mean.
- `.median(): number` Median (50th percentile).
- `.min(): number` Minimum.
- `.max(): number` Maximum.
- `.variance(): number` Population variance.
- `.stdDev(): number` Standard deviation (square root of variance).

---

### Standalone Functions

```typescript
import { sum, mean, median, min, max, variance, stdDev } from '@mathscapes/iterflow';
```

- `sum(src: Iterable<number>): number`
- `mean(src: Iterable<number>): number`
- `median(src: Iterable<number>): number`
- `min(src: Iterable<number>): number`
- `max(src: Iterable<number>): number`
- `variance(src: Iterable<number>): number`
- `stdDev(src: Iterable<number>): number`

---

### Error Classes

- `IterflowError` Base error class.
- `EmptySequenceError` Thrown by statistical methods on empty sequences. Has `op: string` property.

---

### Type Exports

```typescript
import type { Predicate, Mapper, Reducer, FlatMapper } from '@mathscapes/iterflow';
```

- `Predicate<T>` = `(v: T, i: number) => boolean`
- `Mapper<T, U>` = `(v: T, i: number) => U`
- `Reducer<T, U>` = `(acc: U, v: T, i: number) => U`
- `FlatMapper<T, U>` = `(v: T, i: number) => Iterable<U>`

---

### Utility Functions

- `isIterable(v: unknown): v is Iterable<unknown>` Type guard for iterables.

---

## Benchmarks

Performance benchmarks comparing iterflow against Lodash, iter-ops, RxJS, and native methods are available in the [`benchmarks/`](benchmarks/) directory. See [benchmarks/README.md](benchmarks/README.md) for reproduction instructions.

## Examples

See the [`examples/`](examples/) directory for examples comparing iterflow with native JavaScript, Lodash, and RxJS.

## TypeScript

Full type inference. Statistical methods are constrained to `Iterflow<number>`:

```typescript
iter(['a', 'b', 'c']).sum()  // TypeScript error
iter([1, 2, 3]).sum()        // OK: number
```

## License

MIT
