# Problem 4: Three Ways to Sum to N

## Overview
This directory contains 3 unique TypeScript implementations for calculating the summation of integers from `1` to `n` (i.e. `1 + 2 + 3 + ... + n`), focusing on efficiency, input safety, and V8 call stack limits.

## Implementations & Complexity Analysis

### 1. `sum_to_n_a` (Iterative Loop)
* **Algorithm**: Standard imperative `for` loop iterating from `1` up to `n`.
* **Time Complexity**: `O(N)` (Executes loop `N` times)
* **Space Complexity**: `O(1)` (Constant memory usage)
* **Technical Notes**: Imperative loops in JavaScript/V8 are optimized by the TurboFan JIT compiler and safe from call stack overflow regardless of `n`.

### 2. `sum_to_n_b` (Gauss Closed-Form Formula)
* **Algorithm**: Arithmetic progression formula `(n * (n + 1)) / 2`.
* **Time Complexity**: `O(1)` (Single CPU arithmetic operation)
* **Space Complexity**: `O(1)` (Zero additional memory allocation)
* **Technical Notes**: Most efficient implementation in both time and space. `n * (n + 1)` is always even, so it lands on a value float64 can represent exactly (IEEE 754 doubles represent all even integers exactly up to 2<sup>54</sup>, not just up to 2<sup>53</sup> - 1 = `Number.MAX_SAFE_INTEGER`). Since the problem guarantees the final sum stays below `Number.MAX_SAFE_INTEGER` (`n` up to ~134,217,727), this formula stays exact across that entire range.

### 3. `sum_to_n_c` (Divide-and-Conquer Recursion)
* **Algorithm**: Recursive range splitting `[start, end]` into `[start, mid]` and `[mid + 1, end]`.
* **Time Complexity**: `O(N)` (Visits each integer in the range once)
* **Space Complexity**: `O(log N)` (Bounded by `log2(N)` call stack frames)
* **Technical Notes**: Standard linear recursion (`n + sum(n-1)`) has `O(N)` call stack depth, triggering `RangeError: Maximum call stack size exceeded` in Node.js when `n > 10,000`. Using Divide-and-Conquer reduces maximum stack depth for `n = 10,000,000` to ~24 frames, preventing stack overflow.

---

## Edge Cases & Guards
- **Empty Sum Convention**: Returns `0` for `n <= 0`, adhering to the standard mathematical Empty Sum convention (summation of `1` to `n` over an empty range where `n < 1`).
- **Non-finite Protection**: Rejects non-finite values (`NaN`, `Infinity`).
- **Floating-point Truncation**: Truncates decimal inputs using `Math.floor(n)`.

---

## Verification & Execution Commands

### 1. Running Native Unit Tests
```bash
npm test
# OR
npm run test:problem4
# OR
npx tsx --test src/problem4/index.test.ts
```

### 2. Running Performance Benchmarks
```bash
npm run benchmark:problem4
# OR
npx tsx src/problem4/benchmark.ts
```

#### Benchmark Results (N = 10,000,000)
- `sum_to_n_b` (Gauss `O(1)`): **0.0038 ms** (Constant CPU cycles, 0.33 KB heap)
- `sum_to_n_a` (Loop `O(N)`): **8.1445 ms** (Linear time, 0.00 KB heap)
- `sum_to_n_c` (D&C `O(N)`): **116.8192 ms** (Logarithmic stack depth, 0 Stack Overflow errors)
