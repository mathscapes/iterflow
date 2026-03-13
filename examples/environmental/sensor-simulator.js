/**
 * Simulates environmental sensor data streams for testing.
 * Generates realistic air quality (AQI), temperature, and pollution readings.
 */

/**
 * Generate realistic AQI readings with temporal patterns and noise
 */
export function* aqiSensorStream(count = 1000000, options = {}) {
  const {
    baseline = 50,      // Base AQI level
    trend = 0.001,      // Slow upward/downward trend
    noise = 10,         // Random variation
    anomalyRate = 0.01  // 1% anomaly rate
  } = options;

  for (let i = 0; i < count; i++) {
    // Diurnal pattern (peaks during day)
    const hour = (i % 24);
    const diurnal = 20 * Math.sin((hour - 6) * Math.PI / 12);
    
    // Long-term trend
    const trendValue = trend * i;
    
    // Random noise
    const noiseValue = (Math.random() - 0.5) * noise;
    
    // Occasional anomalies (pollution spikes)
    const isAnomaly = Math.random() < anomalyRate;
    const anomaly = isAnomaly ? Math.random() * 100 : 0;
    
    const value = Math.max(0, baseline + diurnal + trendValue + noiseValue + anomaly);
    
    yield {
      timestamp: Date.now() + i * 1000, // 1 reading per second
      sensor_id: 'AQI_001',
      value: Math.round(value * 10) / 10,
      unit: 'AQI',
      anomaly: isAnomaly
    };
  }
}

/**
 * Generate temperature sensor readings
 */
export function* temperatureSensorStream(count = 1000000, options = {}) {
  const {
    baseline = 20,      // Base temperature (°C)
    amplitude = 5,      // Daily temperature swing
    noise = 1           // Random variation
  } = options;

  for (let i = 0; i < count; i++) {
    const hour = (i % 24);
    const diurnal = amplitude * Math.sin((hour - 6) * Math.PI / 12);
    const noiseValue = (Math.random() - 0.5) * noise;
    
    const value = baseline + diurnal + noiseValue;
    
    yield {
      timestamp: Date.now() + i * 1000,
      sensor_id: 'TEMP_001',
      value: Math.round(value * 10) / 10,
      unit: '°C'
    };
  }
}

/**
 * Generate PM2.5 particulate matter readings
 */
export function* pm25SensorStream(count = 1000000, options = {}) {
  const {
    baseline = 25,      // Base PM2.5 level (µg/m³)
    noise = 8,          // Random variation
    anomalyRate = 0.02  // 2% anomaly rate
  } = options;

  for (let i = 0; i < count; i++) {
    const hour = (i % 24);
    // Higher pollution during morning/evening rush hours
    const traffic = hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 15 : 0;
    
    const noiseValue = (Math.random() - 0.5) * noise;
    const isAnomaly = Math.random() < anomalyRate;
    const anomaly = isAnomaly ? Math.random() * 80 : 0;
    
    const value = Math.max(0, baseline + traffic + noiseValue + anomaly);
    
    yield {
      timestamp: Date.now() + i * 1000,
      sensor_id: 'PM25_001',
      value: Math.round(value * 10) / 10,
      unit: 'µg/m³',
      anomaly: isAnomaly
    };
  }
}

/**
 * Simulate multi-sensor environmental monitoring station
 */
export function* multiSensorStream(count = 1000000) {
  const aqiGen = aqiSensorStream(count);
  const tempGen = temperatureSensorStream(count);
  const pm25Gen = pm25SensorStream(count);
  
  for (let i = 0; i < count; i++) {
    yield {
      timestamp: Date.now() + i * 1000,
      station_id: 'ENV_STATION_001',
      aqi: aqiGen.next().value,
      temperature: tempGen.next().value,
      pm25: pm25Gen.next().value
    };
  }
}
