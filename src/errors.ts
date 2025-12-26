/**
 * Error handling utilities and custom error classes for iterflow
 * @module errors
 */

/**
 * Base error class for all iterflow errors
 *
 * Provides a foundation for all library-specific errors with additional context
 * including the operation name and custom metadata for debugging.
 *
 * @example
 * ```typescript
 * throw new iterflowError(
 *   "Invalid configuration",
 *   "setupStream",
 *   { config: { timeout: -1 } }
 * );
 * ```
 */
export class iterflowError extends Error {
  public readonly operation?: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    operation?: string,
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "iterflowError";
    this.operation = operation;
    this.context = context;

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a detailed error message with context
   *
   * Formats the error as a multi-line string including operation name, context data,
   * and stack trace for comprehensive debugging information.
   *
   * @returns A formatted string containing all error details
   * @example
   * ```typescript
   * const error = new iterflowError(
   *   "Processing failed",
   *   "transform",
   *   { index: 42, value: null }
   * );
   * console.log(error.toDetailedString());
   * // iterflowError: Processing failed
   * //   Operation: transform
   * //   Context:
   * //     index: 42
   * //     value: null
   * //   Stack: ...
   * ```
   */
  toDetailedString(): string {
    let msg = `${this.name}: ${this.message}`;

    if (this.operation) {
      msg += `\n  Operation: ${this.operation}`;
    }

    if (this.context && Object.keys(this.context).length > 0) {
      msg += "\n  Context:";
      for (const [key, value] of Object.entries(this.context)) {
        msg += `\n    ${key}: ${JSON.stringify(value)}`;
      }
    }

    if (this.stack) {
      msg += `\n  Stack: ${this.stack.split("\n").slice(1).join("\n")}`;
    }

    return msg;
  }
}

/**
 * Error thrown when operation parameters are invalid
 *
 * Indicates that input validation failed due to incorrect parameter types,
 * out-of-range values, or other constraint violations.
 *
 * @example
 * ```typescript
 * // Thrown when validating a negative value that must be positive
 * throw new ValidationError(
 *   "count must be positive, got -5",
 *   "take",
 *   { paramName: "count", value: -5 }
 * );
 * ```
 */
export class ValidationError extends iterflowError {
  constructor(
    message: string,
    operation?: string,
    context?: Record<string, unknown>,
  ) {
    super(message, operation, context);
    this.name = "ValidationError";
  }
}

/**
 * Error thrown when an operation fails during execution
 *
 * Wraps underlying errors that occur during stream processing or transformations,
 * preserving the original error as the cause while adding operation context.
 *
 * @example
 * ```typescript
 * try {
 *   await processItem(item);
 * } catch (error) {
 *   throw new OperationError(
 *     "Failed to process item",
 *     "map",
 *     error as Error,
 *     { item, index: 5 }
 *   );
 * }
 * ```
 */
export class OperationError extends iterflowError {
  public readonly cause?: Error;

  constructor(
    message: string,
    operation?: string,
    cause?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message, operation, context);
    this.name = "OperationError";
    this.cause = cause;
  }

  /**
   * Returns a detailed error message including the original cause
   *
   * Extends the base toDetailedString() to include information about the
   * underlying error that caused this operation to fail.
   *
   * @returns A formatted string with operation details and cause information
   * @example
   * ```typescript
   * const originalError = new Error("Network timeout");
   * const opError = new OperationError(
   *   "Failed to fetch data",
   *   "fetchAsync",
   *   originalError
   * );
   * console.log(opError.toDetailedString());
   * // OperationError: Failed to fetch data
   * //   Operation: fetchAsync
   * //   Caused by: Network timeout
   * //   [stack traces...]
   * ```
   */
  toDetailedString(): string {
    let msg = super.toDetailedString();

    if (this.cause) {
      msg += `\n  Caused by: ${this.cause.message}`;
      if (this.cause.stack) {
        msg += `\n  ${this.cause.stack}`;
      }
    }

    return msg;
  }
}

/**
 * Error thrown when an operation requires a non-empty sequence
 *
 * Indicates that an operation like first(), last(), or min() was called on an
 * empty iterable where at least one element is required to produce a result.
 *
 * @example
 * ```typescript
 * import { from } from 'iterflow';
 *
 * const empty = from([]);
 * try {
 *   empty.first(); // Throws EmptySequenceError
 * } catch (error) {
 *   console.error(error.message);
 *   // "Operation 'first' requires a non-empty sequence"
 * }
 * ```
 */
