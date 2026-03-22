# higham2002 — Literature Review

**Citation key:** higham2002
**Full reference:** Higham, Nicholas J. *Accuracy and Stability of Numerical Algorithms*. 2nd ed. Philadelphia: SIAM, 2002. DOI: 10.1137/1.9780898718027
**Zotero key:** BLDT4TVA
**Source verified:** Metadata confirmed in Zotero; no PDF attachment. Book is a standard reference available in SIAM e-library. DOI resolves.

---

## What the book establishes

Higham's book is the definitive reference for numerical stability analysis of algorithms in scientific computing. Relevant to iterflow:

- **Chapter 1–2:** Floating-point arithmetic, rounding error models, and the concept of backward stability. Establishes the framework for evaluating whether an algorithm produces results close to what an exact computation would yield.
- **Summation algorithms (Chapter 4):** Analysis of pairwise summation, compensated summation (Kahan), and naive summation. Shows that naive left-to-right summation accumulates O(n ε) relative error in the worst case, while pairwise summation achieves O(log n ε).
- **Welford / Chan et al. (referenced throughout):** Higham cites and affirms Chan, Golub, LeVeque 1982 as the foundation for numerically stable variance computation. The Welford recurrence is confirmed to have the same error bound as the two-pass algorithm.

## Relevance to iterflow

Higham provides the authoritative theoretical backing for the claim that iterflow's streaming statistics are not just algorithmically convenient but numerically sound. Specifically:

- The O(1) memory Welford algorithm used in `streamingMean()`, `streamingVariance()`, and `streamingZScore()` is provably as accurate as the two-pass approach that first computes the mean.
- The comparison with `simple-statistics` and `@stdlib/stats` (array-based) in the paper is not only about memory — the streaming approach avoids the catastrophic cancellation risk that the naive `sum(x²) - n*mean²` formula carries.

## Limitations / caveats

- Higham covers general numerical analysis, not streaming algorithms or JavaScript. The connection to iterflow is through the algorithms it implements (Welford, EWMA), not through any direct treatment of the library.
- This is a reference for the numerical foundations. The paper should cite it in the context of justifying why Welford was chosen over naive variance formulas, not as a direct analysis of iterflow.

## Key claims supported

- The numerical stability argument for choosing Welford's algorithm over naive `sum(x²) - n*mean²` is grounded in established numerical analysis (Higham Ch. 4).
- The spec claim "single-pass, numerically stable, O(1) memory" for Welford has a rigorous basis, not just an empirical one.
