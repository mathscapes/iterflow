import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Examples Test Suite
 *
 * Validates that all committed examples run without errors.
 * This ensures examples stay in sync with the library API.
 */

describe('Examples', () => {
  const examplesDir = path.join(__dirname, '../examples');
  const timeout = 10000; // 10s per example

  describe('Foundational Examples', () => {
    it('should run basic-stats.ts without errors', async () => {
      const { stdout, stderr } = await execAsync(
        `npx tsx ${path.join(examplesDir, 'basic-stats.ts')}`
      );

      expect(stderr).toBe('');
      expect(stdout).toContain('Mean:');
      expect(stdout).toContain('Median:');
      expect(stdout).toContain('Sum:');
    }, timeout);

    it('should run moving-average.ts without errors', async () => {
      const { stdout, stderr } = await execAsync(
        `npx tsx ${path.join(examplesDir, 'moving-average.ts')}`
      );

      expect(stderr).toBe('');
      expect(stdout).toContain('moving average');
    }, timeout);

    it('should run fibonacci.ts without errors', async () => {
      const { stdout, stderr } = await execAsync(
        `npx tsx ${path.join(examplesDir, 'fibonacci.ts')}`
      );

      expect(stderr).toBe('');
      expect(stdout).toContain('Fibonacci');
    }, timeout);

    it('should run chaining.ts without errors', async () => {
      const { stdout, stderr } = await execAsync(
        `npx tsx ${path.join(examplesDir, 'chaining.ts')}`
      );

      expect(stderr).toBe('');
      expect(stdout).toContain('Sales');
    }, timeout);
  });
});
