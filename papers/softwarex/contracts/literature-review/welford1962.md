# welford1962 — Literature Review

**Citation key:** welford1962
**Full reference:** Welford, B. P. "Note on a Method for Calculating Corrected Sums of Squares and Products." *Technometrics* 4, no. 3 (1962): 419–420. DOI: 10.1080/00401706.1962.10490022
**Zotero key:** C8IRWSET
**Source verified:** Full text retrieved from Zotero (PDF attached)

---

## What the paper establishes

Welford presents a single-pass iterative formula for computing the corrected sum of squares (i.e., the sum of squared deviations from the mean) without accumulating the raw sum of squares. The key recurrence is:

```
S_n = S_{n-1} + (n-1)/n * (x_n - m_{n-1})^2
m_n = m_{n-1} + (x_n - m_{n-1}) / n
```

where `m_n` is the running mean of the first `n` values and `S_n` is the running corrected sum of squares. The sample variance is `S_n / (n-1)`.

The motivation is numerical: the naive method (compute sum of squares, subtract n times the squared mean) suffers catastrophic cancellation when values are large relative to their spread. Welford's method avoids this — at no stage are significant figures lost, and each value is used only once and need not be stored.

The paper also derives the extension to corrected sums of products (covariance) and higher-order moments, though these are not the primary focus.

## Relevance to iterflow

`streamingMean()` and `streamingVariance()` implement Welford's algorithm directly. The O(1) memory property (maintaining only `n`, `mean`, `M2`) is what enables constant-memory variance computation over unbounded streams. `streamingZScore()` derives from the same state (`z = (x - mean) / sqrt(M2 / n)`).

The paper is the primary citation for iterflow's numerical stability claim: the implementation does not lose significant figures even over long sequences.

## Limitations / caveats

- The paper is 2 pages. It establishes the formula but provides no formal convergence proof, error bounds, or analysis of the algorithm's numerical behaviour beyond the qualitative argument. The formal analysis is in Chan, Golub, LeVeque 1982 (see `chan1982.md`).
- Welford's formula is numerically stable but not perfectly so in extreme cases (very large `n`, values near machine epsilon). Higham 2002 covers this comprehensively.

## Key claims supported

- "Welford's online algorithm: single-pass, numerically stable, O(1) memory" (spec §2, core algorithms table).
- iterflow's `streamingMean`, `streamingVariance`, `streamingZScore` are single-pass and O(1).
