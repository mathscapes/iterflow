/**
 * Run all benchmarks and output consolidated CSV
 */

import { createRequire } from 'node:module';
import { Bench } from 'tinybench';
import { iter } from '../src/index.js';
import { SCALES, TRANSACTION_CONFIG, PRICE_CONFIG, WINDOW_CONFIG, BENCHMARK_SCALES } from './config.js';

const require = createRequire(import.meta.url);
const incrmvariance = require('@stdlib/stats-incr-mvariance');

interface Row {
  benchmark: string;
  variant: string;
  scale: number;
  opsPerSec: number;
  avgTimeMs: number;
  samples: number;
  throughputSd: number;
  throughputRme: number;
  throughputP75: number;
  throughputP99: number;
  latencySd: number;
  latencyP75: number;
  latencyP99: number;
}

const rows: Row[] = [];

async function run(benchmark: string, scale: number, bench: Bench) {
  await bench.run();
  for (const task of bench.tasks) {
    const r = task.result!;
    rows.push({
      benchmark,
      variant: task.name,
      scale,
      opsPerSec: r.throughput?.mean ?? 0,
      avgTimeMs: r.latency?.mean ?? 0,
      samples: (r.latency as any)?.samplesCount ?? 0,
      throughputSd: r.throughput?.sd ?? 0,
      throughputRme: r.throughput?.rme ?? 0,
      throughputP75: r.throughput?.p75 ?? 0,
      throughputP99: r.throughput?.p99 ?? 0,
      latencySd: r.latency?.sd ?? 0,
      latencyP75: r.latency?.p75 ?? 0,
      latencyP99: r.latency?.p99 ?? 0,
    });
  }
}

// -- 01: Lazy Evaluation --

const generateTransactions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    amount: Math.random() * TRANSACTION_CONFIG.MAX_AMOUNT,
    flagged: Math.random() < TRANSACTION_CONFIG.FLAGGED_PROBABILITY,
  }));

for (const scale of SCALES) {
  const data = generateTransactions(scale);
  const takeCount = Math.min(TRANSACTION_CONFIG.TAKE_COUNT, scale);
  const bench = new Bench();
  bench.add('iterflow', () => {
    iter(data)
      .filter(t => t.amount > TRANSACTION_CONFIG.FILTER_THRESHOLD && !t.flagged)
      .map(t => ({ id: t.id, amount: t.amount }))
      .take(takeCount)
      .toArray();
  });
  bench.add('native', () => {
    data
      .filter(t => t.amount > TRANSACTION_CONFIG.FILTER_THRESHOLD && !t.flagged)
      .map(t => ({ id: t.id, amount: t.amount }))
      .slice(0, takeCount);
  });
  await run('01-lazy-evaluation', scale, bench);
  process.stderr.write(`01 N=${scale} done\n`);
}

// -- 02: Statistical Operations --

const generatePrices = (count: number): number[] => {
  const prices: number[] = [];
  let price = PRICE_CONFIG.BASE_PRICE;
  for (let i = 0; i < count; i++) {
    price = Math.max(PRICE_CONFIG.MIN_PRICE, price + (Math.random() - 0.5) * PRICE_CONFIG.VOLATILITY);
    prices.push(price);
  }
  return prices;
};

const meanNative = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
const varianceTwoPass = (arr: number[]) => {
  const avg = meanNative(arr);
  return arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length;
};
const ewmaManual = (arr: number[], alpha: number) => {
  const result: number[] = [];
  let ewma: number | undefined;
  for (const x of arr) {
    ewma = ewma === undefined ? x : alpha * x + (1 - alpha) * ewma;
    result.push(ewma);
  }
  return result;
};
const correlationTwoPass = (pairs: [number, number][]) => {
  const n = pairs.length;
  const mx = pairs.reduce((s, [x]) => s + x, 0) / n;
  const my = pairs.reduce((s, [, y]) => s + y, 0) / n;
  let cov = 0, vx = 0, vy = 0;
  for (const [x, y] of pairs) { const dx = x - mx; const dy = y - my; cov += dx * dy; vx += dx * dx; vy += dy * dy; }
  return cov / Math.sqrt(vx * vy);
};

