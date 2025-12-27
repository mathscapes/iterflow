import { describe, it, expect } from "vitest";
import { iter, asyncIter, iterflow, AsyncIterflow } from "../src/index.js";
import {
  iterflowError,
  ValidationError,
  OperationError,
  EmptySequenceError,
  IndexOutOfBoundsError,
  TypeConversionError,
  TimeoutError,
  AbortError,
} from "../src/errors.js";

/**
 * API Stability Tests for v0.9.0
 *
 * These tests ensure the public API surface remains stable across versions.
 * Any failure in these tests indicates a breaking change that must be
 * carefully considered before v1.0 release.
 */
describe("API Stability - iterflow Class", () => {
  it("should have all expected transformation methods", () => {
    const instance = iter([1, 2, 3]);
    const transformMethods = [
      "map",
      "filter",
      "flatMap",
      "scan",
      "enumerate",
      "concat",
      "intersperse",
      "reverse",
      "sort",
      "sortBy",
    ];

    for (const method of transformMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected terminal operations", () => {
    const instance = iter([1, 2, 3]);
    const terminalMethods = [
      "toArray",
      "count",
      "reduce",
      "forEach",
      "find",
      "some",
      "every",
      "first",
      "last",
      "nth",
      "isEmpty",
      "includes",
      "partition",
      "groupBy",
      "toString",
    ];

    for (const method of terminalMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected statistical operations", () => {
    const instance = iter([1, 2, 3]);
    const statsMethods = [
      "sum",
      "mean",
      "min",
      "max",
      "median",
      "variance",
      "stdDev",
      "percentile",
      "mode",
      "quartiles",
      "span",
      "product",
      "covariance",
      "correlation",
    ];

    for (const method of statsMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected windowing operations", () => {
    const instance = iter([1, 2, 3]);
    const windowMethods = ["window", "chunk", "pairwise"];

    for (const method of windowMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected utility methods", () => {
    const instance = iter([1, 2, 3]);
    const utilityMethods = [
      "take",
      "drop",
      "limit", // v0.8.0
      "takeWhile",
      "dropWhile",
      "tap",
      "distinct",
      "distinctBy",
      "interleave", // v0.9.0
      "merge", // v0.9.0
    ];

    for (const method of utilityMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have deprecated alias methods", () => {
    const instance = iter([1, 2, 3]);
    const aliases = ["stddev", "skip"];

    for (const alias of aliases) {
      expect(instance).toHaveProperty(alias);
      expect(typeof (instance as any)[alias]).toBe("function");
    }
  });

  it("should have iterator protocol methods", () => {
    const instance = iter([1, 2, 3]);
    expect(Symbol.iterator in instance).toBe(true);
    expect(typeof instance[Symbol.iterator]).toBe("function");
    expect(instance).toHaveProperty("next");
    expect(typeof instance.next).toBe("function");
  });
});

describe("API Stability - AsyncIterflow Class", () => {
  it("should have all expected transformation methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const transformMethods = [
      "map",
      "filter",
      "flatMap",
      "scan",
      "enumerate",
      "concat",
      "reverse",
      "sort",
      "sortBy",
    ];

    for (const method of transformMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected terminal operations", () => {
    const instance = asyncIter([1, 2, 3]);
    const terminalMethods = [
      "toArray",
      "count",
      "reduce",
      "forEach",
      "find",
      "some",
      "every",
      "first",
      "last",
      "nth",
      "isEmpty",
      "partition",
      "groupBy",
    ];

    for (const method of terminalMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected statistical operations", () => {
    const instance = asyncIter([1, 2, 3]);
    const statsMethods = [
      "sum",
      "mean",
      "min",
      "max",
      "median",
      "variance",
      "stdDev",
      "percentile",
      "mode",
      "quartiles",
      "span",
      "product",
      "covariance",
      "correlation",
    ];

    for (const method of statsMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected windowing operations", () => {
    const instance = asyncIter([1, 2, 3]);
    const windowMethods = ["window", "chunk", "pairwise"];

    for (const method of windowMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected utility methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const utilityMethods = [
      "take",
      "drop",
      "limit", // v0.9.0 - NEW
      "takeWhile",
      "dropWhile",
      "tap",
      "distinct",
      "distinctBy",
      "interleave", // v0.9.0 - NEW
      "merge", // v0.9.0 - NEW
    ];

    for (const method of utilityMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected parallel processing methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const parallelMethods = ["mapParallel", "filterParallel", "flatMapParallel"];

    for (const method of parallelMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected backpressure control methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const backpressureMethods = ["buffer", "throttle", "debounce"];

    for (const method of backpressureMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected error handling methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const errorMethods = ["catchError", "retry", "onError"];

    for (const method of errorMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have all expected async control methods", () => {
    const instance = asyncIter([1, 2, 3]);
    const asyncControlMethods = [
      "timeout", // v0.8.0
      "withSignal", // v0.8.0
    ];

    for (const method of asyncControlMethods) {
      expect(instance).toHaveProperty(method);
      expect(typeof (instance as any)[method]).toBe("function");
    }
  });

  it("should have async iterator protocol methods", () => {
    const instance = asyncIter([1, 2, 3]);
    expect(Symbol.asyncIterator in instance).toBe(true);
    expect(typeof instance[Symbol.asyncIterator]).toBe("function");
    expect(instance).toHaveProperty("next");
    expect(typeof instance.next).toBe("function");
  });
});

describe("API Stability - Static Factory Functions", () => {
  it("should have all expected iter namespace static methods", () => {
    const staticMethods = [
      "zip",
      "zipWith",
      "range",
      "repeat",
      "interleave",
      "merge",
      "chain",
    ];

    for (const method of staticMethods) {
      expect(iter).toHaveProperty(method);
      expect(typeof (iter as any)[method]).toBe("function");
    }
  });

  it("should have all expected asyncIter namespace static methods", () => {
    const staticMethods = [
      "zip",
      "zipWith",
      "range",
      "repeat",
      "interleave",
      "merge",
      "chain",
      "fromGenerator",
      "fromPromise",
      "fromPromises",
    ];

    for (const method of staticMethods) {
      expect(asyncIter).toHaveProperty(method);
      expect(typeof (asyncIter as any)[method]).toBe("function");
    }
  });
});

describe("API Stability - Exports", () => {
  it("should export all expected classes", () => {
    expect(iterflow).toBeDefined();
    expect(typeof iterflow).toBe("function");
    expect(AsyncIterflow).toBeDefined();
    expect(typeof AsyncIterflow).toBe("function");
  });

  it("should export all expected factory functions", () => {
    expect(iter).toBeDefined();
    expect(typeof iter).toBe("function");
    expect(asyncIter).toBeDefined();
    expect(typeof asyncIter).toBe("function");
  });

  it("should export all expected error classes", () => {
    const errorClasses = [
      iterflowError,
      ValidationError,
      OperationError,
      EmptySequenceError,
      IndexOutOfBoundsError,
      TypeConversionError,
      TimeoutError, // v0.8.0
      AbortError, // v0.8.0
    ];

    for (const ErrorClass of errorClasses) {
      expect(ErrorClass).toBeDefined();
      expect(typeof ErrorClass).toBe("function");
    }
  });

  it("should allow error classes to be instantiated", () => {
    expect(() => new iterflowError("test")).not.toThrow();
    expect(() => new ValidationError("param", "value", "operation")).not.toThrow();
    expect(() => new OperationError("test", "operation")).not.toThrow();
    expect(() => new EmptySequenceError("operation")).not.toThrow();
    expect(() => new IndexOutOfBoundsError(0, 10, "operation")).not.toThrow();
    expect(() => new TypeConversionError("number", "string", "operation")).not.toThrow();
    expect(() => new TimeoutError(1000, "operation")).not.toThrow();
    expect(() => new AbortError("operation")).not.toThrow();
  });
});

describe("API Stability - Type Inference", () => {
  it("should correctly infer types for iterflow", () => {
    const flow: iterflow<number> = iter([1, 2, 3]);
    expect(flow).toBeInstanceOf(iterflow);
  });

  it("should correctly infer types for AsyncIterflow", () => {
    const flow: AsyncIterflow<number> = asyncIter([1, 2, 3]);
    expect(flow).toBeInstanceOf(AsyncIterflow);
  });

  it("should correctly infer transformed types", () => {
    const numbers: iterflow<number> = iter([1, 2, 3]);
    const strings: iterflow<string> = numbers.map((x) => x.toString());
    expect(strings.toArray()).toEqual(["1", "2", "3"]);
  });

  it("should correctly infer async transformed types", async () => {
    const numbers: AsyncIterflow<number> = asyncIter([1, 2, 3]);
    const strings: AsyncIterflow<string> = numbers.map((x) => x.toString());
    expect(await strings.toArray()).toEqual(["1", "2", "3"]);
  });
});

describe("API Stability - Method Behavior", () => {
  it("should maintain stable method signatures for iter()", () => {
    // Factory accepts arrays
    expect(() => iter([1, 2, 3])).not.toThrow();

    // Factory accepts iterables
    expect(() => iter(new Set([1, 2, 3]))).not.toThrow();

    // Factory accepts iterators
    const generator = function* () {
      yield 1;
      yield 2;
    };
    expect(() => iter(generator())).not.toThrow();
  });

  it("should maintain stable method signatures for asyncIter()", () => {
    // Factory accepts arrays
    expect(() => asyncIter([1, 2, 3])).not.toThrow();

    // Factory accepts sync iterables
    expect(() => asyncIter(new Set([1, 2, 3]))).not.toThrow();

    // Factory accepts async iterables
    const asyncGenerator = async function* () {
      yield 1;
      yield 2;
    };
    expect(() => asyncIter(asyncGenerator())).not.toThrow();
  });

  it("should maintain chainability for sync operations", () => {
    const result = iter([1, 2, 3, 4, 5])
      .map((x) => x * 2)
      .filter((x) => x > 5)
      .take(2)
      .toArray();

    expect(result).toEqual([6, 8]);
  });

  it("should maintain chainability for async operations", async () => {
    const result = await asyncIter([1, 2, 3, 4, 5])
      .map(async (x) => x * 2)
      .filter(async (x) => x > 5)
      .take(2)
      .toArray();

    expect(result).toEqual([6, 8]);
  });
});

describe("API Stability - v0.9.0 Additions", () => {
  it("should have limit() method on AsyncIterflow (new in v0.9.0)", () => {
    const instance = asyncIter([1, 2, 3]);
    expect(instance).toHaveProperty("limit");
    expect(typeof instance.limit).toBe("function");
  });

  it("should have interleave() instance method on AsyncIterflow (new in v0.9.0)", () => {
    const instance = asyncIter([1, 2, 3]);
    expect(instance).toHaveProperty("interleave");
    expect(typeof instance.interleave).toBe("function");
  });

  it("should have merge() instance method on AsyncIterflow (new in v0.9.0)", () => {
    const instance = asyncIter([1, 2, 3]);
    expect(instance).toHaveProperty("merge");
    expect(typeof instance.merge).toBe("function");
  });

  it("should mark stddev() as deprecated", () => {
    const instance = iter([1, 2, 3]);
    // Method still exists for backward compatibility
    expect(instance).toHaveProperty("stddev");
    expect(typeof instance.stddev).toBe("function");
  });

  it("should mark skip() as deprecated", () => {
    const instance = iter([1, 2, 3]);
    // Method still exists for backward compatibility
    expect(instance).toHaveProperty("skip");
    expect(typeof instance.skip).toBe("function");
  });
});
