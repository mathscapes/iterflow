/**
 * Example 6: Deduplicated User Events
 *
 * Problem: Get unique user IDs from event stream, preserving first occurrence order.
 *
 * This example demonstrates:
 * - map() for extracting properties
 * - distinct() for removing duplicates
 * - Order preservation
 */

import { iter } from 'iterflow';
import _ from 'lodash';
import { from } from 'rxjs';
import { distinct, toArray } from 'rxjs/operators';

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

console.log('User Events:');
events.forEach(e => console.log(`  ${e.userId}: ${e.action}`));
console.log('\nExtracting unique user IDs (first occurrence order)...\n');

console.log('Native JS');
{
  const seen = new Set();
  const result = [];
  for (const e of events) {
    if (!seen.has(e.userId)) {
      seen.add(e.userId);
      result.push(e.userId);
    }
  }
  console.log('Unique users:', result);
  // ['a', 'b', 'c', 'd', 'e']
}

console.log('\nLodash');
{
  const result = _.uniqBy(events, 'userId').map(e => e.userId);
  console.log('Unique users:', result);
  // Works but processes all, returns full objects first
}

console.log('\nRxJS');
{
  from(events).pipe(
    distinct(e => e.userId),
    toArray()
  ).subscribe(result => {
    console.log('Unique users:', result.map(e => e.userId));
  });
}

console.log('\niterflow');
{
  const result = iter(events)
    .map(e => e.userId)
    .distinct()
    .toArray();
  console.log('Unique users:', result);
  // ['a', 'b', 'c', 'd', 'e']
}
