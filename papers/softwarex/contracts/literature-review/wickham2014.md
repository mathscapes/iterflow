# wickham2014 — Literature Review

**Citation key:** wickham2014
**Full reference:** Wickham, Hadley. "Tidy Data." *Journal of Statistical Software* 59, no. 10 (2014). DOI: 10.18637/jss.v059.i10
**Zotero key:** LDEAFNKK
**Source verified:** Metadata confirmed in Zotero; DOI resolves to jstatsoft.org. No PDF attached.

---

## What the paper establishes

Wickham introduces "tidy data" as a standard for structuring tabular datasets to facilitate analysis:

1. Each variable forms a column.
2. Each observation forms a row.
3. Each type of observational unit forms a table.

The paper argues that most data analysis time is spent reshaping data into a form suitable for computation, and that a principled standard reduces this friction. The paper also presents the `tidyr` R package as an implementation.

## Relevance to iterflow

This citation is **contextual / comparison-support**, not a direct algorithmic reference. It is used in the paper's comparison with Python/pandas:

- The `COMPARISON.md` (PR #14) compares iterflow pipelines against pandas workflows for a time-series analysis task. Pandas is designed around the tidy data paradigm: load a DataFrame, apply column-wise operations, reshape as needed.
- The comparison illustrates that for streaming numerical analysis, the tidy data model (which requires full materialization of the dataset into a rectangular structure) is a poor fit. iterflow operates directly over `Iterable<number>` without imposing a table structure.

The citation grounds the comparison in established data analysis philosophy, not just a feature comparison. The paper can reference Wickham to note that tidy data is the dominant paradigm in batch statistical computing, and iterflow addresses the use case where batch processing is not possible or desirable.

## Limitations / caveats

- Wickham's paper is about data *structure*, not algorithms or memory efficiency. The citation is appropriate for framing the pandas comparison but would be misused if cited to support any algorithmic claim about iterflow.
- The paper should not overstate the connection. Wickham 2014 is a supporting reference for the "ecosystem context" section, not a primary technical reference.
- The `COMPARISON.md` from PR #14 is the direct source for the "45% less code" and "100x memory reduction" claims. Wickham 2014 contextualizes *why* pandas requires more code (it is a tidy-data framework), not the quantitative comparison itself.

## Key claims supported

- Contextual framing for the pandas comparison (spec §4, "Comparison with Python/pandas").
- Establishes that the dominant Python data analysis paradigm (tidy data / pandas DataFrames) requires full dataset materialization, making the memory comparison meaningful.
