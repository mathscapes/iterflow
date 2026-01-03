/**
 * 01: Lazy Evaluation Benefits
 * Filter-Map-Take pipeline with early termination
 */

import { Bench } from 'tinybench';
import { iter } from '../src/index.js';
import { SCALES, TRANSACTION_CONFIG } from './config.js';

interface Transaction {
  id: number;
  amount: number;
  flagged: boolean;
}

const generateTransactions = (count: number): Transaction[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    amount: Math.random() * TRANSACTION_CONFIG.MAX_AMOUNT,
    flagged: Math.random() < TRANSACTION_CONFIG.FLAGGED_PROBABILITY
  }));

async function benchmarkAtScale(scale: number) {
  console.log(`\nN=${scale.toLocaleString()}`);
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

  await bench.run();
  console.table(bench.table());

  const results = bench.tasks.map(task => ({
    lib: task.name,
    ops: (task.result as any)?.throughput?.mean || 0
  }));

  const ratio = results[0].ops / results[1].ops;
  console.log(`Speedup: ${ratio.toFixed(2)}x`);

  return results;
}

async function main() {
  console.log('\n01: Lazy Evaluation Benefits');
  console.log(`Filter-Map-Take with early termination at ${TRANSACTION_CONFIG.TAKE_COUNT} elements\n`);

  for (const scale of SCALES) {
    await benchmarkAtScale(scale);
  }
}

main().catch(console.error);
