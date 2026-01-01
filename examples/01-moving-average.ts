/**
 * Example 1: Moving Average (Stock Prices)
 *
 * Problem: Calculate 5-day moving average of stock prices.
 *
 * This example demonstrates:
 * - window() for sliding windows
 * - map() for transforming each window
 * - mean() for calculating averages
 */

import { iter } from '@mathscapes/iterflow';
import _ from 'lodash';
import { from } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';

const prices = [100, 102, 104, 103, 105, 107, 106, 108, 110, 109];

console.log('Stock Prices:', prices);
console.log('\nNative JS');
{
  const result = [];
  for (let i = 0; i <= prices.length - 5; i++) {
    const window = prices.slice(i, i + 5);
    result.push(window.reduce((a, b) => a + b, 0) / 5);
  }
  console.log('5-day moving average:', result);
  // [102.8, 104.2, 105, 105.8, 107.2, 108]
}

console.log('\nLodash');
{
  const result = [];
  for (let i = 0; i <= prices.length - 5; i++) {
    result.push(_.mean(prices.slice(i, i + 5)));
  }
  console.log('5-day moving average:', result);
}

console.log('\nRxJS');
{
  from(prices).pipe(
    bufferCount(5, 1),
    map(w => w.reduce((a, b) => a + b, 0) / w.length)
  ).subscribe(avg => console.log('Average:', avg));
}

console.log('\niterflow');
{
  const result = iter(prices)
    .window(5)
    .map(w => iter(w).mean())
    .toArray();
  console.log('5-day moving average:', result);
}
