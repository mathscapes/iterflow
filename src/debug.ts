/**
 * Debug mode and operation tracing utilities for iterflow
 * @module debug
 */

/**
 * Trace entry representing a single operation execution
 */
export interface TraceEntry {
  operation: string;
  timestamp: number;
  input?: unknown;
  output?: unknown;
  error?: Error;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Debug configuration options
 */
export interface DebugConfig {
  enabled: boolean;
  traceOperations: boolean;
  traceInput: boolean;
  traceOutput: boolean;
  logToConsole: boolean;
  maxTraceEntries?: number;
}

/**
 * Global debug state
 *
 * @internal Private implementation detail - use exported debug functions instead
 */
class DebugState {
  private config: DebugConfig = {
    enabled: false,
    traceOperations: false,
    traceInput: false,
    traceOutput: false,
    logToConsole: false,
    maxTraceEntries: 1000,
  };

  private traces: TraceEntry[] = [];

  /**
   * Enable debug mode with optional configuration
   */
  enable(config?: Partial<DebugConfig>): void {
    this.config = {
      ...this.config,
      enabled: true,
      traceOperations: true,
      ...config,
    };

    if (this.config.logToConsole) {
      console.log("[iterflow Debug] Debug mode enabled", this.config);
    }
  }

  /**
   * Disable debug mode
   */
  disable(): void {
    this.config.enabled = false;
    this.config.traceOperations = false;

    if (this.config.logToConsole) {
      console.log("[iterflow Debug] Debug mode disabled");
    }
  }

  /**
   * Check if debug mode is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<DebugConfig> {
    return { ...this.config };
  }

  /**
   * Add a trace entry
   */
  trace(entry: TraceEntry): void {
    if (!this.config.traceOperations) {
      return;
    }

    // Limit trace entries to prevent memory issues
    if (this.traces.length >= (this.config.maxTraceEntries || 1000)) {
      this.traces.shift(); // Remove oldest entry
    }

    this.traces.push(entry);

    if (this.config.logToConsole) {
      this.logTrace(entry);
    }
  }

  /**
   * Get all trace entries
   */
  getTraces(): readonly TraceEntry[] {
    return [...this.traces];
  }

  /**
   * Clear all traces
   */
  clearTraces(): void {
    this.traces = [];

    if (this.config.logToConsole) {
      console.log("[iterflow Debug] Traces cleared");
    }
  }

  /**
   * Get traces for a specific operation
   */
  getTracesForOperation(operation: string): TraceEntry[] {
    return this.traces.filter((t) => t.operation === operation);
  }

  /**
   * Get summary statistics for traces
   */
  getTraceSummary(): Record<
    string,
    { count: number; avgDuration: number; errors: number }
  > {
    const summary: Record<
      string,
      { count: number; totalDuration: number; errors: number }
    > = {};

    for (const trace of this.traces) {
      if (!summary[trace.operation]) {
        summary[trace.operation] = { count: 0, totalDuration: 0, errors: 0 };
      }

      const operationSummary = summary[trace.operation]!;
      operationSummary.count++;

      if (trace.duration !== undefined) {
        operationSummary.totalDuration += trace.duration;
      }

      if (trace.error) {
        operationSummary.errors++;
      }
    }

    // Convert to final format with average duration
    const result: Record<
      string,
      { count: number; avgDuration: number; errors: number }
    > = {};

    for (const [op, stats] of Object.entries(summary)) {
      result[op] = {
        count: stats.count,
        avgDuration: stats.count > 0 ? stats.totalDuration / stats.count : 0,
        errors: stats.errors,
      };
    }

    return result;
  }

