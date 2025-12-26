/**
 * Error recovery utilities for iterflow
 * @module recovery
 */

import { OperationError } from "./errors.js";

/**
 * Error handler function type
 */
export type ErrorHandler<T, R = T> = (
  error: Error,
  element?: T,
  index?: number,
) => R;

/**
 * Options for retry behavior
 */
export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Wraps a function with error recovery
 */
export function withErrorRecovery<T, R>(
  fn: (value: T, index?: number) => R,
  errorHandler: ErrorHandler<T, R>,
): (value: T, index?: number) => R {
  return (value: T, index?: number): R => {
    try {
      return fn(value, index);
    } catch (error) {
      return errorHandler(error as Error, value, index);
    }
  };
}

/**
 * Wraps a function with retry logic
 *
 * Automatically retries a function on failure with configurable attempts, delays,
 * and exponential backoff. Useful for handling transient failures in operations
 * that may succeed on subsequent attempts.
 *
 * @template T - The function's argument types as a tuple
 * @template R - The function's return type
 * @param fn - The function to wrap with retry logic
 * @param options - Configuration object with maxAttempts (default: 3), delay in ms (default: 0), backoff flag (default: false), and optional onRetry callback
 * @returns A wrapped function that retries on failure
 * @throws {OperationError} When all retry attempts are exhausted
 * @example
 * ```typescript
 * const fetchWithRetry = withRetry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   {
 *     maxAttempts: 3,
 *     delay: 1000,
 *     backoff: true,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}: ${error.message}`)
 *   }
 * );
 *
 * const data = fetchWithRetry();
 * ```
 */
export function withRetry<T extends any[], R>(
  fn: (...args: T) => R,
  options: RetryOptions = {},
): (...args: T) => R {
  const { maxAttempts = 3, delay = 0, backoff = false, onRetry } = options;

  return (...args: T): R => {
    let lastError: Error;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          if (onRetry) {
            onRetry(attempt, lastError);
          }

          if (currentDelay > 0) {
            // Synchronous delay (note: this blocks, use with caution)
            const start = Date.now();
            while (Date.now() - start < currentDelay) {
              // busy wait
            }
          }

          if (backoff) {
            currentDelay *= 2;
          }
        }
      }
    }

    throw new OperationError(
      `Operation failed after ${maxAttempts} attempts`,
      "retry",
      lastError!,
    );
  };
}

/**
 * Async version of withRetry
 *
 * Wraps an async function with retry logic, using proper async delays instead of
 * busy-waiting. Ideal for network requests, database operations, or other async
 * operations that may fail transiently.
 *
 * @template T - The function's argument types as a tuple
 * @template R - The function's return type
 * @param fn - The async function to wrap with retry logic
 * @param options - Configuration object with maxAttempts (default: 3), delay in ms (default: 0), backoff flag (default: false), and optional onRetry callback
 * @returns A wrapped async function that retries on failure
 * @throws {OperationError} When all retry attempts are exhausted
 * @example
 * ```typescript
 * const fetchDataWithRetry = withRetryAsync(
 *   async (id: string) => {
 *     const response = await fetch(`/api/items/${id}`);
 *     return response.json();
 *   },
 *   {
 *     maxAttempts: 5,
 *     delay: 500,
 *     backoff: true
 *   }
 * );
 *
 * const item = await fetchDataWithRetry('123');
 * ```
 */
export function withRetryAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {},
): (...args: T) => Promise<R> {
  const { maxAttempts = 3, delay = 0, backoff = false, onRetry } = options;

  return async (...args: T): Promise<R> => {
    let lastError: Error;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          if (onRetry) {
            onRetry(attempt, lastError);
          }

          if (currentDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
          }

          if (backoff) {
            currentDelay *= 2;
          }
        }
      }
    }

    throw new OperationError(
      `Operation failed after ${maxAttempts} attempts`,
      "retry",
      lastError!,
    );
  };
}

/**
 * Returns a default value if an error occurs
 *
 * Wraps a function to catch any errors and return a fallback value instead,
 * preventing exceptions from propagating. Useful for providing safe defaults
 * in transformations or mappings.
 *
 * @template T - The input value type
 * @template R - The return/default value type
 * @param fn - The function that may throw
 * @param defaultValue - The value to return if fn throws
 * @returns A wrapped function that returns defaultValue on error
 * @example
 * ```typescript
 * const parseIntSafe = withDefault(
 *   (str: string) => {
 *     const num = parseInt(str, 10);
 *     if (isNaN(num)) throw new Error("Not a number");
 *     return num;
 *   },
 *   0
 * );
 *
 * parseIntSafe("123");  // returns 123
 * parseIntSafe("abc");  // returns 0 (default)
 * ```
 */
