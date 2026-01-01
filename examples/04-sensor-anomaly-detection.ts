/**
 * Example 4: Sensor Anomaly Detection
 *
 * Problem: Find sensor readings where value exceeds 3 standard deviations from rolling mean.
 *
 * This example demonstrates:
 * - window() for rolling statistics
 * - variance() for statistical analysis
 * - mean() for averages
 * - enumerate() for tracking indices
 */

import { iter } from '@mathscapes/iterflow';

const readings = [10, 11, 10, 12, 11, 50, 10, 11, 12, 10]; // 50 is anomaly
const windowSize = 5;

console.log('Sensor Readings:', readings);
console.log('Detecting anomalies (> 3 std deviations from rolling mean)...\n');

console.log('Native JS');
{
  const anomalies = [];
  for (let i = windowSize; i < readings.length; i++) {
    const window = readings.slice(i - windowSize, i);
    const mean = window.reduce((a, b) => a + b, 0) / windowSize;
    const variance = window.reduce((s, v) => s + (v - mean) ** 2, 0) / windowSize;
    const stdDev = Math.sqrt(variance);
    if (Math.abs(readings[i] - mean) > 3 * stdDev) {
      anomalies.push({ index: i, value: readings[i] });
    }
  }
  console.log('Anomalies found:', anomalies);
}

console.log('\nLodash');
{
  // No built-in variance/stdDev — need manual implementation or another lib
  console.log('Lodash: No built-in statistical functions for variance/stdDev');
}

console.log('\nRxJS');
{
  // No built-in statistics — need to implement manually in map()
  console.log('RxJS: No built-in statistical functions for variance/stdDev');
}

console.log('\niterflow');
{
  const anomalies = [];

  // Build a window history for comparison
  const windows = iter(readings)
    .window(windowSize)
    .toArray();

  // Check each reading after the initial window
  for (let i = windowSize; i < readings.length; i++) {
    const window = windows[i - windowSize];
    const mean = iter(window).mean();
    const stdDev = Math.sqrt(iter(window).variance());

    if (Math.abs(readings[i] - mean) > 3 * stdDev) {
      anomalies.push({ index: i, value: readings[i] });
    }
  }

  console.log('Anomalies found:', anomalies);
}
