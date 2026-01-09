/**
 * Test Suite
 */

import './examples.test.js';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { iter } from '../src/index.js';
import { EmptySequenceError } from '../src/core.js';

describe('Edge Cases - Empty Sequences', () => {
  it('sum throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).sum(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('sum')
    );
  });

  it('mean throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).mean(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('mean')
    );
  });

  it('median throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).median(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('median')
    );
  });

  it('min throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).min(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('min')
    );
  });

  it('max throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).max(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('max')
    );
  });

  it('variance throws EmptySequenceError on empty sequence', () => {
    assert.throws(
      () => iter([]).variance(),
      (err: Error) => err instanceof EmptySequenceError && err.message.includes('variance')
    );
  });
});

describe('Edge Cases - Single Element', () => {
  it('variance returns 0 for single element', () => {
    assert.equal(iter([42]).variance(), 0);
  });

  it('median returns the element for single element', () => {
    assert.equal(iter([42]).median(), 42);
  });

  it('mean returns the element for single element', () => {
    assert.equal(iter([42]).mean(), 42);
  });

  it('sum returns the element for single element', () => {
    assert.equal(iter([42]).sum(), 42);
  });

  it('min returns the element for single element', () => {
    assert.equal(iter([42]).min(), 42);
  });

  it('max returns the element for single element', () => {
    assert.equal(iter([42]).max(), 42);
  });
});

describe('Edge Cases - Two Elements', () => {
  it('variance calculates correctly for two elements', () => {
    // values: [2, 4], mean: 3, variance: ((2-3)^2 + (4-3)^2) / 2 = (1 + 1) / 2 = 1
    assert.equal(iter([2, 4]).variance(), 1);
  });

  it('median returns average of two elements (even length)', () => {
    assert.equal(iter([2, 4]).median(), 3);
  });

  it('median handles unordered two elements', () => {
    assert.equal(iter([4, 2]).median(), 3);
  });
});

describe('Edge Cases - Special Values', () => {
  it('sum handles NaN', () => {
    const result = iter([1, NaN, 3]).sum();
    assert.ok(Number.isNaN(result));
  });

  it('mean handles NaN', () => {
    const result = iter([1, NaN, 3]).mean();
    assert.ok(Number.isNaN(result));
  });

  it('median filters out NaN values', () => {
    assert.equal(iter([1, NaN, 3]).median(), 2);
  });

  it('median returns NaN when all values are NaN', () => {
    assert.ok(Number.isNaN(iter([NaN, NaN]).median()));
    assert.ok(Number.isNaN(iter([NaN]).median()));
  });

  it('variance handles NaN', () => {
    const result = iter([1, NaN, 3]).variance();
    assert.ok(Number.isNaN(result));
  });

  it('sum handles Infinity', () => {
    assert.equal(iter([1, Infinity, 3]).sum(), Infinity);
  });

  it('mean handles Infinity', () => {
    assert.equal(iter([1, Infinity, 3]).mean(), Infinity);
  });

  it('sum handles -Infinity', () => {
    assert.equal(iter([1, -Infinity, 3]).sum(), -Infinity);
  });

  it('mean handles -Infinity', () => {
    assert.equal(iter([1, -Infinity, 3]).mean(), -Infinity);
  });

  it('min handles Infinity', () => {
    assert.equal(iter([Infinity, 2, 3]).min(), 2);
  });

  it('max handles -Infinity', () => {
    assert.equal(iter([-Infinity, 2, 3]).max(), 3);
  });

  it('min returns -Infinity when present', () => {
    assert.equal(iter([1, -Infinity, 3]).min(), -Infinity);
  });

  it('max returns Infinity when present', () => {
    assert.equal(iter([1, Infinity, 3]).max(), Infinity);
  });
});