export function withDefault<T, R>(
  fn: (value: T) => R,
  defaultValue: R,
): (value: T) => R {
  return (value: T): R => {
    try {
      return fn(value);
    } catch {
      return defaultValue;
    }
  };
}

/**
 * Returns a fallback value if an error occurs (swallows errors)
 *
 * Similar to withDefault, this function wraps another function and returns a fallback
 * value on error. Provides error-safe execution for operations that should never throw.
 *
 * @template T - The input value type
 * @template R - The return/fallback value type
 * @param fn - The function that may throw
 * @param fallback - The value to return if fn throws
 * @returns A wrapped function that returns fallback on error
 * @example
 * ```typescript
 * const safeDivide = tryOr(
 *   (x: number) => 100 / x,
 *   Infinity
 * );
 *
 * safeDivide(10);  // returns 10
 * safeDivide(0);   // returns Infinity (fallback)
 * ```
 */
export function tryOr<T, R>(fn: (value: T) => R, fallback: R): (value: T) => R {
  return (value: T): R => {
    try {
      return fn(value);
    } catch {
      return fallback;
    }
  };
}

/**
 * Executes a function and returns [result, error] tuple
 *
 * Provides Go-style error handling by returning both the result and error as a tuple.
 * Allows explicit error handling without try-catch blocks.
 *
 * @template T - The input value type
 * @template R - The function's return type
 * @param fn - The function to execute
 * @param value - The value to pass to fn
 * @returns A tuple of [result, undefined] on success or [undefined, error] on failure
 * @example
 * ```typescript
 * const [result, error] = tryCatch(
 *   (str: string) => JSON.parse(str),
 *   '{"name": "Alice"}'
 * );
 *
 * if (error) {
 *   console.error("Parse failed:", error);
 * } else {
 *   console.log("Parsed:", result);
 * }
 * ```
 */
