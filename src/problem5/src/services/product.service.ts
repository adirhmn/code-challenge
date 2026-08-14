import { Product } from '@prisma/client';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../schemas/product.schema';
import { NotFoundError } from '../errors/app-error';
import { PaginationMeta } from '../utils/response';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return this.repository.create(input);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' was not found`);
    }
    return product;
  }

  async getProducts(query: GetProductsQuery): Promise<{ products: Product[]; meta: PaginationMeta }> {
    const { products, total } = await this.repository.findMany(query);
    const { page, limit } = query;

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    // Check existence first
    await this.getProductById(id);
    return this.repository.update(id, input);
  }

  async deleteProduct(id: string): Promise<Product> {
    // Check existence first
    await this.getProductById(id);
    return this.repository.delete(id);
  }
}
