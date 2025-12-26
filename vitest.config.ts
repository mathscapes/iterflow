import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'benchmarks/',
        'examples/',
        'website/',
        'website/**',
        '.next/',
        '.next/**',
        'scripts/',
        'packages/',
        'packages/**',
        'templates/',
        'templates/**',
        'test-d/',
        'test-d/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/*.bench.ts',
        '**/*.test-d.ts'
      ]
    },
    benchmark: {
      include: ['benchmarks/**/*.bench.ts'],
      exclude: ['node_modules', 'dist'],
      time: process.env.VITEST_BENCH_TIME ? parseInt(process.env.VITEST_BENCH_TIME) : 5000,
      iterations: process.env.VITEST_BENCH_ITERATIONS ? parseInt(process.env.VITEST_BENCH_ITERATIONS) : undefined,
    }
  }
});