export function tryCatch<T, R>(
  fn: (value: T) => R,
  value: T,
): [R | undefined, Error | undefined] {
  try {
    return [fn(value), undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
}

/**
 * Async version of tryCatch
 *
 * Executes an async function and returns [result, error] tuple, providing
 * Go-style error handling for async operations.
 *
 * @template T - The input value type
 * @template R - The function's return type
 * @param fn - The async function to execute
 * @param value - The value to pass to fn
 * @returns A promise resolving to [result, undefined] on success or [undefined, error] on failure
 * @example
 * ```typescript
 * const [data, error] = await tryCatchAsync(
 *   async (url: string) => {
 *     const response = await fetch(url);
 *     return response.json();
 *   },
 *   '/api/users'
 * );
 *
 * if (error) {
 *   console.error("Request failed:", error);
 * } else {
 *   console.log("Data:", data);
 * }
 * ```
 */
export async function tryCatchAsync<T, R>(
  fn: (value: T) => Promise<R>,
  value: T,
): Promise<[R | undefined, Error | undefined]> {
  try {
    return [await fn(value), undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
}

/**
 * Result type for safe operations
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Wraps a function to return a Result type
 *
 * Transforms a throwing function into one that returns a discriminated union
 * Result type ({ success: true, value } | { success: false, error }).
 * Enables type-safe error handling with exhaustive checking.
 *
 * @template T - The input value type
 * @template R - The function's return type
 * @param fn - The function that may throw
 * @returns A wrapped function that returns a Result type
 * @example
 * ```typescript
 * const parseJson = toResult((str: string) => JSON.parse(str));
 *
 * const result = parseJson('{"name": "Alice"}');
 * if (result.success) {
 *   console.log(result.value.name); // Type-safe access
 * } else {
 *   console.error(result.error.message); // Type-safe error handling
 * }
 * ```
 */
export function toResult<T, R>(fn: (value: T) => R): (value: T) => Result<R> {
  return (value: T): Result<R> => {
    try {
      return { success: true, value: fn(value) };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };
}

/**
 * Async version of toResult
 *
 * Wraps an async function to return a Result type instead of throwing.
 * Provides type-safe error handling for async operations.
 *
 * @template T - The input value type
 * @template R - The function's return type
 * @param fn - The async function that may throw
 * @returns A wrapped async function that returns a Result type
 * @example
 * ```typescript
 * const fetchUser = toResultAsync(async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * });
 *
 * const result = await fetchUser('123');
 * if (result.success) {
 *   console.log(result.value.name);
 * } else {
 *   console.error("Fetch failed:", result.error);
 * }
 * ```
 */
export function toResultAsync<T, R>(
  fn: (value: T) => Promise<R>,
): (value: T) => Promise<Result<R>> {
  return async (value: T): Promise<Result<R>> => {
    try {
      return { success: true, value: await fn(value) };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };
}

/**
 * Guards a predicate function to return false on error instead of throwing
 *
 * Wraps a predicate to prevent errors from breaking filter/find operations.
 * Returns the default value (false by default) when the predicate throws.
 *
 * @template T - The value type being tested
 * @param predicate - The predicate function that may throw
 * @param defaultValue - The value to return on error (default: false)
 * @returns A safe predicate that never throws
 * @example
 * ```typescript
 * const hasValidId = safePredicate(
 *   (user: any) => user.id > 0,
 *   false
 * );
 *
 * [{ id: 1 }, { id: null }, { id: 3 }].filter(hasValidId);
 * // Returns [{ id: 1 }, { id: 3 }] - null.id doesn't throw
 * ```
 */
export function safePredicate<T>(
  predicate: (value: T, index?: number) => boolean,
  defaultValue = false,
): (value: T, index?: number) => boolean {
  return (value: T, index?: number): boolean => {
    try {
      return predicate(value, index);
    } catch {
      return defaultValue;
    }
  };
}

/**
 * Guards a comparator function to handle errors gracefully
 *
 * Wraps a comparator to prevent errors from breaking sort operations.
 * Returns the default comparison value (0 by default) when the comparator throws.
 *
 * @template T - The value type being compared
 * @param comparator - The comparator function that may throw
 * @param defaultComparison - The value to return on error (default: 0, meaning equal)
 * @returns A safe comparator that never throws
 * @example
 * ```typescript
 * const byAge = safeComparator(
 *   (a: any, b: any) => a.age - b.age,
 *   0
 * );
 *
 * [{ age: 30 }, { age: null }, { age: 25 }].sort(byAge);
 * // Doesn't throw when comparing with null
 * ```
 */
export function safeComparator<T>(
  comparator: (a: T, b: T) => number,
  defaultComparison = 0,
): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    try {
      return comparator(a, b);
    } catch {
      return defaultComparison;
    }
  };
}

/**
 * Creates an error boundary that catches and logs errors
 *
 * Wraps a function with configurable error handling, allowing custom error logging,
 * optional re-throwing, and default value fallbacks. Ideal for top-level error
 * boundaries or instrumentation.
 *
 * @template T - The function's argument types as a tuple
 * @template R - The function's return type
 * @param fn - The function to wrap with error boundary
 * @param options - Error handling configuration
 * @param options.onError - Callback invoked when an error occurs, before rethrowing or returning default
 * @param options.rethrow - Whether to rethrow the error after logging (default: true)
 * @param options.defaultValue - Value to return instead of rethrowing (only used if rethrow is false)
 * @returns A wrapped function with error boundary
 * @throws The original error if rethrow is true (default behavior)
 * @example
 * ```typescript
 * const processWithLogging = errorBoundary(
 *   (data: unknown) => JSON.parse(data as string),
 *   {
 *     onError: (error, [data]) => {
 *       console.error("Parse failed for:", data, error);
 *       sendToErrorTracking(error);
 *     },
 *     rethrow: false,
 *     defaultValue: {}
 *   }
 * );
 *
 * const result = processWithLogging('invalid json');
 * // Logs error but returns {} instead of throwing
 * ```
 */
export function errorBoundary<T extends any[], R>(
  fn: (...args: T) => R,
  options: {
    onError?: (error: Error, args: T) => void;
    rethrow?: boolean;
    defaultValue?: R;
  } = {},
): (...args: T) => R | undefined {
  const { onError, rethrow = true, defaultValue } = options;

  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      if (onError) {
        onError(error as Error, args);
      }

      if (rethrow) {
        throw error;
      }

      return defaultValue;
    }
  };
}
