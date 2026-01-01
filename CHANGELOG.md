# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
