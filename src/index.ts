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
  map<U>(fn: Mapper<T, U>): Iterflow<U> {
    return new Iterflow(transforms.map(this.src, fn));
  }

  filter(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.filter(this.src, fn));
  }

  flatMap<U>(fn: FlatMapper<T, U>): Iterflow<U> {
    return new Iterflow(transforms.flatMap(this.src, fn));
  }

  take(n: number): Iterflow<T> {
    return new Iterflow(transforms.take(this.src, n));
  }

  drop(n: number): Iterflow<T> {
    return new Iterflow(transforms.drop(this.src, n));
  }

  takeWhile(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.takeWhile(this.src, fn));
  }

  dropWhile(fn: Predicate<T>): Iterflow<T> {
    return new Iterflow(transforms.dropWhile(this.src, fn));
  }

  distinct(): Iterflow<T> {
    return new Iterflow(transforms.distinct(this.src));
  }

  enumerate(): Iterflow<[number, T]> {
    return new Iterflow(transforms.enumerate(this.src));
  }

  concat<U>(...others: Iterable<U>[]): Iterflow<T | U> {
    return new Iterflow(transforms.concat(this.src, ...others));
  }

  window(size: number): Iterflow<T[]> {
    return new Iterflow(transforms.window(this.src, size));
  }

  chunk(size: number): Iterflow<T[]> {
    return new Iterflow(transforms.chunk(this.src, size));
  }

  zip<U>(other: Iterable<U>): Iterflow<[T, U]>;
  zip<U, V>(other1: Iterable<U>, other2: Iterable<V>): Iterflow<[T, U, V]>;
  zip(other: Iterable<unknown>, other2?: Iterable<unknown>): Iterflow<unknown[]> {
    if (other2 !== undefined) {
      return new Iterflow(transforms.zip(this.src, other, other2));
    }
    return new Iterflow(transforms.zip(this.src, other));
  }

  streamingMean(this: Iterflow<number>): Iterflow<number> {
    return new Iterflow(transforms.streamingMean(this.src));
  }

  streamingVariance(this: Iterflow<number>): Iterflow<number> {
    return new Iterflow(transforms.streamingVariance(this.src));
  }

  ewma(this: Iterflow<number>, alpha: number): Iterflow<number> {
    return new Iterflow(transforms.ewma(this.src, alpha));
  }

  streamingCovariance(this: Iterflow<[number, number]>): Iterflow<number> {
    return new Iterflow(transforms.streamingCovariance(this.src));
  }

  streamingCorrelation(this: Iterflow<[number, number]>): Iterflow<number> {
    return new Iterflow(transforms.streamingCorrelation(this.src));
  }

  // Terminals
  toArray(): T[] {
    return terminals.toArray(this.src);
  }

  reduce<U>(fn: Reducer<T, U>, init: U): U {
    return terminals.reduce(this.src, fn, init);
  }

  find(fn: Predicate<T>): T | undefined {
    return terminals.find(this.src, fn);
  }

  forEach(fn: (v: T, i: number) => void): void {
    terminals.forEach(this.src, fn);
  }

  first(): T | undefined {
    return terminals.first(this.src);
  }

  last(): T | undefined {
    return terminals.last(this.src);
  }

  count(): number {
    return terminals.count(this.src);
  }

  some(fn: Predicate<T>): boolean {
    return terminals.some(this.src, fn);
  }

  every(fn: Predicate<T>): boolean {
    return terminals.every(this.src, fn);
  }

  sum(this: Iterflow<number>): number {
    return terminals.sum(this.src);
  }

  mean(this: Iterflow<number>): number {
    return terminals.mean(this.src);
  }

  median(this: Iterflow<number>): number {
    return terminals.median(this.src);
  }

  min(this: Iterflow<number>): number {
    return terminals.min(this.src);
  }

  max(this: Iterflow<number>): number {
    return terminals.max(this.src);
  }

  variance(this: Iterflow<number>): number {
    return terminals.variance(this.src);
  }

  stdDev(this: Iterflow<number>): number {
    return terminals.stdDev(this.src);
  }
}

// Factory function
export function iter<T>(src: Iterable<T>): Iterflow<T> {
  return new Iterflow(src);
}

// Re-exports from other modules
export { IterflowError, EmptySequenceError, isIterable } from './core.js';
export type { Predicate, Mapper, Reducer, FlatMapper } from './core.js';
export { sum, mean, median, min, max, variance, stdDev } from './terminals.js';
