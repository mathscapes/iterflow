# iterflow Examples

Comprehensive examples demonstrating iterflow capabilities from basic operations to advanced workflows.

## Running Examples

All basic examples can be run directly with Node.js 18+:

```bash
node examples/<filename>.ts
```

Or use tsx for TypeScript execution:

```bash
npx tsx examples/<filename>.ts
```

## Example Categories

### Foundational Examples (4 examples)

Perfect for getting started with iterflow:

- **basic-stats.ts** - Statistical operations (mean, median, mode, quartiles, variance)
- **moving-average.ts** - Windowing and sliding window calculations
- **fibonacci.ts** - Lazy evaluation with infinite generators
- **chaining.ts** - Method chaining and composition patterns

### Coming Soon

The following examples are being refined and will be added in a future release:

- **nodejs-streams.ts** - Integration with Node.js Streams API
- **web-streams.ts** - Web Streams API integration
- **csv-streaming.ts** - Stream processing of CSV data
- **json-pipeline.ts** - Complex JSON transformation pipelines
- **log-processing.ts** - Log file analysis and filtering
- **time-series-analysis.ts** - Time series data analysis
- **statistical-workflow.ts** - Complex statistical workflows
- **realtime-filtering.ts** - Real-time stream filtering

## Framework Integration Examples

The following examples require peer dependencies and are included but not committed in v0.3.0:

- **express-middleware.ts** (requires `express`) - Express.js middleware integration
- **fastify-plugin.ts** (requires `fastify`) - Fastify plugin integration
- **react-hooks.ts** (requires `react`) - React hooks integration
- **vue-composables.ts** (requires `vue`) - Vue 3 composables integration
- **rxjs-interop.ts** (requires `rxjs`) - RxJS interoperability

To use framework examples, install the required peer dependency first:

```bash
npm install express  # for express-middleware.ts
npm install fastify  # for fastify-plugin.ts
npm install react    # for react-hooks.ts
npm install vue      # for vue-composables.ts
npm install rxjs     # for rxjs-interop.ts
```

## Dependencies

Basic examples use only:

- Node.js 18+ built-in APIs
- iterflow library

**No external dependencies required for the 4 included examples.**

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
