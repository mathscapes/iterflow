# Frequently Asked Questions (FAQ)

Welcome to the iterflow FAQ! This document answers common questions about using the iterflow library. Use the navigation below to jump to the section you need.

**Quick Navigation:**

- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Common Operations & Patterns](#common-operations--patterns)
- [Performance & Memory](#performance--memory)
- [Error Handling & Debugging](#error-handling--debugging)
- [Async Operations](#async-operations)
- [TypeScript & Types](#typescript--types)
- [Advanced Topics](#advanced-topics)
- [Troubleshooting](#troubleshooting)
- [Migration & Integration](#migration--integration)

---

## Getting Started

### What is iterflow?

iterflow is a **TypeScript-first iterator utilities library** that provides powerful operations for working with sequences of data. It offers statistical operations, windowing, grouping, and lazy evaluation capabilities with zero dependencies.

**Key features:**

- **Zero dependencies** - Pure JavaScript/TypeScript
- **Tree-shakeable** - Import only what you use
- **Lazy evaluation** - Operations don't compute until needed
- **Dual API** - Choose between wrapper (chaining) or functional (composition) style
- **TypeScript-first** - Excellent type inference and type safety
- **ES2022+ compatible** - Uses native iterators

iterflow is perfect for:

- Data analysis and statistics
- Processing large datasets efficiently
- Building data transformation pipelines
- Time-series analysis and windowing operations
- ETL (Extract, Transform, Load) workflows

**How it compares:**

- **vs Array methods**: iterflow is lazy (better for large datasets), while Array methods are eager
- **vs lodash/ramda**: iterflow focuses on iterators and memory efficiency, not a general-purpose utility library
- **vs pandas (Python)**: Similar statistical capabilities, but JavaScript-based and lighter-weight

### How do I install and set up iterflow?

Install using your package manager:

```bash
npm install iterflow
# or
yarn add iterflow
# or
pnpm add iterflow
```

**Basic usage:**

```typescript
import { iter } from 'iterflow';

// Wrapper API - method chaining
const result = iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray();
// [4, 8]
```

**TypeScript configuration:**

iterflow requires **TypeScript 4.7+** for best results. In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",        // or later
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

**ESM vs CommonJS:**

iterflow is published as **ESM only**. If you're using CommonJS:

```javascript
// Won't work
const { iter } = require('iterflow');

// Use dynamic import
(async () => {
  const { iter } = await import('iterflow');
})();
```

### Wrapper API vs Functional API - which should I use?

iterflow provides two API styles for the same functionality. Let's compare them:

**Wrapper API (method chaining):**

```typescript
import { iter } from 'iterflow';

iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .sum();
// 12
```

**Functional API (composition):**

```typescript
import { sum, map, filter } from 'iterflow/fn';

sum(
  map((x: number) => x * 2)(
    filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5])
  )
);
// 12
```

**Or with pipe utility:**

```typescript
import { pipe } from 'iterflow/fn';
import { sum, map, filter } from 'iterflow/fn';

const process = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * 2),
  sum
);

process([1, 2, 3, 4, 5]); // 12
```

**Trade-offs:**

| Aspect | Wrapper | Functional |
|--------|---------|-----------|
| **Readability** | More intuitive, reads left-to-right | Nested, reads inside-out |
| **Learning curve** | Similar to Array methods | Requires FP knowledge |
| **Tree-shaking** | Larger bundle impact | Better tree-shaking |
| **Composition** | Harder to compose | Natural composition |
| **Performance** | Nearly identical | Nearly identical |

**Recommendation:**

- **Use Wrapper API** if you prefer readability and are building standalone scripts
- **Use Functional API** if you're building libraries, need composition, or care about bundle size

### What are the basic operations I should know?

Here are the 10 most useful operations to get started:

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5];

// 1. map - transform each element
iter(data).map(x => x * 2).toArray();
// [2, 4, 6, 8, 10]

// 2. filter - keep elements matching a condition
iter(data).filter(x => x % 2 === 0).toArray();
// [2, 4]

// 3. take - take first N elements
iter(data).take(3).toArray();
// [1, 2, 3]

// 4. drop - skip first N elements
iter(data).drop(2).toArray();
// [3, 4, 5]

// 5. sum - sum all numbers
iter(data).sum();
// 15

// 6. mean - average value
iter(data).mean();
// 3

// 7. window - sliding windows of size N
iter(data).window(2).toArray();
// [[1, 2], [2, 3], [3, 4], [4, 5]]

// 8. chunk - non-overlapping groups of size N
iter(data).chunk(2).toArray();
// [[1, 2], [3, 4], [5]]

// 9. distinct - remove duplicates
iter([1, 2, 2, 3, 1]).distinct().toArray();
// [1, 2, 3]

// 10. toArray - materialize as array
iter(data).take(3).toArray();
// [1, 2, 3]
```

### How do I convert between arrays and iterators?

**Array to iterator:**

```typescript
import { iter } from 'iterflow';

const array = [1, 2, 3];
const iterator = iter(array);
// Now you can chain operations
iterator.map(x => x * 2);
```

**Iterator to array:**

```typescript
const result = iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**When conversion happens:**

- `iter()` wraps the array but doesn't consume it - lazy!
- `.toArray()` converts to array and consumes the iterator - eager operation
- Operations between `.iter()` and `.toArray()` are lazy (not executed yet)

```typescript
const iter_obj = iter([1, 2, 3, 4, 5]);
// Nothing computed yet! Lazy.

const filtered = iter_obj.filter(x => x > 2);
// Still nothing computed!

const result = filtered.toArray();
// NOW it computes! Result: [3, 4, 5]
```

### Does iterflow work in the browser?

Yes! iterflow works in any browser supporting **ES2022+**:

```html
<script type="module">
  import { iter } from 'https://cdn.jsdelivr.net/npm/iterflow@latest/+esm';

  const result = iter([1, 2, 3, 4, 5])
    .filter(x => x % 2 === 0)
    .sum();

  console.log(result); // 6
</script>
```

**Browser compatibility:**

- Chrome 76+
- Firefox 63+
- Safari 12.1+
- Edge 79+

**Bundle size considerations:**

- Wrapper API: ~8KB gzipped
- Functional API: ~5KB gzipped (better tree-shaking)
- Use ES modules and bundler tree-shaking for optimal size

---

## Core Concepts

### What is lazy evaluation and why does it matter?

**Lazy evaluation** means operations are deferred until they're actually needed. Let's compare:

**Eager evaluation (Array methods):**

```typescript
const data = [1, 2, 3, 4, 5];

// IMMEDIATE: Creates full transformed array in memory
const doubled = data.map(x => x * 2);      // [2, 4, 6, 8, 10]
const filtered = doubled.filter(x => x > 5); // [6, 8, 10]
const taken = filtered.slice(0, 2);        // [6, 8]

// Each operation processes ALL elements immediately
```

**Lazy evaluation (iterflow):**

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5];

// DEFERRED: Nothing happens yet!
const result = iter(data)
  .map(x => x * 2)           // Not executed
  .filter(x => x > 5)        // Not executed
  .take(2)                   // Not executed
  .toArray();                // NOW it executes!

// Only processes elements as needed: 1->2->6 (yes), 2->4 (no), 3->6 (yes) [STOP]
// Result: [6, 8]
```

**Why this matters:**

1. **Memory efficiency**: Only computed values stay in memory
2. **Performance on large datasets**: Stops early if possible
3. **Early termination**: `take(2)` stops after 2 matches instead of processing all

```typescript
// Example: Processing 1 million items
const numbers = Array.from({ length: 1_000_000 }, (_, i) => i);

// Array methods - processes ALL 1M items
const result1 = numbers
  .map(x => x * 2)           // Computes 1M values
  .filter(x => x > 100)      // Checks 1M values
  .slice(0, 5);              // Takes first 5

// iterflow - stops early
const result2 = iter(numbers)
  .map(x => x * 2)           // Lazy, deferred
  .filter(x => x > 100)      // Lazy, deferred
  .take(5)                   // Stops after 5 matches!
  .toArray();

// iterflow only processes ~6 values instead of 1M
```

### When are iterators consumed?

An iterator can only be **iterated once**. Once consumed, it's exhausted:

```typescript
import { iter } from 'iterflow';

const iterator = iter([1, 2, 3]);

// First use: OK
const first = Array.from(iterator);
// [1, 2, 3]

// Second use: Empty!
const second = Array.from(iterator);
// []  † Iterator is exhausted!
```

**Terminal operations consume iterators:**

```typescript
const iterator = iter([1, 2, 3, 4, 5]);

// These terminal operations CONSUME the iterator:
iterator.toArray();           // Consumes
iterator.sum();               // Consumes
iterator.count();             // Consumes
iterator.find(x => x > 3);   // Consumes
iterator.reduce((a, b) => a + b, 0); // Consumes

// After any terminal operation, iterator is exhausted!
```

**Creating fresh iterators:**

If you need multiple iterations, create fresh iterators:

```typescript
const data = [1, 2, 3, 4, 5];

//  Create fresh iterators each time
const sum = iter(data).sum();
const count = iter(data).count();
const first = iter(data).first();
```

**Caching with toArray:**

If you need multiple passes, cache the result:

```typescript
const data = [1, 2, 3, 4, 5];

// Cache the transformed data
const transformed = iter(data)
  .map(x => x * 2)
  .toArray();
// Now you can use multiple times
const sum = transformed.reduce((a, b) => a + b, 0);
const count = transformed.length;
```

### Which operations consume memory?

**Memory-intensive operations** (require storing all data):

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5];

// These load everything into memory:
iter(data).toArray();              // Materializes as array
iter(data).reverse();              // Needs all elements to reverse
iter(data).sort();                 // Needs to sort all elements
iter(data).median();               // Needs all to find median
iter(data).variance();             // Needs all to calculate variance
iter(data).groupBy(x => x % 2);   // Needs all to group
```

**Memory-efficient operations** (process one element at a time):

```typescript
// These DON'T materialize:
iter(data).map(x => x * 2);       // Transforms on-the-fly
iter(data).filter(x => x > 2);    // Filters on-the-fly
iter(data).take(3);               // Stops after 3
iter(data).sum();                 // Single accumulator
iter(data).mean();                // Single accumulator
```

**Best practices for large datasets:**

```typescript
// Bad: Processes all 1M items
const result = iter(millionItems)
  .map(transform)
  .toArray();
// All 1M items in memory!

// Good: Process in chunks
const result = iter(millionItems)
  .chunk(1000)           // Lazy: groups into arrays
  .map(chunk => {
    // Process each chunk of 1000
    return processChunk(chunk);
  })
  .toArray();            // Only chunks in memory at once
```

### How does iterflow handle empty sequences?

**Operations returning `undefined`:**

```typescript
import { iter } from 'iterflow';

const empty: number[] = [];

// These return undefined for empty sequences:
iter(empty).min();         // undefined
iter(empty).max();         // undefined
iter(empty).mean();        // undefined
iter(empty).median();      // undefined
iter(empty).first();       // undefined (without default)
```

**Operations returning defaults:**

```typescript
// These return a default for empty sequences:
iter(empty).sum();         // 0
iter(empty).count();       // 0
iter(empty).product();     // 1
```

**Safe handling patterns:**

```typescript
// Pattern 1: Use optional chaining
const avg = iter(data).mean();
console.log(avg?.toFixed(2) ?? 'No data');

// Pattern 2: Use nullish coalescing
const min = iter(data).min() ?? Infinity;

// Pattern 3: Check length first
if (iter(data).count() > 0) {
  const avg = iter(data).mean();
}

// Pattern 4: Provide default to first/last
const first = iter(data).first(0);  // Returns 0 if empty
```

---

## Common Operations & Patterns

### How do I calculate a moving average?

A moving average smooths data by averaging sliding windows:

```typescript
import { iter } from 'iterflow';

const temperatures = [20, 21, 19, 22, 23, 21, 20];

// 3-day moving average
const movingAvg = iter(temperatures)
  .window(3)                    // Get windows of 3
  .map(window =>                // Average each window
    iter(window).mean() ?? 0
  )
  .toArray();

console.log(movingAvg);
// [20, 20.67, 21.33, 22, 21.33]
```

**Why this works:**

- `window(3)` creates sliding windows: `[20,21,19]`, `[21,19,22]`, etc.
- Each window is averaged with `mean()`
- Result is smoothed data with same length as original

**With timestamps (real-world example):**

```typescript
interface DataPoint {
  timestamp: number;
  value: number;
}

const data: DataPoint[] = [
  { timestamp: 1, value: 100 },
  { timestamp: 2, value: 105 },
  { timestamp: 3, value: 103 },
  { timestamp: 4, value: 108 },
];

const smoothed = iter(data)
  .window(2)
  .map(window => ({
    timestamp: window[1].timestamp,
    value: iter(window).map(d => d.value).mean() ?? 0,
  }))
  .toArray();

// [{timestamp: 2, value: 102.5}, {timestamp: 3, value: 104}, ...]
```

### How do I remove duplicates from a sequence?

```typescript
import { iter } from 'iterflow';

// Simple duplicates (primitives)
const numbers = [1, 2, 2, 3, 1, 4, 2];
iter(numbers).distinct().toArray();
// [1, 2, 3, 4]

// Duplicates by property (objects)
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice2' },  // Duplicate ID
  { id: 3, name: 'Charlie' },
];

const uniqueUsers = iter(users)
  .distinctBy(user => user.id)  // Keep first occurrence
  .toArray();

// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 3, name: 'Charlie'}]
```

### What's the difference between window, chunk, and pairwise?

These are related but different operations:

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5];

// window(3) - Sliding windows (overlapping)
iter(data).window(3).toArray();
// [[1,2,3], [2,3,4], [3,4,5]]
// Use case: Moving averages, sliding analysis

// chunk(2) - Non-overlapping groups
iter(data).chunk(2).toArray();
// [[1,2], [3,4], [5]]
// Use case: Batch processing, pagination

// pairwise() - Consecutive pairs (window size 2)
iter(data).pairwise().toArray();
// [[1,2], [2,3], [3,4], [4,5]]
// Use case: Comparing consecutive elements
```

**Visual comparison:**

```plaintext
Data: [1, 2, 3, 4, 5]

window(3):     [1, 2, 3]
                  [2, 3, 4]
                     [3, 4, 5]

chunk(2):      [1, 2] [3, 4] [5]

pairwise():    [1, 2]
                  [2, 3]
                     [3, 4]
                        [4, 5]
```

### How do I work with infinite sequences safely?

Infinite sequences are useful but dangerous - always limit them!

```typescript
import { iter } from 'iterflow';

//  This hangs forever!
// iter.repeat(1).toArray();

//  Use take() to limit
iter.repeat(1).take(5).toArray();
// [1, 1, 1, 1, 1]

//  Fibonacci with take
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

iter(fibonacci())
  .take(10)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

//  Or use takeWhile
iter(fibonacci())
  .takeWhile(x => x < 1000)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, ...]
```

**Common patterns:**

```typescript
// Infinite range
iter.range(0, Infinity).take(5).toArray();
// [0, 1, 2, 3, 4]

// Repeat with limit
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

// Generator with limit
iter(myGenerator()).take(10).toArray();
```

### How do I combine multiple iterators?

```typescript
import { iter } from 'iterflow';

const nums = [1, 2, 3];
const letters = ['a', 'b', 'c'];

// zip - Parallel combination (stops at shortest)
iter.zip(nums, letters).toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]

// chain - Sequential concatenation
iter.chain(nums, [4, 5]).toArray();
// [1, 2, 3, 4, 5]

// interleave - Alternating elements
iter.interleave(nums, letters).toArray();
// [1, 'a', 2, 'b', 3, 'c']

// merge - Merge sorted sequences
iter.merge([1, 3, 5], [2, 4, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

**Real-world example:**

```typescript
// Combine results from multiple sources
const userIds = [1, 2, 3];
const userNames = ['Alice', 'Bob', 'Charlie'];
const userAges = [30, 25, 35];

const users = iter.zip(userIds, userNames, userAges)
  .map(([id, name, age]) => ({ id, name, age }))
  .toArray();

// [
//   { id: 1, name: 'Alice', age: 30 },
//   { id: 2, name: 'Bob', age: 25 },
//   { id: 3, name: 'Charlie', age: 35 }
// ]
```

### How do I filter and transform data in a pipeline?

```typescript
import { iter } from 'iterflow';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 20, category: 'Electronics' },
  { id: 3, name: 'Desk', price: 300, category: 'Furniture' },
  { id: 4, name: 'Chair', price: 150, category: 'Furniture' },
];

// Multi-step pipeline
const result = iter(products)
  .filter(p => p.category === 'Electronics')  // Keep only electronics
  .map(p => ({ ...p, price: p.price * 0.9 })) // Apply 10% discount
  .filter(p => p.price > 50)                   // Keep items over $50
  .toArray();

// [{ id: 1, name: 'Laptop', price: 900, category: 'Electronics' }]
```

**Functional style:**

```typescript
import { pipe } from 'iterflow/fn';
import { filter, map } from 'iterflow/fn';

const filterByCategory = filter((p: Product) => p.category === 'Electronics');
const applyDiscount = map((p: Product) => ({
  ...p,
  price: p.price * 0.9,
}));
const filterByPrice = filter((p: Product) => p.price > 50);

const process = pipe(
  filterByCategory,
  applyDiscount,
  filterByPrice,
);

const result = process(products);
```

### How do I group or partition data?

```typescript
import { iter } from 'iterflow';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Partition - split into two groups
const [evens, odds] = iter(numbers)
  .partition(n => n % 2 === 0);

console.log(evens); // [2, 4, 6, 8]
console.log(odds);  // [1, 3, 5, 7, 9]

// Group by key function
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 },
];

const byAge = iter(users)
  .groupBy(u => u.age);

// Map(2) {
//   30 => [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
//   25 => [{ name: 'Bob', ... }]
// }

// Or convert to object
const result = iter(users)
  .groupBy(u => u.age);

for (const [age, group] of result.entries()) {
  console.log(`Age ${age}: ${group.map(u => u.name).join(', ')}`);
}
```

---

## Performance & Memory

### How does iterflow performance compare to native Array methods?

**iterflow is faster for large datasets with early termination:**

```typescript
import { iter } from 'iterflow';

const numbers = Array.from({ length: 1_000_000 }, (_, i) => i);

//  Arrays methods - processes all 1M items
const result1 = numbers
  .map(x => x * 2)       // Transforms all 1M
  .filter(x => x > 100)  // Filters all 1M
  .slice(0, 5);          // Takes first 5

//  iterflow - stops early
const result2 = iter(numbers)
  .map(x => x * 2)       // Lazy
  .filter(x => x > 100)  // Lazy
  .take(5)               // Stops after 5!
  .toArray();

// iterflow only processes ~6 items vs 1M for Arrays!
```

**Array methods are faster for small datasets:**

```typescript
// With 10 elements, overhead of iterators > benefits
const small = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Arrays are faster
small.map(x => x * 2).filter(x => x > 5);

// iterflow adds small overhead (still negligible)
iter(small).map(x => x * 2).filter(x => x > 5).toArray();
```

**Summary:**

- **Use iterflow** for large datasets (1000+ items) or early termination
- **Use Arrays** for small datasets or when you need multiple passes (arrays are easier)

### How can I process large datasets without running out of memory?

**Strategy: Avoid materializing everything at once**

```typescript
import { iter } from 'iterflow';

//  Bad: Loads all data into memory
const allData = iter(HUGE_DATASET).toArray();

//  Good: Process in chunks
const CHUNK_SIZE = 1000;
const result = iter(HUGE_DATASET)
  .chunk(CHUNK_SIZE)            // Lazy: groups in chunks
  .map(chunk => {
    return processChunk(chunk);  // Process one chunk at a time
  })
  .toArray();                    // Collect results
```

**Example: Processing millions of log lines**

```typescript
import * as fs from 'fs';
import { iter } from 'iterflow';

// Generator that yields lines (doesn't load all at once)
function* readLines(filename: string) {
  const data = fs.readFileSync(filename, 'utf-8');
  for (const line of data.split('\n')) {
    yield line;
  }
}

// Process with iterflow
const stats = iter(readLines('huge.log'))
  .filter(line => line.includes('ERROR'))           // Keep errors
  .map(line => ({
    timestamp: extractTime(line),
    message: extractMessage(line),
  }))
  .chunk(100)                    // Process 100 errors at a time
  .map(errorChunk => ({
    count: errorChunk.length,
    messages: errorChunk.map(e => e.message),
  }))
  .toArray();

// Only keeps current chunk in memory!
```

**Using streaming instead:**

```typescript
// For very large files, use actual streams
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: createReadStream('huge.log'),
  crlfDelay: Infinity,
});

const lineGenerator = async function* () {
  for await (const line of rl) {
    yield line;
  }
};

// Now compatible with iterflow
iter(await lineGenerator())
  .filter(line => line.includes('ERROR'))
  .take(100)  // Only process first 100 errors
  .toArray();
```

### Should I use the wrapper API or functional API for better performance?

**Performance is nearly identical:**

```typescript
import { iter } from 'iterflow';
import { pipe, map, filter, sum } from 'iterflow/fn';

// Wrapper API
const result1 = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 4)
  .sum();

// Functional API
const process = pipe(
  map((x: number) => x * 2),
  filter((x: number) => x > 4),
  sum,
);
const result2 = process([1, 2, 3, 4, 5]);

// Both: ~6,500 ns (microseconds) for 5 elements
// Nearly identical!
```

**Minor difference: Tree-shaking**

```typescript
// Functional API has slightly better tree-shaking
import { sum, map, filter } from 'iterflow/fn';  // Only imports what you use

// Wrapper API bundles the whole class
import { iter } from 'iterflow';  // Imports IterFlow class
```

**Recommendation:**

- Choose based on **code style preference**, not performance
- Both are highly optimized

### What operations trigger eager evaluation?

**Terminal operations (consume the iterator):**

```typescript
import { iter } from 'iterflow';

// These execute immediately:
iter(data).toArray();           // Eager
iter(data).sum();               // Eager
iter(data).mean();              // Eager
iter(data).count();             // Eager
iter(data).min();               // Eager
iter(data).max();               // Eager
iter(data).reduce(...);         // Eager
iter(data).find(...);           // Eager
iter(data).first();             // Eager
iter(data).last();              // Eager
```

**Intermediate operations (lazy):**

```typescript
// These are deferred until a terminal operation:
iter(data)
  .map(x => x * 2)              // Lazy
  .filter(x => x > 5)           // Lazy
  .take(10)                     // Lazy
  .sum();                        // † THIS makes everything execute!
```

**Memory-consuming operations (eager):**

```typescript
// These internally materialize even without explicit toArray():
iter(data).sort();              // Eager: must load all to sort
iter(data).reverse();           // Eager: must load all to reverse
iter(data).median();            // Eager: must load all to find median
iter(data).variance();          // Eager: must load all to calculate
iter(data).groupBy(...);        // Eager: must load all to group
```

---

## Error Handling & Debugging

### How do I handle errors in map/filter functions?

```typescript
import { iter, withErrorRecovery, tryCatch } from 'iterflow';

const data = ['1', '2', 'invalid', '4'];

// Pattern 1: Try/Catch wrapper
const result1 = iter(data)
  .map(x => {
    try {
      return parseInt(x) * 2;
    } catch {
      return 0;  // Default on error
    }
  })
  .toArray();

// Pattern 2: Conditional transformation
const result2 = iter(data)
  .map(x => {
    const num = parseInt(x);
    return isNaN(num) ? 0 : num * 2;
  })
  .toArray();

// Pattern 3: Error recovery utility
const parse = (x: string) => parseInt(x);
const result3 = iter(data)
  .map(x => withErrorRecovery(parse)(x, 0))
  .toArray();

// Result: [2, 4, 0, 8]
```

**Handling missing values:**

```typescript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2 },  // Missing name
  { id: 3, name: 'Charlie' },
];

const result = iter(users)
  .map(user => ({
    ...user,
    name: user.name ?? 'Unknown',  // Provide default
  }))
  .toArray();

// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Unknown' },
//   { id: 3, name: 'Charlie' },
// ]
```

### How do I debug complex pipelines?

**Use `tap()` for side effects:**

```typescript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .tap(x => console.log('After map:', x))      // Debug point 1
  .filter(x => x > 4)
  .tap(x => console.log('After filter:', x))   // Debug point 2
  .take(2)
  .toArray();

// Output:
// After map: 2
// After map: 4
// After map: 6
// After filter: 6
// After filter: 8
// After filter: 10
// After filter: 12
// [6, 8]
```

**Break down pipelines:**

```typescript
// Don't debug a huge pipeline at once!

//  Hard to debug
const result = iter(data)
  .map(transform1)
  .filter(condition1)
  .map(transform2)
  .filter(condition2)
  .toArray();

//  Test each step
const step1 = iter(data).map(transform1).toArray();
console.log('Step 1:', step1);

const step2 = iter(step1).filter(condition1).toArray();
console.log('Step 2:', step2);

const step3 = iter(step2).map(transform2).toArray();
console.log('Step 3:', step3);

const result = iter(step3).filter(condition2).toArray();
console.log('Final:', result);
```

### What validation does iterflow provide?

```typescript
import { iter } from 'iterflow';

// Type validation with TypeScript
const numbers: number[] = [1, 2, 3];
const strings: string[] = ['a', 'b'];

// TypeScript checks that we're calling numeric operations on numbers
iter(numbers).sum();  //  OK
iter(strings).sum();  //  Type error: sum not available on strings
```

**Runtime validation patterns:**

```typescript
// Input validation
function processData(data: any[]) {
  if (!Array.isArray(data)) {
    throw new Error('Expected array');
  }

  return iter(data)
    .filter(x => typeof x === 'number')  // Filter non-numbers
    .filter(x => !isNaN(x))              // Filter NaN
    .filter(x => isFinite(x))            // Filter Infinity
    .toArray();
}
```

---

## Async Operations

### How do I work with async iterators?

```typescript
import { asyncIter } from 'iterflow';

// Async generator
async function* fetchUsers() {
  for (let id = 1; id <= 5; id++) {
    const response = await fetch(`/api/users/${id}`);
    yield response.json();
  }
}

// Use with asyncIter
const result = await asyncIter(fetchUsers())
  .filter(user => user.active)              // Async-friendly filter
  .map(user => ({                           // Async-friendly map
    ...user,
    initials: user.name.substring(0, 2),
  }))
  .take(3)
  .toArray();

// Result: [user1, user2, user3]
```

**Async terminal operations:**

```typescript
const users = asyncIter(fetchUsers());

// Terminal operations must be awaited
const total = await users.count();
const first = await users.first();
const sum = await users.map(u => u.id).sum();
```

### Can I mix sync and async iterators?

Generally **avoid mixing**, but it's possible with care:

```typescript
import { iter, asyncIter } from 'iterflow';

//  This works (both async)
const asyncResult = await asyncIter(fetchData())
  .map(x => x * 2)
  .toArray();

//  Avoid mixing sync operations into async pipeline
// Would need to await or wrap callbacks
```

### How do I handle errors in async pipelines?

```typescript
import { asyncIter } from 'iterflow';

async function* fetchWithErrorHandling() {
  try {
    for (let id = 1; id <= 5; id++) {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        yield response.json();
      } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        // Continue to next item
      }
    }
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

const result = await asyncIter(fetchWithErrorHandling())
  .take(3)
  .toArray();
```

---

## TypeScript & Types

### How do I get proper type inference?

```typescript
import { iter } from 'iterflow';

//  Good: Types inferred automatically
const numbers = [1, 2, 3];
iter(numbers)
  .map(x => x * 2)        // x is inferred as number
  .filter(x => x > 2)     // x is inferred as number
  .sum();                 // Result is number

//  Explicit when needed
const mixed: (number | string)[] = [1, 'a', 2];
iter(mixed)
  .filter((x): x is number => typeof x === 'number')  // Type guard
  .map(x => x * 2)        // x is now number
  .toArray();
```

**Generic constraints:**

```typescript
import { iter } from 'iterflow';

function sumLengths<T extends { length: number }>(items: T[]) {
  return iter(items)
    .map(x => x.length)
    .sum();
}

sumLengths(['hello', 'world']);  //  OK
sumLengths([1, 2, 3]);           //  Type error
```

### Why is TypeScript complaining about my pipeline?

**Common error 1: Type mismatch in map:**

```typescript
//  Error: x is number, but string expected
iter([1, 2, 3])
  .map((x: string) => x.length);

//  Fix: Correct the type
iter([1, 2, 3])
  .map((x: number) => x * 2);
```

**Common error 2: Type narrowing:**

```typescript
const data: (number | string)[] = [1, 'a', 2];

//  Error: string has no method sum()
iter(data).sum();

//  Fix: Filter first
iter(data)
  .filter((x): x is number => typeof x === 'number')
  .sum();
```

**Common error 3: Missing type annotations:**

```typescript
import { sum, map } from 'iterflow/fn';

//  Error: Type inference fails
const process = pipe(
  map(x => x * 2),  // x type unknown
);

//  Fix: Add type annotations
const process = pipe(
  map((x: number) => x * 2),
);
```

### How do I create custom operations with proper types?

```typescript
import { iter, type Iterflow } from 'iterflow';

// Custom operation with proper types
function multiplyBy<T extends number>(factor: T) {
  return function(value: T): T {
    return (value * factor) as T;
  };
}

// Using the custom operation
iter([1, 2, 3])
  .map(multiplyBy(2))
  .toArray();  // [2, 4, 6]

// Functional API
import { map } from 'iterflow/fn';

const double = map((x: number) => x * 2);
double([1, 2, 3]);  // [2, 4, 6]
```

---

## Advanced Topics

### How do I compose operations functionally?

```typescript
import { pipe, map, filter, sum } from 'iterflow/fn';

// Create reusable transformations
const double = (x: number) => x * 2;
const isEven = (x: number) => x % 2 === 0;

// Compose with pipe
const process = pipe(
  filter(isEven),
  map(double),
  sum,
);

// Use multiple times
process([1, 2, 3, 4, 5]);  // 12
process([10, 11, 12, 13]); // 44
```

**Point-free style:**

```typescript
import { pipe, map, filter, reduce } from 'iterflow/fn';

// Function composition
const multiply = (a: number) => (b: number) => a * b;
const add = (a: number) => (b: number) => a + b;

const process = pipe(
  map(multiply(2)),
  filter((x: number) => x > 5),
  reduce(add, 0),
);

// Point-free: No explicit parameters!
```

### How do I create custom statistical operations?

```typescript
import { iter } from 'iterflow';

// Custom: Weighted average
function weightedAverage(
  items: Array<{ value: number; weight: number }>
): number {
  const totalWeight = iter(items)
    .map(x => x.weight)
    .sum();

  const weightedSum = iter(items)
    .map(x => x.value * x.weight)
    .sum();

  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

const data = [
  { value: 10, weight: 1 },
  { value: 20, weight: 2 },
  { value: 30, weight: 1 },
];

weightedAverage(data);  // 20
```

**With reduce:**

```typescript
function geometricMean(numbers: number[]): number {
  const count = numbers.length;
  if (count === 0) return 0;

  const product = iter(numbers)
    .reduce((a, b) => a * b, 1);

  return Math.pow(product, 1 / count);
}

geometricMean([2, 8]);  // 4
```

### Can I use iterflow with other libraries?

**With lodash:**

```typescript
import { iter } from 'iterflow';
import _ from 'lodash';

const data = [1, 2, 3, 4, 5];

// Complementary: lodash for objects, iterflow for sequences
const grouped = _.groupBy(data, x => x % 2);
// { '0': [2, 4], '1': [1, 3, 5] }

// Then use iterflow
iter(grouped['1']).sum();  // 9
```

**With ramda (functional):**

```typescript
import { pipe } from 'iterflow/fn';
import * as R from 'ramda';

// Convert between Ramda and iterflow
const data = [1, 2, 3, 4, 5];

const ramdaResult = R.pipe(
  R.filter(x => x % 2 === 0),
  R.map(x => x * 2),
)(data);

const iterflowResult = iter(ramdaResult).sum();
```

---

## Troubleshooting

### Why is my infinite sequence hanging?

```typescript
import { iter } from 'iterflow';

// This hangs forever!
iter.repeat(1).toArray();

// Always use take() or takeWhile()
iter.repeat(1).take(5).toArray();
// [1, 1, 1, 1, 1]

// Or takeWhile with condition
function* infiniteNumbers() {
  let i = 0;
  while (true) yield i++;
}

iter(infiniteNumbers())
  .takeWhile(x => x < 5)
  .toArray();
// [0, 1, 2, 3, 4]
```

**Prevention:**

1. Always check if a generator could be infinite
2. Always pair infinite generators with `take()` or `takeWhile()`
3. When in doubt, add `take(N)` to debug

### Why am I getting "iterator already consumed" errors?

```typescript
import { iter } from 'iterflow';

const iterator = iter([1, 2, 3]);

//  Error: Iterator consumed
const first = iterator.toArray();   // Consumes
const second = iterator.toArray();  // † Error! Iterator exhausted

//  Solution 1: Create fresh iterators
const first = iter([1, 2, 3]).toArray();
const second = iter([1, 2, 3]).toArray();

//  Solution 2: Cache the result
const data = [1, 2, 3];
const result1 = iter(data).map(x => x * 2).toArray();
const result2 = iter(data).map(x => x * 3).toArray();
```

### My bundle size is too large. How do I fix it?

**Use functional API for better tree-shaking:**

```typescript
//  Larger bundle (includes whole IterFlow class)
import { iter } from 'iterflow';
iter(data).map(x => x * 2);

//  Smaller bundle (tree-shakeable)
import { map } from 'iterflow/fn';
map((x: number) => x * 2)(data);
```

**Check your bundler configuration:**

```javascript
// webpack.config.js
{
  mode: 'production',
  optimization: {
    usedExports: true,  // Enable tree-shaking
    sideEffects: false,
  }
}
```

**Analyze bundle:**

```bash
# Use bundlesize to analyze
npm install --save-dev bundlesize
npx bundlesize
```

### Why are my types not narrowing correctly?

```typescript
//  TypeScript can't infer type narrowing
const data: (number | string)[] = [1, 'a', 2];
const numbers = iter(data)
  .filter(x => typeof x === 'number')
  .toArray();  // Type is still (number | string)[]

//  Use type guard function
const numbers = iter(data)
  .filter((x): x is number => typeof x === 'number')
  .toArray();  // Type is now number[]
```

---

## Migration & Integration

### How do I migrate from Array methods to iterflow?

**Common conversions:**

```typescript
// Array methods †’ iterflow (wrapper)
data.map(x => x * 2)        †’ iter(data).map(x => x * 2).toArray()
data.filter(x => x > 0)     †’ iter(data).filter(x => x > 0).toArray()
data.slice(0, 5)            †’ iter(data).take(5).toArray()
data.slice(5)               †’ iter(data).drop(5).toArray()
data.reduce((a, b) => a + b) †’ iter(data).sum()  // or reduce()
data.find(x => x > 5)       †’ iter(data).find(x => x > 5)
```

**Incremental migration:**

```typescript
// Gradually replace Array chains
// Before:
const result = data
  .filter(x => x > 0)
  .map(x => x * 2)
  .slice(0, 5);

// After:
const result = iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .take(5)
  .toArray();

// Then, remove .toArray() at the end if you're just piping
const processed = iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .take(5);

// Use directly in for...of
for (const item of processed) {
  console.log(item);
}
```

### Is iterflow compatible with ES2025 iterator helpers?

iterflow is **forward-compatible** with the upcoming ES2025 iterator helpers:

```typescript
// Current iterflow
iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray();

// Future: Will work seamlessly with Iterator.prototype methods
// No breaking changes expected
```

**Current status:**

- iterflow uses standard JavaScript iterators
- No conflicts with ES2025 iterator helpers
- Safe to use for forward-compatible code

### How do I contribute or report issues?

**Report bugs:**

- Open an issue on [GitHub](https://github.com/gvsh/iterflow/issues)
- Include: reproduction case, environment, expected vs actual behavior

**Contribute code:**

- See [PLAYBOOK.md](./PLAYBOOK.md) for development workflow
- Fork, create feature branch, make changes, submit PR
- Include tests for new features

**Community:**

- Questions? Open a Discussion on GitHub
- Security concerns? See [SECURITY.md](./SECURITY.md)

---

## Still Have Questions?

- Check [README.md](./README.md) for API reference
- Review [examples/](./examples/) for runnable code samples
- See [SECURITY.md](./SECURITY.md) for security best practices
- Read [PLAYBOOK.md](./PLAYBOOK.md) for contribution guidelines

Happy iterating! 
