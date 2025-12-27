/**
 * Async statistical operations for AsyncIterflow.
 * These functions extract statistical methods from the main AsyncIterflow class.
 *
 * @module async-statistics
 * @internal
 */

import type { AsyncIterflow } from "./iterflow.js";
import { validateRange } from "../validation.js";

/**
 * Calculates the sum of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the sum of all elements
 * @internal
 */
export async function sum(instance: AsyncIterflow<number>): Promise<number> {
  let total = 0;
  for await (const value of instance) {
    total += value;
  }
  return total;
}

/**
 * Calculates the arithmetic mean (average) of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the mean value, or undefined if empty
 * @internal
 */
export async function mean(
  instance: AsyncIterflow<number>,
): Promise<number | undefined> {
  let total = 0;
  let count = 0;
  for await (const value of instance) {
    total += value;
    count++;
  }
  return count === 0 ? undefined : total / count;
}

/**
 * Calculates the median value of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * for sorting. For large datasets, consider using streaming alternatives or limiting data size.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the median value, or undefined if empty
 * @internal
 */
export async function median(
  instance: AsyncIterflow<number>,
): Promise<number | undefined> {
  const values = await instance.toArray();
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);

  if (values.length % 2 === 0) {
    return (values[mid - 1]! + values[mid]!) / 2;
  } else {
    return values[mid]!;
  }
}

/**
 * Calculates the variance of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * to calculate variance. For large datasets, consider using streaming variance algorithms
 * or limiting data size.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the variance, or undefined if empty
 * @internal
 */
export async function variance(
  instance: AsyncIterflow<number>,
): Promise<number | undefined> {
  const values = await instance.toArray();
  if (values.length === 0) return undefined;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Optimize: calculate sum of squared differences in single pass without intermediate array
  let sumSquaredDiffs = 0;
  for (let i = 0; i < values.length; i++) {
    const diff = values[i]! - mean;
    sumSquaredDiffs += diff * diff;
  }

  return sumSquaredDiffs / values.length;
}

/**
 * Calculates the standard deviation of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * via variance calculation. For large datasets, consider using streaming algorithms
 * or limiting data size.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the standard deviation, or undefined if empty
 * @internal
 */
export async function stdDev(
  instance: AsyncIterflow<number>,
): Promise<number | undefined> {
  const varianceValue = await variance(instance);
  return varianceValue === undefined ? undefined : Math.sqrt(varianceValue);
}

/**
 * Calculates the specified percentile of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * for sorting. For large datasets, consider using approximate percentile algorithms
 * or limiting data size.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @param p - The percentile to calculate (0-100)
 * @returns A promise of the percentile value, or undefined if empty
 * @throws {Error} If p is not between 0 and 100
 * @internal
 */
export async function percentile(
  instance: AsyncIterflow<number>,
  p: number,
): Promise<number | undefined> {
  validateRange(p, 0, 100, "percentile", "percentile");

  const values = await instance.toArray();
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);

  if (p === 0) return values[0]!;
  if (p === 100) return values[values.length - 1]!;

  const index = (p / 100) * (values.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return values[lower]!;
  }

  const weight = index - lower;
  return values[lower]! * (1 - weight) + values[upper]! * weight;
}

/**
 * Finds the most frequent value(s) in the dataset.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * to count frequencies. For large datasets with many unique values, memory usage can be significant.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of an array of the most frequent value(s), or undefined if empty
 * @internal
 */
export async function mode(
  instance: AsyncIterflow<number>,
): Promise<number[] | undefined> {
  const values = await instance.toArray();
  if (values.length === 0) return undefined;

  const frequency = new Map<number, number>();
  let maxFreq = 0;

  for (const value of values) {
    const count = (frequency.get(value) || 0) + 1;
    frequency.set(value, count);
    maxFreq = Math.max(maxFreq, count);
  }

  const modes: number[] = [];
  for (const [value, freq] of frequency) {
    if (freq === maxFreq) {
      modes.push(value);
    }
  }

  return modes.sort((a, b) => a - b);
}

/**
 * Calculates the quartiles (Q1, Q2, Q3) of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire async iterator into memory
 * for sorting and percentile calculation. For large datasets, consider using streaming
 * quantile algorithms or limiting data size.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of an object with Q1, Q2, and Q3 values, or undefined if empty
 * @internal
 */
