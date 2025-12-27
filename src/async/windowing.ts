/**
 * Async windowing operations for AsyncIterflow.
 * These functions extract windowing methods from the main AsyncIterflow class.
 *
 * @module async-windowing
 * @internal
 */

import type { AsyncIterflow } from "./iterflow.js";
import { validatePositiveInteger } from "../validation.js";

/**
 * Creates a sliding window of the specified size over the elements.
 * Each window contains `size` consecutive elements.
 * This is a lazy operation that returns an async iterable.
 *
 * @param instance - async iterflow instance
 * @param size - The size of each window (must be at least 1)
 * @returns An async iterable yielding arrays of size `size`
 * @throws {Error} If size is less than 1
 * @internal
 */
export function window<T>(
  instance: AsyncIterflow<T>,
  size: number,
): AsyncIterable<T[]> {
  // Validate eagerly to match original behavior
  validatePositiveInteger(size, "size", "window");

  return {
    async *[Symbol.asyncIterator]() {
      // Use circular buffer to avoid O(n) shift() operations
      const buffer: T[] = new Array(size);
      let count = 0;
      let index = 0;

      for await (const value of instance) {
        buffer[index] = value;
        count++;
        index = (index + 1) % size;

        if (count >= size) {
          // Build window array in correct order from circular buffer
          const windowArr = new Array(size);
          for (let i = 0; i < size; i++) {
            windowArr[i] = buffer[(index + i) % size];
          }
          yield windowArr;
        }
      }
    },
  };
}

/**
 * Splits elements into chunks of the specified size.
 * Unlike window, chunks don't overlap. The last chunk may be smaller.
 * This is a lazy operation that returns an async iterable.
 *
 * @param instance - async iterflow instance
 * @param size - The size of each chunk (must be at least 1)
 * @returns An async iterable yielding arrays of up to `size` elements
 * @throws {Error} If size is less than 1
 * @internal
 */
export function chunk<T>(
  instance: AsyncIterflow<T>,
  size: number,
): AsyncIterable<T[]> {
  // Validate eagerly to match original behavior
  validatePositiveInteger(size, "size", "chunk");

  return {
    async *[Symbol.asyncIterator]() {
      // Preallocate buffer to avoid dynamic resizing
      let buffer: T[] = new Array(size);
      let bufferIndex = 0;

      for await (const value of instance) {
        buffer[bufferIndex++] = value;

        if (bufferIndex === size) {
          yield buffer;
          buffer = new Array(size);
          bufferIndex = 0;
        }
      }

      if (bufferIndex > 0) {
        // Slice to remove unused preallocated slots
        yield buffer.slice(0, bufferIndex);
      }
    },
  };
}

/**
 * Creates pairs of consecutive elements.
 * Equivalent to window(2) but returns tuples.
 * This is a lazy operation that returns an async iterable.
 *
 * @param instance - async iterflow instance
 * @returns An async iterable yielding tuples of two consecutive elements
 * @internal
 */
export function pairwise<T>(
  instance: AsyncIterflow<T>,
): AsyncIterable<[T, T]> {
  return {
    async *[Symbol.asyncIterator]() {
      let previous: T | undefined = undefined;
      let hasPrevious = false;

      for await (const value of instance) {
        if (hasPrevious) {
          yield [previous!, value];
        }
        previous = value;
        hasPrevious = true;
      }
    },
  };
}
