/**
 * Example 10: Percentile-Based Filtering
 *
 * Problem: Keep only values above the 75th percentile.
 *
 * This example demonstrates:
 * - Statistical filtering
 * - median() for percentile approximation
 * - Two-pass processing pattern
 *
 * Note: iterflow currently has median(), not arbitrary percentile().
 * For true 75th percentile, we'd need percentile(75) which could be added.
 */

import { iter } from 'iterflow';
import _ from 'lodash';

const values = [12, 47, 23, 89, 15, 62, 34, 78, 45, 91];
console.log('Values:', values);
console.log('Filtering values above 75th percentile...\n');

console.log('Native JS');
{
  const sorted = [...values].sort((a, b) => a - b);
  const p75Index = Math.floor(sorted.length * 0.75);
  const p75 = sorted[p75Index];
  const result = values.filter(v => v >= p75);
  console.log('75th percentile:', p75);
  console.log('Values ≥ p75:', result);
  // [89, 78, 91]
}

console.log('\nLodash');
{
  // No built-in percentile
  const sorted = _.sortBy(values);
  const p75Index = Math.floor(sorted.length * 0.75);
  const p75 = sorted[p75Index];
  const result = _.filter(values, v => v >= p75);
  console.log('75th percentile:', p75);
  console.log('Values ≥ p75:', result);
}

console.log('\nRxJS');
{
  // No built-in percentile — manual implementation needed
  console.log('RxJS: No built-in percentile function');
}

console.log('\niterflow');
{
  // Using median as approximation for demonstration
  // For true p75, we'd add: iter(values).percentile(75)
  const sorted = iter(values).toArray().sort((a, b) => a - b);
  const p75Index = Math.floor(sorted.length * 0.75);
  const p75 = sorted[p75Index];

  const result = iter(values)
    .filter(v => v >= p75)
    .toArray();

  console.log('75th percentile:', p75);
  console.log('Values ≥ p75:', result);
}

// Bonus: Using median to filter (50th percentile)
console.log('\nBonus: Filter above median (50th percentile)');
{
  const med = iter(values).median();
  const result = iter(values)
    .filter(v => v >= med)
    .toArray();

  console.log('Median (50th percentile):', med);
  console.log('Values ≥ median:', result);
}
