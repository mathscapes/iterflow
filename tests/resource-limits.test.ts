import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  iter,
  asyncIter,
  OperationError,
  TimeoutError,
  AbortError,
  ValidationError,
} from "../src/index.js";

describe("Resource Limits & Safety", () => {
  describe("limit() - Sync", () => {
    it("should allow iterations within limit", () => {
      const result = iter([1, 2, 3]).limit(10).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should throw OperationError when limit is exceeded", () => {
      expect(() => {
        iter([1, 2, 3, 4, 5]).limit(3).toArray();
      }).toThrow(OperationError);
    });

    it("should include limit context in error", () => {
      try {
        iter([1, 2, 3, 4, 5]).limit(3).toArray();
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect((error as OperationError).operation).toBe("limit");
        expect((error as OperationError).context).toMatchObject({
          maxIterations: 3,
        });
      }
    });

    it("should work with exactly maxIterations elements", () => {
      const result = iter([1, 2, 3]).limit(3).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should validate maxIterations parameter", () => {
      expect(() => iter([1, 2, 3]).limit(0)).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).limit(-1)).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).limit(1.5)).toThrow(ValidationError);
    });

    it("should compose with other operations", () => {
      expect(() => {
        iter([1, 2, 3, 4, 5])
          .map((x) => x * 2)
          .filter((x) => x > 2)
          .limit(2)
          .toArray();
      }).toThrow(OperationError);
    });
  });

  describe("timeout() - Async", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should allow operations within timeout", async () => {
      const result = asyncIter([1, 2, 3]).timeout(1000).toArray();

      vi.advanceTimersByTime(500);
      await expect(result).resolves.toEqual([1, 2, 3]);
    });

    it("should throw TimeoutError when operation exceeds timeout", async () => {
      const slowIter = asyncIter([1, 2, 3]).map(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return x;
      });

      const result = slowIter.timeout(1000).toArray();

      vi.advanceTimersByTime(1500);

      await expect(result).rejects.toThrow(TimeoutError);
    });

    it("should include timeout duration in error", async () => {
      const slowIter = asyncIter([1, 2, 3]).map(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return x;
      });

      try {
        const result = slowIter.timeout(1000).toArray();
        vi.advanceTimersByTime(1500);
        await result;
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as TimeoutError).timeoutMs).toBe(1000);
        expect((error as TimeoutError).operation).toBe("timeout");
      }
    });

    it("should validate timeout parameter", () => {
      expect(() => asyncIter([1, 2, 3]).timeout(0)).toThrow(ValidationError);
      expect(() => asyncIter([1, 2, 3]).timeout(-100)).toThrow(ValidationError);
      expect(() => asyncIter([1, 2, 3]).timeout(1.5)).toThrow(ValidationError);
    });
  });

  describe("withSignal() - Async", () => {
    it("should allow normal iteration without abort", async () => {
      const controller = new AbortController();
      const result = await asyncIter([1, 2, 3])
        .withSignal(controller.signal)
        .toArray();

      expect(result).toEqual([1, 2, 3]);
    });

    it("should throw AbortError when signal is aborted during iteration", async () => {
      const controller = new AbortController();

      const promise = asyncIter([1, 2, 3])
        .withSignal(controller.signal)
        .toArray();

      // Abort immediately
      controller.abort("User cancelled");

      await expect(promise).rejects.toThrow(AbortError);
    });

    it("should include abort reason in error", async () => {
      const controller = new AbortController();

      const promise = asyncIter([1, 2, 3])
        .map(async (x) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return x;
        })
        .withSignal(controller.signal)
        .toArray();

      controller.abort("Custom abort reason");

      try {
        await promise;
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AbortError);
        expect((error as AbortError).reason).toBe("Custom abort reason");
        expect((error as AbortError).operation).toBe("withSignal");
      }
    });

    it("should throw immediately if signal is already aborted", async () => {
      const controller = new AbortController();
      controller.abort("Already aborted");

      await expect(
        asyncIter([1, 2, 3]).withSignal(controller.signal).toArray(),
      ).rejects.toThrow(AbortError);
    });

    it("should compose with other async operations", async () => {
      const controller = new AbortController();

      const result = await asyncIter([1, 2, 3])
        .map(async (x) => x * 2)
        .withSignal(controller.signal)
        .filter(async (x) => x > 2)
        .toArray();

      expect(result).toEqual([4, 6]);
    });
  });

  describe("toArray(maxSize) - Sync", () => {
    it("should collect all elements without maxSize", () => {
      const result = iter([1, 2, 3, 4, 5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should limit collection with maxSize", () => {
      const result = iter([1, 2, 3, 4, 5]).toArray(3);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should work with infinite iterators", () => {
      const result = iter.range(Infinity).toArray(10);
      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should not throw when maxSize exceeds actual size", () => {
      const result = iter([1, 2, 3]).toArray(10);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should validate maxSize parameter", () => {
      expect(() => iter([1, 2, 3]).toArray(0)).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).toArray(-1)).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).toArray(1.5)).toThrow(ValidationError);
    });

    it("should use fast-path for arrays", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = iter(arr).toArray(3);
      expect(result).toEqual([1, 2, 3]);
      expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work with generators", () => {
      function* gen() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
      }
      const result = iter(gen()).toArray(3);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should compose with transformations", () => {
      const result = iter([1, 2, 3, 4, 5])
        .map((x) => x * 2)
        .filter((x) => x > 4)
        .toArray(2);
      expect(result).toEqual([6, 8]);
    });
  });

  describe("toArray(maxSize) - Async", () => {
    it("should collect all elements without maxSize", async () => {
      const result = await asyncIter([1, 2, 3, 4, 5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should limit collection with maxSize", async () => {
      const result = await asyncIter([1, 2, 3, 4, 5]).toArray(3);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should work with infinite async iterators", async () => {
      async function* infiniteGen() {
        let i = 0;
        while (true) {
          yield i++;
        }
      }
      const result = await asyncIter(infiniteGen()).toArray(5);
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it("should not throw when maxSize exceeds actual size", async () => {
      const result = await asyncIter([1, 2, 3]).toArray(10);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should validate maxSize parameter", async () => {
      await expect(asyncIter([1, 2, 3]).toArray(0)).rejects.toThrow(ValidationError);
      await expect(asyncIter([1, 2, 3]).toArray(-1)).rejects.toThrow(ValidationError);
      await expect(asyncIter([1, 2, 3]).toArray(1.5)).rejects.toThrow(ValidationError);
    });

    it("should compose with async transformations", async () => {
      const result = await asyncIter([1, 2, 3, 4, 5])
        .map(async (x) => x * 2)
        .filter(async (x) => x > 4)
        .toArray(2);
      expect(result).toEqual([6, 8]);
    });
  });

  describe("Integration - Combined Safety Features", () => {
    it("should combine limit() with toArray(maxSize)", () => {
      expect(() => {
        iter([1, 2, 3, 4, 5]).limit(10).toArray(3);
      }).not.toThrow();

      expect(() => {
        iter([1, 2, 3, 4, 5]).limit(3).toArray(10);
      }).toThrow(OperationError);
    });

    it("should combine timeout() with withSignal()", async () => {
      const controller = new AbortController();

      const promise = asyncIter([1, 2, 3])
        .timeout(5000)
        .withSignal(controller.signal)
        .toArray();

      controller.abort("User cancelled");

      await expect(promise).rejects.toThrow(AbortError);
    });

    it("should use all async safety features together", async () => {
      const controller = new AbortController();

      const result = await asyncIter([1, 2, 3, 4, 5])
        .map(async (x) => x * 2)
        .timeout(1000)
        .withSignal(controller.signal)
        .toArray(3);

      expect(result).toEqual([2, 4, 6]);
    });
  });
});
