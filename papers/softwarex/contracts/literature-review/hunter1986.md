# hunter1986 — Literature Review

**Citation key:** hunter1986
**Full reference:** Hunter, J. Stuart. "The Exponentially Weighted Moving Average." *Journal of Quality Technology* 18, no. 4 (1986): 203–210. DOI: 10.1080/00224065.1986.11979014
**Zotero key:** F48WSZSQ
**Source verified:** Full text retrieved from Zotero (PDF attached)

---

## What the paper establishes

Hunter presents and exposits the Exponentially Weighted Moving Average (EWMA) as a control chart technique with three key properties:

1. **Recursive update rule:** `EWMA_{t+1} = λ * x_t + (1 - λ) * EWMA_t`, where `λ ∈ (0, 1)` is the smoothing constant. The current EWMA contains all historical information; previous observations need not be stored.

2. **Relationship to other charts:** EWMA interpolates between the Shewhart chart (λ → 1, only the most recent point matters) and the CUSUM chart (λ → 0, all history weighted equally). The weighting function decays exponentially with observation age.

3. **Variance of the EWMA:** `Var(EWMA) = [λ / (2 - λ)] * σ²`, which enables analytical control limits.

4. **Dynamic process control:** The EWMA forecast (the predicted next value) can be used to close a feedback control loop — the key reason EWMA is used in real-time systems.

The paper also shows how to estimate λ from historical data using iterative least squares.

## Relevance to iterflow

`ewma(alpha)` in iterflow implements exactly Hunter's recursive formula, where `alpha` maps to `λ`. The O(1) memory property — the EWMA contains all historical information in a single scalar — is the direct justification for why EWMA is a natural streaming transform.

The paper is the canonical citation for the EWMA algorithm. It pre-dates the more widely cited Box-Jenkins treatments and is specifically focused on the discrete-time, single-value streaming context that matches iterflow's use case (latency monitoring, sensor smoothing, financial ticks).

## Limitations / caveats

- Hunter's treatment assumes normally distributed observations and focuses on quality control applications. The formula is general, but the control limit derivations are domain-specific.
- The paper does not address numerical stability of recursive EWMA computation; for very long sequences with extreme `λ` values near 0 or 1, accumulated floating-point error is theoretically possible, though rarely an issue in practice.
- Choosing `λ` is discussed but treated as application-dependent. iterflow exposes `alpha` as a required parameter, placing this decision with the user — consistent with Hunter's recommendation.

## Key claims supported

- `ewma(alpha)` implements single-pass O(1)-memory streaming computation: the EWMA scalar encodes all historical information, a property explicitly stated in Hunter (1986).
- The recursive update formula is from Hunter 1986, which is the standard reference in both quality control and time-series forecasting literature.
