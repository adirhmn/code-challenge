import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/prisma';

const app = createApp();
const API_KEY = 'my-secret-api-key';

describe('Product CRUD API Comprehensive & Edge Case Integration Tests', () => {
  let createdProductId: string;

  beforeAll(async () => {
    // Clear test database before running tests
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /health (Health Check)', () => {
    it('should return ok status for GET /health', async () => {
      const response = await request(app).get('/health').expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('API Key Authentication Edge Cases', () => {
    it('should reject POST with 401 when x-api-key header is missing', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Keyboard', description: 'RGB keyboard', price: 99.99, category: 'ELECTRONICS' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject POST with 401 when x-api-key is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', 'wrong-key')
        .send({ name: 'Keyboard', description: 'RGB keyboard', price: 99.99, category: 'ELECTRONICS' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should accept Bearer token format in Authorization header', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({
          name: 'Bearer Token Test Product',
          description: 'Testing authorization bearer token header format',
          price: 49.99,
          category: 'ELECTRONICS',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/products (Create Product Input & Validation Edge Cases)', () => {
    it('should create a new product successfully with valid input and API key', async () => {
      const payload = {
        name: 'Test Gaming Laptop',
        description: 'High performance gaming laptop with RTX 4080 GPU',
        price: 2199.99,
        category: 'ELECTRONICS',
        status: 'ACTIVE',
        stock: 10,
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send(payload)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(payload.name);
      expect(response.body.data.price).toBe(payload.price);
      expect(response.body.data.category).toBe(payload.category);

      createdProductId = response.body.data.id;
    });

    it('should reject when name is too short (< 2 chars)', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'A', description: 'Valid description text', price: 10, category: 'HOME' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject when description is too short (< 5 chars)', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'Valid Name', description: 'Tiny', price: 10, category: 'HOME' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject non-positive price (zero or negative)', async () => {
      await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'Valid Name', description: 'Valid description text', price: 0, category: 'HOME' })
        .expect(400);

      await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'Valid Name', description: 'Valid description text', price: -99.99, category: 'HOME' })
        .expect(400);
    });

    it('should reject invalid category enum value', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'Valid Name', description: 'Valid description text', price: 100, category: 'NON_EXISTENT_CATEGORY' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject negative stock value', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('x-api-key', API_KEY)
        .send({ name: 'Valid Name', description: 'Valid description text', price: 100, category: 'BOOKS', stock: -5 })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/products (List & Filter Edge Cases)', () => {
    beforeAll(async () => {
      // Seed a few items for filter tests
      await prisma.product.createMany({
        data: [
          { name: 'Wireless Ergonomic Mouse', description: 'Ergonomic optical mouse', price: 29.99, category: 'ELECTRONICS', status: 'ACTIVE', stock: 50 },
          { name: 'Cotton T-Shirt Minimalist', description: 'Comfortable casual wear', price: 19.99, category: 'CLOTHING', status: 'ACTIVE', stock: 100 },
          { name: 'Electric Standing Desk', description: 'Electric standing desk frame', price: 399.00, category: 'HOME', status: 'DRAFT', stock: 5 },
          { name: 'Node.js Architecture Book', description: 'Senior engineering practices', price: 49.99, category: 'BOOKS', status: 'ACTIVE', stock: 20 },
        ],
      });
    });

    it('should retrieve list of products without requiring API key', async () => {
      const response = await request(app)
        .get('/api/v1/products?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('totalPages');
    });

    it('should handle invalid page or limit query params gracefully (fallback to defaults)', async () => {
      const response = await request(app)
        .get('/api/v1/products?page=-5&limit=abc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
    });

    it('should return empty list when search keyword matches no products', async () => {
      const response = await request(app)
        .get('/api/v1/products?search=NonExistentKeyword99999')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.total).toBe(0);
    });

    it('should return empty list when minPrice > maxPrice', async () => {
      const response = await request(app)
        .get('/api/v1/products?minPrice=500&maxPrice=100')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should sort products correctly by price in ascending order', async () => {
      const response = await request(app)
        .get('/api/v1/products?sortBy=price&order=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      const prices = response.body.data.map((p: any) => p.price);
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });

    it('should reject invalid category filter enum', async () => {
      const response = await request(app)
        .get('/api/v1/products?category=INVALID_ENUM')
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/products/:id (Get Detail Edge Cases)', () => {
    it('should return product detail for existing ID without API key', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${createdProductId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdProductId);
    });

    it('should return 400 Validation Error for non-UUID id param format', async () => {
      const response = await request(app)
        .get('/api/v1/products/invalid-uuid-123')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 Not Found for non-existent valid UUID', async () => {
      const randomUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/v1/products/${randomUuid}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/v1/products/:id (Update Product Edge Cases)', () => {
    it('should reject update without API key with 401', async () => {
      await request(app)
        .put(`/api/v1/products/${createdProductId}`)
        .send({ price: 1999.99 })
        .expect(401);
    });

    it('should reject update with empty body {} with 400', async () => {
      const response = await request(app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('x-api-key', API_KEY)
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 Not Found when updating a non-existent valid UUID', async () => {
      const randomUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .put(`/api/v1/products/${randomUuid}`)
        .set('x-api-key', API_KEY)
        .send({ price: 2999.99 })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should update partial product fields successfully with valid API key', async () => {
      const updatePayload = {
        price: 1999.99,
        stock: 25,
      };

      const response = await request(app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('x-api-key', API_KEY)
        .send(updatePayload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(updatePayload.price);
      expect(response.body.data.stock).toBe(updatePayload.stock);
    });
  });

  describe('DELETE /api/v1/products/:id (Delete Product Edge Cases)', () => {
    it('should reject delete without API key with 401', async () => {
      await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .expect(401);
    });

    it('should return 404 Not Found when deleting a non-existent UUID', async () => {
      const randomUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`/api/v1/products/${randomUuid}`)
        .set('x-api-key', API_KEY)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should delete product successfully with valid API key', async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('x-api-key', API_KEY)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdProductId);

      // Verify item no longer exists (subsequent GET returns 404)
      await request(app)
        .get(`/api/v1/products/${createdProductId}`)
        .expect(404);
    });

    it('should return 404 when attempting to delete the same product again', async () => {
      await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('x-api-key', API_KEY)
        .expect(404);
    });
  });

  describe('Global Unhandled Route Handling', () => {
    it('should return 404 ROUTE_NOT_FOUND for non-existent API routes', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });
});
