import { iter } from '@mathscapes/iterflow';

const events = [
  { userId: 'a', action: 'click' },
  { userId: 'b', action: 'view' },
  { userId: 'a', action: 'purchase' },
  { userId: 'c', action: 'click' },
  { userId: 'b', action: 'click' },
  { userId: 'd', action: 'view' },
  { userId: 'a', action: 'share' },
  { userId: 'e', action: 'purchase' },
];

console.log('User Events:');
events.forEach(e => console.log(`  ${e.userId}: ${e.action}`));
console.log('\nExtracting unique user IDs (first occurrence order)...\n');

const result = iter(events)
  .map(e => e.userId)
  .distinct()
  .toArray();

console.log('Unique users:', result);
