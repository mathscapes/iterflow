# SoftwareX Paper Spec: iterflow

**Target journal:** SoftwareX (Elsevier)
**Paper title:** "iterflow: Composable Streaming Statistics Pipelines for Memory-Efficient Data Analysis in JavaScript"

---

## Purpose of this document

This spec defines what the paper must demonstrate and proves. It is a requirements document, not the paper itself. It describes WHAT the paper must cover, which claims must be supported, and what the acceptance criteria are.

---

## 1. Motivation and Significance

### What the paper must establish

The paper must identify the gap that iterflow fills in the JavaScript ecosystem:

- ES2025 Iterator Helpers (`Iterator.prototype.map`, `.filter`, `.take`) provide lazy pipeline composition but have no statistical operations.
- Existing JS statistics libraries (`simple-statistics`, `@stdlib/stats`) are array-based and require full dataset materialization before computation.
- No existing JS library combines both: zero-dependency, lazy streaming composition with statistical terminals.

The paper must name the target environments where this gap matters:

- Edge compute (Cloudflare Workers, Deno Deploy): hard memory limits, no Node.js runtime.
- Browser: no heap profiler, memory budget unknown.
- IoT/embedded Node (Raspberry Pi, Arduino w/ Node): constrained heap.
- Serverless (Lambda): cold start cost scales with bundle size and heap usage.

### Claims to establish in this section

1. No zero-dependency streaming statistics library exists in the npm ecosystem as of v1.0.0 release (2024).
2. The JS iterator protocol (ES2015 `[Symbol.iterator]`) is a universal composition boundary available across all JS runtimes.
3. Composing lazy transforms with statistical terminals over the iterator protocol enables constant-memory computation over arbitrary-length sequences.

---

## 2. Software Description

### Architecture

The paper must describe the two-layer architecture:

**Layer 1: Transforms** (lazy, return `Iterflow<T>`)
- Each transform wraps a source iterable in a generator function.
- No element is computed until the terminal pull phase.
- Source: `src/transforms.ts`

**Layer 2: Terminals** (strict, consume the pipeline)
- `toArray()`, `reduce()`, `find()`, `forEach()`, `first()`, `last()`, `count()`, `some()`, `every()`
- Numerical: `sum()`, `mean()`, `median()`, `min()`, `max()`, `variance()`, `stdDev()`
- Source: `src/terminals.ts`

**Entry point:** `iter(src)` factory wraps any `Iterable<T>` in an `Iterflow<T>` instance.

### Core algorithms

The paper must describe these three algorithms by name, explaining why each was chosen:

| Algorithm | Used for | Why |
|---|---|---|
| Welford's online algorithm | `streamingMean()`, `streamingVariance()`, `streamingZScore()` | Single-pass, numerically stable, O(1) memory |
| Quickselect (Floyd-Rivest variant) | `median()` terminal | O(n) average-case without sorting |
| Monotonic deque | `windowedMin()`, `windowedMax()` | O(1) amortized per element, vs O(n·k) naive scan |

Source references: `src/transforms.ts` (Welford, deque), `src/terminals.ts` (Quickselect).

### Full API surface

The paper must enumerate all public methods. These are the method names as of v1.0.0:

**Transforms:** `map`, `filter`, `flatMap`, `take`, `drop`, `takeWhile`, `dropWhile`, `distinct`, `enumerate`, `concat`, `window`, `chunk`, `zip`

**Streaming stats (transform, emit one value per input):** `streamingMean`, `streamingVariance`, `ewma`, `streamingCovariance`, `streamingCorrelation`, `streamingZScore`, `windowedMin`, `windowedMax`

**Terminals:** `toArray`, `reduce`, `find`, `forEach`, `first`, `last`, `count`, `some`, `every`, `sum`, `mean`, `median`, `min`, `max`, `variance`, `stdDev`

Source: `src/index.ts`

### Design constraints

The paper must state these as explicit design goals, not incidental properties:

- Zero runtime dependencies (verified: `package.json` `dependencies` field is empty).
- TypeScript-first: all public methods are fully typed with no `any` in the public API.
- No configuration: the API has no global state, no initialization step.
- Works in any JS runtime implementing the iterator protocol (Node.js, Deno, Bun, browsers, edge workers).

---

## 3. Illustrative Examples

The paper must include at minimum four code examples. Each example must be self-contained, runnable, and demonstrate a different capability.

