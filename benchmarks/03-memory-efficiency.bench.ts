/**
 * 03: Memory Efficiency and GC Pressure
 * GC monitoring during Filter-Map-Take pipeline (requires --expose-gc)
 */

import { iter } from '../src/index.js';
import { PerformanceObserver, performance } from 'perf_hooks';
import { TRANSACTION_CONFIG, BENCHMARK_SCALES, GC_CONFIG } from './config.js';

interface GCEvent {
  type: 'scavenge' | 'mark-sweep' | 'incremental' | 'weakCb' | 'all';
  duration: number; // milliseconds
  timestamp: number;
}

interface GCMetrics {
  events: GCEvent[];
  totalPauseTime: number; // milliseconds
  eventCount: number;
  avgPauseTime: number; // milliseconds
  scavengeCount: number; // Minor GC
  markSweepCount: number; // Major GC
}

class GCMonitor {
  private events: GCEvent[] = [];
  private observer: PerformanceObserver | null = null;
  private startTime: number = 0;

  start(): void {
    this.events = [];
    this.startTime = performance.now();

    // Clear existing entries
    performance.clearMarks();
    performance.clearMeasures();

    // Create observer for GC events
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'gc') {
          const gcEntry = entry as any; // PerformanceEntry with gc details
          this.events.push({
            type: this.classifyGCKind(gcEntry.detail?.kind),
            duration: entry.duration,
            timestamp: entry.startTime - this.startTime
          });
        }
      }
    });

    try {
      this.observer.observe({ entryTypes: ['gc'] });
    } catch (e) {
      console.warn('GC monitoring not available. Run with --expose-gc flag.');
    }
  }

  stop(): GCMetrics {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const totalPauseTime = this.events.reduce((sum, e) => sum + e.duration, 0);
    const scavengeCount = this.events.filter(e => e.type === 'scavenge').length;
    const markSweepCount = this.events.filter(e => e.type === 'mark-sweep').length;

    return {
      events: this.events,
      totalPauseTime,
      eventCount: this.events.length,
      avgPauseTime: this.events.length > 0 ? totalPauseTime / this.events.length : 0,
      scavengeCount,
      markSweepCount
    };
  }

  private classifyGCKind(kind?: number): GCEvent['type'] {
    // V8 GC kinds from v8.h
    // 1 = Scavenge (minor GC)
    // 2 = Mark-sweep-compact (major GC)
    // 4 = Incremental marking
    // 8 = Weak phantom callback processing
    switch (kind) {
      case 1: return 'scavenge';
      case 2: return 'mark-sweep';
      case 4: return 'incremental';
      case 8: return 'weakCb';
      default: return 'all';
    }
  }
}

function forceGC(): void {
  if (global.gc) {
    global.gc();
  } else {
    console.warn('GC not exposed. Run with --expose-gc flag.');
  }
}

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    external: mem.external,
    rss: mem.rss,
    heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
    heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(2)
  };
}

interface Transaction {
  id: number;
  amount: number;
  flagged: boolean;
}

function generateTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    amount: Math.random() * TRANSACTION_CONFIG.MAX_AMOUNT,
    flagged: Math.random() < TRANSACTION_CONFIG.FLAGGED_PROBABILITY
  }));
}

interface BenchmarkResult {
  library: string;
  scale: number;
  iterations: number;
  gcMetrics: {
    totalEvents: number;
    scavengeCount: number;
    markSweepCount: number;
    totalPauseTime: number;
    avgPauseTime: number;
  };
  memoryDelta: {
    heapUsedMB: number;
    heapTotalMB: number;
  };
  timeMs: number;
}

