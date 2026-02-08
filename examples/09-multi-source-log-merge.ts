import { iter } from '@mathscapes/iterflow';

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

const result = iter(server1Logs)
  .concat(server2Logs, server3Logs)
  .filter(l => l.includes('[ERROR]'))
  .take(100)
  .toArray();

console.log('Error logs found:', result.length);
result.forEach(log => console.log('  ' + log));
