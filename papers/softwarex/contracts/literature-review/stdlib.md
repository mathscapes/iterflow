# stdlib — Literature Review

**Citation key:** stdlib
**Full reference:** stdlib Authors. *stdlib: A Standard Library for JavaScript and Node.js*. 2024. https://github.com/stdlib-js/stdlib
**Zotero key:** X48FPIST
**Source verified:** Metadata confirmed in Zotero; URL resolves. No PDF (software repository).

---

## What stdlib is

stdlib is a comprehensive standard library for JavaScript and Node.js, modeled on the scope and philosophy of standard libraries in languages like Python (NumPy/SciPy) and R. Key characteristics:

- **Scope:** Enormous — thousands of packages covering math, statistics, data structures, I/O, random number generation, linear algebra, and more. Distributed as a monorepo with individual npm packages.
- **API style:** Primarily imperative/functional over arrays and typed arrays. `@stdlib/stats/base/mean`, `@stdlib/stats/base/variance`, etc. Some streaming utilities exist (`@stdlib/stats/incr/*` — incremental statistics).
- **Dependencies:** Heavy — stdlib itself bundles many utilities and has inter-package dependencies. The full stdlib bundle is not zero-dependency.
- **TypeScript:** No — stdlib is authored in JavaScript with JSDoc. TypeScript definitions are available for some packages but not all.
- **Edge/browser:** Partial — some packages work in browsers; others require Node.js APIs. Not designed for Cloudflare Workers or Deno Deploy.
- **Lazy evaluation:** No in the array-based API. The `@stdlib/stats/incr/*` packages do provide incremental (streaming) statistics but they are separate standalone functions, not composable pipeline operators.

## Relevance to iterflow

stdlib is the most feature-complete existing JS statistics library and the closest to a "Python ecosystem" level of coverage. The paper must be precise about what iterflow offers differently:

1. **Zero dependencies:** stdlib is not zero-dependency. iterflow is.
2. **Composable pipeline:** stdlib's incremental stats (`incr*`) are standalone objects that must be manually connected to data sources. iterflow provides them as pipeline operators that chain with `map`, `filter`, `take`, etc.
3. **Edge runtime:** stdlib's full package works in Node.js; edge runtime compatibility is partial and not a design goal.
4. **TypeScript-first:** stdlib is JavaScript-first with optional types. iterflow's API is fully typed with no `any`.

The ecosystem table in the spec:

| Property | iterflow | @stdlib/stats |
|---|---|---|
| Zero dependencies | yes | no |
| Lazy evaluation | yes | no (incr* is streaming but not lazy pipeline) |
| Statistical terminals | yes | yes |
| TypeScript-first | yes | no |
| Works in edge/browser | yes | partial |

## Limitations / caveats

- The stdlib `@stdlib/stats/incr/*` streaming statistics (e.g., `incrMean`, `incrVariance`) do implement Welford's algorithm and are single-pass. The difference from iterflow is architectural (composability, not algorithm), not algorithmic.
- The "no" for TypeScript should be verified at submission time — stdlib has been actively adding TypeScript support.
- The benchmark 05 in `results.csv` compares iterflow against `@stdlib-imperative` and shows @stdlib is significantly faster (60,000–90,000 ops/sec vs iterflow's ~8,000–10,000 ops/sec). The paper must not hide this. The difference is the generator protocol overhead in iterflow. The paper's framing is: iterflow trades raw throughput for composability and memory efficiency; the benchmark validates this trade-off, not claims @stdlib is worse.

## Key claims supported

- "@stdlib/stats" row in ecosystem comparison table (spec §4).
- The gap claim: no existing library combines zero-dependency, lazy pipeline composition, and statistical terminals in a single coherent API.
- Benchmark 05 comparison data in `results.csv` is against stdlib.
