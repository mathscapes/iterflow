export const SCALES = [100, 1_000, 10_000, 100_000, 1_000_000];
export const LIBRARIES = ['iterflow', 'native-array'];

export const TRANSACTION_CONFIG = {
  MAX_AMOUNT: 10000,
  FLAGGED_PROBABILITY: 0.1,
  FILTER_THRESHOLD: 1000,
  TAKE_COUNT: 1000,
} as const;

export const PRICE_CONFIG = {
  BASE_PRICE: 100,
  VOLATILITY: 5,
  MIN_PRICE: 1,
} as const;

export const WINDOW_CONFIG = {
  SIZE: 5,
  STRIDE: 1,
} as const;

export const BENCHMARK_SCALES = {
  WINDOWED_OPS: 10000,
  STANDALONE_STATS: 100000,
  MEMORY_EFFICIENCY: [10000, 100000, 1000000],
} as const;

export const GC_CONFIG = {
  DEFAULT_ITERATIONS: 100,
  SETTLE_TIME_MS: 100,
} as const;