const ws = WINDOW_CONFIG.SIZE;
const statScale = BENCHMARK_SCALES.WINDOWED_OPS;

{
  const data = generatePrices(statScale);
  const bench = new Bench();
  bench.add('iterflow', () => iter(data).window(ws).map(w => iter(w).mean()).toArray());
  bench.add('native', () => {
    const r: number[] = [];
    for (let i = 0; i <= data.length - ws; i++) r.push(meanNative(data.slice(i, i + ws)));
    return r;
  });
  await run('02-windowed-mean', statScale, bench);
  process.stderr.write(`02 windowed-mean done\n`);
}

{
  const data = generatePrices(statScale);
  const bench = new Bench();
  bench.add('iterflow', () => iter(data).window(ws).map(w => iter(w).variance()).toArray());
  bench.add('native-two-pass', () => {
    const r: number[] = [];
    for (let i = 0; i <= data.length - ws; i++) r.push(varianceTwoPass(data.slice(i, i + ws)));
    return r;
  });
  await run('02-windowed-variance', statScale, bench);
  process.stderr.write(`02 windowed-variance done\n`);
}

{
  const data = generatePrices(BENCHMARK_SCALES.STANDALONE_STATS);
  const bench = new Bench();
  bench.add('iterflow', () => iter(data).ewma(0.3).toArray());
  bench.add('native', () => ewmaManual(data, 0.3));
  await run('02-ewma', BENCHMARK_SCALES.STANDALONE_STATS, bench);
  process.stderr.write(`02 ewma done\n`);
}

{
  const data = generatePrices(statScale);
  const pairs: [number, number][] = data.map((x, i) => [x, data[data.length - 1 - i]!]);
  const bench = new Bench();
  bench.add('iterflow', () => iter(pairs).streamingCorrelation().toArray());
  bench.add('native-two-pass', () => {
    const r: number[] = [];
    for (let i = 1; i <= pairs.length; i++) r.push(correlationTwoPass(pairs.slice(0, i)));
    return r;
  });
  await run('02-streaming-correlation', statScale, bench);
  process.stderr.write(`02 streaming-correlation done\n`);
}

{
  const data = generatePrices(BENCHMARK_SCALES.STANDALONE_STATS);
  const bench = new Bench();
  bench.add('iterflow-mean', () => iter(data).mean());
  bench.add('native-mean', () => meanNative(data));
  bench.add('iterflow-variance', () => iter(data).variance());
  bench.add('native-variance', () => varianceTwoPass(data));
  bench.add('iterflow-median', () => iter(data).median());
  await run('02-standalone-stats', BENCHMARK_SCALES.STANDALONE_STATS, bench);
  process.stderr.write(`02 standalone-stats done\n`);
}

// -- 04: Anomaly Detection & Windowed Extrema --

const generateData = (count: number): number[] => {
  const data: number[] = [];
  let v = 100;
  for (let i = 0; i < count; i++) {
    v = Math.max(1, v + (Math.random() - 0.5) * 10);
    data.push(v);
  }
  return data;
};

const naiveWindowedMin = (data: number[], size: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i <= data.length - size; i++) {
    let min = data[i]!;
    for (let j = i + 1; j < i + size; j++) if (data[j]! < min) min = data[j]!;
    result.push(min);
  }
  return result;
};

const naiveWindowedMax = (data: number[], size: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i <= data.length - size; i++) {
    let max = data[i]!;
    for (let j = i + 1; j < i + size; j++) if (data[j]! > max) max = data[j]!;
    result.push(max);
  }
  return result;
};

