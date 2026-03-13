/**
 * Correlation Analysis Template
 * 
 * Reusable workflow for analyzing relationships between variables.
 * Demonstrates streaming covariance and correlation computation.
 * 
 * Use cases:
 * - Sensor correlation analysis
 * - Feature relationship studies
 * - Multi-variate pattern detection
 */

import { iter } from '../../src/index.js';

/**
 * Compute correlation matrix for multiple variables
 */
export function correlationMatrix(data, variableNames) {
  const n = variableNames.length;
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Compute pairwise correlations
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1.0; // Perfect self-correlation
      } else {
        const pairs = data.map(row => [row[i], row[j]]);
        const corr = computeCorrelation(pairs);
        matrix[i][j] = corr;
        matrix[j][i] = corr; // Symmetric
      }
    }
  }
  
  return {
    variables: variableNames,
    matrix
  };
}

/**
 * Compute Pearson correlation coefficient
 */
export function computeCorrelation(pairs) {
  const n = pairs.length;
  
  if (n < 2) return NaN;
  
  // Compute means
  const xMean = pairs.reduce((sum, [x]) => sum + x, 0) / n;
  const yMean = pairs.reduce((sum, [, y]) => sum + y, 0) / n;
  
  // Compute correlation
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;
  
  for (const [x, y] of pairs) {
    const xDev = x - xMean;
    const yDev = y - yMean;
    numerator += xDev * yDev;
    xVariance += xDev * xDev;
    yVariance += yDev * yDev;
  }
  
  if (xVariance === 0 || yVariance === 0) return NaN;
  
  return numerator / Math.sqrt(xVariance * yVariance);
}

/**
 * Streaming correlation analysis
 * Useful for detecting correlation changes over time
 */
export function streamingCorrelationAnalysis(pairs, windowSize = 100) {
  const correlations = [];
  const pairArray = Array.from(pairs);
  
  for (let i = windowSize; i <= pairArray.length; i++) {
    const window = pairArray.slice(i - windowSize, i);
    const corr = computeCorrelation(window);
    correlations.push({
      index: i,
      correlation: corr,
      windowStart: i - windowSize,
      windowEnd: i
    });
  }
  
  return correlations;
}

/**
 * Find strongly correlated variable pairs
 */
export function findStrongCorrelations(corrMatrix, threshold = 0.7) {
  const { variables, matrix } = corrMatrix;
  const strong = [];
  
  for (let i = 0; i < variables.length; i++) {
    for (let j = i + 1; j < variables.length; j++) {
      const corr = matrix[i][j];
      if (Math.abs(corr) >= threshold) {
        strong.push({
          var1: variables[i],
          var2: variables[j],
          correlation: corr,
          strength: Math.abs(corr) >= 0.9 ? 'very strong' :
                   Math.abs(corr) >= 0.7 ? 'strong' : 'moderate'
        });
      }
    }
  }
  
  return strong.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

/**
 * Complete correlation analysis pipeline
 */
export function analyzeCorrelations(data, variableNames, options = {}) {
  const {
    significanceThreshold = 0.7,
    streamingWindowSize = 100
  } = options;
  
  console.log('Correlation Analysis\n');
  console.log(`Variables: ${variableNames.join(', ')}`);
  console.log(`Observations: ${data.length}\n`);
  
  // Compute correlation matrix
  const corrMatrix = correlationMatrix(data, variableNames);
  
  console.log('Correlation Matrix:');
  console.log('       ', variableNames.map(v => v.padEnd(8)).join(' '));
  corrMatrix.matrix.forEach((row, i) => {
    console.log(
      variableNames[i].padEnd(7),
      row.map(v => v.toFixed(3).padStart(8)).join(' ')
    );
  });
  
  // Find strong correlations
  const strongCorr = findStrongCorrelations(corrMatrix, significanceThreshold);
  
  if (strongCorr.length > 0) {
    console.log(`\nSignificant Correlations (|r| ≥ ${significanceThreshold}):`);
    strongCorr.forEach(({ var1, var2, correlation, strength }) => {
      console.log(`  ${var1} ↔ ${var2}: r = ${correlation.toFixed(3)} (${strength})`);
    });
  } else {
    console.log(`\nNo significant correlations found (threshold: ${significanceThreshold})`);
  }
  
  return {
    matrix: corrMatrix,
    strongCorrelations: strongCorr
  };
}

/**
 * Example: Multi-sensor environmental data
 */
export function exampleEnvironmentalCorrelations() {
  // Generate synthetic multi-sensor data
  function generateData(count = 500) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const hour = i % 24;
      
      // Temperature (base pattern)
      const temp = 20 + 5 * Math.sin((hour / 24) * 2 * Math.PI) + 
                  (Math.random() - 0.5) * 2;
      
      // Humidity (inversely correlated with temperature)
      const humidity = 70 - 2 * (temp - 20) + (Math.random() - 0.5) * 5;
      
      // AQI (correlated with traffic patterns, somewhat with temperature)
      const trafficFactor = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 30 : 0;
      const aqi = 50 + trafficFactor + 0.5 * (temp - 20) + (Math.random() - 0.5) * 10;
      
      // Wind speed (independent)
      const windSpeed = 5 + (Math.random() - 0.5) * 4;
      
      data.push([temp, humidity, aqi, windSpeed]);
    }
    
    return data;
  }
  
  console.log('Environmental Sensor Correlation Analysis\n');
  
  const data = generateData(500);
  const variables = ['Temperature', 'Humidity', 'AQI', 'WindSpeed'];
  
  const results = analyzeCorrelations(data, variables, {
    significanceThreshold: 0.5
  });
  
  console.log('\nInterpretation:');
  console.log('  • Temperature ↔ Humidity: Expected negative correlation (physics)');
  console.log('  • AQI ↔ Temperature: Weak positive (pollution + heat)');
  console.log('  • WindSpeed: Should be mostly independent');
  
  return results;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleEnvironmentalCorrelations();
}

export {
  correlationMatrix,
  computeCorrelation,
  streamingCorrelationAnalysis,
  findStrongCorrelations,
  analyzeCorrelations
};
