import { iter } from '@mathscapes/iterflow';

function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

console.log('Fibonacci sequence until value exceeds 1000...\n');

const sum = iter(fibonacci())
  .takeWhile(n => n <= 1000)
  .sum();

console.log('Sum of Fibonacci numbers ≤ 1000:', sum);

const sequence = iter(fibonacci())
  .takeWhile(n => n <= 1000)
  .toArray();

console.log('Numbers:', sequence);
console.log('Count:', sequence.length);