describe('Edge Cases - Large Values (Numerical Stability)', () => {
  it('variance handles large values (1e15 range)', () => {
    const values = [1e15, 1e15 + 1, 1e15 + 2, 1e15 + 3, 1e15 + 4];
    const variance = iter(values).variance();
    // Expected variance: 2 (verified with Welford's algorithm)
    assert.ok(Math.abs(variance - 2) < 1e-6, `Expected ~2, got ${variance}`);
  });

  it('mean handles large values accurately', () => {
    const values = [1e15, 1e15 + 10];
    const mean = iter(values).mean();
    assert.equal(mean, 1e15 + 5);
  });

  it('sum handles large values', () => {
    const values = [1e15, 1e15, 1e15];
    const sum = iter(values).sum();
    assert.equal(sum, 3e15);
  });

  it('median handles large values', () => {
    const values = [1e15, 1e15 + 5, 1e15 + 10];
    const median = iter(values).median();
    assert.equal(median, 1e15 + 5);
  });
});

describe('Edge Cases - Negative and Mixed Signs', () => {
  it('variance handles negative values', () => {
    const values = [-2, -4, -6];
    const variance = iter(values).variance();
    // mean: -4, variance: ((2)^2 + (0)^2 + (-2)^2) / 3 = 8/3 ≈ 2.667
    assert.ok(Math.abs(variance - 8/3) < 1e-10);
  });

  it('median handles negative values', () => {
    assert.equal(iter([-3, -1, -2]).median(), -2);
  });

  it('mean handles negative values', () => {
    assert.equal(iter([-1, -2, -3]).mean(), -2);
  });

  it('sum handles negative values', () => {
    assert.equal(iter([-1, -2, -3]).sum(), -6);
  });

  it('min handles negative values', () => {
    assert.equal(iter([-1, -5, -3]).min(), -5);
  });

  it('max handles negative values', () => {
    assert.equal(iter([-1, -5, -3]).max(), -1);
  });

  it('variance handles mixed signs', () => {
    const values = [-2, 0, 2];
    const variance = iter(values).variance();
    // mean: 0, variance: (4 + 0 + 4) / 3 = 8/3 ≈ 2.667
    assert.ok(Math.abs(variance - 8/3) < 1e-10);
  });

  it('median handles mixed signs', () => {
    assert.equal(iter([-5, 0, 5]).median(), 0);
  });

  it('median handles mixed signs (even length)', () => {
    assert.equal(iter([-2, -1, 1, 2]).median(), 0);
  });
});

// Unit Tests

describe('Transforms - map', () => {
  it('transforms elements', () => {
    assert.deepEqual(iter([1, 2, 3]).map(x => x * 2).toArray(), [2, 4, 6]);
  });

  it('is lazy', () => {
    let count = 0;
    const sequence = iter([1, 2, 3, 4, 5]).map(x => {
      count++;
      return x * 2;
    });
    assert.equal(count, 0);
    sequence.toArray();
    assert.equal(count, 5);
  });
});

describe('Transforms - filter', () => {
  it('keeps matching elements', () => {
    assert.deepEqual(iter([1, 2, 3, 4]).filter(x => x % 2 === 0).toArray(), [2, 4]);
  });

  it('returns empty when no matches', () => {
    assert.deepEqual(iter([1, 3, 5]).filter(x => x % 2 === 0).toArray(), []);
  });

  it('is lazy', () => {
    let count = 0;
    const sequence = iter([1, 2, 3]).filter(() => {
      count++;
      return true;
    });
    assert.equal(count, 0);
    sequence.toArray();
    assert.equal(count, 3);
  });
});

describe('Transforms - flatMap', () => {
  it('flattens mapped results', () => {
    assert.deepEqual(
      iter([1, 2, 3]).flatMap(x => [x, x * 2]).toArray(),
      [1, 2, 2, 4, 3, 6]
    );
  });
});

describe('Transforms - take', () => {
  it('takes first n elements', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).take(3).toArray(), [1, 2, 3]);
  });

  it('takes all if n >= length', () => {
    assert.deepEqual(iter([1, 2, 3]).take(10).toArray(), [1, 2, 3]);
  });

  it('returns empty when n = 0', () => {
    assert.deepEqual(iter([1, 2, 3]).take(0).toArray(), []);
  });
});

