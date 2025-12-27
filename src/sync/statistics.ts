/**
 * Statistical operations for iterflow.
 * These functions extract statistical methods from the main iterflow class.
 *
 * @module statistics
 * @internal
 */

import type { iterflow } from "./iterflow.js";
import { validateRange } from "../validation.js";

/**
 * Calculates the sum of all numeric elements.
 * This is a terminal operation that consumes the iterator.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The sum of all elements, or 0 if the iterator is empty
 * @internal
 */
export function sum(instance: iterflow<number>): number {
  if (instance._sourceArray) {
    let total = 0;
    for (let i = 0; i < instance._sourceArray.length; i++) {
      total += instance._sourceArray[i]!;
    }
    return total;
  }
  let total = 0;
  for (const value of instance) {
    total += value;
  }
  return total;
}

/**
 * Calculates the arithmetic mean (average) of all numeric elements.
 * This is a terminal operation that consumes the iterator.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The mean value, or undefined if the iterator is empty
 * @internal
 */
export function mean(instance: iterflow<number>): number | undefined {
  let total = 0;
  let count = 0;
  for (const value of instance) {
    total += value;
    count++;
  }
  return count === 0 ? undefined : total / count;
}

/**
 * Calculates the median value of all numeric elements.
 * The median is the middle value when elements are sorted.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * for sorting. For large datasets, consider using streaming alternatives or limiting data size.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The median value, or undefined if the iterator is empty
 * @internal
 */
export function median(instance: iterflow<number>): number | undefined {
  const values = instance._sourceArray || instance.toArray();
  if (values.length === 0) return undefined;

  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  } else {
    return sorted[mid]!;
  }
}

/**
 * Calculates the variance of all numeric elements.
 * Variance measures how far each number in the set is from the mean.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * to calculate variance. For large datasets, consider using streaming variance algorithms
 * or limiting data size.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The variance, or undefined if the iterator is empty
 * @internal
 */
export function variance(instance: iterflow<number>): number | undefined {
  const values = instance._sourceArray || instance.toArray();
  if (values.length === 0) return undefined;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Optimize: calculate sum of squared differences in single pass without intermediate array
  let sumSquaredDiffs = 0;
  for (let i = 0; i < values.length; i++) {
    const value = values[i]!; // Safe assertion since i is within bounds
    const diff = value - mean;
    sumSquaredDiffs += diff * diff;
  }

  return sumSquaredDiffs / values.length;
}

/**
 * Calculates the standard deviation of all numeric elements.
 * Standard deviation is the square root of variance and measures dispersion.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * via variance calculation. For large datasets, consider using streaming algorithms
 * or limiting data size.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The standard deviation, or undefined if the iterator is empty
 * @internal
 */
export function stdDev(instance: iterflow<number>): number | undefined {
  const varianceValue = variance(instance);
  return varianceValue === undefined ? undefined : Math.sqrt(varianceValue);
}

/**
 * Calculates the specified percentile of all numeric elements.
 * Uses linear interpolation between closest ranks.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * for sorting. For large datasets, consider using approximate percentile algorithms
 * or limiting data size.
 *
 * @param instance - iterflow instance constrained to numbers
 * @param p - The percentile to calculate (0-100)
 * @returns The percentile value, or undefined if the iterator is empty
 * @throws {Error} If p is not between 0 and 100
 * @internal
 */
export function percentile(
  instance: iterflow<number>,
  p: number,
): number | undefined {
  validateRange(p, 0, 100, "percentile", "percentile");

  const values = instance._sourceArray || instance.toArray();
  if (values.length === 0) return undefined;

  const sorted = values.slice().sort((a, b) => a - b);

  if (p === 0) return sorted[0]!;
  if (p === 100) return sorted[sorted.length - 1]!;

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower]!;
  }

  const weight = index - lower;
  return sorted[lower]! * (1 - weight) + sorted[upper]! * weight;
}

/**
 * Finds the most frequent value(s) in the dataset.
 * Returns an array of all values that appear most frequently.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * to count frequencies. For large datasets with many unique values, memory usage can be significant.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns An array of the most frequent value(s), or undefined if the iterator is empty
 * @internal
 */
export function mode(instance: iterflow<number>): number[] | undefined {
  const values = instance._sourceArray || instance.toArray();
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
 * Q1 is the 25th percentile, Q2 is the median (50th percentile), Q3 is the 75th percentile.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes the entire iterator into memory
 * for sorting and percentile calculation. For large datasets, consider using streaming
 * quantile algorithms or limiting data size.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns An object with Q1, Q2, and Q3 values, or undefined if the iterator is empty
 * @internal
 */
export function quartiles(
  instance: iterflow<number>,
): { Q1: number; Q2: number; Q3: number } | undefined {
  const values = instance._sourceArray || instance.toArray();
  if (values.length === 0) return undefined;

  const sorted = values.slice().sort((a, b) => a - b);

  const calculatePercentile = (p: number): number => {
    if (p === 0) return sorted[0]!;
    if (p === 100) return sorted[sorted.length - 1]!;

    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return sorted[lower]!;
    }

    const weight = index - lower;
    return sorted[lower]! * (1 - weight) + sorted[upper]! * weight;
  };

  return {
    Q1: calculatePercentile(25),
    Q2: calculatePercentile(50),
    Q3: calculatePercentile(75),
  };
}

/**
 * Calculates the span (range from minimum to maximum value) of all numeric elements.
 * This is a terminal operation that consumes the iterator.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The span (max - min), or undefined if the iterator is empty
 * @internal
 */
export function span(instance: iterflow<number>): number | undefined {
  let minimum: number | undefined = undefined;
  let maximum: number | undefined = undefined;

  for (const value of instance) {
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
 * This is a terminal operation that consumes the iterator.
 *
 * @param instance - iterflow instance constrained to numbers
 * @returns The product of all elements, or 1 if the iterator is empty
 * @internal
 */
export function product(instance: iterflow<number>): number {
  let result = 1;
  for (const value of instance) {
    result *= value;
  }
  return result;
}

/**
 * Calculates the covariance between two numeric sequences.
 * Covariance measures the joint variability of two random variables.
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes both iterators into memory
 * to calculate covariance. For large datasets, this doubles memory usage.
 *
 * @param instance - iterflow instance constrained to numbers
 * @param other - An iterable of numbers to compare with
 * @returns The covariance, or undefined if either sequence is empty or sequences have different lengths
 * @internal
 */
export function covariance(
  instance: iterflow<number>,
  other: Iterable<number>,
): number | undefined {
  const values1 = instance._sourceArray || instance.toArray();
  const values2 = Array.from(other);

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
 * Correlation measures the strength and direction of the linear relationship between two variables.
 * Values range from -1 (perfect negative correlation) to 1 (perfect positive correlation).
 * This is a terminal operation that consumes the iterator.
 *
 * WARNING - Memory Intensive: This operation eagerly materializes both iterators into memory
 * to calculate correlation. For large datasets, this doubles memory usage.
 *
 * @param instance - iterflow instance constrained to numbers
 * @param other - An iterable of numbers to compare with
 * @returns The correlation coefficient, or undefined if either sequence is empty or sequences have different lengths
 * @internal
 */
export function correlation(
  instance: iterflow<number>,
  other: Iterable<number>,
): number | undefined {
  const values1 = instance._sourceArray || instance.toArray();
  const values2 = Array.from(other);

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
