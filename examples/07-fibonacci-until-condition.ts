/**
 * Example 7: Fibonacci Until Condition
 *
 * Problem: Get Fibonacci numbers until one exceeds 1000, then sum them.
 *
 * This example demonstrates:
 * - Working with infinite generators
 * - takeWhile() for conditional termination
 * - sum() for aggregation
 * - Lazy evaluation preventing infinite loops
 */

import { iter } from '@mathscapes/iterflow';
import { from } from 'rxjs';
import { takeWhile, reduce } from 'rxjs/operators';

// Infinite Fibonacci generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

console.log('Fibonacci sequence until value exceeds 1000...\n');

console.log('Native JS');
{
  let sum = 0;
  for (const n of fibonacci()) {
    if (n > 1000) break;
    sum += n;
  }
  console.log('Sum of Fibonacci numbers ≤ 1000:', sum);
  // 1785
}

console.log('\nLodash');
{
  // Can't handle infinite generators
  console.log('Lodash: Cannot handle infinite generators');
}

console.log('\nRxJS');
{
  from(fibonacci()).pipe(
    takeWhile(n => n <= 1000),
    reduce((acc, n) => acc + n, 0)
  ).subscribe(sum => {
    console.log('Sum of Fibonacci numbers ≤ 1000:', sum);
  });
}

console.log('\niterflow');
{
  const sum = iter(fibonacci())
    .takeWhile(n => n <= 1000)
    .sum();
  console.log('Sum of Fibonacci numbers ≤ 1000:', sum);
  // 1785
}

// Bonus: Show the actual sequence
console.log('\nBonus - The actual sequence (iterflow):');
{
  const sequence = iter(fibonacci())
    .takeWhile(n => n <= 1000)
    .toArray();
  console.log('Numbers:', sequence);
  console.log('Count:', sequence.length);
}
