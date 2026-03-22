# tc39iterators — Literature Review

**Citation key:** tc39iterators
**Full reference:** TC39. "ECMAScript Iterator Helpers Proposal." Stage 4, ES2025. GitHub: https://github.com/tc39/proposal-iterator-helpers
**Zotero key:** PJEXQPE4
**Source verified:** Metadata confirmed in Zotero; URL resolves. Zotero record has a note attachment. No PDF (web document).

---

## What this document establishes

The TC39 Iterator Helpers proposal (merged into ECMAScript 2025 as a Stage 4 standard) adds the following methods to `Iterator.prototype`:

- `map(fn)`, `filter(fn)`, `flatMap(fn)`: Lazy transforms.
- `take(n)`, `drop(n)`: Prefix/suffix slicing.
- `reduce(fn, init)`, `forEach(fn)`, `some(fn)`, `every(fn)`, `find(fn)`: Terminal consumers.
- `toArray()`: Materializes the iterator into an array.

These are lazy: the pipeline is not evaluated until a terminal (like `toArray()` or `reduce()`) is called. This matches the functional pipeline model.

**What the proposal does not include:** Statistical operations. There are no `mean()`, `variance()`, `median()`, `streamingZScore()`, or windowed operators. The proposal adds composition primitives but leaves numerical computation entirely to user code or libraries.

## Relevance to iterflow

This is the central ecosystem reference for iterflow's motivation. The spec's first gap claim is:

> "ES2025 Iterator Helpers provide lazy pipeline composition but have no statistical operations."

TC39 iterator helpers confirm the half of the picture that JavaScript now provides natively. iterflow is positioned as the statistical complement: it implements the same lazy pipeline model (wrapping `[Symbol.iterator]`) but adds the missing numerical terminals and streaming transforms.

The paper must cite this to establish that the gap is not one that the language itself is filling — the TC39 proposal is complete (Stage 4 = shipped), and statistical operations are not in scope.

## Limitations / caveats

- This is a GitHub repository / TC39 proposal, not a peer-reviewed paper. SoftwareX accepts software/web document references; cite as a misc/techreport entry.
- The proposal was Stage 4 (finalized) as of ES2025. At paper submission time, verify the spec URL points to the final ECMAScript spec text (tc39.es/ecma262) rather than the proposal repository, if the journal prefers standards citations over GitHub.
- Iterator Helpers availability: as of 2024, available in V8 (Chrome/Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari). Edge workers (Cloudflare Workers) may lag behind; verify runtime availability claims in the paper.

## Key claims supported

- "ES2025 Iterator Helpers provide lazy pipeline composition but have no statistical operations" — the gap that motivates iterflow.
- iterflow's API is a superset of the iterator helper pattern: same lazy composition model, extended with statistical operators.
- The `[Symbol.iterator]` protocol (ES2015) is the universal composition boundary; Iterator Helpers (ES2025) formalize it further.
