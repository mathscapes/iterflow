/**
 * Core function types for iterator operations.
 * These types are used internally throughout the library.
 *
 * @module types/core
 * @internal
 */

/**
 * A function that tests a value and returns a boolean result.
 * Used for filtering, conditional operations, and validation.
 *
 * @template T The type of value being tested
 * @param value The value to test
 * @returns true if the value passes the test, false otherwise
 *
 * @example
 * ```typescript
 * const isEven: Predicate<number> = (x) => x % 2 === 0;
 * iter([1, 2, 3, 4]).filter(isEven).toArray(); // [2, 4]
 * ```
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * A function that transforms a value from one type to another.
 * Used for mapping, transformation, and projection operations.
 *
 * @template T The input value type
 * @template U The output value type
 * @param value The value to transform
 * @returns The transformed value
 *
 * @example
 * ```typescript
 * const double: Mapper<number, number> = (x) => x * 2;
 * iter([1, 2, 3]).map(double).toArray(); // [2, 4, 6]
 *
 * const toString: Mapper<number, string> = (x) => `${x}`;
 * iter([1, 2, 3]).map(toString).toArray(); // ['1', '2', '3']
 * ```
 */
export type Mapper<T, U> = (value: T) => U;

/**
 * A function that compares two values and returns a number indicating their order.
 * Returns negative if a < b, zero if a === b, positive if a > b.
 * Used for sorting operations.
 *
 * @template T The type of values being compared
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns Negative if a < b, 0 if equal, positive if a > b
 *
 * @example
 * ```typescript
 * const ascending: Comparator<number> = (a, b) => a - b;
 * iter([3, 1, 2]).sortBy(ascending).toArray(); // [1, 2, 3]
 *
 * const descending: Comparator<number> = (a, b) => b - a;
 * iter([3, 1, 2]).sortBy(descending).toArray(); // [3, 2, 1]
 *
 * const byLength: Comparator<string> = (a, b) => a.length - b.length;
 * iter(['aaa', 'b', 'cc']).sortBy(byLength).toArray(); // ['b', 'cc', 'aaa']
 * ```
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * A function that combines an accumulator with a value to produce a new accumulator.
 * Used for reduction, aggregation, and folding operations.
 *
 * @template T The type of values being reduced
 * @template U The type of the accumulator
 * @param accumulator The current accumulated value
 * @param value The next value to incorporate
 * @returns The new accumulated value
 *
 * @example
 * ```typescript
 * const sum: Reducer<number, number> = (acc, x) => acc + x;
 * iter([1, 2, 3]).reduce(sum, 0); // 6
 *
 * const toObject: Reducer<[string, number], Record<string, number>> =
 *   (acc, [key, val]) => ({ ...acc, [key]: val });
 * iter([['a', 1], ['b', 2]]).reduce(toObject, {}); // { a: 1, b: 2 }
 * ```
 */
export type Reducer<T, U> = (accumulator: U, value: T) => U;

/**
 * An async function that tests a value and returns a promise of boolean result.
 * Used for filtering with async predicates (e.g., database lookups, API calls).
 *
 * @template T The type of value being tested
 * @param value The value to test
 * @returns Promise resolving to true if value passes, false otherwise
 *
 * @example
 * ```typescript
 * const isValidUser: AsyncPredicate<number> = async (id) => {
 *   const user = await db.findUser(id);
 *   return user !== null;
 * };
 * await asyncIter([1, 2, 3]).filter(isValidUser).toArray();
 * ```
 */
export type AsyncPredicate<T> = (value: T) => Promise<boolean>;

/**
 * An async function that transforms a value from one type to another.
 * Used for async mapping operations (e.g., API enrichment, async computations).
 *
 * @template T The input value type
 * @template U The output value type
 * @param value The value to transform
 * @returns Promise resolving to the transformed value
 *
 * @example
 * ```typescript
 * const fetchUserName: AsyncMapper<number, string> = async (id) => {
 *   const user = await api.getUser(id);
 *   return user.name;
 * };
 * await asyncIter([1, 2, 3]).map(fetchUserName).toArray();
 * // ['Alice', 'Bob', 'Charlie']
 * ```
 */
export type AsyncMapper<T, U> = (value: T) => Promise<U>;
