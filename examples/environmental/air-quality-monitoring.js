/**
 * Use Case 1: Real-time Air Quality Monitoring
 * 
 * Demonstrates streaming statistics for environmental sensor networks.
 * Processes continuous AQI data with constant memory usage.
 * 
 * Applications:
 * - IoT sensor networks
 * - Edge devices with limited RAM
 * - Real-time pollution monitoring
 * - Anomaly detection (pollution spikes)
 */

import { iter } from '../../src/index.js';
import { aqiSensorStream } from './sensor-simulator.js';

/**
 * Monitor air quality with rolling statistics
 */
function monitorAirQuality(recordCount = 100000) {
  console.log('Real-time Air Quality Monitoring\n');
  console.log('Processing', recordCount, 'sensor readings...\n');
  
  const windowSize = 60; // 1-hour rolling window (60 readings @ 1/min)
  
  const results = iter(aqiSensorStream(recordCount))
    .map(reading => reading.value)
    .window(windowSize)
    .map((window, i) => {
      const stats = iter(window);
      return {
        timestamp: i,
        rollingMean: stats.mean(),
        rollingStdDev: stats.stdDev(),
        min: stats.min(),
        max: stats.max(),
        current: window[window.length - 1]
      };
    })
    .toArray();
  
  // Report summary statistics
  const finalWindow = results[results.length - 1];
  console.log('Summary Statistics (last hour):');
  console.log(`  Current AQI: ${finalWindow.current.toFixed(2)}`);
  console.log(`  Rolling Mean: ${finalWindow.rollingMean.toFixed(2)}`);
  console.log(`  Rolling Std Dev: ${finalWindow.rollingStdDev.toFixed(2)}`);
  console.log(`  Min: ${finalWindow.min.toFixed(2)}`);
  console.log(`  Max: ${finalWindow.max.toFixed(2)}`);
  
  // Detect pollution events (>2 std devs above mean)
  const pollutionEvents = results.filter(r => 
    r.current > r.rollingMean + (2 * r.rollingStdDev)
  );
  
  console.log(`\nPollution Events Detected: ${pollutionEvents.length}`);
  if (pollutionEvents.length > 0) {
    console.log('  (AQI spikes >2σ above rolling mean)');
  }
  
  return results;
}

/**
 * Streaming anomaly detection using z-scores
 */
function detectAnomalies(recordCount = 100000, threshold = 3.0) {
  console.log('\nStreaming Anomaly Detection\n');
  console.log(`Processing ${recordCount} readings with threshold ${threshold}σ...\n`);
  
  const anomalies = iter(aqiSensorStream(recordCount))
    .map(reading => reading.value)
    .streamingZScore()
    .enumerate()
    .filter(([idx, zscore]) => Math.abs(zscore) > threshold && !isNaN(zscore))
    .toArray();
  
  console.log(`Anomalies Detected: ${anomalies.length}`);
  console.log(`  (z-score threshold: ±${threshold}σ)`);
  
  if (anomalies.length > 0) {
    console.log('\nFirst 5 anomalies:');
    anomalies.slice(0, 5).forEach(([idx, zscore]) => {
      console.log(`  Reading #${idx}: z-score = ${zscore.toFixed(2)}`);
    });
  }
  
  return anomalies;
}

/**
 * Compute exponentially weighted moving average (EWMA) for trend analysis
 */
function trendAnalysis(recordCount = 10000, alpha = 0.1) {
  console.log('\nTrend Analysis (EWMA)\n');
  console.log(`Processing ${recordCount} readings with α=${alpha}...\n`);
  
  const trends = iter(aqiSensorStream(recordCount))
    .map(reading => reading.value)
    .ewma(alpha)
    .toArray();
  
  // Compare start vs end trend
  const startTrend = trends.slice(0, 100).reduce((a, b) => a + b, 0) / 100;
  const endTrend = trends.slice(-100).reduce((a, b) => a + b, 0) / 100;
  const change = ((endTrend - startTrend) / startTrend) * 100;
  
  console.log('Trend Summary:');
  console.log(`  Initial EWMA: ${startTrend.toFixed(2)} AQI`);
  console.log(`  Final EWMA: ${endTrend.toFixed(2)} AQI`);
  console.log(`  Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`);
  console.log(`  Trend: ${Math.abs(change) < 5 ? 'Stable' : change > 0 ? 'Increasing' : 'Decreasing'}`);
  
  return trends;
}

/**
 * Memory-efficient processing pipeline for continuous monitoring
 */
function continuousMonitoring(options = {}) {
  const {
    recordCount = 1000000,
    windowSize = 60,
    anomalyThreshold = 3.0,
    reportInterval = 10000
  } = options;
  
  console.log('\n=== Continuous Air Quality Monitoring ===\n');
  console.log(`Dataset: ${recordCount.toLocaleString()} sensor readings`);
  console.log(`Window: ${windowSize} readings (rolling statistics)`);
  console.log(`Anomaly threshold: ±${anomalyThreshold}σ\n`);
  
  const startMem = process.memoryUsage().heapUsed / 1024 / 1024;
  const startTime = Date.now();
  
  let processed = 0;
  let anomalyCount = 0;
  let currentStats = { mean: 0, stdDev: 0, min: 0, max: 0 };
  
  // Process stream with constant memory
  iter(aqiSensorStream(recordCount))
    .map(reading => reading.value)
    .window(windowSize)
    .forEach((window, i) => {
      processed++;
      
      // Update statistics
      const stats = iter(window);
      currentStats = {
        mean: stats.mean(),
        stdDev: stats.stdDev(),
        min: stats.min(),
        max: stats.max()
      };
      
      // Check for anomaly
      const current = window[window.length - 1];
      const zscore = (current - currentStats.mean) / currentStats.stdDev;
      if (Math.abs(zscore) > anomalyThreshold) {
        anomalyCount++;
      }
      
      // Report progress
      if (processed % reportInterval === 0) {
        const memNow = process.memoryUsage().heapUsed / 1024 / 1024;
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processed / elapsed;
        
        console.log(`[${elapsed.toFixed(1)}s] Processed: ${processed.toLocaleString()} | ` +
                    `Rate: ${rate.toFixed(0)}/s | ` +
                    `Memory: ${memNow.toFixed(2)} MB | ` +
                    `Anomalies: ${anomalyCount}`);
      }
    });
  
  const endMem = process.memoryUsage().heapUsed / 1024 / 1024;
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n=== Final Report ===');
  console.log(`Processed: ${processed.toLocaleString()} readings`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Throughput: ${(processed / duration).toFixed(0)} readings/sec`);
  console.log(`Memory used: ${(endMem - startMem).toFixed(2)} MB`);
  console.log(`Anomalies detected: ${anomalyCount}`);
  console.log(`\nFinal Statistics:`);
  console.log(`  Mean: ${currentStats.mean.toFixed(2)} AQI`);
  console.log(`  Std Dev: ${currentStats.stdDev.toFixed(2)}`);
  console.log(`  Min: ${currentStats.min.toFixed(2)} AQI`);
  console.log(`  Max: ${currentStats.max.toFixed(2)} AQI`);
}

// Run examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  monitorAirQuality(10000);
  detectAnomalies(10000);
  trendAnalysis(10000);
  continuousMonitoring({ recordCount: 100000, reportInterval: 10000 });
}

export {
  monitorAirQuality,
  detectAnomalies,
  trendAnalysis,
  continuousMonitoring
};
