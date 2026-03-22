# iterflow Benchmarks

Performance benchmarks validating the core hypotheses of the iterflow SoftwareX paper (v2).

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

Windowed mean/variance, EWMA, streaming correlation, and standalone statistics. Expected: Competitive performance with superior API.

### 03: Memory Efficiency

```bash
node --expose-gc --import tsx 03-memory-efficiency.bench.ts
```

GC pressure comparison at N=10K, 100K, 1M. Outputs CSV to `memory/results.csv` with GC event counts, scavenge/mark-sweep breakdown, heap delta, and total pause time.

### 04: Anomaly Detection & Windowed Extrema

```bash
npx tsx 04-anomaly-detection-windowed-extrema.bench.ts
```

Monotonic deque windowedMin/Max vs naive O(n*k), streaming z-score vs naive two-pass. Expected: monotonic deque dominates at large window sizes.

### 05: Composition Comparison (@stdlib)

```bash
npx tsx 05-stdlib-comparison.bench.ts
```

Composable pipeline (filter → window → variance → take) vs @stdlib imperative accumulator.

### 06: V2 Streaming Algorithms

```bash
npx tsx 06-v2-algorithms.bench.ts
```

New v2 algorithms benchmarked against naive baselines:
- Streaming quantiles (P-square) vs naive sort-based
- Streaming skewness vs batch two-pass
- Streaming kurtosis vs batch two-pass
- Streaming linear regression vs batch OLS
- Auto-correlation streaming vs batch

## Run All (Consolidated CSV)

```bash
npx tsx run-all-csv.ts > results.csv 2>progress.log
```

Outputs a single CSV with hardware metadata header. Does not include memory benchmarks (run 03 separately with `--expose-gc`).

For memory benchmarks:

```bash
node --expose-gc --import tsx 03-memory-efficiency.bench.ts
```

## Structure

```text
benchmarks/
├── 01-lazy-evaluation.bench.ts
├── 02-statistical-operations.bench.ts
├── 03-memory-efficiency.bench.ts (self-contained with GC utilities)
├── 04-anomaly-detection-windowed-extrema.bench.ts
├── 05-stdlib-comparison.bench.ts
├── 06-v2-algorithms.bench.ts (v2 streaming algorithms)
├── config.ts (shared scales and configuration)
├── run-all-csv.ts (consolidated CSV runner with hardware metadata)
├── memory/
│   └── results.csv (memory benchmark output)
├── results.csv (consolidated benchmark output)
└── README.md
```

## Reproduction

For consistent results:

- Node.js v18+ (paper benchmarks run on the version documented in results.csv header)
- Run each benchmark 3-5 times
- Minimize background processes
- Results vary by CPU/memory/Node version
- Hardware metadata is automatically recorded in CSV output headers
