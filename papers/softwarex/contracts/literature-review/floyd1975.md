# floyd1975 — Literature Review

**Citation key:** floyd1975
**Full reference:** Floyd, Robert W., and Ronald L. Rivest. "Algorithm 489: The Algorithm SELECT — for Finding the ith Smallest of n Elements [M1]." *Communications of the ACM* 18, no. 3 (1975): 173. DOI: 10.1145/360680.360694
**Zotero key:** R6TNUAV5
**Source verified:** Full text and abstract retrieved from Zotero (PDF attached). DOI resolves to dl.acm.org.

---

## What the paper establishes

Floyd and Rivest present SELECT, an improved Quickselect algorithm that uses **recursive sampling** to choose a better pivot. The key innovation:

- Before partitioning X[L:R] around a pivot, SELECT recursively calls itself on a small sample of size `S ≈ √N` to estimate a good pivot element.
- The pivot is biased slightly so the target element is expected to fall in the smaller partition after splitting.
- This reduces the expected number of comparisons compared to Hoare's FIND, which chooses the pivot randomly from the full array.

**Empirical results (from the paper):**
| n | SELECT (avg, 25 trials) | FIND (Hoare) |
|---|---|---|
| 500 | 89 ms | 104 ms |
| 1,000 | 141 ms | 197 ms |
| 5,000 | 493 ms | 1,029 ms |
| 10,000 | 877 ms | 1,964 ms |

SELECT runs roughly 2× faster than FIND at n=10,000. The algorithm is proven to terminate (Sites 1974) and runs asymptotically proportional to N + min(I, N−I), where I is the rank of the target element.

## Relevance to iterflow

The spec explicitly names "Quickselect (Floyd-Rivest variant)" as the algorithm used for `median()`. This is the correct citation. Floyd-Rivest is the specific variant implemented in `src/terminals.ts`, chosen for its better average-case performance over Hoare's original.

The median terminal requires O(n) time and must materialize the full sequence (to partition and select). This is the one terminal in iterflow that is not O(1) memory — it must buffer all values. The paper must explain this trade-off: `median()` is still O(n) average-case without sorting (vs O(n log n) for sort-then-index), and Floyd-Rivest is the most practical known selection algorithm for this purpose.

## Limitations / caveats

- The published algorithm is in Algol (not strictly Algol 60). The iterflow implementation is a JavaScript adaptation; the paper should note this without claiming byte-for-byte equivalence.
- SELECT is not stable (it rearranges the input array). iterflow's `median()` converts the iterable to an array, applies selection in-place, and discards the array — so stability is irrelevant.
- Worst-case is still O(n²), though the sampling strategy makes this extremely unlikely in practice. For adversarial inputs this can be mitigated with shuffling, but iterflow does not add this.

## Key claims supported

- `median()` uses Floyd-Rivest SELECT: O(n) average-case, no full sort required.
- The algorithm is a named, citable improvement over Hoare's FIND with documented empirical speedup.
- This is the correct citation for the spec's "Quickselect (Floyd-Rivest variant)" claim.
