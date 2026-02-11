/**
 * 04: Anomaly Detection & Windowed Extrema
 * Monotonic deque vs naive windowed min/max, streaming z-score, circular buffer window
 */

import { Bench } from 'tinybench';
import { iter } from '../src/index.js';
import { BENCHMARK_SCALES, WINDOW_CONFIG } from './config.js';

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
    for (let j = i + 1; j < i + size; j++) {
      if (data[j]! < min) min = data[j]!;
    }
    result.push(min);
  }
  return result;
};

const naiveWindowedMax = (data: number[], size: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i <= data.length - size; i++) {
    let max = data[i]!;
    for (let j = i + 1; j < i + size; j++) {
      if (data[j]! > max) max = data[j]!;
    }
    result.push(max);
  }
  return result;
};

const naiveZScore = (data: number[]): number[] => {
  const result: number[] = [];
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < 2) {
      result.push(NaN);
    } else {
      const mean = sum / i;
      const variance = (sumSq / i) - mean * mean;
      const stddev = Math.sqrt(Math.max(0, variance));
      const diff = data[i]! - mean;
      result.push(diff === 0 ? 0 : diff / stddev);
    }
    sum += data[i]!;
    sumSq += data[i]! * data[i]!;
  }
  return result;
};

async function runBench(name: string, setup: (bench: Bench, data: number[]) => void, scale: number) {
  console.log(`\n${name} - N=${scale.toLocaleString()}`);
  const data = generateData(scale);
  const bench = new Bench();
  setup(bench, data);
  await bench.run();
  console.table(bench.table());
}

async function main() {
  console.log('\n04: Anomaly Detection & Windowed Extrema\n');

  const ws = WINDOW_CONFIG.SIZE;

  await runBench(`Windowed Min (window=${ws})`, (b, data) => {
    b.add('iterflow-monotonic-deque', () => iter(data).windowedMin(ws).toArray());
    b.add('naive-O(n*k)', () => naiveWindowedMin(data, ws));
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  await runBench(`Windowed Max (window=${ws})`, (b, data) => {
    b.add('iterflow-monotonic-deque', () => iter(data).windowedMax(ws).toArray());
    b.add('naive-O(n*k)', () => naiveWindowedMax(data, ws));
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  await runBench(`Windowed Min (window=50)`, (b, data) => {
    b.add('iterflow-monotonic-deque', () => iter(data).windowedMin(50).toArray());
    b.add('naive-O(n*k)', () => naiveWindowedMin(data, 50));
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  await runBench(`Windowed Max (window=50)`, (b, data) => {
    b.add('iterflow-monotonic-deque', () => iter(data).windowedMax(50).toArray());
    b.add('naive-O(n*k)', () => naiveWindowedMax(data, 50));
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  await runBench('Circular Buffer Window', (b, data) => {
    b.add('iterflow-window', () => iter(data).window(ws).toArray());
    b.add('iterflow-window-large', () => iter(data).window(50).toArray());
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  await runBench('Streaming Z-Score', (b, data) => {
    b.add('iterflow', () => iter(data).streamingZScore().toArray());
    b.add('naive', () => naiveZScore(data));
  }, BENCHMARK_SCALES.STANDALONE_STATS);
}

main().catch(console.error);
