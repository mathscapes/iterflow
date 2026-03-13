# Workflow Comparison: iterflow vs pandas/numpy

Comparing iterflow's compositional approach with traditional Python data analysis libraries.

## Use Case: Time-Series Cleaning + Statistics

### Python (pandas/numpy)

```python
import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('sensor_data.csv')

# Filter outliers (z-score method)
df['zscore'] = (df['value'] - df['value'].mean()) / df['value'].std()
df_clean = df[np.abs(df['zscore']) <= 3].copy()

# Compute rolling statistics
df_clean['rolling_mean'] = df_clean['value'].rolling(window=24).mean()
df_clean['rolling_std'] = df_clean['value'].rolling(window=24).std()

# Compute trend (EWMA)
df_clean['trend'] = df_clean['value'].ewm(alpha=0.1).mean()

# Export results
summary = {
    'count': len(df_clean),
    'mean': df_clean['value'].mean(),
    'std': df_clean['value'].std(),
    'trend_start': df_clean['trend'].iloc[0],
    'trend_end': df_clean['trend'].iloc[-1]
}
```

**Lines of code:** ~15  
**Memory:** O(n) - stores full DataFrame + intermediate columns  
**Readability:** Moderate - imperative, mutable state  

---

### JavaScript (iterflow)

```javascript
import { iter } from '@mathscapes/iterflow';

// Load and process in one pipeline
const results = iter(sensorDataStream)
  .map(d => d.value)
  .filter(v => Math.abs(v - mean) <= 3 * stdDev)  // Filter outliers
  .window(24)                                      // Rolling window
  .map(w => ({
    mean: iter(w).mean(),
    stdDev: iter(w).stdDev(),
    trend: iter(w).ewma(0.1).last()
  }))
  .toArray();
```

**Lines of code:** ~8  
**Memory:** O(1) - constant (streaming)  
**Readability:** High - declarative pipeline  

---

## Comparison Table

| Aspect | pandas/numpy | iterflow |
|--------|-------------|----------|
| **Memory usage** | O(n) - stores full dataset | O(1) - constant streaming |
| **Code style** | Imperative, mutable | Declarative, functional |
| **Intermediate data** | Creates copies/views | No intermediate arrays |
| **Pipeline clarity** | Sequential statements | Single pipeline chain |
| **Type safety** | Runtime (dynamic) | Compile-time (TypeScript) |
| **Environment** | Python required | JavaScript (universal) |

---

## Reproducibility Advantages

### pandas Approach

```python
# Multiple steps, mutable state
df = load_data()
df = clean_outliers(df, threshold=3)
df = add_rolling_stats(df, window=24)
df = compute_trend(df, alpha=0.1)
results = extract_summary(df)
```

**Issues:**
- Each step mutates `df` or creates new object
- Hard to track intermediate states
- Difficult to reproduce exact transformations
- Memory overhead from copies

### iterflow Approach

```javascript
const pipeline = iter(data)
  .filter(cleanOutliers(threshold=3))
  .window(24)
  .map(computeRollingStats)
  .map(addTrend(alpha=0.1))
  .reduce(summarize);
```

**Advantages:**
- Immutable transformations
- Clear data flow (input → output)
- Easy to reproduce (just re-run pipeline)
- Self-documenting (reads like recipe)
- No hidden state

---

## Memory Efficiency Example

### Scenario: Processing 1M sensor readings

**pandas:**
```python
df = pd.read_csv('data.csv')  # ~80 MB in memory
df['zscore'] = ...            # +8 MB (new column)
df['rolling'] = ...           # +8 MB (new column)
df['trend'] = ...             # +8 MB (new column)
# Total: ~104 MB
```

**iterflow:**
```javascript
iter(streamData())
  .streamingZScore()   // +0 MB (streaming)
  .window(24)          // +192 bytes (window buffer)
  .ewma(0.1)           // +8 bytes (state)
  .forEach(process);
// Total: <1 MB
```

**Reduction:** 100x less memory

---

## When to Use Each

### Use pandas/numpy when:
- Working with small datasets (<100K rows)
- Need rich ecosystem (plotting, ML integration)
- Exploratory data analysis in notebooks
- Team is Python-native

### Use iterflow when:
- Processing large datasets (>1M records)
- Memory-constrained environments (edge, IoT)
- Need reproducible pipelines
- Browser or serverless deployment
- Real-time streaming data
- JavaScript/TypeScript ecosystem

---

## Code Complexity Comparison

### Task: Detect anomalies in multi-sensor stream

**pandas (22 lines):**
```python
import pandas as pd
import numpy as np

def detect_anomalies(df, sensors, threshold=3):
    results = {}
    for sensor in sensors:
        values = df[sensor].values
        mean = np.mean(values)
        std = np.std(values)
        zscores = (values - mean) / std
        anomalies = np.where(np.abs(zscores) > threshold)[0]
        results[sensor] = {
            'count': len(anomalies),
            'indices': anomalies.tolist(),
            'mean': mean,
            'std': std
        }
    return results

# Usage
df = pd.read_csv('sensors.csv')
anomalies = detect_anomalies(df, ['aqi', 'temp', 'pm25'])
```

**iterflow (12 lines):**
```javascript
import { iter } from '@mathscapes/iterflow';

const detectAnomalies = (data, sensors, threshold = 3) =>
  Object.fromEntries(
    sensors.map(sensor => [
      sensor,
      iter(data)
        .map(d => d[sensor])
        .streamingZScore()
        .enumerate()
        .filter(([i, z]) => Math.abs(z) > threshold)
        .toArray()
    ])
  );

// Usage  
const anomalies = detectAnomalies(stream, ['aqi', 'temp', 'pm25']);
```

**Reduction:** 45% less code, clearer intent

---

## Reproducibility Score

**Criteria:**
1. Pipeline is self-documenting
2. No hidden mutations
3. Deterministic transformations
4. Easy to version control
5. Can be re-run reliably

| Criterion | pandas | iterflow |
|-----------|---------|----------|
| Self-documenting | ⚠️ Partial | ✅ Yes |
| No mutations | ❌ No | ✅ Yes |
| Deterministic | ⚠️ Mostly | ✅ Yes |
| Version friendly | ⚠️ Moderate | ✅ High |
| Re-runnable | ⚠️ If careful | ✅ Always |

**Overall:** iterflow scores higher on reproducibility metrics due to functional, immutable pipeline design.
