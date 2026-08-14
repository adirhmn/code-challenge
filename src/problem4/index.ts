/**
 * Problem 4: Three ways to sum to n
 * Language: TypeScript / Node.js
 * 
 * Target: Calculate summation from 1 to n (i.e. 1 + 2 + ... + n)
 * Assumption: Output < Number.MAX_SAFE_INTEGER (9,007,199,254,740,991)
 */

/**
 * Implementation A: Iterative Loop
 * 
 * Algorithm: Linearly iterates from 1 up to n, accumulating the sum.
 * Mathematical Convention: Returns 0 for n <= 0, following the standard Empty Sum convention 
 * (summation from i = 1 to n over an empty range where n < 1 evaluates to 0).
 * Decimal handling: Truncates non-integer inputs using Math.floor.
 * 
 * Time Complexity: O(N) (Executes loop n times)
 * Space Complexity: O(1) (Uses a single scalar variable for accumulation)
 * Efficiency: Highly stable and safe from stack overflow for large n.
 */
export function sum_to_n_a(n: number): number {
  // Defensive input validation & Empty Sum convention (extra robustness beyond basic spec)
  if (!Number.isFinite(n) || n <= 0) return 0;
  n = Math.floor(n);
  
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation B: Gauss Mathematical Closed-Form Formula
 * 
 * Algorithm: Applies Gauss arithmetic progression formula: n * (n + 1) / 2.
 * Precision Rationale: n * (n + 1) is always even, so it lands on a value
 * float64 can represent exactly (IEEE 754 doubles represent all even
 * integers exactly up to 2^54, not just up to 2^53 - 1 = MAX_SAFE_INTEGER).
 * Since the problem guarantees the final sum stays below MAX_SAFE_INTEGER
 * (n up to ~134,217,727), this formula stays exact across that entire range.
 * 
 * Time Complexity: O(1) (Constant CPU arithmetic operations)
 * Space Complexity: O(1) (Zero additional memory allocation)
 * Efficiency: Optimal solution in speed and space.
 */
export function sum_to_n_b(n: number): number {
  // Defensive input validation & Empty Sum convention (extra robustness beyond basic spec)
  if (!Number.isFinite(n) || n <= 0) return 0;
  n = Math.floor(n);
  
  return (n * (n + 1)) / 2;
}

/**
 * Implementation C: Divide-and-Conquer Recursion
 * 
 * Algorithm: Recursively splits the range [start, end] into two halves [start, mid] and [mid + 1, end].
 * Why Divide-and-Conquer over Linear Recursion?
 * Linear recursion (n + sum(n-1)) has O(N) call stack depth, causing RangeError (Stack Overflow) 
 * in V8 Node.js when n > 10,000.
 * Divide-and-Conquer reduces recursion depth to O(log N). For n = 10^8, call stack depth is only ~27 frames!
 * 
 * Time Complexity: O(N) (Visits each integer once)
 * Space Complexity: O(log N) (Stack frames depth is bounded by log2(N))
 * Efficiency: Avoids call stack limit issues found in linear recursion.
 */
export function sum_to_n_c(n: number): number {
  // Defensive input validation & Empty Sum convention (extra robustness beyond basic spec)
  if (!Number.isFinite(n) || n <= 0) return 0;
  n = Math.floor(n);

  function rangeSum(start: number, end: number): number {
    if (start === end) return start;
    if (start > end) return 0;
    
    const mid = Math.floor((start + end) / 2);
    return rangeSum(start, mid) + rangeSum(mid + 1, end);
  }

  return rangeSum(1, n);
}
