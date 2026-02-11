# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-rc5] - 2026-02-11

### Added

- `.streamingZScore()` - Z-score anomaly detection using running mean/variance (pre-observation convention)
- `.windowedMin(size)` - Sliding window minimum via monotonic deque (O(1) amortized)
- `.windowedMax(size)` - Sliding window maximum via monotonic deque (O(1) amortized)

### Changed

- `window(size)` now uses circular buffer instead of shift-based array (eliminates O(k) shift per element)
- Trimmed test suite from 197 to 74 tests, removing trivial and redundant cases

## [1.0.0-rc4] - 2026-02-10

### Added

- `.ewma(alpha)` - Exponentially weighted moving average with decay factor α ∈ (0,1]
- `.streamingCovariance()` - Streaming covariance for paired data streams
- `.streamingCorrelation()` - Streaming Pearson correlation coefficient

## [1.0.0-rc3] - 2026-02-08

### Added

- `.zip()` - Combine multiple iterables into tuples (stops at shortest)
- `.streamingMean()` - Streaming transform yielding running mean at each step
- `.streamingVariance()` - Streaming transform yielding running variance at each step
- `.stdDev()` - Population standard deviation terminal

### Fixed

- `median()` now filters out NaN values for deterministic behavior (returns NaN if all values are NaN)

## [1.0.0-rc2] - 2026-01-03

### Added

- **Benchmarks**: Performance comparison suite against Lodash, iter-ops, RxJS, and native methods
- `sideEffects: false` for better tree-shaking

### Changed

- **Median algorithm**: Replaced sort-based approach with Quickselect for O(n) average performance
- **Variance algorithm**: Replaced reduce-based approach with Welford's online algorithm

### Removed

- Trivial JSDoc comments from public API methods
- Unused internal helper function (`indexed`)

### Internal

- **GitHub templates**: Issue templates and PR template
- **CONTRIBUTING.md**: Contributor guidelines with release process
- **.gitignore**: Changed from catch-all to specific exclusions
- Added dev dependencies for benchmarking: `tinybench`, `iter-ops`
- Expanded test suite from 14 to 128 tests
- No public API changes, no breaking changes

[1.0.0-rc2]: https://github.com/mathscapes/iterflow/releases/tag/v1.0.0-rc2

## [1.0.0-rc1] - 2026-01-01

### Initial Release

Lazy iterator utilities with built-in statistics and windowing for memory-efficient data processing.

### Features

#### Transform Operations (Lazy)

- `map(fn)` - Transform each element
- `filter(fn)` - Keep matching elements
- `flatMap(fn)` - Map and flatten results
- `take(n)` - Take first n elements
- `drop(n)` - Skip first n elements
- `takeWhile(fn)` - Take elements while condition is true
- `dropWhile(fn)` - Skip elements while condition is true
- `window(size)` - Sliding windows of size n
- `chunk(size)` - Non-overlapping chunks of size n
- `distinct()` - Remove duplicates
- `enumerate()` - Add index to each element
- `concat(...iterables)` - Combine multiple iterables

#### Terminal Operations

- `toArray()` - Convert to array
- `reduce(fn, initial)` - Reduce to single value
- `forEach(fn)` - Execute function for each element
- `find(fn)` - Find first matching element
- `first()` - Get first element
- `last()` - Get last element
- `count()` - Count elements
- `some(fn)` - Test if any element matches
- `every(fn)` - Test if all elements match

#### Statistical Operations (for `Iterflow<number>`)

- `sum()` - Sum all values
- `mean()` - Calculate average
- `median()` - Calculate median (50th percentile)
- `min()` - Find minimum value
- `max()` - Find maximum value
- `variance()` - Calculate population variance

[1.0.0-rc1]: https://github.com/mathscapes/iterflow/releases/tag/v1.0.0-rc1
