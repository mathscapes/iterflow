# iterflow Benchmarks

Performance benchmarks validating the core hypotheses of the iterflow JOSS paper.

## Requirements

- Node.js v18+
- GC benchmarks require `--expose-gc` flag

## Benchmarks

### 01: Lazy Evaluation Benefits

```bash
npx tsx 01-lazy-evaluation.bench.ts
```

Filter-Map-Take pipeline with early termination. Expected: iterflow outperforms native arrays at N >= 10K.

### 02: Statistical Operations Efficiency

```bash
npx tsx 02-statistical-operations.bench.ts
```

Windowed mean/variance and standalone statistics. Expected: Competitive performance with superior API.

### 03: Memory Efficiency

```bash
node --expose-gc --import tsx 03-memory-efficiency.bench.ts
```

GC pressure comparison. Expected: ~50% fewer GC events, reduced memory delta.

## Run All

```bash
npx tsx 01-lazy-evaluation.bench.ts
npx tsx 02-statistical-operations.bench.ts
node --expose-gc --import tsx 03-memory-efficiency.bench.ts
```

## Structure

```text
benchmarks/
├── 01-lazy-evaluation.bench.ts
├── 02-statistical-operations.bench.ts
├── 03-memory-efficiency.bench.ts (self-contained with GC utilities)
├── config.ts (shared scales)
└── README.md
```

## Reproduction

For consistent results:

- Node.js v18+ (paper used v20.x)
- Run each benchmark 3-5 times
- Minimize background processes
- Results vary by CPU/memory/Node version
