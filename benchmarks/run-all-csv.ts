/**
 * Run all benchmarks and output consolidated CSV
 * Includes hardware metadata header for reproducibility
 */

import { createRequire } from 'node:module';
import os from 'node:os';
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

// -- 06: V2 Streaming Algorithms --

const naiveQuantile = (data: number[], p: number): number => {
  const sorted = [...data].sort((a, b) => a - b);
  const idx = Math.ceil(p * sorted.length) - 1;
  return sorted[Math.max(0, idx)]!;
};

const naiveSkewness = (data: number[]): number => {
  const n = data.length;
  const avg = data.reduce((s, v) => s + v, 0) / n;
  let m2 = 0, m3 = 0;
  for (const x of data) { const d = x - avg; m2 += d * d; m3 += d * d * d; }
  m2 /= n; m3 /= n;
  const s = Math.sqrt(m2);
  return s === 0 ? 0 : m3 / (s * s * s);
};

const naiveKurtosis = (data: number[]): number => {
  const n = data.length;
  const avg = data.reduce((s, v) => s + v, 0) / n;
  let m2 = 0, m4 = 0;
  for (const x of data) { const d = x - avg; m2 += d * d; m4 += d * d * d * d; }
  m2 /= n; m4 /= n;
  return m2 === 0 ? 0 : (m4 / (m2 * m2)) - 3;
};

const naiveBatchOLS = (pairs: [number, number][]): { slope: number; intercept: number; rSquared: number } => {
  const n = pairs.length;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  for (const [x, y] of pairs) { sx += x; sy += y; sxy += x * y; sxx += x * x; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const yMean = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const [x, y] of pairs) { ssTot += (y - yMean) ** 2; ssRes += (y - (slope * x + intercept)) ** 2; }
  return { slope, intercept, rSquared: ssTot === 0 ? 0 : 1 - ssRes / ssTot };
};

const naiveAutoCorrelation = (data: number[], lag: number): number[] => {
  const result: number[] = [];
  for (let i = lag; i < data.length; i++) {
    const window = data.slice(0, i + 1);
    const n = window.length;
    const avg = window.reduce((s, v) => s + v, 0) / n;
    let cov = 0, vari = 0;
    for (let j = 0; j < n; j++) { vari += (window[j]! - avg) ** 2; if (j >= lag) cov += (window[j]! - avg) * (window[j - lag]! - avg); }
    result.push(vari === 0 ? 0 : cov / vari);
  }
  return result;
};

const generatePairs = (count: number): [number, number][] =>
  Array.from({ length: count }, (_, i) => [i, 2.5 * i + 10 + (Math.random() - 0.5) * 20] as [number, number]);

{
  const data = generateData(statScale);
  const bench = new Bench();
  bench.add('iterflow-p-square', () => iter(data).streamingQuantile(0.5).toArray());
  bench.add('naive-sort-quantile', () => {
    const r: number[] = [];
    for (let i = 1; i <= data.length; i++) r.push(naiveQuantile(data.slice(0, i), 0.5));
    return r;
  });
  await run('06-streaming-quantile', statScale, bench);
  process.stderr.write(`06 streaming-quantile done\n`);
}

{
  const data = generateData(statScale);
  const bench = new Bench();
  bench.add('iterflow-streaming', () => iter(data).streamingSkewness().toArray());
  bench.add('naive-batch', () => {
    const r: number[] = [];
    for (let i = 3; i <= data.length; i++) r.push(naiveSkewness(data.slice(0, i)));
    return r;
  });
  await run('06-streaming-skewness', statScale, bench);
  process.stderr.write(`06 streaming-skewness done\n`);
}

{
  const data = generateData(statScale);
  const bench = new Bench();
  bench.add('iterflow-streaming', () => iter(data).streamingKurtosis().toArray());
  bench.add('naive-batch', () => {
    const r: number[] = [];
    for (let i = 4; i <= data.length; i++) r.push(naiveKurtosis(data.slice(0, i)));
    return r;
  });
  await run('06-streaming-kurtosis', statScale, bench);
  process.stderr.write(`06 streaming-kurtosis done\n`);
}

{
  const pairs = generatePairs(statScale);
  const bench = new Bench();
  bench.add('iterflow-streaming', () => iter(pairs).streamingLinearRegression().toArray());
  bench.add('naive-batch-ols', () => {
    const r: { slope: number; intercept: number; rSquared: number }[] = [];
    for (let i = 2; i <= pairs.length; i++) r.push(naiveBatchOLS(pairs.slice(0, i)));
    return r;
  });
  await run('06-streaming-regression', statScale, bench);
  process.stderr.write(`06 streaming-regression done\n`);
}

{
  const data = generateData(statScale);
  const lag = 10;
  const bench = new Bench();
  bench.add('iterflow-streaming', () => iter(data).autoCorrelation(lag).toArray());
  bench.add('naive-batch', () => naiveAutoCorrelation(data, lag));
  await run('06-autocorrelation', statScale, bench);
  process.stderr.write(`06 autocorrelation done\n`);
}

// -- Output CSV with hardware metadata header --

const cpus = os.cpus();
const cpuModel = cpus[0]?.model ?? 'unknown';
const ramGB = (os.totalmem() / (1024 ** 3)).toFixed(1);
const platform = `${os.type()} ${os.release()} ${os.arch()}`;
const nodeVersion = process.version;
const timestamp = new Date().toISOString();

console.log(`# Hardware: ${cpuModel} | ${ramGB} GB RAM | ${platform} | Node.js ${nodeVersion} | ${timestamp}`);
console.log('benchmark,variant,scale,ops_per_sec,avg_time_ms,samples,throughput_sd,throughput_rme_pct,throughput_p75,throughput_p99,latency_sd,latency_p75,latency_p99');
for (const r of rows) {
  console.log(`${r.benchmark},${r.variant},${r.scale},${r.opsPerSec.toFixed(2)},${r.avgTimeMs.toFixed(6)},${r.samples},${r.throughputSd.toFixed(2)},${r.throughputRme.toFixed(4)},${r.throughputP75.toFixed(2)},${r.throughputP99.toFixed(2)},${r.latencySd.toFixed(6)},${r.latencyP75.toFixed(6)},${r.latencyP99.toFixed(6)}`);
}
