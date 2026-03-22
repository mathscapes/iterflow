# abraham2015 — Literature Review

**Citation key:** abraham2015
**Full reference:** Abraham, Mark James, Teemu Murtola, Roland Schulz, Szilárd Páll, Jeremy C. Smith, Berk Hess, and Erik Lindahl. "GROMACS: High Performance Molecular Simulations through Multi-Level Parallelism from Laptops to Supercomputers." *SoftwareX* 1–2 (2015): 19–25. DOI: 10.1016/j.softx.2015.06.001
**Zotero key:** 4EJPU8MC
**Source verified:** Full text retrieved from Zotero (PDF attached). Verified as a real SoftwareX paper (Volume 1–2, 2015, inaugural issue).

---

## What the paper establishes

Abraham et al. describe GROMACS 5, a molecular dynamics simulation package. This is an **exemplar SoftwareX paper**, not an algorithmic reference for iterflow.

The paper demonstrates the expected structure of a SoftwareX "Original Software Publication":

- **Code metadata table** (current version, repository URL, license, language, dependencies, documentation links, support contact).
- **Motivation and significance** section: establishes the scientific gap and why new software is needed.
- **Software description** section: architecture, algorithms, implementation choices.
- **Illustrative examples / performance:** benchmarks, scaling figures, comparison to alternatives.
- **Conclusions.**

Key structural features of the GROMACS paper relevant to iterflow:
1. The code metadata table is mandatory for SoftwareX and appears immediately after the abstract.
2. The paper mixes prose description with performance figures — exactly the format the iterflow paper needs.
3. The GROMACS paper is ~6 pages of body text (within the 2,000–4,000 word limit).
4. Open-source license (LGPL) is stated explicitly in both the text and metadata table.

## Relevance to iterflow

This is a **format reference**, not a content reference. The iterflow SoftwareX paper should follow the same structure:

- Code metadata table: version (1.0.0), npm registry URL, MIT license, TypeScript/JavaScript, zero runtime dependencies, link to README, support via GitHub Issues.
- Motivation section similar in brevity and specificity to GROMACS §1.
- Software description with architecture diagram or description (analogous to GROMACS Fig. 1 showing parallelism levels).

The iterflow paper may cite this as an example of the SoftwareX format, though this is not required. More importantly, reading this paper confirms the expected word count, figure density, and section structure.

## Limitations / caveats

- GROMACS is a large, complex scientific computing package. Iterflow is a small library. The paper's scope and claims must be proportionate; the iterflow paper should not attempt the same depth of performance analysis.
- The GROMACS paper uses many figures; iterflow will likely have fewer (code examples + benchmark table + ecosystem table). This is fine for a smaller library.
- This is a citation for format and journal context only. It should not appear in the iterflow paper's reference list unless the paper has a specific reason to cite it (e.g., contrasting scientific computing libraries with JS libraries).

## Key claims supported

- Confirms SoftwareX format expectations: code metadata table, motivation, description, examples, impact structure.
- Confirms the journal accepts short open-source software papers with benchmark data.
- Confirms open-source license statement is required.
