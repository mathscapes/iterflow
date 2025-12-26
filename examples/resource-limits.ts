/**
 * Resource Limits & Safety Features Example
 *
 * Demonstrates production-ready safety features introduced in v0.8.0:
 * - limit() - Prevent infinite loops
 * - timeout() - Timeout protection for async operations
 * - withSignal() - User cancellation with AbortController
 * - toArray(maxSize) - Safe collection with size limits
 * - Error handling - TimeoutError, AbortError, OperationError
 *
 * These features protect against runaway operations and resource exhaustion.
 */

import { iter, asyncIter, OperationError, TimeoutError, AbortError } from '../dist/index.js';

// ============================================================================
// Example 1: Preventing Infinite Loops with limit()
// ============================================================================

console.log('='.repeat(70));
console.log('Example 1: Preventing Infinite Loops with limit()');
console.log('='.repeat(70));

// Create an infinite generator
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// WITHOUT limit() - This would hang forever
<<<<<<< HEAD
// iter(infiniteSequence()).toArray(); // ❌ Don't run this!
=======
// iter(infiniteSequence()).toArray(); // Don't run this! (would hang)
>>>>>>> develop

// WITH limit() - Safe with hard limit
try {
  const result = iter(infiniteSequence())
    .map(x => x * 2)
    .limit(100)  // Throws if iteration exceeds 100
    .toArray();
<<<<<<< HEAD
  console.log('✅ Successfully processed with limit:', result.length, 'items');
} catch (error) {
  if (error instanceof OperationError) {
    console.error('❌ Caught OperationError:', error.message);
=======
  console.log('SUCCESS: Successfully processed with limit:', result.length, 'items');
} catch (error) {
  if (error instanceof OperationError) {
    console.error('ERROR: Caught OperationError:', error.message);
>>>>>>> develop
  }
}

// Demonstrate limit() with toArray(maxSize)
const safeCollection = iter(infiniteSequence())
  .limit(10000)     // Hard safety limit
  .take(1000)       // Process first 1000 items
  .toArray(100);    // Collect max 100 items

<<<<<<< HEAD
console.log('✅ Safe collection size:', safeCollection.length, 'items\n');
=======
console.log('SUCCESS: Safe collection size:', safeCollection.length, 'items\n');
>>>>>>> develop

// ============================================================================
// Example 2: Timeout Protection for Async Operations
// ============================================================================

console.log('='.repeat(70));
console.log('Example 2: Timeout Protection for Async Operations');
console.log('='.repeat(70));

// Simulate slow async operation
async function slowOperation(x: number, delayMs: number): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return x * 2;
}

// WITHOUT timeout() - Could hang indefinitely
<<<<<<< HEAD
// await asyncIter([1, 2, 3]).map(x => slowOperation(x, 10000)).toArray(); // ❌ Slow!
=======
// await asyncIter([1, 2, 3]).map(x => slowOperation(x, 10000)).toArray(); // Slow!
>>>>>>> develop

// WITH timeout() - Each iteration has timeout limit
try {
  const fastResults = await asyncIter([1, 2, 3])
    .map(async x => await slowOperation(x, 100))  // Fast operations
    .timeout(1000)  // 1 second timeout per iteration
    .toArray();
<<<<<<< HEAD
  console.log('✅ Fast operations completed:', fastResults);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('❌ Timeout:', error.message);
=======
  console.log('SUCCESS: Fast operations completed:', fastResults);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('ERROR: Timeout:', error.message);
>>>>>>> develop
  }
}

// Demonstrate timeout failure
try {
  await asyncIter([1, 2, 3])
    .map(async x => await slowOperation(x, 2000))  // Slow operations
    .timeout(1000)  // 1 second timeout - will fail
    .toArray();
  console.log('Should not reach here');
} catch (error) {
  if (error instanceof TimeoutError) {
<<<<<<< HEAD
    console.log('✅ Correctly caught timeout:', error.message);
=======
    console.log('SUCCESS: Correctly caught timeout:', error.message);
>>>>>>> develop
    console.log('   Timeout was:', error.timeoutMs, 'ms\n');
  }
}

// ============================================================================
// Example 3: User Cancellation with AbortController
// ============================================================================

console.log('='.repeat(70));
console.log('Example 3: User Cancellation with AbortController');
console.log('='.repeat(70));

