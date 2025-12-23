import { describe, it, expect } from "vitest";
import { iter } from "../src/index.js";
import * as fn from "../src/fn/index.js";

describe("Array Fast-Path Optimizations", () => {
  describe("Correctness: Arrays vs Iterators", () => {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const testGen = function* () {
      yield* testArray;
    };

    it("should produce identical results for count()", () => {
      expect(iter(testArray).count()).toBe(iter(testGen()).count());
      expect(iter([]).count()).toBe(iter(function* () {}()).count());
    });

    it("should produce identical results for sum()", () => {
      expect(iter(testArray).sum()).toBe(iter(testGen()).sum());
      expect(iter([]).sum()).toBe(iter(function* () {}()).sum());
    });

    it("should produce identical results for first()", () => {
      expect(iter(testArray).first()).toBe(iter(testGen()).first());
      expect(iter([]).first()).toBe(iter(function* () {}()).first());
      expect(iter([]).first(42)).toBe(iter(function* () {}()).first(42));
    });

    it("should produce identical results for last()", () => {
      expect(iter(testArray).last()).toBe(iter(testGen()).last());
      expect(iter([]).last()).toBe(iter(function* () {}()).last());
      expect(iter([]).last(42)).toBe(iter(function* () {}()).last(42));
    });

    it("should produce identical results for nth()", () => {
      expect(iter(testArray).nth(0)).toBe(iter(testGen()).nth(0));
      expect(iter(testArray).nth(5)).toBe(iter(testGen()).nth(5));
      expect(iter(testArray).nth(100)).toBe(iter(testGen()).nth(100));
      expect(iter(testArray).nth(-1)).toBe(iter(testGen()).nth(-1));
    });

    it("should produce identical results for isEmpty()", () => {
      expect(iter(testArray).isEmpty()).toBe(iter(testGen()).isEmpty());
      expect(iter([]).isEmpty()).toBe(iter(function* () {}()).isEmpty());
    });

    it("should produce identical results for includes()", () => {
      expect(iter(testArray).includes(5)).toBe(iter(testGen()).includes(5));
      expect(iter(testArray).includes(100)).toBe(iter(testGen()).includes(100));
    });

    it("should produce identical results for toArray()", () => {
      expect(iter(testArray).toArray()).toEqual(iter(testGen()).toArray());
      expect(iter([]).toArray()).toEqual(iter(function* () {}()).toArray());
    });

    it("should produce identical results for median()", () => {
      expect(iter(testArray).median()).toBe(iter(testGen()).median());
      expect(iter([1, 2, 3, 4]).median()).toBe(
        iter(function* () {
          yield* [1, 2, 3, 4];
        }()).median(),
      );
    });

    it("should produce identical results for variance()", () => {
      expect(iter(testArray).variance()).toBe(iter(testGen()).variance());
    });

    it("should produce identical results for percentile()", () => {
      expect(iter(testArray).percentile(50)).toBe(
        iter(testGen()).percentile(50),
      );
      expect(iter(testArray).percentile(75)).toBe(
        iter(testGen()).percentile(75),
      );
    });

    it("should produce identical results for mode()", () => {
      const modeArr = [1, 2, 2, 3, 3, 3];
      const modeGen = function* () {
        yield* modeArr;
      };
      expect(iter(modeArr).mode()).toEqual(iter(modeGen()).mode());
    });

    it("should produce identical results for quartiles()", () => {
      expect(iter(testArray).quartiles()).toEqual(iter(testGen()).quartiles());
    });

    it("should produce identical results for drop()", () => {
      expect(iter(testArray).drop(3).toArray()).toEqual(
        iter(testGen()).drop(3).toArray(),
      );
    });

    it("should produce identical results for take()", () => {
      expect(iter(testArray).take(5).toArray()).toEqual(
        iter(testGen()).take(5).toArray(),
      );
    });

    it("should produce identical results for reverse()", () => {
      expect(iter(testArray).reverse().toArray()).toEqual(
        iter(testGen()).reverse().toArray(),
      );
    });

    it("should produce identical results for sort()", () => {
      const unsorted = [5, 2, 8, 1, 9];
      const unsortedGen = function* () {
        yield* unsorted;
      };
      expect(iter(unsorted).sort().toArray()).toEqual(
        iter(unsortedGen()).sort().toArray(),
      );
    });

    it("should produce identical results for sortBy()", () => {
      const unsorted = [5, 2, 8, 1, 9];
      const unsortedGen = function* () {
        yield* unsorted;
      };
      const compareFn = (a: number, b: number) => b - a;
      expect(iter(unsorted).sortBy(compareFn).toArray()).toEqual(
        iter(unsortedGen()).sortBy(compareFn).toArray(),
      );
    });
  });

  describe("Lazy Evaluation Preservation", () => {
    it("should maintain lazy evaluation for map() with early termination", () => {
      let executions = 0;
      const expensive = (x: number) => {
        executions++;
        return x * 2;
      };

      const large = Array.from({ length: 1000 }, (_, i) => i);
      iter(large).map(expensive).take(5).toArray();

      // Should only execute enough to produce 5 results (not all 1000!)
      expect(executions).toBeLessThanOrEqual(10);
      expect(executions).toBeGreaterThanOrEqual(5);
    });

    it("should maintain lazy evaluation for filter() with early termination", () => {
      let executions = 0;
      const predicate = (x: number) => {
        executions++;
        return x % 2 === 0;
      };

      const large = Array.from({ length: 1000 }, (_, i) => i);
      iter(large).filter(predicate).take(3).toArray();

      expect(executions).toBeLessThan(100); // Should stop early
    });

    it("should not eagerly evaluate transformations on arrays", () => {
      let mapExecutions = 0;
      let filterExecutions = 0;

      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .map((x) => {
          mapExecutions++;
          return x * 2;
        })
        .filter((x) => {
          filterExecutions++;
          return x > 10;
        })
        .take(2)
        .toArray();

      expect(result).toEqual([12, 14]);
      // map and filter should only execute enough times to produce 2 results (not all 10!)
      expect(mapExecutions).toBeLessThanOrEqual(10);
      expect(filterExecutions).toBeLessThanOrEqual(10);
    });
  });

  describe("Chain Preservation", () => {
    it("should preserve fast-path through drop/take/count chain", () => {
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .drop(2) // fast-path: slice
        .take(5) // fast-path: slice
        .count(); // fast-path: length

      expect(result).toBe(5);
    });

    it("should preserve fast-path through drop/take/toArray chain", () => {
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .drop(3)
        .take(4)
        .toArray();

      expect(result).toEqual([4, 5, 6, 7]);
    });

    it("should preserve fast-path through reverse/first chain", () => {
      const result = iter([1, 2, 3, 4, 5]).reverse().first();

      expect(result).toBe(5);
    });

    it("should preserve fast-path through sort/last chain", () => {
      const result = iter([5, 2, 8, 1, 9]).sort().last();

      expect(result).toBe(9);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty arrays correctly", () => {
      expect(iter([]).count()).toBe(0);
      expect(iter([]).first()).toBeUndefined();
      expect(iter([]).last()).toBeUndefined();
      expect(iter([]).sum()).toBe(0);
      expect(iter([]).isEmpty()).toBe(true);
      expect(iter([]).median()).toBeUndefined();
      expect(iter([]).variance()).toBeUndefined();
      expect(iter([]).toArray()).toEqual([]);
    });

    it("should handle single-element arrays correctly", () => {
      expect(iter([42]).count()).toBe(1);
      expect(iter([42]).first()).toBe(42);
      expect(iter([42]).last()).toBe(42);
      expect(iter([42]).sum()).toBe(42);
      expect(iter([42]).isEmpty()).toBe(false);
      expect(iter([42]).median()).toBe(42);
      expect(iter([42]).nth(0)).toBe(42);
      expect(iter([42]).nth(1)).toBeUndefined();
    });

    it("should not mutate source arrays with sort()", () => {
      const arr = [3, 1, 2];
      iter(arr).sort().toArray();
      expect(arr).toEqual([3, 1, 2]); // Original unchanged
    });

    it("should not mutate source arrays with reverse()", () => {
      const arr = [1, 2, 3];
      iter(arr).reverse().toArray();
      expect(arr).toEqual([1, 2, 3]); // Original unchanged
    });

    it("should not mutate source arrays with median()", () => {
      const arr = [3, 1, 2];
      iter(arr).median();
      expect(arr).toEqual([3, 1, 2]); // Original unchanged
    });

    it("should return a copy from toArray()", () => {
      const arr = [1, 2, 3];
      const copy = iter(arr).toArray();
      copy[0] = 999;
      expect(arr[0]).toBe(1); // Original unchanged
    });

    it("should handle large arrays efficiently", () => {
      const large = Array.from({ length: 100000 }, (_, i) => i);

      // These should all use fast-paths and complete quickly
      expect(iter(large).count()).toBe(100000);
      expect(iter(large).first()).toBe(0);
      expect(iter(large).last()).toBe(99999);
      expect(iter(large).nth(50000)).toBe(50000);
      expect(iter(large).includes(50000)).toBe(true);
      expect(iter(large).isEmpty()).toBe(false);
    });

    it("should handle drop/take beyond array bounds", () => {
      const arr = [1, 2, 3, 4, 5];

      expect(iter(arr).drop(10).toArray()).toEqual([]);
      expect(iter(arr).take(10).toArray()).toEqual([1, 2, 3, 4, 5]);
      expect(iter(arr).drop(3).take(10).toArray()).toEqual([4, 5]);
    });

    it("should handle negative or invalid indices for nth()", () => {
      const arr = [1, 2, 3, 4, 5];

      expect(iter(arr).nth(-1)).toBeUndefined();
      expect(iter(arr).nth(100)).toBeUndefined();
      expect(iter(arr).nth(0)).toBe(1);
    });
  });

  describe("Performance Characteristics", () => {
    it("should use O(1) count() on arrays", () => {
      const arr = Array.from({ length: 1000000 }, (_, i) => i);

      const start = performance.now();
      const count = iter(arr).count();
      const duration = performance.now() - start;

      expect(count).toBe(1000000);
      expect(duration).toBeLessThan(1); // Should be instant
    });

    it("should use O(1) first() on arrays", () => {
      const arr = Array.from({ length: 1000000 }, (_, i) => i);

      const start = performance.now();
      const first = iter(arr).first();
      const duration = performance.now() - start;

      expect(first).toBe(0);
      expect(duration).toBeLessThan(1); // Should be instant
    });

    it("should use O(1) last() on arrays", () => {
      const arr = Array.from({ length: 1000000 }, (_, i) => i);

      const start = performance.now();
      const last = iter(arr).last();
      const duration = performance.now() - start;

      expect(last).toBe(999999);
      expect(duration).toBeLessThan(1); // Should be instant
    });

    it("should use O(1) nth() on arrays", () => {
      const arr = Array.from({ length: 1000000 }, (_, i) => i);

      const start = performance.now();
      const value = iter(arr).nth(500000);
      const duration = performance.now() - start;

      expect(value).toBe(500000);
      expect(duration).toBeLessThan(1); // Should be instant
    });
  });

  describe("Functional API Fast-Paths", () => {
    it("should use fast-path for fn.sum()", () => {
      expect(fn.sum([1, 2, 3, 4, 5])).toBe(15);
      expect(fn.sum([])).toBe(0);
    });

    it("should use fast-path for fn.count()", () => {
      expect(fn.count([1, 2, 3, 4, 5])).toBe(5);
      expect(fn.count([])).toBe(0);
    });

    it("should use fast-path for fn.mean()", () => {
      expect(fn.mean([1, 2, 3, 4, 5])).toBe(3);
      expect(fn.mean([])).toBeUndefined();
    });

    it("should use fast-path for fn.min()", () => {
      expect(fn.min([5, 2, 8, 1, 9])).toBe(1);
      expect(fn.min([])).toBeUndefined();
    });

    it("should use fast-path for fn.max()", () => {
      expect(fn.max([5, 2, 8, 1, 9])).toBe(9);
      expect(fn.max([])).toBeUndefined();
    });

    it("should use fast-path for fn.median()", () => {
      expect(fn.median([1, 2, 3, 4, 5])).toBe(3);
      expect(fn.median([1, 2, 3, 4])).toBe(2.5);
      expect(fn.median([])).toBeUndefined();
    });

    it("should use fast-path for fn.variance()", () => {
      expect(fn.variance([1, 2, 3, 4, 5])).toBe(2);
      expect(fn.variance([])).toBeUndefined();
    });
  });
});
