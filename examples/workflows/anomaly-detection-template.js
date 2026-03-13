/**
 * Anomaly Detection Template
 * 
 * Reusable workflow for detecting outliers in streaming data.
 * Multiple detection methods for different use cases.
 * 
 * Methods:
 * 1. Statistical (z-score based)
 * 2. Moving average deviation
 * 3. Interquartile range (IQR)
 */

import { iter } from '../../src/index.js';

/**
 * Statistical anomaly detection using streaming z-scores
 */
export function detectAnomaliesZScore(data, options = {}) {
  const {
    threshold = 3.0,  // Standard deviations from mean
    minSamples = 10   // Minimum samples before detection
  } = options;
  
  const anomalies = iter(data)
    .streamingZScore()
    .enumerate()
    .filter(([idx, zscore]) => 
      idx >= minSamples && 
      !isNaN(zscore) && 
      Math.abs(zscore) > threshold
    )
    .toArray();
  
  return {
    method: 'z-score',
    threshold,
    count: anomalies.length,
    indices: anomalies.map(([idx]) => idx),
    scores: anomalies.map(([idx, score]) => ({ index: idx, zscore: score }))
  };
}

/**
 * Moving average deviation method
 */
export function detectAnomaliesMAD(data, options = {}) {
  const {
    windowSize = 50,
    threshold = 3.0
  } = options;
  
  const dataArray = Array.from(data);
  const anomalies = [];
  
  // Compute moving average and std dev
  for (let i = windowSize; i < dataArray.length; i++) {
    const window = dataArray.slice(i - windowSize, i);
    const stats = iter(window);
    const mean = stats.mean();
    const stdDev = stats.stdDev();
    
    const current = dataArray[i];
    const deviation = Math.abs(current - mean) / stdDev;
    
    if (deviation > threshold) {
      anomalies.push({
        index: i,
        value: current,
        deviation,
        windowMean: mean,
        windowStdDev: stdDev
      });
    }
  }
  
  return {
    method: 'moving-average-deviation',
    windowSize,
    threshold,
    count: anomalies.length,
    anomalies
  };
}

/**
 * Interquartile range (IQR) method
 */
export function detectAnomaliesIQR(data, options = {}) {
  const {
    multiplier = 1.5  // IQR multiplier (1.5 = standard, 3.0 = extreme)
  } = options;
  
  const values = Array.from(data);
  const sorted = [...values].sort((a, b) => a - b);
  
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - (multiplier * iqr);
  const upperBound = q3 + (multiplier * iqr);
  
  const anomalies = values
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => value < lowerBound || value > upperBound);
  
  return {
    method: 'iqr',
    multiplier,
    q1,
    q3,
    iqr,
    lowerBound,
    upperBound,
    count: anomalies.length,
    anomalies
  };
}

/**
 * Combined anomaly detection pipeline
 */
export function detectAnomaliesAll(data, options = {}) {
  const dataArray = Array.from(data);
  
  console.log('Running multiple anomaly detection methods...\n');
  
  // Method 1: Z-score
  const zscoreResults = detectAnomaliesZScore(dataArray, {
    threshold: options.zscoreThreshold || 3.0
  });
  
  console.log(`Z-Score Method (threshold: ±${zscoreResults.threshold}σ):`);
  console.log(`  Anomalies detected: ${zscoreResults.count}`);
  
  // Method 2: Moving average deviation
  const madResults = detectAnomaliesMAD(dataArray, {
    windowSize: options.windowSize || 50,
    threshold: options.madThreshold || 3.0
  });
  
  console.log(`\nMoving Average Deviation (window: ${madResults.windowSize}):`);
  console.log(`  Anomalies detected: ${madResults.count}`);
  
  // Method 3: IQR
  const iqrResults = detectAnomaliesIQR(dataArray, {
    multiplier: options.iqrMultiplier || 1.5
  });
  
  console.log(`\nInterquartile Range (IQR × ${iqrResults.multiplier}):`);
  console.log(`  Q1: ${iqrResults.q1.toFixed(2)}`);
  console.log(`  Q3: ${iqrResults.q3.toFixed(2)}`);
  console.log(`  IQR: ${iqrResults.iqr.toFixed(2)}`);
  console.log(`  Bounds: [${iqrResults.lowerBound.toFixed(2)}, ${iqrResults.upperBound.toFixed(2)}]`);
  console.log(`  Anomalies detected: ${iqrResults.count}`);
  
  // Find consensus anomalies (detected by multiple methods)
  const zscoreSet = new Set(zscoreResults.indices);
  const madSet = new Set(madResults.anomalies.map(a => a.index));
  const iqrSet = new Set(iqrResults.anomalies.map(a => a.index));
  
  const consensus = [];
  for (let i = 0; i < dataArray.length; i++) {
    const detectionCount = 
      (zscoreSet.has(i) ? 1 : 0) +
      (madSet.has(i) ? 1 : 0) +
      (iqrSet.has(i) ? 1 : 0);
    
    if (detectionCount >= 2) {
      consensus.push({ index: i, value: dataArray[i], detectedBy: detectionCount });
    }
  }
  
  console.log(`\nConsensus Anomalies (detected by ≥2 methods):`);
  console.log(`  Count: ${consensus.length}`);
  
  return {
    zscore: zscoreResults,
    mad: madResults,
    iqr: iqrResults,
    consensus
  };
}

/**
 * Example: Network traffic anomaly detection
 */
export function exampleNetworkTraffic() {
  // Generate synthetic network traffic data
  function* generateTraffic(count = 1000) {
    for (let i = 0; i < count; i++) {
      const hour = i % 24;
      
      // Business hours pattern
      const businessHours = hour >= 9 && hour <= 17 ? 50 : 20;
      
      // Random variation
      const noise = (Math.random() - 0.5) * 20;
      
      // Occasional traffic spikes (anomalies)
      const anomaly = Math.random() < 0.03 ? Math.random() * 200 : 0;
      
      yield Math.max(0, businessHours + noise + anomaly);
    }
  }
  
  console.log('Anomaly Detection: Network Traffic\n');
  console.log('Dataset: 1000 hourly traffic measurements\n');
  
  const results = detectAnomaliesAll(generateTraffic(1000), {
    zscoreThreshold: 3.0,
    windowSize: 50,
    madThreshold: 3.0,
    iqrMultiplier: 1.5
  });
  
  if (results.consensus.length > 0) {
    console.log('\nTop 5 consensus anomalies:');
    results.consensus.slice(0, 5).forEach(a => {
      console.log(`  Index ${a.index}: ${a.value.toFixed(2)} Mbps (${a.detectedBy}/3 methods)`);
    });
  }
  
  return results;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleNetworkTraffic();
}

export {
  detectAnomaliesZScore,
  detectAnomaliesMAD,
  detectAnomaliesIQR,
  detectAnomaliesAll
};
