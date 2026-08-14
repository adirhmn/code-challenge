# 99Tech Code Challenge Solutions

Welcome! This repository contains the completed solutions for the **99Tech Code Challenge #1**, covering Problem 4, Problem 5, and Problem 6.

Each solution is organized within its respective directory under `src/` and includes dedicated documentation, automated tests, and setup instructions.

---

## Solutions Overview & Navigation

| Problem | Title & Description | Tech Stack / Focus | Documentation & Code |
| :--- | :--- | :--- | :--- |
| **Problem 4** | **Three Ways to Sum to N**<br>Three unique algorithmic implementations for range summation. | TypeScript, Node.js Test Runner | [Read Spec & Benchmarks](./src/problem4/README.md)<br>`src/problem4/` |
| **Problem 5** | **A Crude Server**<br>Full-featured RESTful Product Catalog CRUD backend service with API Key auth and edge-case validation. | ExpressJS, TypeScript, Prisma, SQLite, Zod, Jest, Postman | [Read API Specs & Setup](./src/problem5/README.md)<br>`src/problem5/` |
| **Problem 6** | **Architecture Spec: Live Score Board**<br>Production-grade backend software architecture specification for real-time leaderboard management and anti-cheat protection. | System Architecture, Redis ZSET, WebSockets, PostgreSQL, Mermaid | [Read Architecture Spec](./src/problem6/README.md)<br>`src/problem6/` |

---

## Problem Summaries & Key Highlights

### [Problem 4: Three Ways to Sum to N](./src/problem4/README.md)
* **Implementations**:
  1. `sum_to_n_a`: Iterative Loop (`O(N)` time, `O(1)` space).
  2. `sum_to_n_b`: Gauss Arithmetic Formula (`O(1)` time, `O(1)` space) with full IEEE 754 float64 precision boundary analysis.
  3. `sum_to_n_c`: Divide & Conquer Recursion (`O(N)` time, `O(log N)` stack depth) eliminating call stack overflow RangeErrors for `N > 1,000,000`.
* **Testing & Benchmarks**: 23 automated unit tests (`npm run test:problem4`) and execution benchmarks (`npm run benchmark:problem4`).

### [Problem 5: A Crude Server (Product CRUD API)](./src/problem5/README.md)
* **Architecture**: 4-Tier Clean Architecture (Routes, Controllers, Services, Repositories) with strict Zod DTO request validation and custom `AppError` hierarchy.
* **Features**: Complete CRUD operations, filtering (`category`, `status`, `minPrice`, `maxPrice`), keyword search, sorting, and pagination.
* **Security & Testing**: Protected mutating endpoints (`POST`, `PUT`, `DELETE`) with static API Key middleware (`x-api-key`). Verified with **28 comprehensive integration test scenarios** (`npm run problem5:test`).
* **Postman Collection**: Includes pre-configured Postman v2.1 collection ([postman_collection.json](./src/problem5/postman_collection.json)) with automated variable extraction.

### [Problem 6: Live Score Board Architecture Specification](./src/problem6/README.md)
* **Scope**: Production-ready software architecture specification document designed for backend engineering implementation teams.
* **Core Mechanisms**:
  * **Real-time Leaderboard**: Redis Sorted Sets (`ZSET`) for $O(\log N)$ rank queries and live WebSocket rank broadcasts.
  * **Anti-Cheat & Security**: 3-Tier Security Hierarchy (JWT Auth, HMAC-SHA256 Action Proof verification, Nonce Replay Protection with compensating DB rollback, Zero-Client-Trust score increments).
  * **TOCTOU-Safe Idempotency**: Atomic database unique constraint checks with two-phase status completion (`PROCESSING` $\rightarrow$ `COMPLETED`) and `425 Too Early` in-flight protection.
  * **Multi-Node Scaling**: Redis Pub/Sub horizontal WebSocket fan-out and local 1000ms instance debouncing.

---

## Workspace Quick Start & Commands

Install workspace dependencies from the root directory:

```bash
npm install
```

### Run All Workspace Unit & Integration Tests
```bash
npm test
```

### Problem-Specific Commands
* **Problem 4**:
  * `npm run test:problem4` - Run 23 unit tests
  * `npm run benchmark:problem4` - Run performance benchmarks
* **Problem 5**:
  * `npm run problem5:db:push` - Push SQLite Prisma database schema
  * `npm run problem5:db:seed` - Populate sample database products
  * `npm run problem5:dev` - Start development server at `http://localhost:3000`
  * `npm run problem5:test` - Run 28 API integration tests
  * `npm run problem5:build` - Compile production bundle
