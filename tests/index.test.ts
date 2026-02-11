/**
 * Test Suite
 */

import './examples.test.js';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { iter } from '../src/index.js';
import { EmptySequenceError } from '../src/core.js';

describe('Edge Cases - Empty Sequences', () => {
  it('statistical terminals throw EmptySequenceError', () => {
    for (const op of ['sum', 'mean', 'median', 'min', 'max', 'variance'] as const) {
      assert.throws(
        () => (iter([]) as any)[op](),
        (err: Error) => err instanceof EmptySequenceError
      );
    }
  });
});

describe('Edge Cases - Single Element', () => {
  it('variance returns 0 for single element', () => {
    assert.equal(iter([42]).variance(), 0);
  });
});

describe('Edge Cases - Two Elements', () => {
  it('variance calculates correctly for two elements', () => {
    assert.equal(iter([2, 4]).variance(), 1);
  });

  it('median returns average of two elements (even length)', () => {
    assert.equal(iter([4, 2]).median(), 3);
  });
});

describe('Edge Cases - Special Values', () => {
  it('median filters out NaN values', () => {
    assert.equal(iter([1, NaN, 3]).median(), 2);
  });

  it('median returns NaN when all values are NaN', () => {
    assert.ok(Number.isNaN(iter([NaN, NaN]).median()));
  });
});

describe('Edge Cases - Numerical Stability', () => {
  it('variance handles large values (1e15 range)', () => {
    const values = [1e15, 1e15 + 1, 1e15 + 2, 1e15 + 3, 1e15 + 4];
    assert.ok(Math.abs(iter(values).variance() - 2) < 1e-6);
  });

  it('variance handles mixed signs', () => {
    assert.ok(Math.abs(iter([-2, 0, 2]).variance() - 8/3) < 1e-10);
  });
});

// Transforms

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

  it('throws for invalid input', () => {
    assert.throws(() => iter([1]).take(-1).toArray(), RangeError);
    assert.throws(() => iter([1]).take(2.5).toArray(), TypeError);
  });
});

describe('Transforms - drop', () => {
  it('skips first n elements', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).drop(2).toArray(), [3, 4, 5]);
  });
});

describe('Transforms - takeWhile', () => {
  it('takes elements while predicate is true', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).takeWhile(x => x < 4).toArray(), [1, 2, 3]);
  });
});

describe('Transforms - dropWhile', () => {
  it('drops elements while predicate is true', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).dropWhile(x => x < 3).toArray(), [3, 4, 5]);
  });
});

describe('Transforms - distinct', () => {
  it('removes duplicates preserving order', () => {
    assert.deepEqual(iter([3, 1, 2, 1, 3]).distinct().toArray(), [3, 1, 2]);
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

  it('validates window size', () => {
    assert.throws(() => iter([1]).window(0).toArray(), RangeError);
  });
});

describe('Transforms - chunk', () => {
  it('creates chunks with remainder', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5]).chunk(2).toArray(),
      [[1, 2], [3, 4], [5]]
    );
  });

  it('validates chunk size', () => {
    assert.throws(() => iter([1]).chunk(0).toArray(), RangeError);
  });
});

describe('Transforms - concat', () => {
  it('concatenates multiple iterables', () => {
    assert.deepEqual(
      iter([1, 2]).concat([3, 4], [5, 6]).toArray(),
      [1, 2, 3, 4, 5, 6]
    );
  });
});

describe('Transforms - zip', () => {
  it('combines two iterables into tuples', () => {
    assert.deepEqual(
      iter([1, 2, 3]).zip(['a', 'b', 'c']).toArray(),
      [[1, 'a'], [2, 'b'], [3, 'c']]
    );
  });

  it('stops at shortest iterable', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5]).zip(['a', 'b']).toArray(),
      [[1, 'a'], [2, 'b']]
    );
  });

  it('works with three iterables', () => {
    assert.deepEqual(
      iter([1, 2, 3]).zip(['a', 'b', 'c'], [true, false, true]).toArray(),
      [[1, 'a', true], [2, 'b', false], [3, 'c', true]]
    );
  });
});

