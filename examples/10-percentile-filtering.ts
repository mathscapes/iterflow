import { iter } from '@mathscapes/iterflow';

const values = [12, 47, 23, 89, 15, 62, 34, 78, 45, 91];

console.log('Values:', values);
console.log('Filtering values above 75th percentile...\n');

const sorted = iter(values).toArray().sort((a, b) => a - b);
const p75Index = Math.floor(sorted.length * 0.75);
const p75 = sorted[p75Index];

const result = iter(values)
  .filter(v => v >= p75)
  .toArray();

console.log('75th percentile:', p75);
console.log('Values ≥ p75:', result);

console.log('\nFilter above median (50th percentile):');

const med = iter(values).median();
const aboveMedian = iter(values)
  .filter(v => v >= med)
  .toArray();

console.log('Median (50th percentile):', med);
console.log('Values ≥ median:', aboveMedian);
