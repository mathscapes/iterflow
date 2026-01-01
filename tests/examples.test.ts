/**
 * Example Tests
 *
 * Comprehensive tests for all 10 iterflow examples.
 * These tests validate that iterflow produces correct results.
 */

import test from 'node:test';
import assert from 'node:assert';
import { iter } from '../src/index.js';

// Helper: Fibonacci generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Helper: Generate records
function* generateRecords(count: number) {
  for (let i = 0; i < count; i++) {
    yield { id: i, data: `record_${i}` };
  }
}

// Example 1: Moving Average
test('example 1: moving average calculates 5-day average correctly', () => {
  const prices = [100, 102, 104, 103, 105, 107, 106, 108, 110, 109];
  const result = iter(prices)
    .window(5)
    .map(w => iter(w).mean())
    .toArray();

  assert.deepEqual(result, [102.8, 104.2, 105, 105.8, 107.2, 108]);
});

// Example 2: First Valid Transactions
test('example 2: filters and takes first 10 valid transactions', () => {
  const transactions = [
    { id: 1, amount: 500, flagged: false },
    { id: 2, amount: 1500, flagged: true },
    { id: 3, amount: 2000, flagged: false },
    { id: 4, amount: 800, flagged: false },
    { id: 5, amount: 3000, flagged: false },
    { id: 6, amount: 1200, flagged: false },
    { id: 7, amount: 900, flagged: false },
    { id: 8, amount: 2500, flagged: false },
    { id: 9, amount: 1100, flagged: true },
    { id: 10, amount: 1800, flagged: false },
    { id: 11, amount: 1500, flagged: false },
    { id: 12, amount: 2200, flagged: false },
    { id: 13, amount: 1300, flagged: false },
    { id: 14, amount: 1700, flagged: false },
    { id: 15, amount: 1900, flagged: false },
  ];

  const result = iter(transactions)
    .filter(t => t.amount > 1000 && !t.flagged)
    .take(10)
    .toArray();

  assert.strictEqual(result.length, 10);
  assert.ok(result.every(t => t.amount > 1000 && !t.flagged));
  assert.strictEqual(result[0].id, 3);
});

// Example 3: Batch Database Inserts
test('example 3: chunks records into batches of 500', () => {
  const batches = iter(generateRecords(1500))
    .chunk(500)
    .toArray();

  assert.strictEqual(batches.length, 3);
  assert.strictEqual(batches[0].length, 500);
  assert.strictEqual(batches[1].length, 500);
  assert.strictEqual(batches[2].length, 500);
});

test('example 3: handles partial batches correctly', () => {
  const batches = iter(generateRecords(1250))
    .chunk(500)
    .toArray();

  assert.strictEqual(batches.length, 3);
  assert.strictEqual(batches[0].length, 500);
  assert.strictEqual(batches[1].length, 500);
  assert.strictEqual(batches[2].length, 250);
});

// Example 4: Sensor Anomaly Detection
test('example 4: detects anomalies using rolling statistics', () => {
  const readings = [10, 11, 10, 12, 11, 50, 10, 11, 12, 10];
  const windowSize = 5;
  const anomalies = [];

  const windows = iter(readings)
    .window(windowSize)
    .toArray();

  for (let i = windowSize; i < readings.length; i++) {
    const window = windows[i - windowSize];
    const mean = iter(window).mean();
    const stdDev = Math.sqrt(iter(window).variance());

    if (Math.abs(readings[i] - mean) > 3 * stdDev) {
      anomalies.push({ index: i, value: readings[i] });
    }
  }

  assert.strictEqual(anomalies.length, 1);
  assert.strictEqual(anomalies[0].value, 50);
});

// Example 5: Log File Processing
test('example 5: drops, filters, and takes correctly', () => {
  const lines = Array.from({ length: 2000 }, (_, i) =>
    `Line ${i + 1}: ${i < 100 ? 'HEADER' : 'Data'}`
  );

  const result = iter(lines)
    .drop(100)
    .filter((_, i) => i % 10 === 0)
    .take(100)
    .toArray();

  assert.strictEqual(result.length, 100);
  assert.ok(result[0].includes('Line 101'));
});

