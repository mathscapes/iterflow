# dunning2019 — Literature Review

**Citation key:** dunning2019
**Full reference:** Dunning, Ted, and Otmar Ertl. "Computing Extremely Accurate Quantiles Using t-Digests." arXiv:1902.04023 [cs.DS], 2019.
**Zotero key:** 8M9NYMVX
**Source verified:** Metadata confirmed in Zotero (arXiv ID: 1902.04023); no PDF attached. Paper is publicly available at arxiv.org/abs/1902.04023.

---

## What the paper establishes

Dunning and Ertl introduce the t-digest, a data structure for approximate quantile estimation over streaming data. Key properties:

- **Mergeability:** Multiple t-digests can be merged without accessing the original data — useful for distributed systems.
- **Space:** O(1/δ) where δ controls accuracy. Much smaller than storing all data.
- **Accuracy:** Error is concentrated near the tails (quantiles near 0 and 1), where accuracy matters most for anomaly detection. The median estimate has higher relative error than tail quantiles.
- **Algorithm:** Maintains a set of weighted centroids (clusters of nearby values). New values are merged into the nearest centroid if the centroid's weight stays within a scale-function bound.

## Relevance to iterflow

The t-digest represents the class of **approximate streaming quantile algorithms** — the alternative design space that iterflow explicitly chose not to occupy. iterflow's `median()` terminal is exact (Floyd-Rivest on the full buffered sequence) rather than approximate.

This citation belongs in the paper's Related Work or Software Description section, specifically when explaining the design choice to use exact median over approximate streaming median:

> "Approximate streaming quantile algorithms such as the t-digest [dunning2019] provide O(1) memory at the cost of approximation error. iterflow's `median()` terminal opts for exact computation (Floyd-Rivest SELECT, O(n) average-case) over approximation, accepting that median requires materializing the full sequence."

## Limitations / caveats

- t-digest is not implemented in iterflow and is not the algorithm being described. It is cited as context for the design space.
- The paper is an arXiv preprint (as of 2026). It has not been published in a peer-reviewed journal, though it is widely cited in systems literature (Apache Cassandra, Elasticsearch, etc. use t-digest). Verify citation status at submission time.
- The claim about t-digest's accuracy near the median is stated in the paper but the specific error bound depends on the implementation's compression parameter.

## Key claims supported

- Contextualizes the trade-off between exact and approximate streaming quantiles.
- Supports the paper's explanation of why `median()` buffers data — not because iterflow is unaware of streaming alternatives, but because the design prioritizes exactness.
