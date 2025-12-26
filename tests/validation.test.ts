/**
 * Comprehensive test coverage for validation utilities
 * Target: ≥75% statement and branch coverage
 */

import { describe, it, expect } from "vitest";
import {
  validatePositiveInteger,
  validateNonNegativeInteger,
  validateRange,
  validateFiniteNumber,
  validateNonZero,
  validateFunction,
  validateIterable,
  validateComparator,
  validateNonEmpty,
  toNumber,
  toInteger,
  validateIndex,
  validateSafeInteger,
  validateWindowSize,
  validateMemoryLimit,
} from "../src/validation.js";
import { ValidationError, TypeConversionError } from "../src/errors.js";

describe("validatePositiveInteger", () => {
  it("should accept positive integers", () => {
    expect(() => validatePositiveInteger(1, "n")).not.toThrow();
    expect(() => validatePositiveInteger(100, "count")).not.toThrow();
    expect(() => validatePositiveInteger(Number.MAX_SAFE_INTEGER, "max")).not.toThrow();
  });

  it("should throw for negative numbers", () => {
    expect(() => validatePositiveInteger(-1, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validatePositiveInteger(-100, "count", "test"))
      .toThrow("count must be at least 1");
  });

  it("should throw for zero", () => {
    expect(() => validatePositiveInteger(0, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validatePositiveInteger(0, "count", "test"))
      .toThrow("count must be at least 1");
  });

  it("should throw for decimal numbers", () => {
    expect(() => validatePositiveInteger(1.5, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validatePositiveInteger(0.1, "fraction", "test"))
      .toThrow("fraction must be an integer");
    expect(() => validatePositiveInteger(99.999, "value", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for NaN", () => {
    expect(() => validatePositiveInteger(NaN, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validatePositiveInteger(NaN, "value", "test"))
      .toThrow("value must be an integer");
  });

  it("should throw for Infinity", () => {
    expect(() => validatePositiveInteger(Infinity, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validatePositiveInteger(-Infinity, "value", "test"))
      .toThrow(ValidationError);
  });

  it("should include error context with operation and parameters", () => {
    try {
      validatePositiveInteger(-5, "count", "myOperation");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).operation).toBe("myOperation");
      expect((error as ValidationError).context).toMatchObject({
        paramName: "count",
        value: -5,
      });
    }
  });
});

describe("validateNonNegativeInteger", () => {
  it("should accept zero", () => {
    expect(() => validateNonNegativeInteger(0, "index")).not.toThrow();
  });

  it("should accept positive integers", () => {
    expect(() => validateNonNegativeInteger(1, "index")).not.toThrow();
    expect(() => validateNonNegativeInteger(100, "count")).not.toThrow();
  });

  it("should throw for negative numbers", () => {
    expect(() => validateNonNegativeInteger(-1, "index", "test"))
      .toThrow(ValidationError);
    expect(() => validateNonNegativeInteger(-100, "count", "test"))
      .toThrow("count must be non-negative");
  });

  it("should throw for decimals", () => {
    expect(() => validateNonNegativeInteger(1.5, "index", "test"))
      .toThrow(ValidationError);
    expect(() => validateNonNegativeInteger(0.1, "offset", "test"))
      .toThrow("offset must be an integer");
  });

  it("should throw for NaN and Infinity", () => {
    expect(() => validateNonNegativeInteger(NaN, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateNonNegativeInteger(Infinity, "n", "test"))
      .toThrow(ValidationError);
  });
});

describe("validateRange", () => {
  it("should accept values within range", () => {
    expect(() => validateRange(5, 1, 10, "n")).not.toThrow();
    expect(() => validateRange(1, 1, 10, "n")).not.toThrow();
    expect(() => validateRange(10, 1, 10, "n")).not.toThrow();
  });

  it("should accept boundary values", () => {
    expect(() => validateRange(0, 0, 100, "percent")).not.toThrow();
    expect(() => validateRange(100, 0, 100, "percent")).not.toThrow();
  });

  it("should throw when value below minimum", () => {
    expect(() => validateRange(0, 1, 10, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateRange(-5, 0, 100, "percent", "test"))
      .toThrow("percent must be between 0 and 100");
  });

  it("should throw when value above maximum", () => {
    expect(() => validateRange(11, 1, 10, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateRange(150, 0, 100, "percent", "test"))
      .toThrow("percent must be between 0 and 100");
  });

  it("should handle equal min and max", () => {
    expect(() => validateRange(5, 5, 5, "n")).not.toThrow();
    expect(() => validateRange(4, 5, 5, "n", "test"))
      .toThrow(ValidationError);
  });

  it("should include error context", () => {
    try {
      validateRange(150, 0, 100, "percent", "validatePercent");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).context).toMatchObject({
        paramName: "percent",
        value: 150,
        min: 0,
        max: 100,
      });
    }
  });
});

describe("validateFiniteNumber", () => {
  it("should accept finite numbers", () => {
    expect(() => validateFiniteNumber(0, "n")).not.toThrow();
    expect(() => validateFiniteNumber(1.5, "value")).not.toThrow();
    expect(() => validateFiniteNumber(-100, "negative")).not.toThrow();
    expect(() => validateFiniteNumber(Number.MAX_SAFE_INTEGER, "max")).not.toThrow();
  });

  it("should throw for NaN", () => {
    expect(() => validateFiniteNumber(NaN, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateFiniteNumber(NaN, "value", "test"))
      .toThrow("value must be a finite number");
  });

  it("should throw for Infinity", () => {
    expect(() => validateFiniteNumber(Infinity, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateFiniteNumber(-Infinity, "value", "test"))
      .toThrow(ValidationError);
  });
});

describe("validateNonZero", () => {
  it("should accept non-zero numbers", () => {
    expect(() => validateNonZero(1, "divisor")).not.toThrow();
    expect(() => validateNonZero(-1, "divisor")).not.toThrow();
    expect(() => validateNonZero(0.1, "small")).not.toThrow();
    expect(() => validateNonZero(-0.1, "small")).not.toThrow();
  });

  it("should throw for zero", () => {
    expect(() => validateNonZero(0, "divisor", "test"))
      .toThrow(ValidationError);
    expect(() => validateNonZero(0, "denominator", "test"))
      .toThrow("denominator cannot be zero");
  });

  it("should throw for negative zero", () => {
    expect(() => validateNonZero(-0, "divisor", "test"))
      .toThrow(ValidationError);
  });

  it("should include error context", () => {
    try {
      validateNonZero(0, "divisor", "divide");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).context).toMatchObject({
        paramName: "divisor",
        value: 0,
      });
    }
  });
});

describe("validateFunction", () => {
  it("should accept arrow functions", () => {
    const arrowFn = () => {};
    expect(() => validateFunction(arrowFn, "fn")).not.toThrow();
  });

  it("should accept regular functions", () => {
    function regularFn() {}
    expect(() => validateFunction(regularFn, "fn")).not.toThrow();
  });

  it("should accept async functions", () => {
    async function asyncFn() {}
    expect(() => validateFunction(asyncFn, "fn")).not.toThrow();
  });

  it("should accept generator functions", () => {
    function* generatorFn() {
      yield 1;
    }
    expect(() => validateFunction(generatorFn, "fn")).not.toThrow();
  });

  it("should accept class constructors", () => {
    class MyClass {}
    expect(() => validateFunction(MyClass, "fn")).not.toThrow();
  });

  it("should throw for null", () => {
    expect(() => validateFunction(null, "fn", "test"))
      .toThrow(ValidationError);
    expect(() => validateFunction(null, "callback", "test"))
      .toThrow("callback must be a function");
  });

  it("should throw for undefined", () => {
    expect(() => validateFunction(undefined, "fn", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for numbers", () => {
    expect(() => validateFunction(123, "fn", "test"))
      .toThrow(ValidationError);
    expect(() => validateFunction(123, "handler", "test"))
      .toThrow("handler must be a function, got number");
  });

  it("should throw for strings", () => {
    expect(() => validateFunction("not a function", "fn", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for objects", () => {
    expect(() => validateFunction({}, "fn", "test"))
      .toThrow(ValidationError);
    expect(() => validateFunction({ call: () => {} }, "fn", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for arrays", () => {
    expect(() => validateFunction([], "fn", "test"))
      .toThrow(ValidationError);
  });

  it("should include error context with type information", () => {
    try {
      validateFunction(123, "callback", "map");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).context).toMatchObject({
        paramName: "callback",
        type: "number",
      });
    }
  });
});

describe("validateIterable", () => {
  it("should accept arrays", () => {
    expect(() => validateIterable([1, 2, 3], "items")).not.toThrow();
    expect(() => validateIterable([], "empty")).not.toThrow();
  });

  it("should accept strings", () => {
    expect(() => validateIterable("hello", "str")).not.toThrow();
    expect(() => validateIterable("", "empty")).not.toThrow();
  });

  it("should accept Maps", () => {
    expect(() => validateIterable(new Map(), "map")).not.toThrow();
  });

  it("should accept Sets", () => {
    expect(() => validateIterable(new Set(), "set")).not.toThrow();
  });

  it("should accept generators", () => {
    function* generator() {
      yield 1;
      yield 2;
    }
    expect(() => validateIterable(generator(), "gen")).not.toThrow();
  });

  it("should accept custom iterables", () => {
    const customIterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
      },
    };
    expect(() => validateIterable(customIterable, "custom")).not.toThrow();
  });

  it("should throw for null", () => {
    expect(() => validateIterable(null, "items", "test"))
      .toThrow(ValidationError);
    expect(() => validateIterable(null, "sequence", "test"))
      .toThrow("sequence must be iterable");
  });

  it("should throw for undefined", () => {
    expect(() => validateIterable(undefined, "items", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for numbers", () => {
    expect(() => validateIterable(123, "items", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for plain objects without Symbol.iterator", () => {
    expect(() => validateIterable({}, "items", "test"))
      .toThrow(ValidationError);
    expect(() => validateIterable({ a: 1, b: 2 }, "obj", "test"))
      .toThrow(ValidationError);
  });

  it("should include error context", () => {
    try {
      validateIterable(123, "items", "map");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).context).toMatchObject({
        paramName: "items",
        type: "number",
      });
    }
  });
});

describe("validateComparator", () => {
  it("should accept comparator functions", () => {
    const comparator = (a: number, b: number) => a - b;
    expect(() => validateComparator(comparator)).not.toThrow();
  });

  it("should accept arrow function comparators", () => {
    const comparator = (a: string, b: string) => a.localeCompare(b);
    expect(() => validateComparator(comparator)).not.toThrow();
  });

  it("should throw for non-function values", () => {
    expect(() => validateComparator(null, "test"))
      .toThrow(ValidationError);
    expect(() => validateComparator(undefined, "test"))
      .toThrow(ValidationError);
    expect(() => validateComparator(123, "test"))
      .toThrow(ValidationError);
    expect(() => validateComparator("not a function", "test"))
      .toThrow(ValidationError);
  });

  it("should use validateFunction internally", () => {
    // validateComparator delegates to validateFunction
    // so it should have the same error messages
    try {
      validateComparator({} as any, "sortBy");
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toContain("comparator must be a function");
    }
  });
});

describe("validateNonEmpty", () => {
  it("should accept non-empty arrays", () => {
    expect(() => validateNonEmpty([1])).not.toThrow();
    expect(() => validateNonEmpty([1, 2, 3])).not.toThrow();
  });

  it("should throw for empty arrays", () => {
    expect(() => validateNonEmpty([], "test"))
      .toThrow(ValidationError);
    expect(() => validateNonEmpty([], "isEmpty"))
      .toThrow("Sequence cannot be empty");
  });
});

describe("toNumber", () => {
  it("should convert valid numeric strings", () => {
    expect(toNumber("123")).toBe(123);
    expect(toNumber("0")).toBe(0);
    expect(toNumber("-45.6")).toBe(-45.6);
  });

  it("should convert numbers as-is", () => {
    expect(toNumber(123)).toBe(123);
    expect(toNumber(0)).toBe(0);
    expect(toNumber(-45.6)).toBe(-45.6);
  });

  it("should throw for NaN results", () => {
    expect(() => toNumber("not a number", "test"))
      .toThrow(TypeConversionError);
    expect(() => toNumber({}, "test"))
      .toThrow(TypeConversionError);
    expect(() => toNumber(undefined, "test"))
      .toThrow(TypeConversionError);
  });
});

describe("toInteger", () => {
  it("should convert valid integers", () => {
    expect(toInteger("123")).toBe(123);
    expect(toInteger(456)).toBe(456);
    expect(toInteger("0")).toBe(0);
  });

  it("should throw for decimal values", () => {
    expect(() => toInteger("123.45", "test"))
      .toThrow(TypeConversionError);
    expect(() => toInteger(789.12, "test"))
      .toThrow(TypeConversionError);
  });

  it("should throw for non-numeric strings", () => {
    expect(() => toInteger("abc", "test"))
      .toThrow(TypeConversionError);
  });
});

describe("validateIndex", () => {
  it("should accept valid indices", () => {
    expect(() => validateIndex(0, 10)).not.toThrow();
    expect(() => validateIndex(5, 10)).not.toThrow();
    expect(() => validateIndex(9, 10)).not.toThrow();
  });

  it("should throw for negative indices", () => {
    expect(() => validateIndex(-1, 10, "test"))
      .toThrow(ValidationError);
  });

  it("should throw for index >= size", () => {
    expect(() => validateIndex(10, 10, "test"))
      .toThrow(ValidationError);
    expect(() => validateIndex(15, 10, "test"))
      .toThrow("Index 15 is out of bounds for size 10");
  });
});

describe("validateSafeInteger", () => {
  it("should accept safe integers", () => {
    expect(() => validateSafeInteger(0, "n")).not.toThrow();
    expect(() => validateSafeInteger(123, "n")).not.toThrow();
    expect(() => validateSafeInteger(Number.MAX_SAFE_INTEGER, "n")).not.toThrow();
    expect(() => validateSafeInteger(Number.MIN_SAFE_INTEGER, "n")).not.toThrow();
  });

  it("should throw for unsafe integers", () => {
    expect(() => validateSafeInteger(Number.MAX_SAFE_INTEGER + 1, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateSafeInteger(Number.MIN_SAFE_INTEGER - 1, "n", "test"))
      .toThrow(ValidationError);
  });

  it("should throw for non-integers", () => {
    expect(() => validateSafeInteger(1.5, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateSafeInteger(NaN, "n", "test"))
      .toThrow(ValidationError);
    expect(() => validateSafeInteger(Infinity, "n", "test"))
      .toThrow(ValidationError);
  });
});

describe("validateWindowSize", () => {
  it("should accept reasonable window sizes", () => {
    expect(() => validateWindowSize(10)).not.toThrow();
    expect(() => validateWindowSize(1000)).not.toThrow();
    expect(() => validateWindowSize(100000)).not.toThrow();
  });

  it("should throw for sizes exceeding default limit", () => {
    expect(() => validateWindowSize(2_000_000, undefined, "test"))
      .toThrow(ValidationError);
    expect(() => validateWindowSize(5_000_000, undefined, "test"))
      .toThrow("exceeds maximum allowed size");
  });

  it("should respect custom max size", () => {
    expect(() => validateWindowSize(500, 1000)).not.toThrow();
    expect(() => validateWindowSize(1500, 1000, "test"))
      .toThrow(ValidationError);
  });

  it("should throw for invalid sizes", () => {
    expect(() => validateWindowSize(0, undefined, "test"))
      .toThrow(ValidationError);
    expect(() => validateWindowSize(-10, undefined, "test"))
      .toThrow(ValidationError);
  });
});

describe("validateMemoryLimit", () => {
  it("should accept reasonable sizes", () => {
    expect(() => validateMemoryLimit(100)).not.toThrow();
    expect(() => validateMemoryLimit(1000000)).not.toThrow();
  });

  it("should throw for sizes exceeding default limit", () => {
    expect(() => validateMemoryLimit(20_000_000, undefined, "test"))
      .toThrow(ValidationError);
    expect(() => validateMemoryLimit(50_000_000, undefined, "test"))
      .toThrow("exceed memory limit");
  });

  it("should respect custom max elements", () => {
    expect(() => validateMemoryLimit(500, 1000)).not.toThrow();
    expect(() => validateMemoryLimit(1500, 1000, "test"))
      .toThrow(ValidationError);
  });

  it("should accept zero size", () => {
    expect(() => validateMemoryLimit(0)).not.toThrow();
  });

  it("should throw for negative sizes", () => {
    expect(() => validateMemoryLimit(-100, undefined, "test"))
      .toThrow(ValidationError);
  });
});

describe("Error message formatting", () => {
  it("should include parameter name in error messages", () => {
    try {
      validatePositiveInteger(-1, "customParam", "op");
    } catch (error) {
      expect((error as ValidationError).message).toContain("customParam");
    }
  });

  it("should include operation name when provided", () => {
    try {
      validatePositiveInteger(-1, "n", "myCustomOperation");
    } catch (error) {
      expect((error as ValidationError).operation).toBe("myCustomOperation");
    }
  });

  it("should work without operation name", () => {
    try {
      validatePositiveInteger(-1, "n");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).operation).toBeUndefined();
    }
  });

  it("should include actual value in error messages", () => {
    try {
      validatePositiveInteger(-5, "count", "op");
    } catch (error) {
      expect((error as ValidationError).message).toContain("-5");
    }
  });

  it("should include range in validateRange errors", () => {
    try {
      validateRange(150, 0, 100, "percent", "op");
    } catch (error) {
      expect((error as ValidationError).message).toContain("0");
      expect((error as ValidationError).message).toContain("100");
      expect((error as ValidationError).message).toContain("150");
    }
  });
});
