import { z } from 'zod';

export const CategoryEnum = z.enum(['ELECTRONICS', 'CLOTHING', 'HOME', 'BOOKS', 'BEAUTY', 'SPORTS']);
export const StatusEnum = z.enum(['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED']);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
    description: z.string().min(5, 'Description must be at least 5 characters long').max(1000),
    price: z.number().positive('Price must be greater than 0'),
    category: CategoryEnum,
    status: StatusEnum.optional().default('ACTIVE'),
    stock: z.number().int().nonnegative('Stock cannot be negative').optional().default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(5).max(1000).optional(),
    price: z.number().positive().optional(),
    category: CategoryEnum.optional(),
    status: StatusEnum.optional(),
    stock: z.number().int().nonnegative().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getProductParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: CategoryEnum.optional(),
    status: StatusEnum.optional(),
    minPrice: z.string().optional().transform((val) => (val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined)),
    sortBy: z.enum(['createdAt', 'price', 'name', 'stock']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().transform((val) => {
      if (!val) return 1;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
    limit: z.string().optional().transform((val) => {
      if (!val) return 10;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1) return 10;
      return parsed > 100 ? 100 : parsed;
    }),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>['query'];
