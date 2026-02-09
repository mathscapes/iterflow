import { EmptySequenceError } from './core.js';

// Generator factory
export function makeTransform<T, U>(
  src: Iterable<T>,
  generator: (src: Iterable<T>) => Generator<U>
): Iterable<U> {
  return {
    *[Symbol.iterator]() {
      yield* generator(src);
    }
  };
}

// Iteration helpers
export function assertNonEmpty(count: number, op: string): void {
  if (count === 0) {
    throw new EmptySequenceError(op);
  }
}

export function assertHasValue(has: boolean, op: string): void {
  if (!has) {
    throw new EmptySequenceError(op);
  }
}

// Validation helpers
export function validateInteger(n: number, param: string): void {
  if (!Number.isFinite(n)) {
    throw new RangeError(`${param} must be finite`);
  }
  if (!Number.isInteger(n)) {
    throw new TypeError(`${param} must be an integer`);
  }
}

export function validateNonNegative(n: number, param: string): void {
  validateInteger(n, param);
  if (n < 0) {
    throw new RangeError(`${param} must be non-negative`);
  }
}

export function validatePositive(n: number, param: string): void {
  validateInteger(n, param);
  if (n <= 0) {
    throw new RangeError(`${param} must be positive`);
  }
}

export function validateAlphaRange(alpha: number, param: string): void {
  if (!Number.isFinite(alpha)) {
    throw new RangeError(`${param} must be finite`);
  }
  if (alpha <= 0 || alpha > 1) {
    throw new RangeError(`${param} must be in range (0, 1]`);
  }
}
