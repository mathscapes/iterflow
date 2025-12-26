import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';
import * as fn from '../src/fn/index.js';

describe('Functional API - Integration with Wrapper API', () => {
  describe('Converting between APIs', () => {
    it('should convert wrapper results to functional API', () => {
      const wrapperResult = iter([1, 2, 3, 4, 5])
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .toArray();

      const functionalResult = Array.from(
        fn.map((x: number) => x * 2)(fn.filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5]))
      );

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should use functional API results in wrapper', () => {
      const functionalData = fn.range(1, 6);
      const wrapperResult = iter(functionalData)
        .filter((x) => x % 2 === 0)
        .toArray();

      expect(wrapperResult).toEqual([2, 4]);
    });

    it('should chain functional and wrapper operations', () => {
      const functionalPart = fn.map((x: number) => x * 2);
      const data = [1, 2, 3, 4, 5];

      const result = iter(functionalPart(data))
        .filter((x) => x > 5)
        .toArray();

      expect(result).toEqual([6, 8, 10]);
    });
  });

  describe('Statistical operations comparison', () => {
    const operations = [
      {
        name: 'sum',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).sum(),
        functional: (d: number[]) => fn.sum(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'mean',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).mean(),
        functional: (d: number[]) => fn.mean(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'min',
        data: [3, 1, 4, 1, 5],
        wrapper: (d: number[]) => iter(d).min(),
        functional: (d: number[]) => fn.min(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'max',
        data: [3, 1, 4, 1, 5],
        wrapper: (d: number[]) => iter(d).max(),
        functional: (d: number[]) => fn.max(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'count',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).count(),
        functional: (d: number[]) => fn.count(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'median',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).median(),
        functional: (d: number[]) => fn.median(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'variance',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).variance(),
        functional: (d: number[]) => fn.variance(d),
        checkFn: (a: any, b: any) => expect(a).toBeCloseTo(b!),
      },
      {
        name: 'stdDev',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).stdDev(),
        functional: (d: number[]) => fn.stdDev(d),
        checkFn: (a: any, b: any) => expect(a).toBeCloseTo(b!),
      },
      {
        name: 'percentile',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        wrapper: (d: number[]) => iter(d).percentile(50),
        functional: (d: number[]) => fn.percentile(d, 50),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'mode',
        data: [1, 2, 2, 3, 3, 3],
        wrapper: (d: number[]) => iter(d).mode(),
        functional: (d: number[]) => fn.mode(d),
        checkFn: (a: any, b: any) => expect(a).toEqual(b),
      },
      {
        name: 'quartiles',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        wrapper: (d: number[]) => iter(d).quartiles(),
        functional: (d: number[]) => fn.quartiles(d),
        checkFn: (a: any, b: any) => expect(a).toEqual(b),
      },
      {
        name: 'span',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).span(),
        functional: (d: number[]) => fn.span(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
      {
        name: 'product',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: number[]) => iter(d).product(),
        functional: (d: number[]) => fn.product(d),
        checkFn: (a: any, b: any) => expect(a).toBe(b),
      },
    ];

    operations.forEach(({ name, data, wrapper, functional, checkFn }) => {
      it(`should produce same ${name} result`, () => {
        const wrapperResult = wrapper(data);
        const functionalResult = functional(data);
        checkFn(wrapperResult, functionalResult);
      });
    });
  });

  describe('Transformation operations comparison', () => {
    const transformations = [
      {
        name: 'map',
        data: [1, 2, 3],
        wrapper: (d: any[]) => iter(d).map((x: number) => x * 2).toArray(),
        functional: (d: any[]) => Array.from(fn.map((x: number) => x * 2)(d)),
      },
      {
        name: 'filter',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).filter((x: number) => x % 2 === 0).toArray(),
        functional: (d: any[]) => Array.from(fn.filter((x: number) => x % 2 === 0)(d)),
      },
      {
        name: 'take',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).take(3).toArray(),
        functional: (d: any[]) => Array.from(fn.take(3)(d)),
      },
      {
        name: 'drop',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).drop(2).toArray(),
        functional: (d: any[]) => Array.from(fn.drop(2)(d)),
      },
      {
        name: 'flatMap',
        data: [1, 2, 3],
        wrapper: (d: any[]) => iter(d).flatMap((x: number) => [x, x * 2]).toArray(),
        functional: (d: any[]) => Array.from(fn.flatMap((x: number) => [x, x * 2])(d)),
      },
      {
        name: 'reverse',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).reverse().toArray(),
        functional: (d: any[]) => Array.from(fn.reverse()(d)),
      },
      {
        name: 'distinct',
        data: [1, 2, 2, 3, 1, 4],
        wrapper: (d: any[]) => iter(d).distinct().toArray(),
        functional: (d: any[]) => Array.from(fn.distinct(d)),
      },
      {
        name: 'distinctBy',
        data: [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}],
        wrapper: (d: any[]) => iter(d).distinctBy((x) => x.id).toArray(),
        functional: (d: any[]) => Array.from(fn.distinctBy((x: any) => x.id)(d)),
      },
    ];

    transformations.forEach(({ name, data, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        const wrapperResult = wrapper(data);
        const functionalResult = functional(data);
        expect(wrapperResult).toEqual(functionalResult);
      });
    });
  });

  describe('Windowing operations comparison', () => {
    const windowingOps = [
      {
        name: 'window',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).window(3).toArray(),
        functional: (d: any[]) => Array.from(fn.window(3)(d)),
      },
      {
        name: 'chunk',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).chunk(2).toArray(),
        functional: (d: any[]) => Array.from(fn.chunk(2)(d)),
      },
      {
        name: 'pairwise',
        data: [1, 2, 3, 4],
        wrapper: (d: any[]) => iter(d).pairwise().toArray(),
        functional: (d: any[]) => Array.from(fn.pairwise(d)),
      },
    ];

    windowingOps.forEach(({ name, data, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        expect(wrapper(data)).toEqual(functional(data));
      });
    });
  });

  describe('Terminal operations comparison', () => {
    const terminalOps = [
      {
        name: 'reduce',
        data: [1, 2, 3, 4],
        wrapper: (d: any[]) => iter(d).reduce((a: number, x: number) => a + x, 0),
        functional: (d: any[]) => fn.reduce((a: number, x: number) => a + x, 0)(d),
      },
      {
        name: 'find',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).find((x: number) => x > 3),
        functional: (d: any[]) => fn.find((x: number) => x > 3)(d),
      },
      {
        name: 'findIndex',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).findIndex((x: number) => x > 3),
        functional: (d: any[]) => fn.findIndex((x: number) => x > 3)(d),
      },
      {
        name: 'some',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).some((x: number) => x > 3),
        functional: (d: any[]) => fn.some((x: number) => x > 3)(d),
      },
      {
        name: 'every',
        data: [2, 4, 6],
        wrapper: (d: any[]) => iter(d).every((x: number) => x % 2 === 0),
        functional: (d: any[]) => fn.every((x: number) => x % 2 === 0)(d),
      },
      {
        name: 'first',
        data: [1, 2, 3],
        wrapper: (d: any[]) => iter(d).first(),
        functional: (d: any[]) => fn.first(d),
      },
      {
        name: 'last',
        data: [1, 2, 3],
        wrapper: (d: any[]) => iter(d).last(),
        functional: (d: any[]) => fn.last(d),
      },
      {
        name: 'nth',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).nth(2),
        functional: (d: any[]) => fn.nth(2)(d),
      },
      {
        name: 'isEmpty',
        data: [],
        wrapper: (d: any[]) => iter(d).isEmpty(),
        functional: (d: any[]) => fn.isEmpty(d),
      },
      {
        name: 'includes',
        data: [1, 2, 3, 4, 5],
        wrapper: (d: any[]) => iter(d).includes(3),
        functional: (d: any[]) => fn.includes(3)(d),
      },
    ];

    terminalOps.forEach(({ name, data, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        expect(wrapper(data)).toBe(functional(data));
      });
    });
  });

  describe('Combining operations comparison', () => {
    const combiningOps = [
      {
        name: 'zip',
        data1: [1, 2, 3],
        data2: ['a', 'b', 'c'],
        wrapper: (d1: any, d2: any) => iter.zip(d1, d2).toArray(),
        functional: (d1: any, d2: any) => Array.from(fn.zip(d1, d2)),
      },
      {
        name: 'zipWith',
        data1: [1, 2, 3],
        data2: [10, 20, 30],
        wrapper: (d1: any, d2: any) => iter.zipWith(d1, d2, (a: number, b: number) => a + b).toArray(),
        functional: (d1: any, d2: any) => Array.from(fn.zipWith(d1, d2, (a: number, b: number) => a + b)),
      },
    ];

    combiningOps.forEach(({ name, data1, data2, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        expect(wrapper(data1, data2)).toEqual(functional(data1, data2));
      });
    });
  });

  describe('Generator operations comparison', () => {
    const generatorOps = [
      {
        name: 'range (stop)',
        wrapper: () => iter.range(5).toArray(),
        functional: () => Array.from(fn.range(5)),
      },
      {
        name: 'range (start/stop)',
        wrapper: () => iter.range(2, 7).toArray(),
        functional: () => Array.from(fn.range(2, 7)),
      },
      {
        name: 'range (start/stop/step)',
        wrapper: () => iter.range(0, 10, 2).toArray(),
        functional: () => Array.from(fn.range(0, 10, 2)),
      },
      {
        name: 'repeat',
        wrapper: () => iter.repeat('x', 3).toArray(),
        functional: () => Array.from(fn.repeat('x', 3)),
      },
    ];

    generatorOps.forEach(({ name, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        expect(wrapper()).toEqual(functional());
      });
    });
  });

  describe('Interleaving operations comparison', () => {
    const interleavingOps = [
      {
        name: 'interleave',
        wrapper: () => iter.interleave([1, 2, 3], [4, 5, 6]).toArray(),
        functional: () => Array.from(fn.interleave([1, 2, 3], [4, 5, 6])),
      },
      {
        name: 'merge',
        wrapper: () => iter.merge([1, 3, 5], [2, 4, 6]).toArray(),
        functional: () => Array.from(fn.merge([1, 3, 5], [2, 4, 6])),
      },
      {
        name: 'chain',
        wrapper: () => iter.chain([1, 2], [3, 4], [5, 6]).toArray(),
        functional: () => Array.from(fn.chain([1, 2], [3, 4], [5, 6])),
      },
    ];

    interleavingOps.forEach(({ name, wrapper, functional }) => {
      it(`should produce same ${name} result`, () => {
        expect(wrapper()).toEqual(functional());
      });
    });
  });

  describe('Complex pipeline comparisons', () => {
    it('should produce same result for complex wrapper pipeline', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const wrapperResult = iter(data)
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .take(3)
        .toArray();

      const filterFn = fn.filter((x: number) => x % 2 === 0);
      const mapFn = fn.map((x: number) => x * 2);
      const takeFn = fn.take(3);

      const functionalResult = Array.from(takeFn(mapFn(filterFn(data))));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same statistical result after transformations', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperSum = iter(data).map((x) => x * 2).sum();

      const mapFn = fn.map((x: number) => x * 2);
      const functionalSum = fn.sum(mapFn(data));

      expect(wrapperSum).toBe(functionalSum);
    });

    it('should handle composition with groupBy', () => {
      const data = ['alice', 'bob', 'charlie', 'dave'];
      const keyFn = (s: string) => s.length;

      const wrapperResult = iter(data).groupBy(keyFn);
      const functionalResult = fn.groupBy(keyFn)(data);

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should handle composition with partition', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x % 2 === 0;

      const wrapperResult = iter(data).partition(predicate);
      const functionalResult = fn.partition(predicate)(data);

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Mixed API usage patterns', () => {
    it('should allow using functional API within wrapper chains', () => {
      const data = [1, 2, 3, 4, 5];

      // Use functional map within wrapper chain
      const functionalMapper = fn.map((x: number) => x * 2);
      const result = iter(functionalMapper(data))
        .filter((x) => x > 5)
        .sum();

      expect(result).toBe(6 + 8 + 10); // 24
    });

    it('should allow passing wrapper results to functional operations', () => {
      const wrapperData = iter.range(1, 6); // Returns iterflow

      // Use functional operations on wrapper result
      const filterFn = fn.filter((x: number) => x % 2 === 0);
      const result = fn.sum(filterFn(wrapperData));

      expect(result).toBe(2 + 4); // 6
    });

    it('should compose functional utilities with wrapper methods', () => {
      const data = [1, 2, 3, 4, 5];

      // Functional composition
      const double = fn.map((x: number) => x * 2);
      const evens = fn.filter((x: number) => x % 2 === 0);

      // Mix with wrapper
      const result = iter(data)
        .map((x) => x + 1) // [2, 3, 4, 5, 6]
        .toArray();

      const functionalResult = Array.from(evens(double(result)));
      expect(functionalResult).toEqual([4, 6, 8, 10, 12]);
    });

    it('should allow functional scan with wrapper aggregation', () => {
      const data = [1, 2, 3, 4];
      const scanFn = fn.scan((acc: number, x: number) => acc + x, 0);

      const result = iter(scanFn(data)).last();
      expect(result).toBe(10); // Final accumulated value
    });

    it('should work with functional generators and wrapper transformations', () => {
      const rangeData = fn.range(1, 11);
      const repeatData = fn.repeat(2, 5);

      const result1 = iter(rangeData).filter((x) => x % 2 === 0).sum();
      const result2 = iter(repeatData).sum();

      expect(result1).toBe(2 + 4 + 6 + 8 + 10); // 30
      expect(result2).toBe(10);
    });
  });

  describe('Performance equivalence', () => {
    it('should lazily evaluate in both APIs', () => {
      let wrapperCount = 0;
      let functionalCount = 0;

      const data = [1, 2, 3, 4, 5];

      // Wrapper API
      const wrapperResult = iter(data)
        .map((x) => {
          wrapperCount++;
          return x * 2;
        })
        .take(2)
        .toArray();

      // Functional API
      const mapFn = fn.map((x: number) => {
        functionalCount++;
        return x * 2;
      });
      const takeFn = fn.take(2);
      const functionalResult = Array.from(takeFn(mapFn(data)));

      // Both APIs evaluate lazily and should only process what's needed
      // Both implementations might process slightly more than strictly necessary
      // due to how generators and iterators work
      expect(wrapperCount).toBeLessThanOrEqual(3);
      expect(functionalCount).toBeLessThanOrEqual(3);
      expect(wrapperResult).toEqual(functionalResult);
      expect(wrapperResult.length).toBe(2);
    });
  });

  describe('Type compatibility', () => {
    it('should maintain type safety across API boundaries', () => {
      const numbers = [1, 2, 3, 4, 5];

      // Functional to wrapper (numbers -> strings)
      const mapToString = fn.map((x: number) => x.toString());
      const strings = iter(mapToString(numbers)).toArray();

      // Type should be string[]
      const firstString: string = strings[0]!;
      expect(typeof firstString).toBe('string');
    });

    it('should handle complex type transformations', () => {
      type Person = { name: string; age: number };
      const people: Person[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];

      // Functional extraction
      const extractAge = fn.map((p: Person) => p.age);
      const ages = iter(extractAge(people)).toArray();

      expect(ages).toEqual([30, 25]);
    });
  });
});
