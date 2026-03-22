# hoare1961 — Literature Review

**Citation key:** hoare1961
**Full reference:** Hoare, C. A. R. "Algorithm 65: Find." *Communications of the ACM* 4, no. 7 (1961): 321–322. DOI: 10.1145/366622.366647
**Zotero key:** P4GIYSFW
**Source verified:** Full text retrieved from Zotero (PDF attached — the original CACM algorithms section, pp. 319–322, containing Algorithms 61–67)

---

## What the paper establishes

Hoare presents three related algorithms in a single CACM note:

- **Algorithm 63 (PARTITION):** Rearranges an array around a pivot so all elements ≤ pivot are left, all ≥ pivot are right. This is the partition step used in Quicksort and Quickselect.
- **Algorithm 64 (QUICKSORT):** The full sorting algorithm. Average O(n log n) comparisons, no extra space required.
- **Algorithm 65 (FIND):** Given array A[M:N] and index K, rearranges A so that A[K] contains the value it would have in a sorted array, using recursive partition. This is the original Quickselect algorithm.

The FIND algorithm has average-case O(n) time but worst-case O(n²). The pivot is chosen randomly, which makes the worst case unlikely in practice but not impossible.

## Relevance to iterflow

`median()` in iterflow uses Quickselect (specifically the Floyd-Rivest variant — see `floyd1975.md`) to find the median without sorting the full array. Hoare 1961 is the foundational citation for the selection problem and the partition-based approach.

The paper must cite both Hoare 1961 (the original algorithm) and Floyd & Rivest 1975 (the improved variant actually implemented) to accurately describe the lineage. Citing only one would be incomplete.

## Limitations / caveats

- The FIND algorithm as published by Hoare uses a random pivot and is not the exact algorithm implemented in iterflow. The Floyd-Rivest variant (1975) improves average-case performance through sampling-based pivot selection. Iterflow uses Floyd-Rivest; Hoare is cited for intellectual lineage.
- The paper is a 2-page algorithms note, not a full analysis. No formal complexity proof is given; Hoare notes only that the average number of comparisons is proportional to n.
- The full text in Zotero contains Algorithms 61–67 from that issue; Algorithm 65 is on page 321.

## Key claims supported

- `median()` uses a Quickselect-family algorithm: O(n) average-case, no sorting required.
- The selection problem (finding the kth smallest element) is solvable in expected O(n) time — established by Hoare 1961 and improved by Floyd-Rivest 1975.
