import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { apiKeyAuth } from '../middlewares/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductParamsSchema,
  getProductsQuerySchema,
} from '../schemas/product.schema';

const router = Router();
const controller = new ProductController();

// Public Read Endpoints
router.get('/', validate(getProductsQuerySchema), controller.getProducts);
router.get('/:id', validate(getProductParamsSchema), controller.getProductById);

// Protected Mutating Endpoints (Require valid x-api-key header)
router.post('/', apiKeyAuth, validate(createProductSchema), controller.createProduct);
router.put('/:id', apiKeyAuth, validate(updateProductSchema), controller.updateProduct);
router.delete('/:id', apiKeyAuth, validate(getProductParamsSchema), controller.deleteProduct);

export default router;
