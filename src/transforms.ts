import type { Predicate, Mapper, FlatMapper } from './core.js';
import { makeTransform, validateNonNegative, validatePositive, validateAlphaRange, validateProbability } from './internal.js';

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
    const buf = new Array<T>(size);
    let pos = 0;
    let count = 0;
    for (const v of s) {
      buf[pos] = v;
      pos = (pos + 1) % size;
      count++;
      if (count >= size) {
        const result = new Array<T>(size);
        for (let i = 0; i < size; i++) result[i] = buf[(pos + i) % size]!;
        yield result;
      }
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

export function streamingZScore(src: Iterable<number>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let count = 0;
    let mean = 0;
    let M2 = 0;
    for (const x of s) {
      if (count < 2) {
        yield NaN;
      } else {
        const diff = x - mean;
        yield diff === 0 ? 0 : diff / Math.sqrt(M2 / count);
      }
      count++;
      const delta = x - mean;
      mean += delta / count;
      const delta2 = x - mean;
      M2 += delta * delta2;
    }
  });
}

export function windowedMin(src: Iterable<number>, size: number): Iterable<number> {
  validatePositive(size, 'Window size');
  return makeTransform(src, function* (s) {
    const dequeVal: number[] = [];
    const dequeIdx: number[] = [];
    let i = 0;
    for (const x of s) {
      while (dequeVal.length > 0 && dequeVal[dequeVal.length - 1]! >= x) {
        dequeVal.pop();
        dequeIdx.pop();
      }
      dequeVal.push(x);
      dequeIdx.push(i);
      if (dequeIdx[0]! <= i - size) {
        dequeVal.shift();
        dequeIdx.shift();
      }
      if (i >= size - 1) yield dequeVal[0]!;
      i++;
    }
  });
}

export function windowedMax(src: Iterable<number>, size: number): Iterable<number> {
  validatePositive(size, 'Window size');
  return makeTransform(src, function* (s) {
    const dequeVal: number[] = [];
    const dequeIdx: number[] = [];
    let i = 0;
    for (const x of s) {
      while (dequeVal.length > 0 && dequeVal[dequeVal.length - 1]! <= x) {
        dequeVal.pop();
        dequeIdx.pop();
      }
      dequeVal.push(x);
      dequeIdx.push(i);
      if (dequeIdx[0]! <= i - size) {
        dequeVal.shift();
        dequeIdx.shift();
      }
      if (i >= size - 1) yield dequeVal[0]!;
      i++;
    }
  });
}

// Streaming higher-order moments (Pébay 2008 / Terriberry 2007)
export function streamingSkewness(src: Iterable<number>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let n = 0;
    let mean = 0;
    let M2 = 0;
    let M3 = 0;
    for (const x of s) {
      n++;
      const delta = x - mean;
      const deltaN = delta / n;
      const term1 = delta * deltaN * (n - 1);
      mean += deltaN;
      M3 += term1 * deltaN * (n - 2) - 3 * deltaN * M2;
      M2 += term1;
      if (n < 3 || M2 === 0) {
        yield NaN;
      } else {
        const variance = M2 / n;
        yield (M3 / n) / (variance * Math.sqrt(variance));
      }
    }
  });
}

export function streamingKurtosis(src: Iterable<number>): Iterable<number> {
  return makeTransform(src, function* (s) {
    let n = 0;
    let mean = 0;
    let M2 = 0;
    let M3 = 0;
    let M4 = 0;
    for (const x of s) {
      n++;
      const delta = x - mean;
      const deltaN = delta / n;
      const deltaN2 = deltaN * deltaN;
      const term1 = delta * deltaN * (n - 1);
      mean += deltaN;
      M4 += term1 * deltaN2 * (n * n - 3 * n + 3) + 6 * deltaN2 * M2 - 4 * deltaN * M3;
      M3 += term1 * deltaN * (n - 2) - 3 * deltaN * M2;
      M2 += term1;
      if (n < 4 || M2 === 0) {
        yield NaN;
      } else {
        const variance = M2 / n;
        yield (M4 / n) / (variance * variance) - 3;
      }
    }
  });
}

// Streaming histogram
export function streamingHistogram(src: Iterable<number>, binCount: number, min: number, max: number): Iterable<number[]> {
  validatePositive(binCount, 'Bin count');
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('Min and max must be finite');
  }
  if (min >= max) {
    throw new RangeError('Min must be less than max');
  }
  return makeTransform(src, function* (s) {
    const bins = new Array<number>(binCount).fill(0);
    const binWidth = (max - min) / binCount;
    for (const x of s) {
      if (x >= min && x <= max) {
        const idx = x === max ? binCount - 1 : Math.floor((x - min) / binWidth);
        bins[idx]!++;
      }
      yield bins.slice();
    }
  });
}

