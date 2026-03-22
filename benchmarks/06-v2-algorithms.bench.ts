/**
 * 06: V2 Streaming Algorithms
 * Benchmarks for new v2 algorithms: streaming quantiles, skewness/kurtosis,
 * linear regression, and auto-correlation.
 */

import { Bench } from 'tinybench';
import { iter } from '../src/index.js';
import { BENCHMARK_SCALES } from './config.js';

// -- Naive baselines --

function naiveQuantile(data: number[], p: number): number {
  const sorted = [...data].sort((a, b) => a - b);
  const idx = Math.ceil(p * sorted.length) - 1;
  return sorted[Math.max(0, idx)]!;
}

function naiveSkewness(data: number[]): number {
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  let m2 = 0, m3 = 0;
  for (const x of data) {
    const d = x - mean;
    m2 += d * d;
    m3 += d * d * d;
  }
  m2 /= n;
  m3 /= n;
  const s = Math.sqrt(m2);
  return s === 0 ? 0 : m3 / (s * s * s);
}

function naiveKurtosis(data: number[]): number {
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  let m2 = 0, m4 = 0;
  for (const x of data) {
    const d = x - mean;
    m2 += d * d;
    m4 += d * d * d * d;
  }
  m2 /= n;
  m4 /= n;
  return m2 === 0 ? 0 : (m4 / (m2 * m2)) - 3;
}

function naiveLinearRegression(pairs: [number, number][]): { slope: number; intercept: number; rSquared: number } {
  const n = pairs.length;
  let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pairs) {
    sx += x;
    sy += y;
    sxy += x * y;
    sxx += x * x;
    syy += y * y;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const yMean = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const [x, y] of pairs) {
    ssTot += (y - yMean) ** 2;
    ssRes += (y - (slope * x + intercept)) ** 2;
  }
  return { slope, intercept, rSquared: ssTot === 0 ? 0 : 1 - ssRes / ssTot };
}

function naiveAutoCorrelation(data: number[], lag: number): number[] {
  const result: number[] = [];
  for (let i = lag; i < data.length; i++) {
    const window = data.slice(0, i + 1);
    const n = window.length;
    const mean = window.reduce((s, v) => s + v, 0) / n;
    let cov = 0, variance = 0;
    for (let j = 0; j < n; j++) {
      variance += (window[j]! - mean) ** 2;
      if (j >= lag) cov += (window[j]! - mean) * (window[j - lag]! - mean);
    }
    result.push(variance === 0 ? 0 : cov / variance);
  }
  return result;
}

// -- Data generators --

function generateRandomWalk(count: number): number[] {
  const data: number[] = [];
  let v = 100;
  for (let i = 0; i < count; i++) {
    v = Math.max(1, v + (Math.random() - 0.5) * 10);
    data.push(v);
  }
  return data;
}

function generatePairs(count: number): [number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const x = i;
    const y = 2.5 * i + 10 + (Math.random() - 0.5) * 20;
    return [x, y] as [number, number];
  });
}

// -- Benchmarks --

const SCALE = BENCHMARK_SCALES.WINDOWED_OPS; // 10000
const LARGE_SCALE = BENCHMARK_SCALES.STANDALONE_STATS; // 100000

async function main() {
  console.log('\n06: V2 Streaming Algorithms\n');

  // Streaming quantile vs naive sort-based
  {
    console.log('Streaming quantile (P-square) vs naive sort...');
    const data = generateRandomWalk(SCALE);
    const bench = new Bench();
    bench.add('iterflow-streaming-quantile', () => iter(data).streamingQuantile(0.5).toArray());
    bench.add('naive-sort-quantile', () => {
      const result: number[] = [];
      for (let i = 1; i <= data.length; i++) {
        result.push(naiveQuantile(data.slice(0, i), 0.5));
      }
      return result;
    });
    await bench.run();
    console.table(bench.table());
  }

  // Streaming skewness vs batch
  {
    console.log('Streaming skewness vs batch...');
    const data = generateRandomWalk(SCALE);
    const bench = new Bench();
    bench.add('iterflow-streaming-skewness', () => iter(data).streamingSkewness().toArray());
    bench.add('naive-batch-skewness', () => {
      const result: number[] = [];
      for (let i = 3; i <= data.length; i++) {
        result.push(naiveSkewness(data.slice(0, i)));
      }
      return result;
    });
    await bench.run();
    console.table(bench.table());
  }

  // Streaming kurtosis vs batch
  {
    console.log('Streaming kurtosis vs batch...');
    const data = generateRandomWalk(SCALE);
    const bench = new Bench();
    bench.add('iterflow-streaming-kurtosis', () => iter(data).streamingKurtosis().toArray());
    bench.add('naive-batch-kurtosis', () => {
      const result: number[] = [];
      for (let i = 4; i <= data.length; i++) {
        result.push(naiveKurtosis(data.slice(0, i)));
      }
      return result;
    });
    await bench.run();
    console.table(bench.table());
  }

  // Streaming linear regression vs batch OLS
  {
    console.log('Streaming linear regression vs batch OLS...');
    const pairs = generatePairs(SCALE);
    const bench = new Bench();
    bench.add('iterflow-streaming-regression', () => iter(pairs).streamingLinearRegression().toArray());
    bench.add('naive-batch-ols', () => {
      const result: { slope: number; intercept: number; rSquared: number }[] = [];
      for (let i = 2; i <= pairs.length; i++) {
        result.push(naiveLinearRegression(pairs.slice(0, i)));
      }
      return result;
    });
    await bench.run();
    console.table(bench.table());
  }

  // Auto-correlation streaming vs batch
  {
    console.log('Auto-correlation streaming vs batch...');
    const data = generateRandomWalk(SCALE);
    const lag = 10;
    const bench = new Bench();
    bench.add('iterflow-autocorrelation', () => iter(data).autoCorrelation(lag).toArray());
    bench.add('naive-batch-autocorrelation', () => naiveAutoCorrelation(data, lag));
    await bench.run();
    console.table(bench.table());
  }
}

main().catch(console.error);