// Simulate long-running batch processing
async function processBatch(controller: AbortController) {
  const items = Array.from({ length: 100 }, (_, i) => i);

  try {
    const result = await asyncIter(items)
      .withSignal(controller.signal)  // Enable cancellation
      .map(async x => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return x * 2;
      })
      .toArray();

<<<<<<< HEAD
    console.log('✅ Batch completed:', result.length, 'items');
    return result;
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('✅ Batch cancelled:', error.reason);
=======
    console.log('SUCCESS: Batch completed:', result.length, 'items');
    return result;
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('SUCCESS: Batch cancelled:', error.reason);
>>>>>>> develop
      console.log('   Processed some items before cancellation\n');
    }
    throw error;
  }
}

// Example: Start operation and cancel it
const controller1 = new AbortController();

// Start the batch
const batchPromise = processBatch(controller1);

// Simulate user clicking "Cancel" after 50ms
setTimeout(() => {
  controller1.abort('User clicked cancel button');
}, 50);

try {
  await batchPromise;
} catch (error) {
  // Expected cancellation
}

// ============================================================================
// Example 4: Safe Collection with toArray(maxSize)
// ============================================================================

console.log('='.repeat(70));
console.log('Example 4: Safe Collection with toArray(maxSize)');
console.log('='.repeat(70));

// Large dataset - only collect what we need
const hugeRange = iter.range(1000000);  // 1 million items

// WITHOUT maxSize - Would allocate 1M items (8MB+ memory)
<<<<<<< HEAD
// const allItems = hugeRange.toArray(); // ❌ Memory intensive

// WITH maxSize - Only collects what we need
const limitedItems = iter.range(1000000).toArray(100);
console.log('✅ Limited collection from huge range:', limitedItems.length, 'items');
=======
// const allItems = hugeRange.toArray(); // Memory intensive

// WITH maxSize - Only collects what we need
const limitedItems = iter.range(1000000).toArray(100);
console.log('SUCCESS: Limited collection from huge range:', limitedItems.length, 'items');
>>>>>>> develop

// Combine with other operations
const processedItems = iter.range(Infinity)
  .filter(x => x % 2 === 0)  // Even numbers only
  .map(x => x * x)           // Square them
  .toArray(10);              // Collect first 10

<<<<<<< HEAD
console.log('✅ Processed items:', processedItems);
=======
console.log('SUCCESS: Processed items:', processedItems);
>>>>>>> develop
console.log('   (First 10 even numbers, squared)\n');

// ============================================================================
// Example 5: Combining All Safety Features
// ============================================================================

console.log('='.repeat(70));
console.log('Example 5: Production-Ready Pattern (All Features Combined)');
console.log('='.repeat(70));

/**
 * Production-ready data processing with comprehensive safety features
 */
async function secureDataProcessing(
  data: Iterable<unknown>,
  signal: AbortSignal
): Promise<number[]> {
  const MAX_ITERATIONS = 100000;
  const MAX_COLLECTION = 1000;
  const TIMEOUT_PER_ITEM = 5000;  // 5 seconds

  try {
    const result = await asyncIter(data)
      // Layer 1: Limit total iterations (safety check)
      .limit(MAX_ITERATIONS)

      // Layer 2: Type validation and transformation
      .map(async (item) => {
        // Validate input type
        if (typeof item !== 'number') {
          throw new Error(`Invalid type: expected number, got ${typeof item}`);
        }

        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 1));

        return item * 2;
      })

      // Layer 3: Timeout protection
      .timeout(TIMEOUT_PER_ITEM)

      // Layer 4: User cancellation
      .withSignal(signal)

      // Layer 5: Safe collection
      .toArray(MAX_COLLECTION);

    return result;
  } catch (error) {
    if (error instanceof OperationError) {
<<<<<<< HEAD
      console.error('❌ Iteration limit exceeded:', error.context);
    } else if (error instanceof TimeoutError) {
      console.error('❌ Operation timeout:', error.timeoutMs, 'ms');
    } else if (error instanceof AbortError) {
      console.error('✅ User cancelled:', error.reason);
    } else {
      console.error('❌ Unexpected error:', error);
=======
      console.error('ERROR: Iteration limit exceeded:', error.context);
    } else if (error instanceof TimeoutError) {
      console.error('ERROR: Operation timeout:', error.timeoutMs, 'ms');
    } else if (error instanceof AbortError) {
      console.error('SUCCESS: User cancelled:', error.reason);
    } else {
      console.error('ERROR: Unexpected error:', error);
>>>>>>> develop
    }
    throw error;
  }
}

