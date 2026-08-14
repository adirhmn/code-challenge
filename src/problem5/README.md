# Problem 5: A Crude Server (ExpressJS + TypeScript + Prisma)

A backend CRUD service for managing a **Product Catalog**, built with **ExpressJS**, **TypeScript**, **Prisma ORM**, and **SQLite**.

---

## Architecture & Features

- **Layered Clean Architecture**: Strict separation of concerns between Routes, Controllers, Services, Repositories, and Data Models.
- **Type Safety & Validation**: Built with TypeScript and **Zod** schema validation for request inputs (`body`, `query`, `params`).
- **Data Persistence**: **Prisma ORM** with **SQLite** database (zero database setup required for reviewers).
- **API Key Authentication**: Mutating endpoints (`POST`, `PUT`, `DELETE`) are protected by Static API Key middleware (`x-api-key`), while read endpoints (`GET`) remain public.
- **Centralized Error Handling**: Standardized HTTP JSON response format for both success payloads and error states.
- **Security & Utilities**: Configured with `helmet`, `cors`, and graceful shutdown (`SIGTERM`/`SIGINT`).
- **Automated Seeding & Testing**: Pre-configured sample seed data and integration test suite with `supertest` & `jest`.

---

## Project Structure

```
src/problem5/
├── prisma/
│   ├── schema.prisma       # Prisma schema & SQLite datasource definition
│   └── seed.ts             # Seed script with sample product dataset
├── src/
│   ├── config/             # Environment validation & Prisma client singleton
│   ├── controllers/        # HTTP Handlers (ProductController)
│   ├── errors/             # AppError custom error hierarchy
│   ├── middlewares/        # Express error handler & Zod validation middleware
│   ├── repositories/       # Data Access Layer (ProductRepository)
│   ├── routes/             # Express API Routers (product.routes.ts)
│   ├── schemas/            # Zod DTO Validation Schemas (product.schema.ts)
│   ├── services/           # Business Logic Layer (ProductService)
│   ├── utils/              # Standardized API response helpers
│   ├── app.ts              # Express App setup & middleware registration
│   └── server.ts           # Server bootstrap & Graceful shutdown
├── tests/
│   └── product.test.ts     # Automated API Integration Tests
├── .env.example            # Environment variables configuration template
├── jest.config.json        # Jest test runner configuration
├── postman_collection.json # Ready-to-import Postman Collection v2.1
└── tsconfig.json           # TypeScript configuration
```

---

## Getting Started

### 1. Installation

Install all workspace dependencies from the root directory:

```bash
npm install
```

### 2. Environment Configuration

Create the `.env` configuration file from the template:

```bash
# On Linux / macOS / Git Bash
cp src/problem5/.env.example src/problem5/.env

# On Windows PowerShell
Copy-Item src/problem5/.env.example src/problem5/.env
```

### 3. Database Migration & Setup

Generate the Prisma Client and push the schema to the SQLite database:

```bash
npm run problem5:db:push
```

### 4. Seed & Reset Sample Data

Populate or reset the database with fresh sample products (this will clear existing product records and re-insert the initial sample dataset):

```bash
npm run problem5:db:seed
# or
npm run problem5:db:reset
```

### 5. Run Development Server

Start the development server with hot-reloading:

```bash
npm run problem5:dev
```

The server will start at `http://localhost:3000`. You can test health check at `GET http://localhost:3000/health`.

### 6. Run Automated Tests

Execute the full integration test suite:

```bash
npm run problem5:test
```

### 7. Production Build & Start

Compile TypeScript to JavaScript and run the production bundle:

```bash
npm run problem5:build
npm run problem5:start
```

## API Documentation & Examples

Base URL: `http://localhost:3000/api/v1/products`

### Postman Collection Import

A ready-to-use Postman Collection is provided in [postman_collection.json](./postman_collection.json).

**How to Import & Use:**
1. Open Postman, click **Import** button in the top left.
2. Drag and drop [postman_collection.json](./postman_collection.json) or browse to select the file.
3. The collection **Problem 5 - Product CRUD API** will appear with pre-configured requests (`Health Check`, `Create Product`, `List Products`, `Get Details`, `Update Product`, `Delete Product`).
4. Running **Create Product** automatically saves the new product ID into the collection variable `productId`, allowing subsequent Get/Update/Delete requests to work seamlessly out-of-the-box.

### Standard Response Formats

**Success Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product with ID 'xyz' was not found"
  }
}
```

---

### Endpoints

#### 1. Create a Product
- **Endpoint**: `POST /api/v1/products`
- **Header**: `x-api-key: my-secret-api-key`
- **Body**:
```json
{
  "name": "Wireless Ergonomic Mouse",
  "description": "2.4GHz rechargeable ergonomic vertical optical mouse",
  "price": 35.99,
  "category": "ELECTRONICS",
  "status": "ACTIVE",
  "stock": 50
}
```
- **cURL Example**:
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{
    "name": "Wireless Ergonomic Mouse",
    "description": "2.4GHz rechargeable ergonomic vertical optical mouse",
    "price": 35.99,
    "category": "ELECTRONICS",
    "status": "ACTIVE",
    "stock": 50
  }'
```

---

#### 2. List Products (with Filtering, Search & Pagination)
- **Endpoint**: `GET /api/v1/products`
- **Supported Query Parameters**:
  - `search`: Keyword matching name or description (e.g. `?search=mouse`)
  - `category`: `ELECTRONICS` | `CLOTHING` | `HOME` | `BOOKS` | `BEAUTY` | `SPORTS`
  - `status`: `DRAFT` | `ACTIVE` | `OUT_OF_STOCK` | `ARCHIVED`
  - `minPrice`: Minimum price threshold
  - `maxPrice`: Maximum price threshold
  - `sortBy`: `createdAt` | `price` | `name` | `stock` (default: `createdAt`)
  - `order`: `asc` | `desc` (default: `desc`)
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`)

- **cURL Example**:
```bash
curl "http://localhost:3000/api/v1/products?category=ELECTRONICS&minPrice=100&sortBy=price&order=asc&page=1&limit=5"
```

---

#### 3. Get Product Details
- **Endpoint**: `GET /api/v1/products/:id`
- **cURL Example**:
```bash
curl http://localhost:3000/api/v1/products/<PRODUCT_ID>
```

---

#### 4. Update Product Details
- **Endpoint**: `PUT /api/v1/products/:id`
- **Header**: `x-api-key: my-secret-api-key`
- **Body**: (At least one field to update)
```json
{
  "price": 29.99,
  "stock": 45,
  "status": "ACTIVE"
}
```
- **cURL Example**:
```bash
curl -X PUT http://localhost:3000/api/v1/products/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{
    "price": 29.99,
    "stock": 45
  }'
```

---

#### 5. Delete a Product
- **Endpoint**: `DELETE /api/v1/products/:id`
- **Header**: `x-api-key: my-secret-api-key`
- **cURL Example**:
```bash
curl -X DELETE http://localhost:3000/api/v1/products/<PRODUCT_ID> \
  -H "x-api-key: my-secret-api-key"
```
