# iterflow Examples

Comprehensive examples demonstrating iterflow capabilities.

## Running Examples

All examples can be run directly with Node.js 18+:

```bash
node examples/<filename>.ts
```

Or use tsx for TypeScript execution:

```bash
npx tsx examples/<filename>.ts
```

## Examples

Perfect for getting started with iterflow:

- **basic-stats.ts** - Statistical operations (mean, median, mode, quartiles, variance)
- **moving-average.ts** - Windowing and sliding window calculations
- **fibonacci.ts** - Lazy evaluation with infinite generators
- **chaining.ts** - Method chaining and composition patterns

## Dependencies

All examples use only:

- Node.js 18+ built-in APIs
- iterflow library

**No external dependencies required.**

## Learning Path

Recommended order for learning iterflow:

1. **basic-stats.ts** - Understand core statistical operations
2. **chaining.ts** - Learn method composition and chaining
3. **moving-average.ts** - Understand windowing operations
4. **fibonacci.ts** - Master lazy evaluation with infinite sequences

## Example Highlights

### Basic Statistics

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stats = {
  mean: iter(data).mean(),
  median: iter(data).median(),
  variance: iter(data).variance(),
  stdDev: iter(data).stdDev()
};
```

### Moving Averages

```typescript
const temperatures = [20, 22, 25, 23, 21, 19, 18, 20, 22, 24];
const movingAvg = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();
```

### Lazy Evaluation

```typescript
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const evenFibs = iter(fibonacci())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();
```

## Contributing Examples

When adding new examples:

1. Focus on a single concept or use case
2. Include clear comments explaining key concepts
3. Use realistic, practical scenarios
4. Test the example before committing
5. Update this README with the new example
6. Follow the existing code style

## Questions or Issues?

- Check the main [README.md](../README.md)
- Review the [API documentation](../docs/)
- Open an issue on [GitHub](https://github.com/mathscapes/iterflow/issues)

## License

All examples are released under the Unlicense. See [LICENSE](../LICENSE) for details.
