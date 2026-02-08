import { iter } from '@mathscapes/iterflow';

const transactions = [
  { id: 1, amount: 500, flagged: false },
  { id: 2, amount: 1500, flagged: true },
  { id: 3, amount: 2000, flagged: false },
  { id: 4, amount: 800, flagged: false },
  { id: 5, amount: 3000, flagged: false },
  { id: 6, amount: 1200, flagged: false },
  { id: 7, amount: 900, flagged: false },
  { id: 8, amount: 2500, flagged: false },
  { id: 9, amount: 1100, flagged: true },
  { id: 10, amount: 1800, flagged: false },
  { id: 11, amount: 1500, flagged: false },
  { id: 12, amount: 2200, flagged: false },
  { id: 13, amount: 1300, flagged: false },
  { id: 14, amount: 1700, flagged: false },
  { id: 15, amount: 1900, flagged: false },
];

console.log('Finding first 10 valid transactions (amount > $1000, not flagged)...\n');

const result = iter(transactions)
  .filter(t => t.amount > 1000 && !t.flagged)
  .take(10)
  .toArray();

console.log('Valid transactions:', result.map(t => `#${t.id}: $${t.amount}`));