describe('Transforms - take validation', () => {
  it('throws RangeError for negative n', () => {
    assert.throws(
      () => iter([1, 2, 3]).take(-1).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('non-negative')
    );
  });

  it('throws TypeError for non-integer n', () => {
    assert.throws(
      () => iter([1, 2, 3]).take(2.5).toArray(),
      (err: Error) => err instanceof TypeError && err.message.includes('integer')
    );
  });

  it('throws RangeError for non-finite n', () => {
    assert.throws(
      () => iter([1, 2, 3]).take(Infinity).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('finite')
    );
  });
});

describe('Transforms - drop', () => {
  it('skips first n elements', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).drop(2).toArray(), [3, 4, 5]);
  });

  it('returns empty if n >= length', () => {
    assert.deepEqual(iter([1, 2, 3]).drop(10).toArray(), []);
  });

  it('returns all when n = 0', () => {
    assert.deepEqual(iter([1, 2, 3]).drop(0).toArray(), [1, 2, 3]);
  });
});

describe('Transforms - drop validation', () => {
  it('throws RangeError for negative n', () => {
    assert.throws(
      () => iter([1, 2, 3]).drop(-1).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('non-negative')
    );
  });
});

describe('Transforms - takeWhile', () => {
  it('takes elements while predicate is true', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).takeWhile(x => x < 4).toArray(), [1, 2, 3]);
  });

  it('returns empty if first element fails', () => {
    assert.deepEqual(iter([5, 1, 2]).takeWhile(x => x < 4).toArray(), []);
  });

  it('takes all if predicate always true', () => {
    assert.deepEqual(iter([1, 2, 3]).takeWhile(() => true).toArray(), [1, 2, 3]);
  });

  it('works with empty array', () => {
    assert.deepEqual(iter([]).takeWhile(() => true).toArray(), []);
  });
});

describe('Transforms - dropWhile', () => {
  it('drops elements while predicate is true', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).dropWhile(x => x < 3).toArray(), [3, 4, 5]);
  });

  it('returns all if first element fails', () => {
    assert.deepEqual(iter([5, 1, 2]).dropWhile(x => x < 4).toArray(), [5, 1, 2]);
  });

  it('returns empty if predicate always true', () => {
    assert.deepEqual(iter([1, 2, 3]).dropWhile(() => true).toArray(), []);
  });

  it('works with empty array', () => {
    assert.deepEqual(iter([]).dropWhile(() => true).toArray(), []);
  });
});

describe('Transforms - distinct', () => {
  it('removes duplicates', () => {
    assert.deepEqual(iter([1, 2, 2, 3, 1, 4]).distinct().toArray(), [1, 2, 3, 4]);
  });

  it('preserves order of first occurrence', () => {
    assert.deepEqual(iter([3, 1, 2, 1, 3]).distinct().toArray(), [3, 1, 2]);
  });

  it('works with all unique elements', () => {
    assert.deepEqual(iter([1, 2, 3]).distinct().toArray(), [1, 2, 3]);
  });
});

describe('Transforms - enumerate', () => {
  it('adds indices to elements', () => {
    assert.deepEqual(
      iter(['a', 'b', 'c']).enumerate().toArray(),
      [[0, 'a'], [1, 'b'], [2, 'c']]
    );
  });
});

describe('Transforms - window', () => {
  it('creates sliding windows', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5]).window(3).toArray(),
      [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
    );
  });

  it('returns empty when size > length', () => {
    assert.deepEqual(iter([1, 2]).window(5).toArray(), []);
  });

  it('handles size = 1', () => {
    assert.deepEqual(iter([1, 2, 3]).window(1).toArray(), [[1], [2], [3]]);
  });
});

describe('Transforms - window validation', () => {
  it('throws RangeError for size = 0', () => {
    assert.throws(
      () => iter([1, 2, 3]).window(0).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('positive')
    );
  });

  it('throws RangeError for negative size', () => {
    assert.throws(
      () => iter([1, 2, 3]).window(-1).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('positive')
    );
  });
});

