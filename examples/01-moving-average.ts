import { iter } from '@mathscapes/iterflow';

const prices = [100, 102, 104, 103, 105, 107, 106, 108, 110, 109];

console.log('Stock Prices:', prices);
console.log('\n5-day moving average:');

const movingAvg = iter(prices)
  .window(5)
  .map(w => iter(w).mean())
  .toArray();

console.log(movingAvg.map(v => v.toFixed(2)));
