# lemire2006 — Literature Review

**Citation key:** lemire2006
**Full reference:** Lemire, Daniel. "Streaming Maximum-Minimum Filter Using No More than Three Comparisons per Element." *Nordic Journal of Computing* 13, no. 4 (2006): 328–339.
**Zotero key:** SDKRMNTX
**Source verified:** Metadata confirmed in Zotero; no PDF attached. No DOI in Zotero record. The article is available as arXiv preprint arXiv:cs/0610046, which contains the same content.

**Note on DOI:** Nordic Journal of Computing does not appear to have registered DOIs for this volume. The standard citation form is author/journal/volume/page. A preprint is available at https://arxiv.org/abs/cs/0610046.

---

## What the paper establishes

Lemire presents an algorithm for computing the running maximum and minimum over a sliding window of size k in O(1) amortized time per element (O(n) total for n elements), using a **monotonic deque** (double-ended queue):

- **Deque invariant (for running max):** The deque stores indices of elements in decreasing value order. When a new element arrives, all deque elements smaller than it are popped from the back. When the front element's index falls outside the current window, it is popped.
- **Result:** The front of the deque is always the index of the maximum element in the current window.

Lemire proves this achieves no more than three comparisons per element on average (across both enqueueing and dequeueing operations), making it O(n) regardless of window size k.

**The contrast with naive O(n·k):** A naive sliding window max requires scanning all k elements in the window for each new element — O(n·k) total. For large windows, this becomes the bottleneck. Lemire's deque is O(n) regardless of k.

## Relevance to iterflow

`windowedMin(size)` and `windowedMax(size)` implement Lemire's monotonic deque algorithm. The benchmark data confirms the theoretical crossover:

| Configuration | iterflow deque | naive O(n·k) |
|---|---|---|
| w=5, N=10K | 1,200 ops/sec | 6,750 ops/sec |
| w=50, N=10K | 1,491 ops/sec | 1,013 ops/sec |

At w=5 the constant-factor overhead of the deque implementation outweighs the asymptotic advantage (naive is faster). At w=50 the deque wins (1.47×). The crossover point is where the asymptotic O(n) vs O(n·k) advantage overcomes the constant factor — consistent with the algorithm's O(1) amortized claim.

## Limitations / caveats

- No PDF in Zotero. The preprint (arXiv cs/0610046) should be verified against the journal version for accuracy of claims. The preprint is widely cited and considered reliable.
- The paper addresses the *streaming* sliding window case (new elements arrive one at a time). iterflow's `windowedMin`/`windowedMax` fit this model exactly.
- The three-comparison bound is average-case; worst-case per element can be higher for adversarial inputs, but O(n) total is guaranteed.

## Key claims supported

- "Monotonic deque: O(1) amortized per element, vs O(n·k) naive scan" (spec §2, core algorithms table).
- The benchmark crossover at large window sizes is explained by the asymptotic complexity difference proven in this paper.
- Lemire 2006 is the primary citation for the deque-based windowed extrema algorithm.