// Example 6: Deduplicated Events
test('example 6: extracts unique user IDs preserving order', () => {
  const events = [
    { userId: 'a', action: 'click' },
    { userId: 'b', action: 'view' },
    { userId: 'a', action: 'purchase' },
    { userId: 'c', action: 'click' },
    { userId: 'b', action: 'click' },
    { userId: 'd', action: 'view' },
    { userId: 'a', action: 'share' },
    { userId: 'e', action: 'purchase' },
  ];

  const result = iter(events)
    .map(e => e.userId)
    .distinct()
    .toArray();

  assert.deepEqual(result, ['a', 'b', 'c', 'd', 'e']);
});

// Example 7: Fibonacci Until Condition
test('example 7: sums fibonacci numbers until exceeding 1000', () => {
  const sum = iter(fibonacci())
    .takeWhile(n => n <= 1000)
    .sum();

  assert.strictEqual(sum, 2583);
});

test('example 7: gets correct fibonacci sequence count', () => {
  const sequence = iter(fibonacci())
    .takeWhile(n => n <= 1000)
    .toArray();

  assert.strictEqual(sequence.length, 17);
  assert.deepEqual(
    sequence,
    [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]
  );
});

// Example 8: Pairwise Price Changes
test('example 8: calculates percentage changes between consecutive prices', () => {
  const prices = [100, 105, 103, 108, 106];
  const changes = iter(prices)
    .window(2)
    .map(([prev, curr]) => (curr - prev) / prev * 100)
    .toArray();

  assert.strictEqual(changes.length, 4);
  assert.ok(Math.abs(changes[0] - 5.00) < 0.01);
  assert.ok(Math.abs(changes[1] - (-1.90)) < 0.01);
  assert.ok(Math.abs(changes[2] - 4.85) < 0.01);
  assert.ok(Math.abs(changes[3] - (-1.85)) < 0.01);
});

// Example 9: Multi-Source Log Merge
test('example 9: concatenates and filters logs from multiple sources', () => {
  const server1Logs = [
    '[INFO] Server 1 started',
    '[ERROR] Server 1: disk full',
    '[INFO] Server 1: processing request',
  ];

  const server2Logs = [
    '[WARN] Server 2: high memory usage',
    '[ERROR] Server 2: database timeout',
    '[INFO] Server 2: cache hit',
  ];

  const server3Logs = [
    '[ERROR] Server 3: application crash',
    '[INFO] Server 3: restart initiated',
    '[ERROR] Server 3: out of memory',
  ];

  const result = iter(server1Logs)
    .concat(server2Logs, server3Logs)
    .filter(l => l.includes('[ERROR]'))
    .toArray();

  assert.strictEqual(result.length, 4);
  assert.ok(result.every(log => log.includes('[ERROR]')));
});

test('example 9: stops early with take', () => {
  const server1Logs = ['[ERROR] 1', '[ERROR] 2', '[ERROR] 3'];
  const server2Logs = ['[ERROR] 4', '[ERROR] 5', '[ERROR] 6'];
  const server3Logs = ['[ERROR] 7', '[ERROR] 8', '[ERROR] 9'];

  const result = iter(server1Logs)
    .concat(server2Logs, server3Logs)
    .filter(l => l.includes('[ERROR]'))
    .take(5)
    .toArray();

  assert.strictEqual(result.length, 5);
});

// Example 10: Percentile Filtering
test('example 10: filters values above 75th percentile', () => {
  const values = [12, 47, 23, 89, 15, 62, 34, 78, 45, 91];
  const sorted = [...values].sort((a, b) => a - b);
  const p75Index = Math.floor(sorted.length * 0.75);
  const p75 = sorted[p75Index];

  const result = iter(values)
    .filter(v => v >= p75)
    .toArray();

  assert.ok(result.every(v => v >= p75));
  assert.ok(result.includes(89));
  assert.ok(result.includes(78));
  assert.ok(result.includes(91));
});

test('example 10: filters values above median', () => {
  const values = [12, 47, 23, 89, 15, 62, 34, 78, 45, 91];
  const median = iter(values).median();
  const result = iter(values)
    .filter(v => v >= median)
    .toArray();

  assert.ok(result.every(v => v >= median));
  assert.strictEqual(median, 46);
});
