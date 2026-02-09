/**
 * 02: Statistical Operations Efficiency
 * Windowed and standalone statistics
 */

import { Bench } from 'tinybench';
import { iter } from '../src/index.js';
import { PRICE_CONFIG, WINDOW_CONFIG, BENCHMARK_SCALES } from './config.js';

const generatePrices = (count: number, base = PRICE_CONFIG.BASE_PRICE): number[] => {
  const prices: number[] = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    price = Math.max(PRICE_CONFIG.MIN_PRICE, price + (Math.random() - 0.5) * PRICE_CONFIG.VOLATILITY);
    prices.push(price);
  }
  return prices;
};

const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;

const varianceTwoPass = (arr: number[]) => {
  const avg = mean(arr);
  return arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length;
};

const varianceOnline = (arr: number[]) => {
  let sum = 0, sumSq = 0;
  for (const v of arr) {
    sum += v;
    sumSq += v * v;
  }
  const n = arr.length;
  return (sumSq / n) - (sum / n) ** 2;
};

const median = (arr: number[]) => {
  arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid]! : (arr[mid - 1]! + arr[mid]!) / 2;
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
  const meanX = pairs.reduce((s, [x]) => s + x, 0) / n;
  const meanY = pairs.reduce((s, [, y]) => s + y, 0) / n;

  let cov = 0, varX = 0, varY = 0;
  for (const [x, y] of pairs) {
    const dx = x - meanX;
    const dy = y - meanY;
    cov += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }
  return cov / Math.sqrt(varX * varY);
};

async function runBench(name: string, setup: (bench: Bench, data: number[], ws?: number) => void, scale: number, windowSize?: number) {
  console.log(`\n${name} - N=${scale.toLocaleString()}`);
  const data = generatePrices(scale);
  const bench = new Bench();
  setup(bench, data, windowSize);
  await bench.run();
  console.table(bench.table());
}

async function main() {
  console.log('\n02: Statistical Operations Efficiency\n');

  // Windowed mean
  await runBench('Windowed Mean', (b, data, ws = WINDOW_CONFIG.SIZE) => {
    b.add('iterflow', () => iter(data).window(ws).map(w => iter(w).mean()).toArray());
    b.add('native', () => {
      const result: number[] = [];
      for (let i = 0; i <= data.length - ws; i++) {
        result.push(mean(data.slice(i, i + ws)));
      }
      return result;
    });
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  // Windowed variance
  await runBench('Windowed Variance', (b, data, ws = WINDOW_CONFIG.SIZE) => {
    b.add('iterflow', () => iter(data).window(ws).map(w => iter(w).variance()).toArray());
    b.add('native-two-pass', () => {
      const result: number[] = [];
      for (let i = 0; i <= data.length - ws; i++) {
        result.push(varianceTwoPass(data.slice(i, i + ws)));
      }
      return result;
    });
    b.add('native-one-pass', () => {
      const result: number[] = [];
      for (let i = 0; i <= data.length - ws; i++) {
        result.push(varianceOnline(data.slice(i, i + ws)));
      }
      return result;
    });
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  // EWMA
  await runBench('EWMA (alpha=0.1)', (b, data) => {
    b.add('iterflow', () => iter(data).ewma(0.1).toArray());
    b.add('native', () => ewmaManual(data, 0.1));
  }, BENCHMARK_SCALES.STANDALONE_STATS);

  await runBench('EWMA (alpha=0.5)', (b, data) => {
    b.add('iterflow', () => iter(data).ewma(0.5).toArray());
    b.add('native', () => ewmaManual(data, 0.5));
  }, BENCHMARK_SCALES.STANDALONE_STATS);

  await runBench('EWMA (alpha=0.9)', (b, data) => {
    b.add('iterflow', () => iter(data).ewma(0.9).toArray());
    b.add('native', () => ewmaManual(data, 0.9));
  }, BENCHMARK_SCALES.STANDALONE_STATS);

  // Windowed EWMA
  await runBench('Windowed EWMA', (b, data, ws = WINDOW_CONFIG.SIZE) => {
    b.add('iterflow', () => iter(data).window(ws).map(w => iter(w).ewma(0.1).toArray()).toArray());
    b.add('native', () => {
      const result: number[][] = [];
      for (let i = 0; i <= data.length - ws; i++) {
        result.push(ewmaManual(data.slice(i, i + ws), 0.1));
      }
      return result;
    });
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  // Streaming correlation
  await runBench('Streaming Correlation', (b, data) => {
    const pairs: [number, number][] = data.map((x, i) => [x, data[data.length - 1 - i]!]);
    b.add('iterflow', () => iter(pairs).streamingCorrelation().toArray());
    b.add('native-two-pass', () => {
      const result: number[] = [];
      for (let i = 1; i <= pairs.length; i++) {
        result.push(correlationTwoPass(pairs.slice(0, i)));
      }
      return result;
    });
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  // Windowed correlation
  await runBench('Windowed Correlation', (b, data, ws = WINDOW_CONFIG.SIZE) => {
    const pairs: [number, number][] = data.map((x, i) => [x, data[data.length - 1 - i]!]);
    b.add('iterflow', () => {
      return iter(pairs).window(ws).map(w => {
        const corr = iter(w).streamingCorrelation().toArray();
        return corr[corr.length - 1];
      }).toArray();
    });
    b.add('native', () => {
      const result: number[] = [];
      for (let i = 0; i <= pairs.length - ws; i++) {
        result.push(correlationTwoPass(pairs.slice(i, i + ws)));
      }
      return result;
    });
  }, BENCHMARK_SCALES.WINDOWED_OPS);

  // Standalone statistics
  console.log(`\nStandalone Statistics - N=${BENCHMARK_SCALES.STANDALONE_STATS.toLocaleString()}`);
  const data = generatePrices(BENCHMARK_SCALES.STANDALONE_STATS);

  const stats = new Bench();
  stats.add('iterflow-mean', () => iter(data).mean());
  stats.add('native-mean', () => mean(data));
  stats.add('iterflow-variance', () => iter(data).variance());
  stats.add('native-variance-two-pass', () => varianceTwoPass(data));
  stats.add('native-variance-one-pass', () => varianceOnline(data));
  stats.add('iterflow-median', () => iter(data).median());
  stats.add('native-median', () => median(data));

  await stats.run();
  console.table(stats.table());
}

main().catch(console.error);