### Example 1: Environmental sensor anomaly detection

**File to reference:** `examples/04-sensor-anomaly-detection.ts` and PR #14 `examples/environmental/air-quality-monitoring.js`

**What it must demonstrate:**
- Windowed statistics over a real-world stream (AQI/sensor readings).
- The pipeline processes readings as they arrive without accumulating the full history.
- Anomaly flagging using rolling mean and standard deviation.

**Key claim:** The pipeline works over any `Iterable`, including async generators wrapping live sensor APIs (show the structural equivalence even if the example uses a static array).

### Example 2: Streaming z-score anomaly detection

**File to reference:** `examples/11-zscore-anomaly-detection.ts`

**What it must demonstrate:**
- `streamingZScore()` emits a z-score for each value using Welford's running mean and variance.
- No buffer required: the algorithm maintains only three numbers (count, mean, M2).
- Application: latency spike detection in production systems.

**Key claim:** The same pipeline logic applies to network latency, financial tick data, and sensor streams — the domain is irrelevant because the abstraction is over `Iterable<number>`.

### Example 3: Memory comparison (1M records)

**File to reference:** `benchmarks/03-memory-efficiency.bench.ts`

**What it must demonstrate:**
- Processing 1M records with `filter().map().take()`:
  - iterflow: constant heap, no intermediate arrays allocated.
  - Native array: three intermediate arrays created (`filter`, `map`, `slice`).
- GC event reduction: iterflow generates fewer GC events under the same workload.

**Concrete numbers to include (from benchmark infrastructure; run to get exact values):**
- Expected: ~50% fewer GC events for iterflow vs native at N=100K (per benchmark README).
- Memory delta: iterflow heap delta is near-zero; native heap delta scales with N.

**Note:** The paper must report actual measured values from running `benchmarks/03-memory-efficiency.bench.ts` on the paper's reference hardware, not estimated values.

### Example 4: Reproducible analysis workflow

**File to reference:** PR #14 `examples/workflows/timeseries-template.js`

**What it must demonstrate:**
- A complete analysis workflow that can be run with `node timeseries-template.js` and produces identical results on any run (deterministic input, no randomness).
- Pipeline stages are composable and reorderable without changing the algorithm.
- The workflow documents its own structure through method chaining (no intermediate variable names needed).

---

## 4. Impact

### Performance claims (all must be sourced from `benchmarks/results.csv`)

The paper must include a performance table. These values come from `benchmarks/results.csv`:

**Lazy evaluation crossover (Benchmark 01):**

| N | iterflow (ops/sec) | native array (ops/sec) | winner |
|---|---|---|---|
| 100 | 78,113 | 1,823,279 | native |
| 10,000 | 7,851 | 13,316 | native |
| 100,000 | 8,088 | 442 | **iterflow** |
| 1,000,000 | 7,922 | 27 | **iterflow** |

The paper must explain the crossover: at small N, generator protocol overhead dominates. At large N, native array `.filter().map()` creates intermediate arrays that exhaust memory and trigger GC.

**Windowed extrema (Benchmark 04) — monotonic deque vs naive O(n·k):**

| Window size | iterflow deque (ops/sec) | naive (ops/sec) | speedup |
|---|---|---|---|
| w=5, N=10K | 1,200 | 6,750 | naive faster |
| w=50, N=10K | 1,491 | 1,013 | **iterflow 1.47x** |

The paper must explain the asymptotic crossover: deque is O(n) regardless of window size; naive is O(n·k). At large k the deque dominates.

**Streaming z-score vs naive two-pass (Benchmark 04):**
- iterflow: 182 ops/sec at N=100K
- naive: 646 ops/sec at N=100K
- The paper must explain: iterflow trades throughput for O(1) memory and single-pass semantics, which is the correct trade-off for unbounded streams where the full dataset never exists.

**Streaming correlation (Benchmark 02):**
- iterflow: 1,552 ops/sec at N=10K
- naive two-pass: 2.30 ops/sec at N=10K
- iterflow is ~674x faster because it avoids materializing two full arrays and computing covariance in a second pass.

### Comparison with Python/pandas

**Source:** PR #14 `examples/workflows/COMPARISON.md`

