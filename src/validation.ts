/**
 * Input validation utilities for iterflow operations
 * @module validation
 */

import { ValidationError, TypeConversionError } from "./errors.js";

/**
 * Validates that a value is a positive integer
 */
export function validatePositiveInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isInteger(value)) {
    throw new ValidationError(
      `${paramName} must be an integer, got ${value}`,
      operation,
      { paramName, value },
    );
  }

  if (value < 1) {
    throw new ValidationError(
      `${paramName} must be at least 1, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is a non-negative integer (zero or greater)
 *
 * This function ensures the value is both an integer and non-negative, making it
 * suitable for array indices, counts, and offsets that can start from zero.
 *
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value is not an integer
 * @throws {ValidationError} When value is negative
 * @example
 * ```typescript
 * validateNonNegativeInteger(0, "index");      // OK - zero is allowed
 * validateNonNegativeInteger(5, "offset");     // OK
 * validateNonNegativeInteger(-1, "index");     // throws ValidationError
 * validateNonNegativeInteger(1.5, "count");    // throws ValidationError
 * ```
 */
export function validateNonNegativeInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isInteger(value)) {
    throw new ValidationError(
      `${paramName} must be an integer, got ${value}`,
      operation,
      { paramName, value },
    );
  }

  if (value < 0) {
    throw new ValidationError(
      `${paramName} must be non-negative, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is within a specific range (inclusive)
 *
 * Checks that a numeric value falls within the specified bounds, including
 * both minimum and maximum values. Useful for percentages, bounded parameters,
 * and range-constrained inputs.
 *
 * @param value - The value to validate
 * @param min - The minimum allowed value (inclusive)
 * @param max - The maximum allowed value (inclusive)
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value is less than min or greater than max
 * @example
 * ```typescript
 * validateRange(50, 0, 100, "percent");     // OK
 * validateRange(0, 0, 100, "percent");      // OK - min boundary
 * validateRange(100, 0, 100, "percent");    // OK - max boundary
 * validateRange(150, 0, 100, "percent");    // throws ValidationError
 * validateRange(-10, 0, 100, "percent");    // throws ValidationError
 * ```
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  paramName: string,
  operation?: string,
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${paramName} must be between ${min} and ${max}, got ${value}`,
      operation,
      { paramName, value, min, max },
    );
  }
}

/**
 * Validates that a value is a finite number (not NaN or Infinity)
 *
 * Ensures the value is a real, finite number that can be used in mathematical
 * operations. Rejects NaN, Infinity, and -Infinity which could cause undefined
 * behavior in calculations.
 *
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value is NaN, Infinity, or -Infinity
 * @example
 * ```typescript
 * validateFiniteNumber(42, "weight");           // OK
 * validateFiniteNumber(-3.14, "temperature");   // OK
 * validateFiniteNumber(0, "value");             // OK
 * validateFiniteNumber(NaN, "result");          // throws ValidationError
 * validateFiniteNumber(Infinity, "max");        // throws ValidationError
 * ```
 */
export function validateFiniteNumber(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isFinite(value)) {
    throw new ValidationError(
      `${paramName} must be a finite number, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is not zero
 *
 * Prevents division by zero errors and other operations where zero is invalid.
 * Detects both positive and negative zero.
 *
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value equals zero (including -0)
 * @example
 * ```typescript
 * validateNonZero(1, "divisor");       // OK
 * validateNonZero(-5, "denominator");  // OK
 * validateNonZero(0.1, "scale");       // OK
 * validateNonZero(0, "divisor");       // throws ValidationError
 * validateNonZero(-0, "divisor");      // throws ValidationError
 * ```
 */
export function validateNonZero(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (value === 0) {
    throw new ValidationError(`${paramName} cannot be zero`, operation, {
      paramName,
      value,
    });
  }
}

/**
 * Validates that a value is a function
 *
 * Type guard that ensures the value is callable. Accepts arrow functions, regular
 * functions, async functions, generator functions, and class constructors.
 * Uses TypeScript assertion to narrow the type.
 *
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value is not a function
 * @example
 * ```typescript
 * validateFunction((x) => x * 2, "mapper");           // OK
 * validateFunction(Math.max, "comparator");           // OK
 * async function fetch() {}
 * validateFunction(fetch, "loader");                  // OK
 * validateFunction(null, "callback");                 // throws ValidationError
 * validateFunction("not a function", "fn");           // throws ValidationError
 * ```
 */
export function validateFunction(
  value: unknown,
  paramName: string,
  operation?: string,
): asserts value is (...args: unknown[]) => unknown {
  if (typeof value !== "function") {
    throw new ValidationError(
      `${paramName} must be a function, got ${typeof value}`,
      operation,
      { paramName, type: typeof value },
    );
  }
}

/**
 * Validates that a value is iterable
 *
 * Type guard ensuring the value implements the iterable protocol (has Symbol.iterator).
 * Accepts arrays, strings, Maps, Sets, generators, and custom iterables.
 * Uses TypeScript assertion to narrow the type.
 *
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 * @throws {ValidationError} When value is null, undefined, or lacks Symbol.iterator
 * @example
 * ```typescript
 * validateIterable([1, 2, 3], "items");                // OK
 * validateIterable("hello", "text");                   // OK
 * validateIterable(new Set([1, 2]), "uniqueIds");      // OK
 * function* gen() { yield 1; }
 * validateIterable(gen(), "sequence");                 // OK
 * validateIterable(null, "items");                     // throws ValidationError
 * validateIterable({ a: 1 }, "obj");                   // throws ValidationError
 * ```
 */
export function validateIterable<T>(
  value: unknown,
  paramName: string,
  operation?: string,
): asserts value is Iterable<T> {
  if (value == null || typeof (value as any)[Symbol.iterator] !== "function") {
    throw new ValidationError(`${paramName} must be iterable`, operation, {
      paramName,
      type: typeof value,
    });
  }
}

/**
 * Validates that a value is a valid comparator function
 *
 * Type guard ensuring the value is a function suitable for sorting and comparison
 * operations. A comparator should return a negative number if a < b, zero if a === b,
 * and a positive number if a > b. Uses TypeScript assertion to narrow the type.
 *
 * @param fn - The value to validate as a comparator
 * @param operation - The operation name for error context
 * @throws {ValidationError} When fn is not a function
 * @example
 * ```typescript
 * const numCompare = (a: number, b: number) => a - b;
 * validateComparator(numCompare);                      // OK
 *
 * const strCompare = (a: string, b: string) => a.localeCompare(b);
 * validateComparator(strCompare, "sortBy");            // OK
 *
 * validateComparator(null, "sort");                    // throws ValidationError
 * validateComparator("not a function", "sort");        // throws ValidationError
 * ```
 */
export function validateComparator<T>(
  fn: unknown,
  operation?: string,
): asserts fn is (a: T, b: T) => number {
  validateFunction(fn, "comparator", operation);

  // Optional: Test with sample values if needed
  // This is a basic check - actual validation happens at runtime
}

/**
 * Validates that an array is not empty
 *
 * Ensures an array has at least one element. Useful for operations that require
 * at least one item to function properly (e.g., finding min/max, first/last).
 *
 * @param arr - The array to validate
 * @param operation - The operation name for error context
 * @throws {ValidationError} When the array is empty (length === 0)
 * @example
 * ```typescript
 * validateNonEmpty([1, 2, 3]);         // OK
 * validateNonEmpty(["a"]);             // OK
 * validateNonEmpty([]);                // throws ValidationError
 *
 * // Usage in operations requiring elements
 * function findMax(arr: number[]): number {
 *   validateNonEmpty(arr, "findMax");
 *   return Math.max(...arr);
 * }
 * ```
 */
export function validateNonEmpty<T>(arr: T[], operation?: string): void {
  if (arr.length === 0) {
    throw new ValidationError("Sequence cannot be empty", operation);
  }
}

/**
 * Safely converts a value to a number
 *
 * Attempts to convert any value to a number using JavaScript's Number() constructor.
 * Throws a specific error if the conversion results in NaN, providing clear feedback
 * about type conversion failures.
 *
 * @param value - The value to convert to a number
 * @param operation - The operation name for error context
 * @returns The numeric representation of the value
 * @throws {TypeConversionError} When conversion results in NaN
 * @example
 * ```typescript
 * toNumber("123");              // returns 123
 * toNumber("45.6");             // returns 45.6
 * toNumber(100);                // returns 100
 * toNumber(true);               // returns 1
 * toNumber("not a number");     // throws TypeConversionError
 * toNumber(undefined);          // throws TypeConversionError
 * ```
 */
export function toNumber(
  value: unknown,
  operation?: string,
): number {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new TypeConversionError(value, "number", operation);
  }

  return num;
}

/**
 * Safely converts a value to an integer
 *
 * Converts a value to a number and ensures it's an integer (no decimal part).
 * Uses Math.trunc to identify the integer portion and validates that no precision
 * is lost during conversion.
 *
 * @param value - The value to convert to an integer
 * @param operation - The operation name for error context
 * @returns The integer representation of the value
 * @throws {TypeConversionError} When conversion to number fails (NaN)
 * @throws {TypeConversionError} When the number has a fractional part
 * @example
 * ```typescript
 * toInteger("123");             // returns 123
 * toInteger(456);               // returns 456
 * toInteger("0");               // returns 0
 * toInteger("-50");             // returns -50
 * toInteger("123.45");          // throws TypeConversionError
 * toInteger(789.12);            // throws TypeConversionError
 * toInteger("abc");             // throws TypeConversionError
 * ```
 */
export function toInteger(
  value: unknown,
  operation?: string,
): number {
  const num = toNumber(value, operation);
  const int = Math.trunc(num);

  if (num !== int) {
    throw new TypeConversionError(value, "integer", operation);
  }

  return int;
}

/**
 * Validates an array index is within bounds
 *
 * Ensures an index is a non-negative integer and falls within the valid range
 * for an array or collection of the given size. Valid indices are 0 to size-1.
 *
 * @param index - The index to validate
 * @param size - The size of the array or collection
 * @param operation - The operation name for error context
 * @throws {ValidationError} When index is not a non-negative integer
 * @throws {ValidationError} When index is greater than or equal to size
 * @example
 * ```typescript
 * validateIndex(0, 10);         // OK
 * validateIndex(5, 10);         // OK
 * validateIndex(9, 10);         // OK - last valid index
 * validateIndex(10, 10);        // throws ValidationError - out of bounds
 * validateIndex(-1, 10);        // throws ValidationError - negative
 * validateIndex(1.5, 10);       // throws ValidationError - not integer
 * ```
 */
export function validateIndex(
  index: number,
  size: number,
  operation?: string,
): void {
  validateNonNegativeInteger(index, "index", operation);

  if (index >= size) {
    throw new ValidationError(
      `Index ${index} is out of bounds for size ${size}`,
      operation,
      { index, size },
    );
  }
}

/**
 * Validates that a number is a safe integer within JavaScript's safe integer range
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 */
export function validateSafeInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isSafeInteger(value)) {
    throw new ValidationError(
      `${paramName} must be a safe integer (${Number.MIN_SAFE_INTEGER} to ${Number.MAX_SAFE_INTEGER}), got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a window/chunk size is within reasonable bounds
 * @param size - The size to validate
 * @param maxSize - The maximum allowed size (default: 1,000,000)
 * @param operation - The operation name for error context
 */
export function validateWindowSize(
  size: number,
  maxSize: number = 1_000_000,
  operation?: string,
): void {
  validatePositiveInteger(size, "size", operation);

  if (size > maxSize) {
    throw new ValidationError(
      `Window size ${size} exceeds maximum allowed size ${maxSize}. Consider using smaller windows or streaming operations.`,
      operation,
      { size, maxSize },
    );
  }
}

/**
 * Validates that an array size is within reasonable memory bounds
 * @param size - The estimated size
 * @param maxElements - The maximum allowed elements (default: 10,000,000)
 * @param operation - The operation name for error context
 */
export function validateMemoryLimit(
  size: number,
  maxElements: number = 10_000_000,
  operation?: string,
): void {
  validateNonNegativeInteger(size, "size", operation);

  if (size > maxElements) {
    throw new ValidationError(
      `Operation would exceed memory limit (${size} elements > ${maxElements} maximum). Consider using streaming operations with take() or chunk().`,
      operation,
      { size, maxElements },
    );
  }
}
