/**
 * iterflow - Lazy iterators with statistics and windowing
 * @packageDocumentation
 */

import type { Predicate, Mapper, Reducer, FlatMapper } from './core.js';
import * as transforms from './transforms.js';
import * as terminals from './terminals.js';

// Iterflow class
export class Iterflow<T> implements Iterable<T> {
  constructor(private readonly src: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.src[Symbol.iterator]();
  }

  // Transforms
  /**
   * Transform each element using the provided function.
   */
  map<U>(fn: Mapper<T, U>): Iterflow<U> {
    return new Iterflow(transforms.map(this.src, fn));
  }

  /**
   * Keep only elements matching the predicate.
   */
  filter(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.filter(this.src, fn));
  }

  /**
   * Transform each element to an iterable and flatten the results.
   */
  flatMap<U>(fn: FlatMapper<T, U>): Iterflow<U> {
    return new Iterflow(transforms.flatMap(this.src, fn));
  }

  /**
   * Take the first n elements.
   */
  take(n: number): Iterflow<T> {
    return new Iterflow(transforms.take(this.src, n));
  }

  /**
   * Skip the first n elements.
   */
  drop(n: number): Iterflow<T> {
    return new Iterflow(transforms.drop(this.src, n));
  }

  /**
   * Take elements while the predicate is true.
   */
  takeWhile(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.takeWhile(this.src, fn));
  }

  /**
   * Skip elements while the predicate is true.
   */
  dropWhile(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.dropWhile(this.src, fn));
  }

  /**
   * Remove duplicate elements.
   */
  distinct(): Iterflow<T> {
    return new Iterflow(transforms.distinct(this.src));
  }

  /**
   * Yield [index, value] pairs.
   */
  enumerate(): Iterflow<[number, T]> {
    return new Iterflow(transforms.enumerate(this.src));
  }

  /**
   * Append additional iterables to the sequence.
   */
  concat<U>(...others: Iterable<U>[]): Iterflow<T | U> {
    return new Iterflow(transforms.concat(this.src, ...others));
  }

  /**
   * Create sliding windows of the specified size.
   */
  window(size: number): Iterflow<T[]> {
    return new Iterflow(transforms.window(this.src, size));
  }

  /**
   * Split the sequence into fixed-size chunks.
   */
  chunk(size: number): Iterflow<T[]> {
    return new Iterflow(transforms.chunk(this.src, size));
  }

  // Terminals
  /**
   * Collect all elements into an array.
   */
  toArray(): T[] {
    return terminals.toArray(this.src);
  }

  /**
   * Fold the sequence into a single value.
   */
  reduce<U>(fn: Reducer<T, U>, init: U): U {
    return terminals.reduce(this.src, fn, init);
  }

  /**
   * Find the first element matching the predicate.
   */
  find(fn: Predicate<T>): T | undefined {
    return terminals.find(this.src, fn);
  }

  /**
   * Execute a function for each element.
   */
  forEach(fn: (v: T, i: number) => void): void {
    terminals.forEach(this.src, fn);
  }

  /**
   * Get the first element, or undefined if empty.
   */
  first(): T | undefined {
    return terminals.first(this.src);
  }

  /**
   * Get the last element, or undefined if empty.
   */
  last(): T | undefined {
    return terminals.last(this.src);
  }

  /**
   * Count the number of elements.
   */
  count(): number {
    return terminals.count(this.src);
  }

  /**
   * Check if any element matches the predicate.
   */
  some(fn: Predicate<T>): boolean {
    return terminals.some(this.src, fn);
  }

  /**
   * Check if all elements match the predicate.
   */
  every(fn: Predicate<T>): boolean {
    return terminals.every(this.src, fn);
  }

  // Stats (numbers only)
  /**
   * Calculate the sum of all numbers.
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  sum(this: Iterflow<number>): number {
    return terminals.sum(this.src);
  }

  /**
   * Calculate the arithmetic mean.
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  mean(this: Iterflow<number>): number {
    return terminals.mean(this.src);
  }

  /**
   * Calculate the median (50th percentile).
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  median(this: Iterflow<number>): number {
    return terminals.median(this.src);
  }

  /**
   * Find the minimum value.
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  min(this: Iterflow<number>): number {
    return terminals.min(this.src);
  }

  /**
   * Find the maximum value.
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  max(this: Iterflow<number>): number {
    return terminals.max(this.src);
  }

  /**
   * Calculate the population variance.
   * @throws {EmptySequenceError} If the sequence is empty.
   */
  variance(this: Iterflow<number>): number {
    return terminals.variance(this.src);
  }
}

// Factory function
/**
 * Creates an Iterflow wrapper around any iterable.
 */
export function iter<T>(src: Iterable<T>): Iterflow<T> {
  return new Iterflow(src);
}

// Re-exports from other modules
export { IterflowError, EmptySequenceError, isIterable } from './core.js';
export type { Predicate, Mapper, Reducer, FlatMapper } from './core.js';
export { sum, mean, median, min, max, variance } from './terminals.js';