describe('Transforms - chunk', () => {
  it('creates chunks of specified size', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5]).chunk(2).toArray(),
      [[1, 2], [3, 4], [5]]
    );
  });

  it('handles exact division', () => {
    assert.deepEqual(iter([1, 2, 3, 4]).chunk(2).toArray(), [[1, 2], [3, 4]]);
  });

  it('handles size = 1', () => {
    assert.deepEqual(iter([1, 2, 3]).chunk(1).toArray(), [[1], [2], [3]]);
  });

  it('works with empty array', () => {
    assert.deepEqual(iter([]).chunk(2).toArray(), []);
  });
});

describe('Transforms - chunk validation', () => {
  it('throws RangeError for size = 0', () => {
    assert.throws(
      () => iter([1, 2, 3]).chunk(0).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('positive')
    );
  });

  it('throws RangeError for negative size', () => {
    assert.throws(
      () => iter([1, 2, 3]).chunk(-1).toArray(),
      (err: Error) => err instanceof RangeError && err.message.includes('positive')
    );
  });
});

describe('Transforms - concat', () => {
  it('concatenates multiple iterables', () => {
    assert.deepEqual(
      iter([1, 2]).concat([3, 4], [5, 6]).toArray(),
      [1, 2, 3, 4, 5, 6]
    );
  });

  it('works with empty arrays', () => {
    assert.deepEqual(iter([1, 2]).concat([], [3]).toArray(), [1, 2, 3]);
  });

  it('works with no additional iterables', () => {
    assert.deepEqual(iter([1, 2]).concat().toArray(), [1, 2]);
  });
});

describe('Terminals - toArray', () => {
  it('converts iterable to array', () => {
    assert.deepEqual(iter([1, 2, 3]).toArray(), [1, 2, 3]);
  });
});

describe('Terminals - reduce', () => {
  it('reduces elements with accumulator', () => {
    assert.equal(iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0), 10);
  });

  it('uses initial value', () => {
    assert.equal(iter([1, 2, 3]).reduce((acc, x) => acc + x, 100), 106);
  });
});

describe('Terminals - find', () => {
  it('finds first matching element', () => {
    assert.equal(iter([1, 2, 3, 4]).find(x => x > 2), 3);
  });

  it('returns undefined when no match', () => {
    assert.equal(iter([1, 2, 3]).find(x => x > 10), undefined);
  });

  it('stops on first match (lazy)', () => {
    let count = 0;
    iter([1, 2, 3, 4, 5]).find(x => {
      count++;
      return x === 3;
    });
    assert.equal(count, 3);
  });
});

describe('Terminals - forEach', () => {
  it('executes function for each element', () => {
    const results: number[] = [];
    iter([1, 2, 3]).forEach(x => results.push(x * 2));
    assert.deepEqual(results, [2, 4, 6]);
  });

  it('provides index', () => {
    const indices: number[] = [];
    iter(['a', 'b', 'c']).forEach((_, i) => indices.push(i));
    assert.deepEqual(indices, [0, 1, 2]);
  });
});

describe('Terminals - first', () => {
  it('returns first element', () => {
    assert.equal(iter([1, 2, 3]).first(), 1);
  });

  it('does not consume entire iterator', () => {
    let count = 0;
    iter([1, 2, 3, 4]).map(x => {
      count++;
      return x;
    }).first();
    assert.equal(count, 1);
  });
});

describe('Terminals - last', () => {
  it('returns last element', () => {
    assert.equal(iter([1, 2, 3]).last(), 3);
  });
});

describe('Terminals - count', () => {
  it('counts elements', () => {
    assert.equal(iter([1, 2, 3, 4, 5]).count(), 5);
  });

  it('counts after transformations', () => {
    assert.equal(iter([1, 2, 3, 4, 5]).filter(x => x > 2).count(), 3);
  });
});

