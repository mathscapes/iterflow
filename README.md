# iterflow

Iterator utilities for ES2022+ with statistical operations, windowing, and lazy evaluation.

[![npm version](https://img.shields.io/npm/v/iterflow.svg)](https://www.npmjs.com/package/iterflow)
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

## API

### Wrapper API

```typescript
import { iter } from 'iterflow';

iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)    // Native iterator method
  .map(x => x * 2)       // Native iterator method
  .sum();                // iterflow extension - 24
```

### Functional API

```typescript
import { sum, filter, map } from 'iterflow/fn';

const data = [1, 2, 3, 4, 5];
sum(map(x => x * 2)(filter(x => x > 2)(data))); // 24
```

## Operations

### Statistical

```typescript
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).sum();          // 55
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).mean();         // 5.5
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).median();       // 5.5
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).variance();     // 8.25
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).percentile(75); // 7.75
```

### Windowing

```typescript
// Sliding window
iter([1, 2, 3, 4, 5]).window(3).toArray();
// [[1,2,3], [2,3,4], [3,4,5]]

// Non-overlapping chunks
iter([1, 2, 3, 4, 5]).chunk(2).toArray();
// [[1,2], [3,4], [5]]

// Consecutive pairs
iter([1, 2, 3, 4]).pairwise().toArray();
// [[1,2], [2,3], [3,4]]
```

### Grouping

```typescript
// Partition by predicate
const [evens, odds] = iter([1, 2, 3, 4, 5, 6])
  .partition(x => x % 2 === 0);

// Group by key function
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'vegetable', name: 'carrot' },
  { category: 'fruit', name: 'banana' }
];

const groups = iter(items).groupBy(item => item.category);
```

### Set Operations

```typescript
// Remove duplicates
iter([1, 2, 2, 3, 3, 3, 4]).distinct().toArray();
// [1, 2, 3, 4]

// Remove duplicates by key
iter(people).distinctBy(person => person.id).toArray();
```

### Combining

```typescript
// Zip iterators
iter.zip([1, 2, 3], ['a', 'b', 'c']).toArray();
// [[1,'a'], [2,'b'], [3,'c']]

// Interleave round-robin
iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
// [1, 4, 2, 5, 3, 6]

// Merge sorted iterators
iter.merge([1, 3, 5], [2, 4, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

### Utilities

```typescript
// Side effects
iter([1, 2, 3])
  .tap(x => console.log(`Processing: ${x}`))
  .map(x => x * 2)
  .toArray();

// Conditional take/drop
iter([1, 2, 3, 4, 3, 2, 1]).takeWhile(x => x < 4).toArray();
// [1, 2, 3]

iter([1, 2, 3, 4, 5]).dropWhile(x => x < 3).toArray();
// [3, 4, 5]
```

### Generators

```typescript
// Numeric ranges
iter.range(5).toArray();           // [0, 1, 2, 3, 4]
iter.range(2, 8).toArray();        // [2, 3, 4, 5, 6, 7]
iter.range(0, 10, 2).toArray();    // [0, 2, 4, 6, 8]

// Repeat values
iter.repeat('hello', 3).toArray();  // ['hello', 'hello', 'hello']
iter.repeat(0).take(5).toArray();   // [0, 0, 0, 0, 0]
```

## Examples

### Processing Pipeline

```typescript
interface Sale {
  product: string;
  amount: number;
  category: string;
}

const sales: Sale[] = [
  { product: 'Laptop', amount: 1200, category: 'Electronics' },
  { product: 'Mouse', amount: 25, category: 'Electronics' },
  { product: 'Book', amount: 15, category: 'Books' },
];

// Average electronics sale amount
const electronicsAvg = iter(sales)
  .filter(sale => sale.category === 'Electronics')
  .map(sale => sale.amount)
  .mean();

// Total sales by category
const salesByCategory = iter(sales)
  .groupBy(sale => sale.category)
  .entries()
  .map(([category, sales]) => ({
    category,
    total: iter(sales).map(sale => sale.amount).sum()
  }));
```

### Infinite Sequences

```typescript
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// First 10 even fibonacci numbers
const evenFibs = iter(fibonacci())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();
```

### Moving Averages

```typescript
const temperatures = [20, 22, 25, 23, 21, 19, 18, 20, 22, 24];

const movingAverages = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();
```

<!-- BENCHMARK_SUMMARY_START -->
<!-- BENCHMARK_SUMMARY_END -->

## Documentation

- **[FAQ](FAQ.md)** - Frequently asked questions, common patterns, and troubleshooting
- **[Examples](examples/)** - Real-world usage examples
- **[SECURITY.md](SECURITY.md)** - Security best practices and vulnerability reporting

## Contributing

We welcome contributions! Please see our [PLAYBOOK.md](PLAYBOOK.md) for:

- Development workflow and branching strategy
- Commit message guidelines
- Testing requirements
- Release process

For quick start:

1. Fork the repository
2. Create a feature branch from `dev`
3. Make your changes with tests
4. Submit a PR to `dev`

See [PLAYBOOK.md](PLAYBOOK.md) for complete details.

## License

The Unlicense - See [LICENSE](LICENSE) for details.
