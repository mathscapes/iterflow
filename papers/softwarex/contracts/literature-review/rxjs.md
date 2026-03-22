# rxjs — Literature Review

**Citation key:** rxjs
**Full reference:** RxJS Contributors. *RxJS: Reactive Extensions Library for JavaScript*. 2024. https://rxjs.dev
**Zotero key:** BXFQEVPN
**Source verified:** Metadata confirmed in Zotero; URL resolves. No PDF (web document).

---

## What RxJS is

RxJS implements the ReactiveX pattern for JavaScript: asynchronous event streams composed with operators. Key characteristics:

- **Observable/Observer pattern:** Push-based (the source pushes values to subscribers). This is the fundamental difference from iterflow's pull-based iterator protocol.
- **Operators:** `map`, `filter`, `take`, `mergeMap`, `scan` (running accumulation), `bufferTime`/`bufferCount` (windowing). The operator set is large and covers many of the same composition patterns as iterflow.
- **Statistical operators:** RxJS does not include statistical terminals (`mean`, `variance`, `median`, etc.) in its core. Users combine `scan` with manual accumulators.
- **Dependencies:** RxJS is not zero-dependency. The library itself is large (v7: ~220KB minified). It is not designed for edge/serverless environments where bundle size matters.
- **TypeScript:** RxJS is TypeScript-first and fully typed.

## Relevance to iterflow

The spec's ecosystem comparison table includes RxJS:

| Property | iterflow | RxJS |
|---|---|---|
| Zero dependencies | yes | no |
| Lazy evaluation | yes | yes (push-based) |
| Statistical terminals | yes | no |
| TypeScript-first | yes | yes |
| Works in edge/browser | yes | yes |

The paper must distinguish iterflow from RxJS on two axes:

1. **Pull vs. push:** iterflow is pull-based (iterator protocol). Computation happens only when a terminal requests values. RxJS is push-based (Observables emit when they have data). For batch/analytical workloads over synchronous data, pull-based is simpler and avoids the subscription/teardown complexity of Observables.

2. **Statistical operators:** RxJS has none built-in. A user wanting streaming variance in RxJS must implement Welford manually in a `scan` operator. iterflow provides this directly.

## Limitations / caveats

- RxJS is a much larger and more mature project than iterflow. The comparison is legitimate for the specific use case (analytical pipelines over synchronous iterables), not a general claim of superiority.
- The "no statistical terminals" claim about RxJS should be verified at submission time — community packages may provide this, but it is not in the core library.
- RxJS's `scan` operator is semantically equivalent to iterflow's `reduce` combined with intermediate emission. The paper should not misrepresent this overlap.

## Key claims supported

- RxJS row in the ecosystem comparison table (spec §4): lazy evaluation yes, statistical terminals no, zero dependencies no.
- The distinction between push-based reactive streams (RxJS) and pull-based lazy iterators (iterflow) is a meaningful architectural difference, not just superficial.
