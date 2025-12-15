/**
 * Error handling utilities and custom error classes for iterflow
 * @module errors
 */

/**
 * Base error class for all iterflow errors
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