describe('Transforms - streamingMean', () => {
  it('yields running mean at each step', () => {
    assert.deepEqual(iter([1, 2, 3, 4, 5]).streamingMean().toArray(), [1, 1.5, 2, 2.5, 3]);
  });

  it('handles large values accurately', () => {
    const results = iter([1e15, 1e15 + 10]).streamingMean().toArray();
    assert.equal(results[1], 1e15 + 5);
  });
});

describe('Transforms - streamingVariance', () => {
  it('yields running variance at each step', () => {
    const results = iter([2, 4, 6]).streamingVariance().toArray();
    assert.equal(results[0], 0);
    assert.ok(Math.abs(results[1]! - 1) < 1e-10);
    assert.ok(Math.abs(results[2]! - 8/3) < 1e-10);
  });

  it('handles large values accurately (numerical stability)', () => {
    const results = iter([1e15, 1e15 + 1, 1e15 + 2]).streamingVariance().toArray();
    assert.ok(Math.abs(results[2]! - 2/3) < 1e-6);
  });
});

describe('Transforms - ewma', () => {
  it('yields exponentially weighted moving average', () => {
    const results = iter([1, 2, 3, 4, 5]).ewma(0.5).toArray();
    assert.equal(results[0], 1);
    assert.equal(results[1], 1.5);
    assert.equal(results[2], 2.25);
    assert.equal(results[3], 3.125);
    assert.equal(results[4], 4.0625);
  });

  it('validates alpha in range (0, 1]', () => {
    assert.throws(() => iter([1]).ewma(0).toArray(), /must be in range/);
    assert.throws(() => iter([1]).ewma(1.1).toArray(), /must be in range/);
  });

  it('alpha=1 passes through unchanged', () => {
    assert.deepEqual(iter([1, 2, 3]).ewma(1).toArray(), [1, 2, 3]);
  });
});

describe('Transforms - streamingCovariance', () => {
  it('yields running covariance at each step', () => {
    const results = iter([[1, 2], [2, 4], [3, 6]] as [number, number][]).streamingCovariance().toArray();
    assert.equal(results[0], 0);
    assert.ok(Math.abs(results[1]! - 0.5) < 1e-10);
    assert.ok(Math.abs(results[2]! - 4/3) < 1e-10);
  });

  it('handles zero covariance (independent variables)', () => {
    const results = iter([[1, 5], [2, 5], [3, 5]] as [number, number][]).streamingCovariance().toArray();
    assert.deepEqual(results, [0, 0, 0]);
  });
});

describe('Transforms - streamingCorrelation', () => {
  it('yields running Pearson correlation', () => {
    const results = iter([[1, 2], [2, 4], [3, 6]] as [number, number][]).streamingCorrelation().toArray();
    assert.ok(Number.isNaN(results[0]));
    assert.ok(Math.abs(results[2]! - 1.0) < 1e-10);
  });

  it('handles perfect negative correlation', () => {
    const results = iter([[1, 5], [2, 4], [3, 3], [4, 2], [5, 1]] as [number, number][]).streamingCorrelation().toArray();
    for (let i = 1; i < results.length; i++) {
      assert.ok(Math.abs(results[i]! - (-1.0)) < 1e-10);
    }
  });

  it('returns NaN when one variable has zero variance', () => {
    const results = iter([[1, 5], [2, 5], [3, 5]] as [number, number][]).streamingCorrelation().toArray();
    assert.ok(results.every(r => Number.isNaN(r)));
  });
});

describe('Transforms - streamingZScore', () => {
  it('computes z-scores using pre-observation statistics', () => {
    const results = iter([10, 10, 10, 20]).streamingZScore().toArray();
    assert.ok(Number.isNaN(results[0]));
    assert.ok(Number.isNaN(results[1]));
    assert.equal(results[2], 0);
    assert.ok(results[3]! > 0);
  });

  it('yields zero when all values are identical', () => {
    const results = iter([5, 5, 5, 5]).streamingZScore().toArray();
    assert.equal(results[2], 0);
    assert.equal(results[3], 0);
  });

  it('detects extreme outliers', () => {
    const results = iter([100, 101, 99, 100, 102, 100, 500]).streamingZScore().toArray();
    assert.ok(Math.abs(results[results.length - 1]!) > 3);
  });
});

