import { iter } from '@mathscapes/iterflow';

const prices = [100, 105, 103, 108, 106];

console.log('Stock Prices:', prices);
console.log('Calculating percentage change between consecutive prices...\n');

const changes = iter(prices)
  .window(2)
  .map(([prev, curr]) => (curr - prev) / prev * 100)
  .toArray();

console.log('Price changes (%):', changes.map(c => c.toFixed(2)));

const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const labeled = iter(prices)
  .window(2)
  .enumerate()
  .map(([i, [prev, curr]]) => {
    const change = (curr - prev) / prev * 100;
    return `${dates[i]} → ${dates[i + 1]}: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  })
  .toArray();

console.log('\nWith labels:');
labeled.forEach(label => console.log('  ' + label));
