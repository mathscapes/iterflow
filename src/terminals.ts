import type { Predicate, Reducer } from './core.js';
import { assertNonEmpty, assertHasValue } from './internal.js';

// Collection terminals
export function toArray<T>(src: Iterable<T>): T[] {
  return Array.from(src);
}

export function reduce<T, U>(src: Iterable<T>, fn: Reducer<T, U>, init: U): U {
  let acc = init, i = 0;
  for (const v of src) acc = fn(acc, v, i++);
  return acc;
}

export function find<T>(src: Iterable<T>, fn: Predicate<T>): T | undefined {
  let i = 0;
  for (const v of src) if (fn(v, i++)) return v;
  return undefined;
}

export function forEach<T>(src: Iterable<T>, fn: (v: T, i: number) => void): void {
  let i = 0;
  for (const v of src) fn(v, i++);
}

// Testing terminals
export function first<T>(src: Iterable<T>): T | undefined {
  for (const v of src) return v;
  return undefined;
}

export function last<T>(src: Iterable<T>): T | undefined {
  if (Array.isArray(src)) return src[src.length - 1];
  let last: T | undefined;
  for (const v of src) last = v;
  return last;
}

export function count<T>(src: Iterable<T>): number {
  if (Array.isArray(src)) return src.length;
  let n = 0;
  for (const _ of src) n++;
  return n;
}

export function some<T>(src: Iterable<T>, fn: Predicate<T>): boolean {
  let i = 0;
  for (const v of src) if (fn(v, i++)) return true;
  return false;
}

export function every<T>(src: Iterable<T>, fn: Predicate<T>): boolean {
  let i = 0;
  for (const v of src) if (!fn(v, i++)) return false;
  return true;
}

// Statistical terminals
/**
 * Calculate the sum of all numbers.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const sum = (src: Iterable<number>): number => {
  let total = 0, count = 0;
  for (const v of src) { total += v; count++; }
  assertNonEmpty(count, 'sum');
  return total;
};

/**
 * Calculate the arithmetic mean.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const mean = (src: Iterable<number>): number => {
  let total = 0, count = 0;
  for (const v of src) { total += v; count++; }
  assertNonEmpty(count, 'mean');
  return total / count;
};

/**
 * Partition array around a pivot for Quickselect.
 * @private
 */
function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right]!;
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j]! < pivot) {
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right]!, arr[i]!];
  return i;
}

/**
 * Find the k-th smallest element using Quickselect (Hoare's selection algorithm).
 * @private
 */
function quickselect(arr: number[], k: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const pivotIndex = partition(arr, left, right);
    if (pivotIndex === k) {
      return arr[k]!;
    } else if (pivotIndex > k) {
      right = pivotIndex - 1;
    } else {
      left = pivotIndex + 1;
    }
  }

  return arr[left]!;
}

/**
 * Calculate the median (50th percentile) using Quickselect algorithm.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const median = (src: Iterable<number>): number => {
  const arr = Array.from(src);
  assertNonEmpty(arr.length, 'median');

  const mid = arr.length >> 1;
  if (arr.length % 2) {
    // Odd length: return middle element
    return quickselect(arr, mid);
  } else {
    // Even length: return average of two middle elements
    const upper = quickselect(arr, mid);
    const lower = quickselect(arr, mid - 1);
    return (lower + upper) / 2;
  }
};

/**
 * Find the minimum value.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const min = (src: Iterable<number>): number => {
  let result = Infinity, has = false;
  for (const v of src) { if (v < result) result = v; has = true; }
  assertHasValue(has, 'min');
  return result;
};

/**
 * Find the maximum value.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const max = (src: Iterable<number>): number => {
  let result = -Infinity, has = false;
  for (const v of src) { if (v > result) result = v; has = true; }
  assertHasValue(has, 'max');
  return result;
};

/**
 * Calculate the population variance using Welford's online algorithm.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const variance = (src: Iterable<number>): number => {
  let count = 0;
  let mean = 0;
  let M2 = 0;

  for (const x of src) {
    count++;
    const delta = x - mean;
    mean += delta / count;
    const delta2 = x - mean;
    M2 += delta * delta2;
  }

  assertNonEmpty(count, 'variance');
  return M2 / count;
};
