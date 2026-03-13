# iterflow v2.0 Paper Plan (SoftwareX Submission)

**Status:** Planning phase  
**Target:** SoftwareX (Q3, Elsevier)  
**Library version:** v2.0  
**v1 (Zenodo):** Remains published, not retracted

---

## Strategy

**Problem:** v1 already published on Zenodo. SoftwareX won't accept the same content.

**Solution:** Substantial additions that make v2 a significant research contribution beyond v1.

---

## v1 → v2 Additions (Required for SoftwareX)

### 1. Extended Benchmarks & Performance Analysis

**v1 had:** Basic benchmarks comparing to Lodash/RxJS  
**v2 adds:**
- Memory profiling (heap usage over time)
- Real-world datasets (not just synthetic)
- Benchmark suite against:
  - Python: pandas, numpy
  - R: dplyr, data.table
  - Other JS: stdlib, simple-statistics
- Performance breakdown: where does the overhead come from?
- Optimization strategies explored (and why current tradeoffs exist)

**Why this matters for SoftwareX:** Shows engineering rigor, honest assessment of tradeoffs.

---

### 2. Use Case Studies (Real Applications)

**v1 had:** API examples  
**v2 adds:**
- 3-5 real-world applications:
  1. Edge computing: sensor data processing
  2. Browser: real-time analytics dashboard
  3. Serverless: log analysis pipeline
  4. IoT: streaming environmental monitoring
  5. Financial: rolling stock indicators
- Each with:
  - Problem description
  - Why iterflow was chosen
  - Performance/memory measurements
  - Code snippets

**Why this matters:** Demonstrates practical value, not just theoretical tool.

---

### 3. Extended API (New Statistical Methods)

**v1 had:** Core streaming statistics (mean, variance, z-score, EWMA, covariance)  
**v2 adds:**
- Streaming quantiles (P² algorithm or t-digest)
- Streaming histogram
- Streaming skewness & kurtosis
- Streaming linear regression (online least squares)
- Auto-correlation functions
- Seasonal decomposition primitives

**Why this matters:** Shows library evolution, research contribution (implementing streaming algorithms).

---

### 4. Methodology Section (Research Contribution)

**v1 had:** API documentation  
**v2 adds:**
- **Design patterns:** Compositional streaming statistics (formal methodology)
- **Algorithm correctness:** Proofs/references for streaming algorithms (Welford, P², etc.)
- **Memory model:** Why constant memory vs batching
- **Comparison framework:** How to evaluate streaming stats libraries
- **Lazy evaluation theory:** When to evaluate vs when to defer

**Why this matters:** SoftwareX values **methodology**, not just tools.

---

### 5. Ecosystem Comparison (Cross-Language)

**v1 had:** Brief mention of alternatives  
**v2 adds:**
- **Comparison table:** iterflow vs pandas, dplyr, RxJS, stdlib
- **Feature matrix:** What each ecosystem offers
- **Performance comparison:** Apples-to-apples benchmarks
- **API design comparison:** Why compositional approach differs
- **When to use each:** Honest assessment of trade-offs

**Why this matters:** Shows awareness of research landscape, positions iterflow clearly.

---

### 6. Library Evolution (v1.0 → v2.0 Changes)

**Document:**
- What changed from v1.0 (Zenodo) to v2.0 (SoftwareX)
- New features added
- Performance improvements (if any)
- API refinements
- Breaking changes (if any)

**Why this matters:** Justifies v2 paper (not just republishing v1).

---

## SoftwareX Requirements Checklist

- [ ] **Original Software Publication:** ✅ Yes (v2.0 with substantial additions)
- [ ] **Code Availability:** ✅ GitHub + npm
- [ ] **Documentation:** ✅ README + API docs + examples
- [ ] **Impact Statement:** Why researchers/practitioners should use this
- [ ] **Software Metapaper:** 4-6 pages describing software (not full research paper)
- [ ] **Reproducibility:** Benchmarks + examples must be runnable
- [ ] **Novelty:** What's new beyond v1 (see additions above)

