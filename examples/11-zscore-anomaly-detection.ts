import { iter } from '@mathscapes/iterflow';

const latencies = [45, 42, 48, 44, 46, 43, 47, 45, 44, 200, 46, 43, 45, 250, 44];

console.log('Request latencies (ms):', latencies);
console.log('Detecting anomalies (|z| > 3)...\n');

const anomalies = iter(latencies)
  .streamingZScore()
  .enumerate()
  .filter(([_, z]) => Math.abs(z) > 3)
  .map(([i, z]) => ({ index: i, value: latencies[i], zScore: z.toFixed(2) }))
  .toArray();

console.log('Anomalies:', anomalies);

console.log('\nAll z-scores:');
iter(latencies)
  .streamingZScore()
  .enumerate()
  .forEach(([i, z]) => console.log(`  [${i}] ${latencies[i]}ms -> z=${Number.isNaN(z) ? 'N/A' : z.toFixed(2)}`));
