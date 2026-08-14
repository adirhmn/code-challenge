import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

describe('Problem 4: Sum to N Unit Tests', () => {
  const fns = [
    { name: 'sum_to_n_a (Iterative Loop)', fn: sum_to_n_a },
    { name: 'sum_to_n_b (Gauss Formula)', fn: sum_to_n_b },
    { name: 'sum_to_n_c (Divide & Conquer)', fn: sum_to_n_c },
  ];

  for (const { name, fn } of fns) {
    describe(name, () => {
      it('should return 15 for n = 5', () => {
        assert.strictEqual(fn(5), 15);
      });

      it('should return 1 for n = 1', () => {
        assert.strictEqual(fn(1), 1);
      });

      it('should return 0 for n = 0', () => {
        assert.strictEqual(fn(0), 0);
      });

      it('should return 0 for negative input (n = -10)', () => {
        assert.strictEqual(fn(-10), 0);
      });

      it('should return 5050 for n = 100', () => {
        assert.strictEqual(fn(100), 5050);
      });

      it('should handle floating point input by flooring (n = 5.8 => 15)', () => {
        assert.strictEqual(fn(5.8), 15);
      });

      it('should return 0 for NaN / non-finite inputs', () => {
        assert.strictEqual(fn(NaN), 0);
        assert.strictEqual(fn(Infinity), 0);
      });
    });
  }

  describe('sum_to_n_c (Divide & Conquer) - stack safety', () => {
    it('should not throw RangeError for large n (n = 1,000,000)', () => {
      assert.doesNotThrow(() => sum_to_n_c(1_000_000));
    });

    it('should match Gauss formula result for large n', () => {
      assert.strictEqual(sum_to_n_c(1_000_000), sum_to_n_b(1_000_000));
    });
  });
});
