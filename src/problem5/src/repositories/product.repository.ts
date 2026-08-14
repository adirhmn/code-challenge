import { Prisma, Product } from '@prisma/client';
import { prisma } from '../config/prisma';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../schemas/product.schema';

export class ProductRepository {
  async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findMany(query: GetProductsQuery): Promise<{ products: Product[]; total: number }> {
    const { search, category, status, minPrice, maxPrice, sortBy, order, page, limit } = query;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }
}
