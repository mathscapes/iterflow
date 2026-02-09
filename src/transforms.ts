import type { Predicate, Mapper, FlatMapper } from './core.js';
import { makeTransform, validateNonNegative, validatePositive, validateAlphaRange } from './internal.js';

// Mapping transforms
export function map<T, U>(src: Iterable<T>, fn: Mapper<T, U>): Iterable<U> {
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) yield fn(v, i++);
  });
}

export function flatMap<T, U>(src: Iterable<T>, fn: FlatMapper<T, U>): Iterable<U> {
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) yield* fn(v, i++);
  });
}

export function enumerate<T>(src: Iterable<T>): Iterable<[number, T]> {
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) yield [i++, v];
  });
}

// Filtering transforms
export function filter<T>(src: Iterable<T>, fn: Predicate<T>): Iterable<T> {
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) if (fn(v, i++)) yield v;
  });
}

export function take<T>(src: Iterable<T>, n: number): Iterable<T> {
  validateNonNegative(n, 'Count');
  return makeTransform(src, function* (s) {
    let remaining = n;
    for (const v of s) {
      if (remaining-- <= 0) break;
      yield v;
    }
  });
}

export function drop<T>(src: Iterable<T>, n: number): Iterable<T> {
  validateNonNegative(n, 'Count');
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) if (i++ >= n) yield v;
  });
}

export function takeWhile<T>(src: Iterable<T>, fn: Predicate<T>): Iterable<T> {
  return makeTransform(src, function* (s) {
    let i = 0;
    for (const v of s) {
      if (!fn(v, i++)) break;
      yield v;
    }
  });
}

export function dropWhile<T>(src: Iterable<T>, fn: Predicate<T>): Iterable<T> {
  return makeTransform(src, function* (s) {
    let i = 0, dropping = true;
    for (const v of s) {
      if (dropping && !fn(v, i)) dropping = false;
      if (!dropping) yield v;
      i++;
    }
  });
}

export function distinct<T>(src: Iterable<T>): Iterable<T> {
  return makeTransform(src, function* (s) {
    const seen = new Set<T>();
    for (const v of s) {
      if (!seen.has(v)) { seen.add(v); yield v; }
    }
  });
}

// Windowing transforms
export function window<T>(src: Iterable<T>, size: number): Iterable<T[]> {
  validatePositive(size, 'Window size');
  return makeTransform(src, function* (s) {
    const buf: T[] = [];
    for (const v of s) {
      buf.push(v);
      if (buf.length === size) { yield buf.slice(); buf.shift(); }
    }
  });
}

export function chunk<T>(src: Iterable<T>, size: number): Iterable<T[]> {
  validatePositive(size, 'Chunk size');
  return makeTransform(src, function* (s) {
    let batch: T[] = [];
    for (const v of s) {
      batch.push(v);
      if (batch.length === size) { yield batch; batch = []; }
    }
    if (batch.length) yield batch;
  });
}

// Combining transforms
export function concat<T, U>(src: Iterable<T>, ...others: Iterable<U>[]): Iterable<T | U> {
  return makeTransform(src, function* (s) {
    yield* s;
    for (const o of others) yield* o;
  });
}

export function zip<T, U>(src: Iterable<T>, other: Iterable<U>): Iterable<[T, U]>;
export function zip<T, U, V>(src: Iterable<T>, other1: Iterable<U>, other2: Iterable<V>): Iterable<[T, U, V]>;
export function zip<T>(src: Iterable<T>, ...others: Iterable<unknown>[]): Iterable<unknown[]> {
  return makeTransform(src, function* (s) {
    const iterators = [s[Symbol.iterator](), ...others.map(o => o[Symbol.iterator]())];
    while (true) {
      const results = iterators.map(it => it.next());
      if (results.some(r => r.done)) break;
      yield results.map(r => r.value);
    }
  });
}

// Streaming statistics
export function streamingMean(src: Iterable<number>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let count = 0;
    let mean = 0;
    for (const x of s) {
      count++;
      mean += (x - mean) / count;
      yield mean;
    }
  });
}

export function streamingVariance(src: Iterable<number>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let count = 0;
    let mean = 0;
    let M2 = 0;
    for (const x of s) {
      count++;
      const delta = x - mean;
      mean += delta / count;
      const delta2 = x - mean;
      M2 += delta * delta2;
      yield M2 / count;
    }
  });
}

export function ewma(src: Iterable<number>, alpha: number): Iterable<number> {
  validateAlphaRange(alpha, 'Alpha');
  return makeTransform(src, function* (s) {
    let ewma: number | undefined;
    for (const x of s) {
      ewma = ewma === undefined ? x : alpha * x + (1 - alpha) * ewma;
      yield ewma;
    }
  });
}

export function streamingCovariance(src: Iterable<[number, number]>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let count = 0;
    let meanX = 0;
    let meanY = 0;
    let Cxy = 0;
    for (const [x, y] of s) {
      count++;
      const deltaX = x - meanX;
      meanX += deltaX / count;
      const deltaY = y - meanY;
      meanY += deltaY / count;
      const deltaY2 = y - meanY;
      Cxy += deltaX * deltaY2;
      yield Cxy / count;
    }
  });
}

export function streamingCorrelation(src: Iterable<[number, number]>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let count = 0;
    let meanX = 0;
    let meanY = 0;
    let M2x = 0;
    let M2y = 0;
    let Cxy = 0;
    for (const [x, y] of s) {
      count++;
      const deltaX = x - meanX;
      meanX += deltaX / count;
      const deltaX2 = x - meanX;
      M2x += deltaX * deltaX2;
      const deltaY = y - meanY;
      meanY += deltaY / count;
      const deltaY2 = y - meanY;
      M2y += deltaY * deltaY2;
      Cxy += deltaX * deltaY2;
      const denom = M2x * M2y;
      yield denom > 0 ? Cxy / Math.sqrt(denom) : NaN;
    }
  });
}