async function benchmarkGCPressure(
  library: 'iterflow' | 'native-array',
  scale: number,
  iterations: number = GC_CONFIG.DEFAULT_ITERATIONS
): Promise<BenchmarkResult> {

  console.log(`\nTesting ${library} at N=${scale.toLocaleString()}...`);

  const data = generateTransactions(scale);

  // Force GC before starting
  forceGC();
  await new Promise(resolve => setTimeout(resolve, GC_CONFIG.SETTLE_TIME_MS));

  const memBefore = getMemoryUsage();
  const gcMonitor = new GCMonitor();

  gcMonitor.start();
  const startTime = performance.now();

  // Run multiple iterations to accumulate GC events
  for (let i = 0; i < iterations; i++) {
    if (library === 'iterflow') {
      iter(data)
        .filter(t => t.amount > TRANSACTION_CONFIG.FILTER_THRESHOLD && !t.flagged)
        .map(t => ({ id: t.id, amount: t.amount }))
        .take(TRANSACTION_CONFIG.TAKE_COUNT)
        .toArray();
    } else {
      data
        .filter(t => t.amount > TRANSACTION_CONFIG.FILTER_THRESHOLD && !t.flagged)
        .map(t => ({ id: t.id, amount: t.amount }))
        .slice(0, TRANSACTION_CONFIG.TAKE_COUNT);
    }
  }

  const endTime = performance.now();
  const gcMetrics = gcMonitor.stop();

  // Force GC to see final state
  forceGC();
  await new Promise(resolve => setTimeout(resolve, GC_CONFIG.SETTLE_TIME_MS));

  const memAfter = getMemoryUsage();

  return {
    library,
    scale,
    iterations,
    gcMetrics: {
      totalEvents: gcMetrics.eventCount,
      scavengeCount: gcMetrics.scavengeCount,
      markSweepCount: gcMetrics.markSweepCount,
      totalPauseTime: gcMetrics.totalPauseTime,
      avgPauseTime: gcMetrics.avgPauseTime
    },
    memoryDelta: {
      heapUsedMB: parseFloat(memAfter.heapUsedMB) - parseFloat(memBefore.heapUsedMB),
      heapTotalMB: parseFloat(memAfter.heapTotalMB) - parseFloat(memBefore.heapTotalMB)
    },
    timeMs: endTime - startTime
  };
}

async function main() {
  if (typeof global.gc !== 'function') {
    console.error('\nERROR: Requires --expose-gc flag');
    console.error('Run: node --expose-gc --import tsx 03-memory-efficiency.bench.ts\n');
    process.exit(1);
  }

  console.log('\n03: Memory Efficiency and GC Pressure');
  console.log(`Filter-Map-Take (${GC_CONFIG.DEFAULT_ITERATIONS} iterations per scale)\n`);

  const scales = BENCHMARK_SCALES.MEMORY_EFFICIENCY;
  const allResults: BenchmarkResult[] = [];

  for (const scale of scales) {
    console.log(`\nN=${scale.toLocaleString()}`);

    const iterflowResult = await benchmarkGCPressure('iterflow', scale, GC_CONFIG.DEFAULT_ITERATIONS);
    const nativeResult = await benchmarkGCPressure('native-array', scale, GC_CONFIG.DEFAULT_ITERATIONS);
    allResults.push(iterflowResult, nativeResult);

    const gcReduction = ((nativeResult.gcMetrics.totalEvents - iterflowResult.gcMetrics.totalEvents) / nativeResult.gcMetrics.totalEvents * 100);
    const memReduction = ((nativeResult.memoryDelta.heapUsedMB - iterflowResult.memoryDelta.heapUsedMB) / nativeResult.memoryDelta.heapUsedMB * 100);

    console.log(`  iterflow:  ${iterflowResult.gcMetrics.totalEvents} GC events, ${iterflowResult.memoryDelta.heapUsedMB.toFixed(2)} MB heap`);
    console.log(`  native:    ${nativeResult.gcMetrics.totalEvents} GC events, ${nativeResult.memoryDelta.heapUsedMB.toFixed(2)} MB heap`);
    console.log(`  Reduction: ${gcReduction.toFixed(1)}% GC events, ${memReduction.toFixed(1)}% memory`);
  }

  console.log('\nSummary:\n');
  console.table(allResults.map(r => ({
    Library: r.library,
    'N': r.scale.toLocaleString(),
    'GC Events': r.gcMetrics.totalEvents,
    'Heap (MB)': r.memoryDelta.heapUsedMB.toFixed(2)
  })));
}

main().catch(console.error);
