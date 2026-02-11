/**
 * 05: Composition Comparison — iterflow vs @stdlib imperative
 * Pipeline: filter(x > 50) -> window(5) -> variance -> take(500)
 */

import { createRequire } from 'node:module';
import { Bench } from 'tinybench';
import { iter } from '../src/index.js';

const require = createRequire(import.meta.url);
const incrmvariance = require('@stdlib/stats-incr-mvariance');

const SCALES = [1_000, 10_000, 100_000];
const WINDOW_SIZE = 5;
const TAKE_COUNT = 500;
const FILTER_THRESHOLD = 50;

const generateData = (count: number): number[] => {
  const data: number[] = [];
  let v = 100;
  for (let i = 0; i < count; i++) {
    v = Math.max(1, v + (Math.random() - 0.5) * 10);
    data.push(v);
  }
  return data;
};

async function benchmarkAtScale(scale: number) {
  const data = generateData(scale);
  const bench = new Bench();

  bench.add('iterflow', () => {
    iter(data)
      .filter(x => x > FILTER_THRESHOLD)
      .window(WINDOW_SIZE)
      .map(w => iter(w).variance())
      .take(TAKE_COUNT)
      .toArray();
  });

  bench.add('@stdlib-imperative', () => {
    const results: (number | null)[] = [];
    const acc = incrmvariance(WINDOW_SIZE);
    let filtered = 0;
    for (const x of data) {
      if (x <= FILTER_THRESHOLD) continue;
      filtered++;
      const v = acc(x);
      if (filtered >= WINDOW_SIZE) {
        results.push(v);
        if (results.length >= TAKE_COUNT) break;
      }
    }
    return results;
  });

  await bench.run();
  console.table(bench.table());

  const tasks = bench.tasks;
  const iterflowOps = (tasks[0]!.result as any)?.throughput?.mean ?? 0;
  const stdlibOps = (tasks[1]!.result as any)?.throughput?.mean ?? 0;
  console.log(`N=${scale}: iterflow ${iterflowOps.toFixed(0)} ops/s, @stdlib ${stdlibOps.toFixed(0)} ops/s\n`);
}

async function main() {
  console.log('\n05: Composition Comparison — iterflow vs @stdlib imperative');
  console.log(`Pipeline: filter(x > 50) -> window(${WINDOW_SIZE}) -> variance -> take(${TAKE_COUNT})\n`);

  for (const scale of SCALES) {
    await benchmarkAtScale(scale);
  }
}

main().catch(console.error);
