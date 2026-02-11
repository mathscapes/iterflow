import { iter } from '@mathscapes/iterflow';

const prices = [100, 102, 98, 105, 97, 110, 95, 108, 103, 112, 99, 115];

console.log('Prices:', prices);

console.log('\nEWMA smoothed (alpha=0.3):');
const smoothed = iter(prices).ewma(0.3).toArray();
smoothed.forEach((v, i) => console.log(`  [${i}] raw=${prices[i]}  smoothed=${v.toFixed(2)}`));

console.log('\nSliding window min/max (window=4):');
const mins = iter(prices).windowedMin(4).toArray();
const maxs = iter(prices).windowedMax(4).toArray();
mins.forEach((min, i) => console.log(`  window ${i}: min=${min}  max=${maxs[i]}  spread=${maxs[i] - min}`));