The paper must include the comparison table from that file. Expected values (confirm against actual file when PR #14 is merged):
- 45% less code than equivalent pandas for the same analysis pipeline.
- 100x memory reduction vs pandas for 1M numeric records (5 MB vs ~500 MB).

**Caveat the paper must state:** The comparison is against pandas batch processing. NumPy and pandas also have streaming options (chunked reads); the comparison is against the idiomatic pandas workflow, not the most optimized possible pandas code.

### Ecosystem positioning

The paper must include a short comparison table:

| Property | iterflow | simple-statistics | @stdlib/stats | RxJS |
|---|---|---|---|---|
| Zero dependencies | yes | yes | no | no |
| Lazy evaluation | yes | no | no | yes |
| Statistical terminals | yes | yes | yes | no |
| TypeScript-first | yes | partial | no | yes |
| Works in edge/browser | yes | yes | partial | yes |

Source: package.json files of each library (verify at submission time).

---

## 5. Conclusions

The paper must conclude with these claims:

1. **Reproducibility:** Functional pipelines over immutable iterators produce identical results for identical inputs. No shared state, no side effects in transforms.

2. **Universality:** The iterator protocol (`[Symbol.iterator]`) is the common interface across Node.js, Deno, Bun, browsers, and edge runtimes. iterflow requires nothing beyond this protocol.

3. **Memory model:** Streaming computation enables processing datasets larger than available heap, which is impossible with array-based stats libraries.

4. **Composability:** The transform/terminal separation mirrors the Unix pipe model: each stage does one thing, and stages compose without coordination.

---

## 6. Functional Requirements

### Sections that must appear in the paper

- [ ] Abstract (250 words max for SoftwareX)
- [ ] Keywords (5–8, must include: streaming statistics, lazy evaluation, JavaScript, iterator protocol, memory efficiency)
- [ ] Motivation and Significance
- [ ] Software Description
  - [ ] Software Architecture subsection
  - [ ] Sample Code Snippet (SoftwareX requirement: at least one runnable example in the paper body)
- [ ] Illustrative Examples
- [ ] Impact
- [ ] Conclusions
- [ ] Conflict of Interest statement
- [ ] References

### SoftwareX-specific requirements

- Paper length: 2,000–4,000 words (body text, excluding code and references).
- All code examples must be runnable against the published npm package (`@mathscapes/iterflow@1.0.0`).
- Software must be archived in Zenodo or equivalent with a DOI.
- Software must be under an open-source license (MIT, per `package.json`).
- GitHub repository must be public with a clear README.

### Reproducibility criteria

Every numerical claim in the paper must satisfy one of:
1. Directly sourced from `benchmarks/results.csv` (exact value, cite benchmark file and hardware).
2. Computed from `benchmarks/results.csv` (show formula).
3. From PR #14 `examples/workflows/COMPARISON.md` (cite file and methodology).
4. From running a benchmark file with documented hardware and Node.js version.

No estimated or approximate claims without a corresponding benchmark source.

---

## 7. Assumptions

- PR #14 will be merged before paper submission. All PR #14 files are treated as part of the v1.0.0 codebase.
- Benchmark results in `benchmarks/results.csv` were collected on consistent hardware. The paper must document: CPU model, RAM, OS, Node.js version, and number of benchmark runs.
- The comparison values from `COMPARISON.md` are accurate. If the file contains different numbers than cited here, the file's values take precedence.
- `@mathscapes/iterflow@1.0.0` is the version the paper describes. If a v1.0.1+ is published before submission, the paper must target the published version.

---

## 8. Files to Reference During Writing

| Content needed | File |
|---|---|
| Full API surface | `src/index.ts` |
| Transform implementations (Welford, deque) | `src/transforms.ts` |
| Terminal implementations (Quickselect) | `src/terminals.ts` |
| Lazy evaluation benchmark data | `benchmarks/results.csv` (rows: `01-lazy-evaluation`) |
| Statistical operations benchmark data | `benchmarks/results.csv` (rows: `02-*`) |
| Memory/GC benchmark methodology | `benchmarks/03-memory-efficiency.bench.ts` |
| Windowed extrema benchmark data | `benchmarks/results.csv` (rows: `04-*`) |
| Sensor anomaly example | `examples/04-sensor-anomaly-detection.ts` |
| Z-score anomaly example | `examples/11-zscore-anomaly-detection.ts` |
| Environmental monitoring example | `examples/environmental/air-quality-monitoring.js` (PR #14) |
| Reproducible workflow example | `examples/workflows/timeseries-template.js` (PR #14) |
| Python comparison table | `examples/workflows/COMPARISON.md` (PR #14) |
