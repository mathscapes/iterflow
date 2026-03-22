# simplestatistics — Literature Review

**Citation key:** simplestatistics
**Full reference:** MacWright, Tom. *simple-statistics: Statistical Methods in Readable JavaScript*. 2024. https://github.com/simple-statistics/simple-statistics
**Zotero key:** KHKP66IT
**Source verified:** Metadata confirmed in Zotero; URL resolves. No PDF (software repository).

---

## What simple-statistics is

simple-statistics is a JavaScript statistics library providing a wide range of statistical functions as standalone functions (not pipeline-based). Key characteristics:

- **API style:** Pure functions over arrays. `mean([1, 2, 3])`, `standardDeviation([1, 2, 3])`, `quantile([1, 2, 3], 0.5)`. No chaining, no lazy evaluation.
- **Scope:** Large — includes mean, median, mode, variance, standard deviation, quantile, regression, correlation, hypothesis tests, distributions (normal, binomial, etc.), and more.
- **Zero dependencies:** Yes — simple-statistics has no runtime dependencies.
- **TypeScript:** Partial — the library has TypeScript type definitions but is authored in JavaScript. Types are not generated from implementation.
- **Edge/browser:** Yes — works in any JS environment. Bundle size is moderate (~60KB minified).
- **Lazy evaluation:** No — all functions are strict (they process the full input array immediately). There is no streaming or incremental computation.

## Relevance to iterflow

simple-statistics is the closest existing competitor for iterflow's statistical terminal functions. The key distinction:

**simple-statistics requires full dataset materialization.** `mean(data)` must receive the complete array before computing. If data arrives incrementally (sensor stream, log tail, chunked file read), the user must buffer everything before calling simple-statistics.

**iterflow does not.** `iter(stream).streamingMean().last()` computes the mean of an unbounded stream in O(1) memory.

The ecosystem table in the spec:

| Property | iterflow | simple-statistics |
|---|---|---|
| Zero dependencies | yes | yes |
| Lazy evaluation | yes | no |
| Statistical terminals | yes | yes |
| TypeScript-first | yes | partial |
| Works in edge/browser | yes | yes |

The paper must be precise: simple-statistics is not wrong or inferior for batch workloads. It is the right tool when the full dataset is available. iterflow is the right tool when it is not.

## Limitations / caveats

- The "partial TypeScript" characterization should be verified at submission time. simple-statistics may have improved its TypeScript coverage.
- simple-statistics does not include streaming/windowed operators (`streamingMean`, `windowedMin`, etc.). This is the unambiguous gap iterflow fills relative to this library.
- The zero-dependency claim should be verified in `package.json` at submission time — it has historically been true.

## Key claims supported

- "Existing JS statistics libraries (`simple-statistics`) are array-based and require full dataset materialization before computation" (spec §1).
- simple-statistics row in the ecosystem comparison table (spec §4).