// Test with valid data
const controller2 = new AbortController();
const validData = Array.from({ length: 500 }, (_, i) => i);

const secureResult = await secureDataProcessing(validData, controller2.signal);
<<<<<<< HEAD
console.log('✅ Secure processing completed:', secureResult.length, 'items');
=======
console.log('SUCCESS: Secure processing completed:', secureResult.length, 'items');
>>>>>>> develop
console.log('   Multiple safety layers active:');
console.log('   - Iteration limit: 100,000');
console.log('   - Timeout per item: 5,000ms');
console.log('   - User cancellation: enabled');
console.log('   - Collection limit: 1,000 items\n');

// ============================================================================
// Example 6: Error Handling Best Practices
// ============================================================================

console.log('='.repeat(70));
console.log('Example 6: Error Handling Best Practices');
console.log('='.repeat(70));

/**
 * Demonstrates proper error handling for all safety features
 */
async function processWithErrorHandling() {
  const controller = new AbortController();

  try {
    // This will timeout
    await asyncIter([1, 2, 3])
      .map(async x => await slowOperation(x, 5000))
      .timeout(1000)
      .withSignal(controller.signal)
      .toArray();
  } catch (error) {
    if (error instanceof TimeoutError) {
<<<<<<< HEAD
      console.log('✅ Handled TimeoutError');
=======
      console.log('SUCCESS: Handled TimeoutError');
>>>>>>> develop
      console.log('   - Operation:', error.operation);
      console.log('   - Timeout:', error.timeoutMs, 'ms');
      console.log('   - Suggested action: Retry with longer timeout or split work\n');
      return;
    }

    if (error instanceof AbortError) {
<<<<<<< HEAD
      console.log('✅ Handled AbortError');
=======
      console.log('SUCCESS: Handled AbortError');
>>>>>>> develop
      console.log('   - Reason:', error.reason);
      console.log('   - Suggested action: Clean up resources, notify user\n');
      return;
    }

    if (error instanceof OperationError) {
<<<<<<< HEAD
      console.log('✅ Handled OperationError');
=======
      console.log('SUCCESS: Handled OperationError');
>>>>>>> develop
      console.log('   - Context:', error.context);
      console.log('   - Suggested action: Check for infinite loops, adjust limits\n');
      return;
    }

    // Unknown error
<<<<<<< HEAD
    console.error('❌ Unknown error:', error);
=======
    console.error('ERROR: Unknown error:', error);
>>>>>>> develop
    throw error;
  }
}

await processWithErrorHandling();

// ============================================================================
// Summary
// ============================================================================

console.log('='.repeat(70));
console.log('Summary: Resource Limits & Safety Features');
console.log('='.repeat(70));
console.log('');
<<<<<<< HEAD
console.log('✅ limit(maxIterations)     - Prevent infinite loops, throw error when exceeded');
console.log('✅ timeout(ms)              - Add timeout to async operations (per-iteration)');
console.log('✅ withSignal(signal)       - Enable user cancellation via AbortController');
console.log('✅ toArray(maxSize)         - Safely collect with size limits');
console.log('✅ Error Types              - TimeoutError, AbortError, OperationError');
=======
console.log('SUCCESS: limit(maxIterations)     - Prevent infinite loops, throw error when exceeded');
console.log('SUCCESS: timeout(ms)              - Add timeout to async operations (per-iteration)');
console.log('SUCCESS: withSignal(signal)       - Enable user cancellation via AbortController');
console.log('SUCCESS: toArray(maxSize)         - Safely collect with size limits');
console.log('SUCCESS: Error Types              - TimeoutError, AbortError, OperationError');
>>>>>>> develop
console.log('');
console.log('Production Best Practices:');
console.log('  1. Always use limit() for unknown-size iterators');
console.log('  2. Add timeout() to all async operations');
console.log('  3. Provide withSignal() for long operations');
console.log('  4. Use toArray(maxSize) instead of toArray()');
console.log('  5. Handle errors gracefully with specific error types');
console.log('');
console.log('See docs/guides/resource-limits.md for complete documentation.');
console.log('='.repeat(70));