describe('Transforms - windowedMin', () => {
  it('computes sliding window minimum', () => {
    assert.deepEqual(
      iter([3, 1, 4, 1, 5, 9, 2]).windowedMin(3).toArray(),
      [1, 1, 1, 1, 2]
    );
  });

  it('matches naive implementation', () => {
    const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    const size = 4;
    const naive: number[] = [];
    for (let i = 0; i <= data.length - size; i++) {
      naive.push(Math.min(...data.slice(i, i + size)));
    }
    assert.deepEqual(iter(data).windowedMin(size).toArray(), naive);
  });

  it('validates window size', () => {
    assert.throws(() => iter([1, 2]).windowedMin(0).toArray(), /positive/);
  });
});

describe('Transforms - windowedMax', () => {
  it('computes sliding window maximum', () => {
    assert.deepEqual(
      iter([3, 1, 4, 1, 5, 9, 2]).windowedMax(3).toArray(),
      [4, 4, 5, 9, 9]
    );
  });

  it('matches naive implementation', () => {
    const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    const size = 4;
    const naive: number[] = [];
    for (let i = 0; i <= data.length - size; i++) {
      naive.push(Math.max(...data.slice(i, i + size)));
    }
    assert.deepEqual(iter(data).windowedMax(size).toArray(), naive);
  });

  it('validates window size', () => {
    assert.throws(() => iter([1, 2]).windowedMax(0).toArray(), /positive/);
  });
});

// Terminals

describe('Terminals', () => {
  it('toArray converts iterable to array', () => {
    assert.deepEqual(iter([1, 2, 3]).toArray(), [1, 2, 3]);
  });

  it('reduce accumulates with initial value', () => {
    assert.equal(iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0), 10);
  });

  it('find returns first match and stops', () => {
    let count = 0;
    const result = iter([1, 2, 3, 4, 5]).find(x => {
      count++;
      return x === 3;
    });
    assert.equal(result, 3);
    assert.equal(count, 3);
  });

  it('first returns first element without consuming iterator', () => {
    let count = 0;
    const result = iter([1, 2, 3, 4]).map(x => { count++; return x; }).first();
    assert.equal(result, 1);
    assert.equal(count, 1);
  });

  it('last returns last element', () => {
    assert.equal(iter([1, 2, 3]).last(), 3);
  });

  it('count counts elements', () => {
    assert.equal(iter([1, 2, 3, 4, 5]).count(), 5);
  });

  it('some stops on first match', () => {
    let count = 0;
    iter([1, 2, 3, 4, 5]).some(x => { count++; return x === 3; });
    assert.equal(count, 3);
  });

  it('every stops on first non-match', () => {
    let count = 0;
    iter([2, 4, 5, 6, 8]).every(x => { count++; return x % 2 === 0; });
    assert.equal(count, 3);
  });
});

describe('Generator Support', () => {
  it('take terminates infinite generators', () => {
    function* fibonacci() {
      let [a, b] = [0, 1];
      while (true) { yield a; [a, b] = [b, a + b]; }
    }
    assert.deepEqual(iter(fibonacci()).take(7).toArray(), [0, 1, 1, 2, 3, 5, 8]);
  });
});

describe('Complex Chaining', () => {
  it('chains window + map with statistics', () => {
    assert.deepEqual(
      iter([1, 2, 3, 4, 5]).window(3).map(w => iter(w).sum()).toArray(),
      [6, 9, 12]
    );
  });

  it('lazy evaluation stops processing after take()', () => {
    let count = 0;
    iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .map(x => { count++; return x; })
      .filter(x => x % 2 === 0)
      .take(2)
      .toArray();
    assert.ok(count < 10);
  });
});