---

## Paper Structure (SoftwareX Format)

### Title
"iterflow v2.0: Composable Streaming Statistics for Memory-Efficient Data Analysis in JavaScript"

### Abstract
- Problem: Large-scale data processing in memory-constrained environments
- Solution: Compositional streaming statistics library
- v2 additions: Extended benchmarks, use cases, new algorithms, methodology
- Impact: Enables efficient statistical analysis in edge/browser/serverless contexts

### 1. Motivation & Significance
- Why streaming statistics matter
- JavaScript ecosystem gap
- v1 → v2 evolution

### 2. Software Description
- Architecture
- Core API
- Design patterns
- v2 additions (extended API)

### 3. Illustrative Examples
- Use case studies (5 real-world applications)
- Code snippets

### 4. Impact
- Who uses it (or would use it)
- Performance vs alternatives
- Memory efficiency gains

### 5. Conclusions
- Summary of contributions
- Future work

### 6. Conflict of Interest & Acknowledgments

---

## Implementation Plan

### Phase 1: Library Development (v2.0)
- [ ] Implement new streaming algorithms (quantiles, histogram, skewness, kurtosis, regression)
- [ ] Performance profiling & optimization
- [ ] Extended test suite
- [ ] Version bump to 2.0.0

### Phase 2: Research & Benchmarking
- [ ] Memory profiling framework
- [ ] Real-world dataset collection
- [ ] Cross-ecosystem benchmarks (Python, R, JS)
- [ ] Use case studies (5 applications)

### Phase 3: Paper Writing
- [ ] Methodology section (design patterns, algorithm correctness)
- [ ] Extended benchmarks section
- [ ] Use case studies section
- [ ] Ecosystem comparison section
- [ ] Full draft

### Phase 4: Submission
- [ ] Format for SoftwareX
- [ ] Reproducibility package (Docker + scripts)
- [ ] Submit

---

## Timeline Estimate

- **Library v2.0:** 2-3 weeks
- **Benchmarks & Use Cases:** 1-2 weeks
- **Paper writing:** 1-2 weeks
- **Review/revisions:** Variable
- **Total:** ~6-8 weeks to submission

---

## Success Criteria

**v2 paper will be accepted if:**
1. Substantial additions beyond v1 (✓ new algorithms, use cases, benchmarks)
2. Clear methodology contribution (✓ compositional streaming patterns)
3. Reproducible (✓ code + examples + benchmarks)
4. Honest assessment of tradeoffs (✓ performance vs memory)
5. Practical value demonstrated (✓ use case studies)

---

## Progress Tracker

### ✅ Day 1 Complete (2026-03-12)

**Environmental Monitoring Use Cases:**
- [x] Sensor data simulator (AQI, temperature, PM2.5 streams)
- [x] Air quality monitoring example (rolling stats, anomaly detection, EWMA)
- [x] Memory benchmark (streaming vs batch comparison)
- [x] Documentation (README with use cases and key findings)

**Results:**
- 1M sensor readings: 5 MB (streaming) vs 80 MB (batch)
- Real-world applications documented (smart cities, IoT, edge computing)
- Code ready for SoftwareX reproducibility requirements

**Branch:** `feat/v2-environmental-use-cases`

---

### 🔄 Day 2 TODO (Next)

**Reproducibility Workflows:**
- [ ] Create 3 analysis templates (time-series, anomaly detection, correlation)
- [ ] Write comparison section (iterflow vs pandas/numpy)
- [ ] Add "Reproducible Workflows" examples
- [ ] Document methodology (compositional patterns)
- [ ] Polish + format for paper

---

### 📋 Remaining for v2

- [ ] Library version bump to 2.0.0
- [ ] Paper writing (merge v1 + new content)
- [ ] Format for SoftwareX
- [ ] Reproducibility package (Docker + scripts)
- [ ] Submit

**Timeline:** On track for 48-hour completion
