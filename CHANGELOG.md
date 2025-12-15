# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-12-15

### Initial Release

Iterator utilities library for ES2022+ with comprehensive feature set:

#### Core Features

- **iterflow class** - Fluent API for iterator operations
- **Factory function** - `iter()` for creating iterflow instances  
- **Dual API support** - Both wrapper and functional programming styles
- **Zero dependencies** - Pure TypeScript/JavaScript implementation
- **Tree-shakeable** - Import only what you need
- **Lazy evaluation** - Efficient processing of large/infinite sequences

#### Statistical Operations

- `sum()`, `mean()`, `min()`, `max()`, `count()` - Basic aggregations
- `median()`, `variance()`, `stdDev()` - Advanced statistics  
- `percentile(p)`, `mode()`, `quartiles()` - Distribution analysis
- `span()`, `product()`, `covariance()`, `correlation()` - Extended statistical functions

#### Windowing & Grouping

- `window(size)` - Sliding window operations
- `chunk(size)` - Non-overlapping groups  
- `pairwise()` - Consecutive pairs
- `partition(predicate)` - Split based on condition
- `groupBy(keyFn)` - Group by key function

#### Set Operations & Combining

- `distinct()`, `distinctBy(keyFn)` - Remove duplicates
- `iter.zip()`, `iter.zipWith()` - Combine iterators
- `iter.interleave()`, `iter.merge()`, `iter.chain()` - Advanced combining

#### Generators & Utilities  

- `iter.range()`, `iter.repeat()` - Generate sequences
- `tap()`, `takeWhile()`, `dropWhile()` - Stream utilities
- `map()`, `filter()`, `take()`, `drop()`, `flatMap()` - Transform operations

#### Advanced Features

- **Async iterators** - Full async/await support with Asynciterflow
- **Error handling** - Comprehensive error recovery utilities
- **Debug mode** - Operation tracing and performance monitoring  
- **TypeScript-first** - Complete type safety and inference
- **ES2025 forward compatibility** - Ready for future iterator helpers

[0.2.1]: https://github.com/mathscapes/iterflow/releases/tag/v0.2.1
