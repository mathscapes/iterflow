/**
 * Example 9: Multi-Source Log Merge
 *
 * Problem: Combine logs from 3 servers, filter errors, take first 100.
 *
 * This example demonstrates:
 * - concat() for merging multiple iterables
 * - filter() for conditional selection
 * - take() for limiting results
 * - Lazy concatenation (stops early)
 */

import { iter } from 'iterflow';
import _ from 'lodash';
import { concat, from } from 'rxjs';
import { filter, take, toArray } from 'rxjs/operators';

const server1Logs = [
  '[INFO] Server 1 started',
  '[ERROR] Server 1: disk full',
  '[INFO] Server 1: processing request',
  '[WARN] Server 1: slow response',
  '[ERROR] Server 1: connection timeout',
];

const server2Logs = [
  '[WARN] Server 2: high memory usage',
  '[ERROR] Server 2: database timeout',
  '[INFO] Server 2: cache hit',
  '[ERROR] Server 2: failed to connect',
  '[INFO] Server 2: request completed',
];

const server3Logs = [
  '[ERROR] Server 3: application crash',
  '[INFO] Server 3: restart initiated',
  '[ERROR] Server 3: out of memory',
  '[WARN] Server 3: degraded performance',
  '[INFO] Server 3: health check passed',
];

console.log('Combining logs from 3 servers and filtering errors...\n');

console.log('Native JS');
{
  const result = [];
  const all = [...server1Logs, ...server2Logs, ...server3Logs];
  for (const log of all) {
    if (log.includes('[ERROR]')) {
      result.push(log);
      if (result.length === 100) break;
    }
  }
  console.log('Error logs found:', result.length);
  result.forEach(log => console.log('  ' + log));
}

console.log('\nLodash');
{
  const result = _([...server1Logs, ...server2Logs, ...server3Logs])
    .filter(l => l.includes('[ERROR]'))
    .take(100)
    .value();
  console.log('Error logs found:', result.length);
  result.forEach(log => console.log('  ' + log));
  // Eager concat, processes all before filtering
}

console.log('\nRxJS');
{
  concat(from(server1Logs), from(server2Logs), from(server3Logs)).pipe(
    filter(l => l.includes('[ERROR]')),
    take(100),
    toArray()
  ).subscribe(result => {
    console.log('Error logs found:', result.length);
    result.forEach(log => console.log('  ' + log));
  });
}

console.log('\niterflow');
{
  const result = iter(server1Logs)
    .concat(server2Logs, server3Logs)
    .filter(l => l.includes('[ERROR]'))
    .take(100)
    .toArray();
  console.log('Error logs found:', result.length);
  result.forEach(log => console.log('  ' + log));
  // Lazy concat — stops as soon as 100 found
}
