/**
 * Example 3: Batch Database Inserts
 *
 * Problem: Insert 1M records in batches of 500 without loading all into memory.
 *
 * This example demonstrates:
 * - chunk() for batching
 * - forEach() for side effects
 * - Constant memory usage with generators
 * - Processing large datasets efficiently
 */

import { iter } from '@mathscapes/iterflow';
import _ from 'lodash';
import { from } from 'rxjs';
import { bufferCount } from 'rxjs/operators';

// Simulate a generator that produces 1M records
function* generateRecords(count: number = 1_000_000) {
  for (let i = 0; i < count; i++) {
    yield { id: i, data: `record_${i}` };
  }
}

// Mock database for demonstration
const db = {
  totalInserted: 0,
  insertMany(records: any[]) {
    this.totalInserted += records.length;
    // Simulate async DB operation
    // In real code: await this.collection.insertMany(records);
  }
};

console.log('Batch inserting records (using 10,000 for demo speed)...\n');

console.log('Native JS');
{
  db.totalInserted = 0;
  let batch: any[] = [];
  for (const record of generateRecords(10_000)) {
    batch.push(record);
    if (batch.length === 500) {
      db.insertMany(batch);
      batch = [];
    }
  }
  if (batch.length) db.insertMany(batch);
  console.log(`Inserted ${db.totalInserted} records in batches of 500`);
}

console.log('\nLodash');
{
  // Can't handle generators lazily — must collect first (OOM risk)
  db.totalInserted = 0;
  const all = [...generateRecords(10_000)]; // Memory spike!
  _.chunk(all, 500).forEach(batch => db.insertMany(batch));
  console.log(`Inserted ${db.totalInserted} records in batches of 500`);
  console.log('Note: Lodash loaded all records into memory first');
}

console.log('\nRxJS');
{
  db.totalInserted = 0;
  from(generateRecords(10_000)).pipe(
    bufferCount(500)
  ).subscribe(batch => db.insertMany(batch));
  console.log(`Inserted ${db.totalInserted} records in batches of 500`);
}

console.log('\niterflow');
{
  db.totalInserted = 0;
  iter(generateRecords(10_000))
    .chunk(500)
    .forEach(batch => db.insertMany(batch));
  console.log(`Inserted ${db.totalInserted} records in batches of 500`);
  console.log('Memory usage: Constant — only 500 records in memory at a time');
}
