# iterflow

Iterator utilities for ES2022+ with statistical operations, windowing, and lazy evaluation.

[![npm version](https://img.shields.io/npm/v/iterflow.svg)](https://www.npmjs.com/package/iterflow)
[![CI](https://img.shields.io/github/actions/workflow/status/mathscapes/iterflow/ci.yml?branch=main)](https://github.com/mathscapes/iterflow/actions)
[![Coverage](https://img.shields.io/badge/coverage-81%25-brightgreen)](https://github.com/mathscapes/iterflow)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://github.com/mathscapes/iterflow/blob/main/package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%2B-blue)](https://www.typescriptlang.org/)
[![License: Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg)](https://unlicense.org/)


## Installation

```bash
npm install iterflow
```

## Quick Start

```typescript
import { iter } from 'iterflow';

// Statistical operations
iter([1, 2, 3, 4, 5]).mean();    // 3
iter([1, 2, 3, 4, 5]).median();  // 3

// Windowing
iter([1, 2, 3, 4, 5])
  .window(2)
  .toArray();
// [[1,2], [2,3], [3,4], [4,5]]

// Method chaining
iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .chunk(2)
  .toArray();
// [[4, 8], [12]]
```

## Core Operations

### Statistical

```typescript
iter([1, 2, 3, 4, 5]).sum();          // 15
iter([1, 2, 3, 4, 5]).mean();         // 3
iter([1, 2, 3, 4, 5]).median();       // 3
iter([1, 2, 3, 4, 5]).variance();     // 2
```

### Windowing

```typescript
iter([1, 2, 3, 4, 5]).window(3).toArray();  // [[1,2,3], [2,3,4], [3,4,5]]
iter([1, 2, 3, 4, 5]).chunk(2).toArray();   // [[1,2], [3,4], [5]]
```

### Transformations

```typescript
iter([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .take(3)
  .toArray();  // [6, 8, 10]
```

### Resource Limits (v0.8.0+)

```typescript
// Prevent infinite loops
iter.range(Infinity)
  .limit(10000)      // Throws if exceeded
  .toArray(1000);    // Collects max 1000

// Timeout async operations
await asyncIter(items)
  .timeout(5000)     // 5s per iteration
  .toArray();

// User cancellation
const controller = new AbortController();
asyncIter(data).withSignal(controller.signal).toArray();
controller.abort();  // Cancel anytime
```

## Documentation

- **[API Reference](./docs/api/index.md)** - Complete TypeScript API documentation
- **[Examples](./examples/)** - Real-world usage examples

## When to Use iterflow

### Use iterflow when

- Large datasets (1000+ items) - lazy evaluation avoids unnecessary work
- Early termination - finding first match, taking limited results
- Memory efficiency - windowing, chunking, processing huge files
- Complex pipelines - chaining 3+ operations
- Statistical operations - mean, median, variance, percentiles

### Consider alternatives when

- Small arrays (< 100 items) - native Array methods are slightly faster
- Single simple operation - map or filter alone
- Need multiple iterations - arrays are easier to loop over multiple times

## API Styles

### Wrapper API (Recommended for most use cases)

```typescript
import { iter } from 'iterflow';

iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .sum();  // 12
```

### Functional API (Better tree-shaking)

```typescript
import { pipe, filter, map, sum } from 'iterflow/fn';

const process = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * 2),
  sum
);

process([1, 2, 3, 4, 5]);  // 12
```

## Contributing

Quick start:

1. Fork the repository
2. Create a feature branch from `dev`
3. Make your changes with tests
4. Submit a PR to `dev`

## License

The Unlicense - See [LICENSE](LICENSE) for details.
