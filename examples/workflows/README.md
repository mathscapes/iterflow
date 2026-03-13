# Reproducible Analysis Workflows

Reusable analysis templates demonstrating iterflow's compositional approach to reproducible data science.

## Philosophy

**Workflows should be:**
1. **Readable** - Code documents the analysis process
2. **Reproducible** - Same input → same output, always
3. **Composable** - Build complex pipelines from simple operations
4. **Memory-efficient** - Handle large datasets on constrained hardware

## Available Templates

### 1. Time-Series Analysis (`timeseries-template.js`)

**Purpose:** Analyze temporal data with trend detection and seasonal pattern recognition.

**Steps:**
1. Load data
2. Clean outliers (z-score filtering)
3. Compute trend (EWMA)
4. Detrend and analyze residuals
5. Calculate rolling statistics
6. Export results

**Use cases:**
- Climate data analysis
- Stock price analysis
- Sensor trend monitoring
- Energy consumption patterns

**Run:**
```bash
node examples/workflows/timeseries-template.js
```

**Example output:**
```
Time-Series Analysis: Climate Data

Original Data:
  Count: 1000
  Mean: 20.15°C
  Std Dev: 8.42°C
  Range: -5.23°C - 45.67°C

Data Cleaning:
  Outliers removed: 18 (1.80%)

Trend Analysis (EWMA):
  Initial: 19.23°C
  Final: 21.45°C
  Change: +11.54%
```

---

### 2. Anomaly Detection (`anomaly-detection-template.js`)

**Purpose:** Detect outliers using multiple statistical methods.

**Methods:**
- **Z-score** - Statistical distance from mean
- **Moving Average Deviation** - Deviation from local average
- **Interquartile Range (IQR)** - Quartile-based outlier detection

**Consensus detection:** Flag points identified by ≥2 methods

**Use cases:**
- Network traffic anomalies
- Fraud detection
- Equipment failure prediction
- Quality control

**Run:**
```bash
node examples/workflows/anomaly-detection-template.js
```

---

### 3. Correlation Analysis (`correlation-template.js`)

**Purpose:** Analyze relationships between multiple variables.

**Features:**
- Correlation matrix computation
- Streaming correlation (windowed)
- Significance testing
- Strong correlation identification

**Use cases:**
- Multi-sensor correlation studies
- Feature relationship analysis
- Environmental pattern detection
- Predictive modeling prep

**Run:**
```bash
node examples/workflows/correlation-template.js
```

---

## Comparison with Traditional Approaches

See [`COMPARISON.md`](./COMPARISON.md) for detailed comparison with pandas/numpy.

**Summary:**
- **45% less code** for equivalent workflows
- **100x less memory** for large datasets
- **Higher reproducibility** due to functional design
- **Universal runtime** (works anywhere JavaScript runs)

---

## Reproducibility Benefits

### 1. Self-Documenting Pipelines

```javascript
// Workflow is explicit in code
const analysis = iter(data)
  .filter(outlierRemoval(threshold=3))
  .window(24)
  .map(computeStats)
  .reduce(summarize);
```

The pipeline *is* the documentation. No separate "methods" section needed.

### 2. Immutable Transformations

```javascript
// Original data unchanged
const cleaned = iter(rawData).filter(isValid);
const normalized = iter(cleaned).map(normalize);

// Can re-run any step
const reprocessed = iter(rawData).filter(isValid);
```

Every transformation produces new data. No hidden mutations.

### 3. Versioned Workflows

```javascript
// Git-friendly: workflows are just functions
export const analysisV1 = data => iter(data)
  .filter(basic)
  .map(simple);

export const analysisV2 = data => iter(data)
  .filter(advanced)
  .window(50)
  .map(complex);
```

Easy to version, compare, and reproduce historical analyses.

---

## Best Practices

### DO: Chain operations functionally

```javascript
✅ iter(data)
  .filter(clean)
  .map(transform)
  .reduce(aggregate)
```

### DON'T: Store intermediate results unnecessarily

```javascript
❌ const step1 = iter(data).filter(clean).toArray();
   const step2 = iter(step1).map(transform).toArray();
   const step3 = iter(step2).reduce(aggregate);
```

### DO: Extract reusable transformations

```javascript
✅ const cleanOutliers = threshold => v => Math.abs(v - mean) <= threshold * std;
   const normalize = v => (v - min) / (max - min);
   
   iter(data)
     .filter(cleanOutliers(3))
     .map(normalize)
```

### DO: Document parameters clearly

```javascript
✅ function analyzeTimeSeries(data, {
     alpha = 0.1,           // EWMA smoothing factor
     outlierThreshold = 3,  // Z-score threshold
     windowSize = 24        // Rolling window size
   } = {}) { ... }
```

---

## Integration with Research Workflows

### 1. Jupyter-style Notebook Integration

```javascript
// Each cell is a pipeline step
const raw = loadData('sensor.csv');
const clean = iter(raw).filter(isValid);
const stats = iter(clean).map(compute);
const viz = plot(stats.toArray());
```

### 2. Automated Report Generation

```javascript
const report = generateReport({
  data: sensorStream,
  workflows: [
    timeSeries({ alpha: 0.1 }),
    anomalyDetection({ threshold: 3 }),
    correlation(['temp', 'humidity'])
  ]
});
```

### 3. Continuous Monitoring

```javascript
// Live dashboard with reproducible transforms
setInterval(() => {
  const stats = iter(liveStream)
    .take(1000)
    .window(60)
    .map(computeMetrics)
    .last();
  
  dashboard.update(stats);
}, 60000);
```

---

## Performance Notes

All templates process data in streaming fashion:

- **Memory:** O(1) constant (except final `.toArray()`)
- **Throughput:** 10,000+ records/sec on modest hardware
- **Scalability:** Can process millions of records without OOM

For best performance:
- Avoid `.toArray()` until final step
- Use `.forEach()` for side effects (logging, streaming output)
- Chain operations to minimize intermediate allocations

---

## Citation

When using these workflows in research, please cite:

```bibtex
@software{iterflow2024,
  title={iterflow: Composable Streaming Statistics for JavaScript},
  author={Singh, Gaurav},
  year={2024},
  url={https://github.com/mathscapes/iterflow}
}
```

---

## Contributing

Have a workflow template to share? Submit a PR following this structure:

1. Single-file template with clear documentation
2. Example usage with realistic data
3. README entry explaining use case
4. Comparison with traditional approach (optional)
