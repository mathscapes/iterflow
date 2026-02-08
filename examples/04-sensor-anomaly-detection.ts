import { iter } from '@mathscapes/iterflow';

const readings = [10, 11, 10, 12, 11, 50, 10, 11, 12, 10];
const windowSize = 5;

console.log('Sensor Readings:', readings);
console.log('Detecting anomalies (> 3 std deviations from rolling mean)...\n');

const anomalies = [];
const windows = iter(readings)
  .window(windowSize)
  .toArray();

for (let i = windowSize; i < readings.length; i++) {
  const window = windows[i - windowSize];
  const mean = iter(window).mean();
  const stdDev = iter(window).stdDev();

  if (Math.abs(readings[i] - mean) > 3 * stdDev) {
    anomalies.push({ index: i, value: readings[i] });
  }
}

console.log('Anomalies found:', anomalies);
