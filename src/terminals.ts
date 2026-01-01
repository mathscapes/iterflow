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
 * Calculate the median (50th percentile).
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const median = (src: Iterable<number>): number => {
  const vals = Array.from(src);
  assertNonEmpty(vals.length, 'median');
  vals.sort((a, b) => a - b);
  const mid = vals.length >> 1;
  return vals.length % 2 ? vals[mid]! : (vals[mid - 1]! + vals[mid]!) / 2;
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
 * Calculate the population variance.
 * @throws {EmptySequenceError} If the sequence is empty.
 */
export const variance = (src: Iterable<number>): number => {
  const vals = Array.from(src);
  assertNonEmpty(vals.length, 'variance');

  let sum = 0;
  for (const v of vals) sum += v;
  const avg = sum / vals.length;

  return vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length;
};
