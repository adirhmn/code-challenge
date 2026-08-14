import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../schemas/product.schema';

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body as CreateProductInput;
      const product = await this.service.createProduct(input);
      return sendSuccess(res, product, 201);
    } catch (error) {
      next(error);
    }
  };

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as GetProductsQuery;
      const { products, meta } = await this.service.getProducts(query);
      return sendSuccess(res, products, 200, meta);
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.getProductById(req.params.id);
      return sendSuccess(res, product, 200);
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body as UpdateProductInput;
      const product = await this.service.updateProduct(req.params.id, input);
      return sendSuccess(res, product, 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.service.deleteProduct(req.params.id);
      return sendSuccess(res, { id: deleted.id, message: 'Product deleted successfully' }, 200);
    } catch (error) {
      next(error);
    }
  };
}