export async function quartiles(
  instance: AsyncIterflow<number>,
): Promise<{ Q1: number; Q2: number; Q3: number } | undefined> {
  const values = await instance.toArray();
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);

  const calculatePercentile = (p: number): number => {
    if (p === 0) return values[0]!;
    if (p === 100) return values[values.length - 1]!;

    const index = (p / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return values[lower]!;
    }

    const weight = index - lower;
    return values[lower]! * (1 - weight) + values[upper]! * weight;
  };

  return {
    Q1: calculatePercentile(25),
    Q2: calculatePercentile(50),
    Q3: calculatePercentile(75),
  };
}

/**
 * Calculates the span (range from minimum to maximum value).
 * This is a terminal operation that consumes the async iterator.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the span (max - min), or undefined if empty
 * @internal
 */
export async function span(
  instance: AsyncIterflow<number>,
): Promise<number | undefined> {
  let minimum: number | undefined = undefined;
  let maximum: number | undefined = undefined;

  for await (const value of instance) {
    if (minimum === undefined || value < minimum) {
      minimum = value;
    }
    if (maximum === undefined || value > maximum) {
      maximum = value;
    }
  }

  return minimum === undefined || maximum === undefined
    ? undefined
    : maximum - minimum;
}

/**
 * Calculates the product of all numeric elements.
 * This is a terminal operation that consumes the async iterator.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @returns A promise of the product of all elements
 * @internal
 */
export async function product(
  instance: AsyncIterflow<number>,
): Promise<number> {
  let result = 1;
  for await (const value of instance) {
    result *= value;
  }
  return result;
}

/**
 * Calculates the covariance between two numeric sequences.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes both async iterators into memory
 * to calculate covariance. For large datasets, this doubles memory usage.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @param other - An async iterable or iterable of numbers to compare with
 * @returns A promise of the covariance, or undefined if sequences are empty or have different lengths
 * @internal
 */
export async function covariance(
  instance: AsyncIterflow<number>,
  other: AsyncIterable<number> | Iterable<number>,
): Promise<number | undefined> {
  const values1 = await instance.toArray();
  const values2: number[] = [];

  if (Symbol.asyncIterator in other) {
    for await (const value of other) {
      values2.push(value);
    }
  } else {
    for (const value of other) {
      values2.push(value);
    }
  }

  if (
    values1.length === 0 ||
    values2.length === 0 ||
    values1.length !== values2.length
  ) {
    return undefined;
  }

  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

  let covarianceValue = 0;
  for (let i = 0; i < values1.length; i++) {
    covarianceValue += (values1[i]! - mean1) * (values2[i]! - mean2);
  }

  return covarianceValue / values1.length;
}

/**
 * Calculates the Pearson correlation coefficient between two numeric sequences.
 * This is a terminal operation that consumes the async iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes both async iterators into memory
 * to calculate correlation. For large datasets, this doubles memory usage.
 *
 * @param instance - async iterflow instance constrained to numbers
 * @param other - An async iterable or iterable of numbers to compare with
 * @returns A promise of the correlation coefficient, or undefined if sequences are empty or have different lengths
 * @internal
 */
export async function correlation(
  instance: AsyncIterflow<number>,
  other: AsyncIterable<number> | Iterable<number>,
): Promise<number | undefined> {
  const values1 = await instance.toArray();
  const values2: number[] = [];

  if (Symbol.asyncIterator in other) {
    for await (const value of other) {
      values2.push(value);
    }
  } else {
    for (const value of other) {
      values2.push(value);
    }
  }

  if (
    values1.length === 0 ||
    values2.length === 0 ||
    values1.length !== values2.length
  ) {
    return undefined;
  }

  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

  let covarianceValue = 0;
  let variance1 = 0;
  let variance2 = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i]! - mean1;
    const diff2 = values2[i]! - mean2;
    covarianceValue += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }

  const stdDev1 = Math.sqrt(variance1 / values1.length);
  const stdDev2 = Math.sqrt(variance2 / values2.length);

  if (stdDev1 === 0 || stdDev2 === 0) {
    return undefined;
  }

  return covarianceValue / (values1.length * stdDev1 * stdDev2);
}