describe('Terminals - some', () => {
  it('returns true if any element matches', () => {
    assert.equal(iter([1, 2, 3]).some(x => x > 2), true);
  });

  it('returns false if no element matches', () => {
    assert.equal(iter([1, 2, 3]).some(x => x > 10), false);
  });

  it('stops on first match (lazy)', () => {
    let count = 0;
    iter([1, 2, 3, 4, 5]).some(x => {
      count++;
      return x === 3;
    });
    assert.equal(count, 3);
  });
});

describe('Terminals - every', () => {
  it('returns true if all elements match', () => {
    assert.equal(iter([2, 4, 6]).every(x => x % 2 === 0), true);
  });

  it('returns false if any element does not match', () => {
    assert.equal(iter([2, 3, 4]).every(x => x % 2 === 0), false);
  });

  it('stops on first non-match (lazy)', () => {
    let count = 0;
    iter([2, 4, 5, 6, 8]).every(x => {
      count++;
      return x % 2 === 0;
    });
    assert.equal(count, 3);
  });
});

describe('Generator Support', () => {
  function* integerRange(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  it('map works with generators', () => {
    assert.deepEqual(
      iter(integerRange(1, 5)).map(x => x * 2).toArray(),
      [2, 4, 6, 8, 10]
    );
  });

  it('filter works with generators', () => {
    assert.deepEqual(
      iter(integerRange(1, 10)).filter(x => x % 2 === 0).toArray(),
      [2, 4, 6, 8, 10]
    );
  });

  it('take terminates infinite generators', () => {
    assert.deepEqual(
      iter(fibonacci()).take(7).toArray(),
      [0, 1, 1, 2, 3, 5, 8]
    );
  });

  it('takeWhile terminates infinite generators', () => {
    assert.deepEqual(
      iter(fibonacci()).takeWhile(n => n < 10).toArray(),
      [0, 1, 1, 2, 3, 5, 8]
    );
  });

  it('find works with generators (lazy)', () => {
    let count = 0;
    function* countingGen() {
      for (let i = 1; i <= 100; i++) {
        count++;
        yield i;
      }
    }
    const result = iter(countingGen()).find(x => x === 5);
    assert.equal(result, 5);
    assert.equal(count, 5);
  });

  it('chaining works with generators', () => {
    assert.deepEqual(
      iter(integerRange(1, 20))
        .filter(x => x % 2 === 0)
        .map(x => x * 2)
        .take(3)
        .toArray(),
      [4, 8, 12]
    );
  });
});

describe('Complex Chaining', () => {
  it('chains filter + map + take', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .filter(x => x % 2 === 0)
        .map(x => x * 2)
        .take(3)
        .toArray(),
      [4, 8, 12]
    );
  });

  it('chains drop + filter + take', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .drop(3)
        .filter(x => x % 2 === 0)
        .take(2)
        .toArray(),
      [4, 6]
    );
  });

  it('chains window + map with statistics', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5])
        .window(3)
        .map(w => iter(w).sum())
        .toArray(),
      [6, 9, 12]
    );
  });

  it('chains distinct + enumerate + filter', () => {
    assert.deepEqual(
      iter([1, 2, 2, 3, 1, 4])
        .distinct()
        .enumerate()
        .filter(([i, _]) => i % 2 === 0)
        .map(([_, v]) => v)
        .toArray(),
      [1, 3]
    );
  });

  it('chains flatMap + filter + take', () => {
    assert.deepEqual(
      iter([1, 2, 3])
        .flatMap(x => [x, x * 2])
        .filter(x => x > 2)
        .take(3)
        .toArray(),
      [4, 3, 6]
    );
  });

  it('chains multiple transforms ending with terminal', () => {
    const sum = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .filter(x => x % 2 === 0)
      .map(x => x * 2)
      .take(3)
      .sum();
    assert.equal(sum, 24);
  });

  it('verifies lazy evaluation stops processing after take()', () => {
    let count = 0;
    iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .map(x => {
        count++;
        return x;
      })
      .filter(x => x % 2 === 0)
      .take(2)
      .toArray();
    assert.ok(count < 10);
  });
});