export class EmptySequenceError extends iterflowError {
  constructor(operation: string, message?: string) {
    super(
      message || `Operation '${operation}' requires a non-empty sequence`,
      operation,
    );
    this.name = "EmptySequenceError";
  }
}

/**
 * Error thrown when accessing an invalid index
 *
 * Indicates that an index-based operation attempted to access an element
 * outside the valid range of the collection (negative index or index >= size).
 *
 * @example
 * ```typescript
 * import { from } from 'iterflow';
 *
 * const items = from([1, 2, 3]);
 * try {
 *   items.elementAt(10); // Only 3 elements, index 10 is out of bounds
 * } catch (error) {
 *   console.error(error.message);
 *   // "Index 10 is out of bounds (size: 3)"
 * }
 * ```
 */
export class IndexOutOfBoundsError extends iterflowError {
  public readonly index: number;
  public readonly size?: number;

  constructor(index: number, size?: number, operation?: string) {
    const sizeInfo = size !== undefined ? ` (size: ${size})` : "";
    super(`Index ${index} is out of bounds${sizeInfo}`, operation, {
      index,
      size,
    });
    this.name = "IndexOutOfBoundsError";
    this.index = index;
    this.size = size;
  }
}

/**
 * Error thrown when a type conversion or coercion fails
 *
 * Indicates that an attempt to convert a value to a specific type failed,
 * such as converting a non-numeric string to a number or a decimal to an integer.
 *
 * @example
 * ```typescript
 * import { toNumber } from 'iterflow';
 *
 * try {
 *   const num = toNumber("not-a-number");
 * } catch (error) {
 *   console.error(error.message);
 *   // 'Cannot convert value "not-a-number" to type number'
 * }
 * ```
 */
export class TypeConversionError extends iterflowError {
  public readonly value: unknown;
  public readonly expectedType: string;

  constructor(value: unknown, expectedType: string, operation?: string) {
    super(
      `Cannot convert value ${JSON.stringify(value)} to type ${expectedType}`,
      operation,
      { value, expectedType },
    );
    this.name = "TypeConversionError";
    this.value = value;
    this.expectedType = expectedType;
  }
}

/**
 * Error thrown when an operation exceeds its timeout duration
 *
 * Indicates that an async operation took longer than the specified timeout
 * and was terminated to prevent indefinite waiting.
 *
 * @example
 * ```typescript
 * import { fromAsync } from 'iterflow';
 *
 * async function* slowGenerator() {
 *   yield await new Promise(resolve => setTimeout(() => resolve(1), 5000));
 * }
 *
 * try {
 *   // Timeout after 1 second
 *   await fromAsync(slowGenerator())
 *     .withTimeout(1000)
 *     .toArray();
 * } catch (error) {
 *   console.error(error.message);
 *   // "Operation timed out after 1000ms"
 * }
 * ```
 */
export class TimeoutError extends iterflowError {
  public readonly timeoutMs: number;

  constructor(timeoutMs: number, operation?: string) {
    super(
      `Operation timed out after ${timeoutMs}ms`,
      operation,
      { timeoutMs },
    );
    this.name = "TimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Error thrown when an operation is aborted via AbortSignal
 *
 * Indicates that an async operation was cancelled using an AbortController,
 * typically for user-initiated cancellation or cleanup during component unmounting.
 *
 * @example
 * ```typescript
 * import { fromAsync } from 'iterflow';
 *
 * const controller = new AbortController();
 *
 * setTimeout(() => controller.abort("User cancelled"), 1000);
 *
 * try {
 *   await fromAsync(longRunningGenerator())
 *     .withAbortSignal(controller.signal)
 *     .toArray();
 * } catch (error) {
 *   console.error(error.message);
 *   // "Operation aborted: User cancelled"
 * }
 * ```
 */
export class AbortError extends iterflowError {
  public readonly reason?: string;

  constructor(operation?: string, reason?: string) {
    super(
      reason ? `Operation aborted: ${reason}` : "Operation aborted",
      operation,
      { reason },
    );
    this.name = "AbortError";
    this.reason = reason;
  }
}