  /**
   * Log a trace entry to console
   */
  private logTrace(entry: TraceEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const duration =
      entry.duration !== undefined ? `${entry.duration.toFixed(2)}ms` : "N/A";

    if (entry.error) {
      console.error(
        `[iterflow Debug] ${timestamp} | ${entry.operation} | ERROR | ${duration}`,
        entry.error,
      );
    } else {
      console.log(
        `[iterflow Debug] ${timestamp} | ${entry.operation} | ${duration}`,
      );

      if (this.config.traceInput && entry.input !== undefined) {
        console.log("  Input:", entry.input);
      }

      if (this.config.traceOutput && entry.output !== undefined) {
        console.log("  Output:", entry.output);
      }

      if (entry.metadata) {
        console.log("  Metadata:", entry.metadata);
      }
    }
  }
}

// Global debug instance
const debugState = new DebugState();

/**
 * Enable debug mode
 */
export function enableDebug(config?: Partial<DebugConfig>): void {
  debugState.enable(config);
}

/**
 * Disable debug mode
 */
export function disableDebug(): void {
  debugState.disable();
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return debugState.isEnabled();
}

/**
 * Get debug configuration
 */
export function getDebugConfig(): Readonly<DebugConfig> {
  return debugState.getConfig();
}

/**
 * Add a trace entry
 *
 * Manually records an operation trace entry for debugging purposes.
 * Traces are only recorded when debug mode is enabled with traceOperations: true.
 *
 * @param entry - The trace entry to add
 * @example
 * ```typescript
 * import { enableDebug, addTrace } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * addTrace({
 *   operation: 'customOp',
 *   timestamp: Date.now(),
 *   duration: 42.5,
 *   metadata: { itemsProcessed: 100 }
 * });
 * ```
 */
export function addTrace(entry: TraceEntry): void {
  debugState.trace(entry);
}

/**
 * Get all trace entries
 *
 * Retrieves all recorded trace entries for analysis. Each trace entry contains
 * operation name, timestamp, duration, and optional input/output/error data.
 *
 * @returns An immutable array of all trace entries
 * @example
 * ```typescript
 * import { from, enableDebug, getTraces } from 'iterflow';
 *
 * enableDebug({ traceOperations: true, traceInput: true, traceOutput: true });
 *
 * from([1, 2, 3]).map(x => x * 2).toArray();
 *
 * const traces = getTraces();
 * traces.forEach(trace => {
 *   console.log(`${trace.operation} took ${trace.duration}ms`);
 * });
 * ```
 */
export function getTraces(): readonly TraceEntry[] {
  return debugState.getTraces();
}

/**
 * Clear all traces
 *
 * Removes all recorded trace entries from memory. Useful for resetting debug state
 * between test runs or freeing memory after analyzing traces.
 *
 * @example
 * ```typescript
 * import { enableDebug, getTraces, clearTraces } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * // ... run some operations ...
 *
 * const traces = getTraces();
 * analyzePerformance(traces);
 *
 * clearTraces(); // Reset for next benchmark
 * ```
 */
export function clearTraces(): void {
  debugState.clearTraces();
}

/**
 * Get traces for a specific operation
 *
 * Filters trace entries to return only those for the specified operation name.
 * Useful for analyzing performance of a specific method or transformation.
 *
 * @param operation - The operation name to filter by (e.g., "map", "filter")
 * @returns An array of trace entries for the specified operation
 * @example
 * ```typescript
 * import { from, enableDebug, getTracesForOperation } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * from([1, 2, 3])
 *   .map(x => x * 2)
 *   .filter(x => x > 3)
 *   .toArray();
 *
 * const mapTraces = getTracesForOperation('map');
 * console.log(`map was called ${mapTraces.length} times`);
 * ```
 */
export function getTracesForOperation(operation: string): TraceEntry[] {
  return debugState.getTracesForOperation(operation);
}

/**
 * Get trace summary statistics
 *
 * Computes aggregated statistics for each operation including call count,
 * average duration, and error count. Useful for identifying performance
 * bottlenecks and error-prone operations.
 *
 * @returns An object mapping operation names to their statistics
 * @example
 * ```typescript
 * import { from, enableDebug, getTraceSummary } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * from([1, 2, 3, 4, 5])
 *   .map(x => x * 2)
 *   .filter(x => x > 5)
 *   .toArray();
 *
 * const summary = getTraceSummary();
 * Object.entries(summary).forEach(([op, stats]) => {
 *   console.log(`${op}: ${stats.count} calls, avg ${stats.avgDuration.toFixed(2)}ms`);
 * });
 * // Output:
 * // map: 5 calls, avg 0.02ms
 * // filter: 5 calls, avg 0.01ms
 * ```
 */
export function getTraceSummary(): Record<
  string,
  { count: number; avgDuration: number; errors: number }
> {
  return debugState.getTraceSummary();
}

/**
 * Wrapper function to trace operation execution
 *
 * Wraps a synchronous function to automatically record execution timing and errors.
 * Only records traces when debug mode is enabled.
 *
 * @template T - The function's return type
 * @param operation - The operation name for the trace entry
 * @param fn - The function to execute and trace
 * @param metadata - Optional metadata to include in the trace entry
 * @returns The result of executing fn
 * @example
 * ```typescript
 * import { enableDebug, traceOperation } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * const result = traceOperation(
 *   'computeExpensive',
 *   () => {
 *     let sum = 0;
 *     for (let i = 0; i < 1000000; i++) sum += i;
 *     return sum;
 *   },
 *   { iterations: 1000000 }
 * );
 * ```
 */
export function traceOperation<T>(
  operation: string,
  fn: () => T,
  metadata?: Record<string, unknown>,
): T {
  if (!debugState.isEnabled()) {
    return fn();
  }

  const startTime = performance.now();
  const timestamp = Date.now();

  try {
    const result = fn();
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      output: debugState.getConfig().traceOutput ? result : undefined,
      metadata,
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      error: error as Error,
      metadata,
    });

    throw error;
  }
}

/**
 * Async version of traceOperation
 *
 * Wraps an async function to automatically record execution timing and errors.
 * Only records traces when debug mode is enabled.
 *
 * @template T - The function's return type
 * @param operation - The operation name for the trace entry
 * @param fn - The async function to execute and trace
 * @param metadata - Optional metadata to include in the trace entry
 * @returns A promise resolving to the result of executing fn
 * @example
 * ```typescript
 * import { enableDebug, traceOperationAsync } from 'iterflow';
 *
 * enableDebug({ traceOperations: true });
 *
 * const data = await traceOperationAsync(
 *   'fetchUserData',
 *   async () => {
 *     const response = await fetch('/api/users');
 *     return response.json();
 *   },
 *   { endpoint: '/api/users' }
 * );
 * ```
 */
export async function traceOperationAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>,
): Promise<T> {
  if (!debugState.isEnabled()) {
    return fn();
  }

  const startTime = performance.now();
  const timestamp = Date.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      output: debugState.getConfig().traceOutput ? result : undefined,
      metadata,
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      error: error as Error,
      metadata,
    });

    throw error;
  }
}
