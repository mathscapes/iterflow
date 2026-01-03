// Error classes
/**
 * Base error class for all iterflow errors.
 */
export class IterflowError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IterflowError';
  }
}

/**
 * Thrown by statistical methods when called on empty sequences.
 */
export class EmptySequenceError extends IterflowError {
  constructor(readonly op: string) {
    super(`Cannot compute ${op} of empty sequence`);
    this.name = 'EmptySequenceError';
  }
}

// Type definitions
export type Predicate<T> = (v: T, i: number) => boolean;
export type Mapper<T, U> = (v: T, i: number) => U;
export type Reducer<T, U> = (acc: U, v: T, i: number) => U;
export type FlatMapper<T, U> = (v: T, i: number) => Iterable<U>;

// Utilities
/**
 * Type guard to check if a value is iterable.
 */
export const isIterable = (v: unknown): v is Iterable<unknown> =>
  v != null && typeof v === 'object' && Symbol.iterator in v;