const naiveZScore = (data: number[]): number[] => {
  const result: number[] = [];
  let sum = 0, sumSq = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < 2) { result.push(NaN); } else {
      const m = sum / i;
      const v = (sumSq / i) - m * m;
      const s = Math.sqrt(Math.max(0, v));
      const d = data[i]! - m;
      result.push(d === 0 ? 0 : d / s);
    }
    sum += data[i]!;
    sumSq += data[i]! * data[i]!;
  }
  return result;
};

for (const winSize of [ws, 50]) {
  const data = generateData(BENCHMARK_SCALES.WINDOWED_OPS);
  const bench = new Bench();
  bench.add('iterflow-monotonic-deque', () => iter(data).windowedMin(winSize).toArray());
  bench.add('naive-O(n*k)', () => naiveWindowedMin(data, winSize));
  await run(`04-windowed-min-w${winSize}`, BENCHMARK_SCALES.WINDOWED_OPS, bench);
  process.stderr.write(`04 windowed-min w=${winSize} done\n`);
}

for (const winSize of [ws, 50]) {
  const data = generateData(BENCHMARK_SCALES.WINDOWED_OPS);
  const bench = new Bench();
  bench.add('iterflow-monotonic-deque', () => iter(data).windowedMax(winSize).toArray());
  bench.add('naive-O(n*k)', () => naiveWindowedMax(data, winSize));
  await run(`04-windowed-max-w${winSize}`, BENCHMARK_SCALES.WINDOWED_OPS, bench);
  process.stderr.write(`04 windowed-max w=${winSize} done\n`);
}

{
  const data = generateData(BENCHMARK_SCALES.STANDALONE_STATS);
  const bench = new Bench();
  bench.add('iterflow', () => iter(data).streamingZScore().toArray());
  bench.add('naive', () => naiveZScore(data));
  await run('04-streaming-zscore', BENCHMARK_SCALES.STANDALONE_STATS, bench);
  process.stderr.write(`04 streaming-zscore done\n`);
}

// -- 05: Composition Comparison (@stdlib) --

const STDLIB_SCALES = [1_000, 10_000, 100_000];
const STDLIB_WINDOW = 5;
const STDLIB_TAKE = 500;
const STDLIB_THRESHOLD = 50;

for (const scale of STDLIB_SCALES) {
  const data = generateData(scale);
  const bench = new Bench();
  bench.add('iterflow', () => {
    iter(data)
      .filter(x => x > STDLIB_THRESHOLD)
      .window(STDLIB_WINDOW)
      .map(w => iter(w).variance())
      .take(STDLIB_TAKE)
      .toArray();
  });
  bench.add('@stdlib-imperative', () => {
    const results: (number | null)[] = [];
    const acc = incrmvariance(STDLIB_WINDOW);
    let filtered = 0;
    for (const x of data) {
      if (x <= STDLIB_THRESHOLD) continue;
      filtered++;
      const v = acc(x);
      if (filtered >= STDLIB_WINDOW) {
        results.push(v);
        if (results.length >= STDLIB_TAKE) break;
      }
    }
    return results;
  });
  await run('05-stdlib-comparison', scale, bench);
  process.stderr.write(`05 N=${scale} done\n`);
}

// -- Output CSV --

console.log('benchmark,variant,scale,ops_per_sec,avg_time_ms,samples,throughput_sd,throughput_rme_pct,throughput_p75,throughput_p99,latency_sd,latency_p75,latency_p99');
for (const r of rows) {
  console.log(`${r.benchmark},${r.variant},${r.scale},${r.opsPerSec.toFixed(2)},${r.avgTimeMs.toFixed(6)},${r.samples},${r.throughputSd.toFixed(2)},${r.throughputRme.toFixed(4)},${r.throughputP75.toFixed(2)},${r.throughputP99.toFixed(2)},${r.latencySd.toFixed(6)},${r.latencyP75.toFixed(6)},${r.latencyP99.toFixed(6)}`);
}
