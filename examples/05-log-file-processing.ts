import { iter } from '@mathscapes/iterflow';

function* readLines(count: number = 10_000) {
  for (let i = 1; i <= count; i++) {
    yield `Line ${i}: ${i <= 100 ? 'HEADER/METADATA' : 'Log entry data...'}`;
  }
}

console.log('Processing log file (10,000 lines)...');
console.log('Task: Skip first 100 lines, take every 10th line, get first 1000\n');

const result = iter(readLines())
  .drop(100)
  .filter((_, i) => i % 10 === 0)
  .take(1000)
  .toArray();

console.log(`Processed ${result.length} lines`);
console.log('First 3:', result.slice(0, 3));
