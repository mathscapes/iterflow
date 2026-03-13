/**
 * Time-Series Analysis Template
 * 
 * Reusable workflow for analyzing temporal data.
 * Demonstrates compositional approach to reproducible analysis.
 * 
 * Steps:
 * 1. Load data
 * 2. Clean/filter outliers
 * 3. Compute trend (EWMA)
 * 4. Detect seasonal patterns
 * 5. Calculate summary statistics
 * 6. Export results
 */

import { iter } from '../../src/index.js';

/**
 * Time-series analysis pipeline
 * 
 * @param {Iterable<{timestamp: number, value: number}>} data - Time-series data
 * @param {Object} options - Configuration
 * @returns {Object} Analysis results
 */
export function analyzeTimeSeries(data, options = {}) {
  const {
    alpha = 0.1,           // EWMA smoothing factor
    outlierThreshold = 3,  // Z-score threshold for outliers
    windowSize = 24        // Rolling window size
  } = options;
  
  // Step 1: Extract values and compute basic statistics
  const values = iter(data)
    .map(d => d.value)
    .toArray();
  
  const stats = iter(values);
  const mean = stats.mean();
  const stdDev = stats.stdDev();
  
  // Step 2: Filter outliers
  const cleaned = iter(values)
    .filter(v => Math.abs(v - mean) <= outlierThreshold * stdDev)
    .toArray();
  
  const outlierCount = values.length - cleaned.length;
  
  // Step 3: Compute trend (EWMA)
  const trend = iter(cleaned)
    .ewma(alpha)
    .toArray();
  
  // Step 4: Detrend and analyze residuals
  const residuals = cleaned.map((v, i) => v - trend[i]);
  const residualStats = iter(residuals);
  
  // Step 5: Rolling statistics for seasonal patterns
  const rollingStats = iter(cleaned)
    .window(windowSize)
    .map(window => {
      const w = iter(window);
      return {
        mean: w.mean(),
        stdDev: w.stdDev(),
        min: w.min(),
        max: w.max()
      };
    })
    .toArray();
  
  // Step 6: Summary
  return {
    original: {
      count: values.length,
      mean,
      stdDev,
      min: stats.min(),
      max: stats.max()
    },
    cleaned: {
      count: cleaned.length,
      outlierCount,
      outlierRate: (outlierCount / values.length) * 100
    },
    trend: {
      initial: trend[0],
      final: trend[trend.length - 1],
      change: ((trend[trend.length - 1] - trend[0]) / trend[0]) * 100,
      data: trend
    },
    residuals: {
      mean: residualStats.mean(),
      stdDev: residualStats.stdDev()
    },
    rollingStats: {
      windowSize,
      data: rollingStats
    }
  };
}

/**
 * Example: Climate data analysis
 */
export function exampleClimateData() {
  // Generate synthetic climate data (temperature readings)
  function* generateData(count = 1000) {
    for (let i = 0; i < count; i++) {
      const hour = i % 24;
      const day = Math.floor(i / 24);
      
      // Seasonal pattern (yearly cycle)
      const seasonal = 10 * Math.sin((day / 365) * 2 * Math.PI);
      
      // Diurnal pattern
      const diurnal = 5 * Math.sin((hour / 24) * 2 * Math.PI);
      
      // Random noise
      const noise = (Math.random() - 0.5) * 3;
      
      // Occasional anomalies
      const anomaly = Math.random() < 0.02 ? (Math.random() - 0.5) * 30 : 0;
      
      yield {
        timestamp: Date.now() + i * 3600000, // Hourly
        value: 20 + seasonal + diurnal + noise + anomaly
      };
    }
  }
  
  console.log('Time-Series Analysis: Climate Data\n');
  
  const results = analyzeTimeSeries(generateData(1000), {
    alpha: 0.1,
    outlierThreshold: 3,
    windowSize: 24
  });
  
  console.log('Original Data:');
  console.log(`  Count: ${results.original.count}`);
  console.log(`  Mean: ${results.original.mean.toFixed(2)}°C`);
  console.log(`  Std Dev: ${results.original.stdDev.toFixed(2)}°C`);
  console.log(`  Range: ${results.original.min.toFixed(2)}°C - ${results.original.max.toFixed(2)}°C`);
  
  console.log('\nData Cleaning:');
  console.log(`  Outliers removed: ${results.cleaned.outlierCount} (${results.cleaned.outlierRate.toFixed(2)}%)`);
  
  console.log('\nTrend Analysis (EWMA):');
  console.log(`  Initial: ${results.trend.initial.toFixed(2)}°C`);
  console.log(`  Final: ${results.trend.final.toFixed(2)}°C`);
  console.log(`  Change: ${results.trend.change > 0 ? '+' : ''}${results.trend.change.toFixed(2)}%`);
  
  console.log('\nResiduals (Detrended):');
  console.log(`  Mean: ${results.residuals.mean.toFixed(4)}°C (should be ~0)`);
  console.log(`  Std Dev: ${results.residuals.stdDev.toFixed(2)}°C`);
  
  console.log('\nRolling Statistics:');
  console.log(`  Window size: ${results.rollingStats.windowSize} hours`);
  console.log(`  Computed: ${results.rollingStats.data.length} windows`);
  
  return results;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleClimateData();
}
