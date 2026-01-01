/**
 * Example 2: First 10 Valid Transactions
 *
 * Problem: From a huge log, get first 10 transactions over $1000 that aren't flagged.
 *
 * This example demonstrates:
 * - Lazy evaluation (stops after finding 10)
 * - filter() for conditional selection
 * - take() for limiting results
 * - Memory efficiency with large datasets
 */

import { iter } from 'iterflow';
import _ from 'lodash';
import { from } from 'rxjs';
import { filter, take, toArray } from 'rxjs/operators';

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
  // ... imagine millions more
];

console.log('Finding first 10 valid transactions (amount > $1000, not flagged)...\n');

console.log('Native JS');
{
  const result = [];
  for (const t of transactions) {
    if (t.amount > 1000 && !t.flagged) {
      result.push(t);
      if (result.length === 10) break;
    }
  }
  console.log('Valid transactions:', result.map(t => `#${t.id}: $${t.amount}`));
}

console.log('\nLodash');
{
  // Eager — processes entire array even though we need 10
  const result = _(transactions)
    .filter(t => t.amount > 1000 && !t.flagged)
    .take(10)
    .value();
  console.log('Valid transactions:', result.map(t => `#${t.id}: $${t.amount}`));
}

console.log('\nRxJS');
{
  from(transactions).pipe(
    filter(t => t.amount > 1000 && !t.flagged),
    take(10),
    toArray()
  ).subscribe(result => {
    console.log('Valid transactions:', result.map(t => `#${t.id}: $${t.amount}`));
  });
}

console.log('\niterflow');
{
  const result = iter(transactions)
    .filter(t => t.amount > 1000 && !t.flagged)
    .take(10)
    .toArray();
  console.log('Valid transactions:', result.map(t => `#${t.id}: $${t.amount}`));
  // Stops after finding 10 — doesn't touch remaining millions
}
