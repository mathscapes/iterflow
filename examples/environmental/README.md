# Environmental Monitoring Examples

Demonstrates iterflow for real-time environmental sensor data processing with constant memory usage.

## Use Cases

### 1. Air Quality Monitoring (`air-quality-monitoring.js`)

**Scenario:** IoT sensor network monitoring air pollution across a city.

**Problem:** 
- Continuous stream of AQI readings (millions per day)
- Limited memory on edge devices
- Need real-time anomaly detection

**Solution:**
- Streaming statistics with constant memory
- Rolling window analysis (hourly trends)
- Z-score based anomaly detection
- EWMA for trend analysis

**Results:**
- Processes 1M readings with <5 MB memory
- Detects pollution spikes in real-time
- Suitable for Raspberry Pi / edge deployment

### 2. Sensor Data Simulator (`sensor-simulator.js`)

Generates realistic environmental sensor streams for testing:
- AQI readings with diurnal patterns
- Temperature data with seasonal variation
- PM2.5 particulate matter readings
- Synthetic anomalies (pollution spikes)

## Running Examples

```bash
# Air quality monitoring demo
node examples/environmental/air-quality-monitoring.js

# Memory benchmark (streaming vs batch)
node benchmarks/memory/streaming-vs-batch.js
```

## Key Findings

**Memory Efficiency:**
- Batch processing: ~8 bytes per reading (linear growth)
- Streaming: Constant ~2-5 MB regardless of dataset size
- For 1M readings: 80 MB (batch) vs 5 MB (streaming)

**Performance:**
- Processes 10,000+ readings/sec on modest hardware
- Real-time capability on constrained devices
- Suitable for continuous 24/7 monitoring

## Applications

- **Smart Cities:** Distributed air quality monitoring
- **Industrial IoT:** Factory emissions tracking
- **Environmental Research:** Long-term pollution studies
- **Public Health:** Real-time exposure alerts
- **Edge Computing:** On-device analytics without cloud dependency

## Why Streaming Matters

Traditional batch processing requires storing all data before analysis:
- 1 day of readings (86,400) = ~690 KB memory
- 1 week = ~4.8 MB
- 1 month = ~20 MB
- 1 year = ~240 MB (OOM risk on embedded devices)

Streaming approach:
- Constant memory footprint regardless of duration
- Enables continuous monitoring on resource-constrained hardware
- No data loss due to memory limits
