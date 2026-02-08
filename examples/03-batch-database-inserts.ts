import { iter } from '@mathscapes/iterflow';

function* generateRecords(count: number = 1_000_000) {
  for (let i = 0; i < count; i++) {
    yield { id: i, data: `record_${i}` };
  }
}

const db = {
  totalInserted: 0,
  insertMany(records: any[]) {
    this.totalInserted += records.length;
  }
};

console.log('Batch inserting records (using 10,000 for demo)...\n');

iter(generateRecords(10_000))
  .chunk(500)
  .forEach(batch => db.insertMany(batch));

console.log(`Inserted ${db.totalInserted} records in batches of 500`);
console.log('Memory usage: Constant — only 500 records in memory at a time');