// Streaming linear regression (online least squares)
export function streamingLinearRegression(src: Iterable<[number, number]>): Iterable<{ slope: number; intercept: number; rSquared: number }> {
  return makeTransform(src, function* (s) {
    let n = 0;
    let meanX = 0;
    let meanY = 0;
    let M2x = 0;
    let Cxy = 0;
    let M2y = 0;
    for (const [x, y] of s) {
      n++;
      const deltaX = x - meanX;
      meanX += deltaX / n;
      const deltaX2 = x - meanX;
      M2x += deltaX * deltaX2;
      const deltaY = y - meanY;
      meanY += deltaY / n;
      const deltaY2 = y - meanY;
      M2y += deltaY * deltaY2;
      Cxy += deltaX * deltaY2;
      if (n < 2 || M2x === 0) {
        yield { slope: NaN, intercept: NaN, rSquared: NaN };
      } else {
        const slope = Cxy / M2x;
        const intercept = meanY - slope * meanX;
        const rSquared = M2y > 0 ? (Cxy * Cxy) / (M2x * M2y) : NaN;
        yield { slope, intercept, rSquared };
      }
    }
  });
}

// Auto-correlation (lag-based correlation for time series)
export function autoCorrelation(src: Iterable<number>, lag: number): Iterable<number> {
  validatePositive(lag, 'Lag');
  return makeTransform(src, function* (s) {
    const buffer: number[] = [];
    let n = 0;
    let meanAll = 0;
    let M2all = 0;
    for (const x of s) {
      n++;
      const delta = x - meanAll;
      meanAll += delta / n;
      M2all += delta * (x - meanAll);
      buffer.push(x);
      if (n <= lag) {
        yield NaN;
      } else {
        // Compute auto-correlation at the given lag using the full series seen so far
        const variance = M2all / n;
        if (variance === 0) {
          yield NaN;
        } else {
          let cov = 0;
          const len = buffer.length;
          for (let i = 0; i < len - lag; i++) {
            cov += (buffer[i]! - meanAll) * (buffer[i + lag]! - meanAll);
          }
          cov /= n;
          yield cov / variance;
        }
      }
    }
  });
}

// Streaming quantiles (P-square algorithm, Jain & Chlamtac 1985)
export function streamingQuantile(src: Iterable<number>, p: number): Iterable<number> {
  validateProbability(p, 'Quantile');
  return makeTransform(src, function* (s) {
    // P-square uses 5 markers to estimate the p-th quantile
    const q = new Array<number>(5); // marker heights
    const n = new Array<number>(5); // marker positions (1-indexed)
    const nPrime = new Array<number>(5); // desired marker positions
    const dn = [0, p / 2, p, (1 + p) / 2, 1]; // increments
    let count = 0;
    const initial: number[] = [];

    for (const x of s) {
      count++;
      if (count <= 5) {
        initial.push(x);
        if (count < 5) {
          yield NaN;
          continue;
        }
        // Initialize with first 5 observations sorted
        initial.sort((a, b) => a - b);
        for (let i = 0; i < 5; i++) {
          q[i] = initial[i]!;
          n[i] = i + 1;
          nPrime[i] = 1 + 2 * dn[i]! * 2; // desired positions for n=5
        }
        // Correct desired positions for initial state
        nPrime[0] = 1;
        nPrime[1] = 1 + 2 * p / 2;
        nPrime[2] = 1 + 2 * p;
        nPrime[3] = 1 + 2 * (1 + p) / 2;
        nPrime[4] = 5;
        yield q[2]!;
        continue;
      }

      // Step B1: Find cell k
      let k: number;
      if (x < q[0]!) {
        q[0] = x;
        k = 0;
      } else if (x < q[1]!) {
        k = 0;
      } else if (x < q[2]!) {
        k = 1;
      } else if (x < q[3]!) {
        k = 2;
      } else if (x <= q[4]!) {
        k = 3;
      } else {
        q[4] = x;
        k = 3;
      }

      // Step B2: Increment positions
      for (let i = k + 1; i < 5; i++) n[i]!++;

      // Update desired positions
      nPrime[0] = 1;
      nPrime[1] = (count - 1) * p / 2 + 1;
      nPrime[2] = (count - 1) * p + 1;
      nPrime[3] = (count - 1) * (1 + p) / 2 + 1;
      nPrime[4] = count;

      // Step B3: Adjust marker heights
      for (let i = 1; i <= 3; i++) {
        const di = nPrime[i]! - n[i]!;
        if ((di >= 1 && (n[i + 1]! - n[i]!) > 1) || (di <= -1 && (n[i - 1]! - n[i]!) < -1)) {
          const sign = di > 0 ? 1 : -1;
          // Try parabolic
          const qi = q[i]!;
          const qim1 = q[i - 1]!;
          const qip1 = q[i + 1]!;
          const ni = n[i]!;
          const nim1 = n[i - 1]!;
          const nip1 = n[i + 1]!;
          const parabolic = qi + (sign / (nip1 - nim1)) * (
            (ni - nim1 + sign) * (qip1 - qi) / (nip1 - ni) +
            (nip1 - ni - sign) * (qi - qim1) / (ni - nim1)
          );
          if (qim1 < parabolic && parabolic < qip1) {
            q[i] = parabolic;
          } else {
            // Linear fallback
            const j = i + sign;
            q[i] = qi + sign * (q[j]! - qi) / (n[j]! - ni);
          }
          n[i] = ni + sign;
        }
      }

      yield q[2]!;
    }
  });
}
