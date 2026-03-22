# zekollari2017 — Literature Review

**Citation key:** zekollari2017
**Full reference:** Zekollari, Harry. "TopoZeko: A MATLAB Function for 3-D and 4-D Topographical Visualization in Geosciences." *SoftwareX* 6 (2017): 285–292. DOI: 10.1016/j.softx.2017.10.004
**Zotero key:** NFLJBVQF
**Source verified:** Full text retrieved from Zotero (PDF attached). Verified as a real SoftwareX paper (Volume 6, 2017).

---

## What the paper establishes

Zekollari presents TopoZeko, a MATLAB function for 3-D and 4-D topographical visualization in geosciences. This is an **exemplar SoftwareX paper for a small, single-function library** — structurally analogous to iterflow.

Key structural features:
- **Scope:** A single MATLAB function (40 optional parameters, enumerated in Table 1). Much smaller than GROMACS; comparable in scope to a focused JS library like iterflow.
- **Code metadata table:** Version v1.0, MIT license, GitHub repository, MATLAB as sole language requirement, no compilation dependencies.
- **Motivation:** Identifies a specific gap (existing MATLAB plotting cannot combine different color schemes in a single 3-D figure) and fills it with a user-friendly function.
- **Software description:** How the function works (4-step internal process), parameter table (Table 1 — 40 optional parameters listed), and examples.
- **Impact and conclusions:** Practical utility statement, invitation for user feedback.
- **Paper length:** ~8 pages including figures and large parameter table. Body text is ~1,500–2,000 words.

Key observation: TopoZeko is cited by the authors across multiple papers. This is the same expectation for iterflow — the paper establishes a citable artifact for the library.

## Relevance to iterflow

This is the **most structurally analogous SoftwareX exemplar** to the iterflow paper. Both are:
- Single-purpose, open-source, MIT-licensed utilities
- Filling a specific gap in their ecosystem (visualization in MATLAB; streaming statistics in JavaScript)
- Targeting researchers and developers who need a specific capability without a large framework

Key lessons for the iterflow paper from Zekollari 2017:
1. A small library can be published in SoftwareX with a straightforward motivation and software description, without requiring novel algorithms.
2. The parameter table (Table 1) is analogous to iterflow's API surface table. Both enumerate the public interface.
3. The "motivation and significance" section is direct and specific — it names exactly what MATLAB cannot do natively and how TopoZeko addresses it.
4. Examples are the core of the paper — Zekollari shows 6 figures of visualizations. Iterflow needs equivalent code examples and benchmark figures.

## Limitations / caveats

- TopoZeko is a domain-specific visualization tool; iterflow is a general-purpose data processing library. The comparison is structural, not technical.
- Zekollari's paper includes only one benchmark (timing for matrix sizes, Fig. 7) — a simple runtime comparison. Iterflow has much richer benchmark data. This is an advantage, not a constraint.
- This is a format reference. It should not appear in the iterflow paper's reference list unless specifically cited for a cross-reference reason.

## Key claims supported

- Confirms SoftwareX publishes small, focused, single-author/single-function software papers.
- Sets expectations for the iterflow paper's scope, depth, and length.
- Confirms that the "software description" section should include an enumeration of the public API (analogous to iterflow's transform/terminal method lists).
