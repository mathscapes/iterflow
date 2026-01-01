/**
 * Example 8: Pairwise Price Changes
 *
 * Problem: Calculate percentage change between consecutive prices.
 *
 * This example demonstrates:
 * - window(2) for sliding pairs
 * - map() for calculating differences
 * - Clean pairwise operations
 */

import { iter } from '@mathscapes/iterflow';
import _ from 'lodash';
import { from } from 'rxjs';
import { bufferCount, filter, map } from 'rxjs/operators';

const prices = [100, 105, 103, 108, 106];
console.log('Stock Prices:', prices);
console.log('Calculating percentage change between consecutive prices...\n');

console.log('Native JS');
{
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push((prices[i] - prices[i - 1]) / prices[i - 1] * 100);
  }
  console.log('Price changes (%):', changes.map(c => c.toFixed(2)));
  // [5.00, -1.90, 4.85, -1.85]
}

console.log('\nLodash');
{
  const changes = _.zip(prices.slice(0, -1), prices.slice(1))
    .map(([prev, curr]) => ((curr! - prev!) / prev!) * 100);
  console.log('Price changes (%):', changes.map(c => c.toFixed(2)));
  // Creates intermediate arrays
}

console.log('\nRxJS');
{
  from(prices).pipe(
    bufferCount(2, 1),
    filter(b => b.length === 2),
    map(([prev, curr]) => (curr - prev) / prev * 100)
  ).subscribe(change => {
    console.log('Change:', change.toFixed(2) + '%');
  });
}

console.log('\niterflow');
{
  const changes = iter(prices)
    .window(2)
    .map(([prev, curr]) => (curr - prev) / prev * 100)
    .toArray();
  console.log('Price changes (%):', changes.map(c => c.toFixed(2)));
}

// Bonus: Show with labels
console.log('\nBonus - With date labels (iterflow):');
{
  const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const labeled = iter(prices)
    .window(2)
    .enumerate()
    .map(([i, [prev, curr]]) => {
      const change = (curr - prev) / prev * 100;
      return `${dates[i]} → ${dates[i + 1]}: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    })
    .toArray();

  labeled.forEach(label => console.log('  ' + label));
}
