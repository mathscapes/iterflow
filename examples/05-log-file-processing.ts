/**
 * Example 5: Log File Processing — Skip Headers, Take Sample
 *
 * Problem: Skip first 100 lines (headers/metadata), take every 10th line, get first 1000.
 *
 * This example demonstrates:
 * - drop() to skip initial lines
 * - filter() with index for sampling
 * - take() to limit output
 * - Memory efficiency with large files
 */

import { iter } from 'iterflow';
import { from } from 'rxjs';
import { skip, filter, take, toArray } from 'rxjs/operators';

// Simulate reading lines from a huge log file
function* readLines(count: number = 10_000) {
  for (let i = 1; i <= count; i++) {
    yield `Line ${i}: ${i <= 100 ? 'HEADER/METADATA' : 'Log entry data...'}`;
  }
}

console.log('Processing log file (10,000 lines for demo)...');
console.log('Task: Skip first 100 lines, take every 10th line, get first 1000\n');

console.log('Native JS');
{
  const result = [];
  let lineNum = 0;
  for (const line of readLines()) {
    lineNum++;
    if (lineNum <= 100) continue;
    if ((lineNum - 100) % 10 !== 1) continue;
    result.push(line);
    if (result.length === 1000) break;
  }
  console.log(`Processed ${result.length} lines`);
  console.log('First 3:', result.slice(0, 3));
}

console.log('\nLodash');
{
  // Must collect all lines first — OOM on huge files
  console.log('Lodash: Would need to load entire file into memory first (OOM risk)');
}

console.log('\nRxJS');
{
  from(readLines()).pipe(
    skip(100),
    filter((_, i) => i % 10 === 0),
    take(1000),
    toArray()
  ).subscribe(result => {
    console.log(`Processed ${result.length} lines`);
    console.log('First 3:', result.slice(0, 3));
  });
}

console.log('\niterflow');
{
  const result = iter(readLines())
    .drop(100)
    .filter((_, i) => i % 10 === 0)
    .take(1000)
    .toArray();
  console.log(`Processed ${result.length} lines`);
  console.log('First 3:', result.slice(0, 3));
}
