import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', authorize('admin', 'vendedor'), productController.getProducts);
router.get('/:id', authorize('admin', 'vendedor'), productController.getProductById);
router.post('/', authorize('admin'), validate(createProductSchema), productController.createProduct);
router.put('/:id', authorize('admin'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authorize('admin'), productController.deleteProduct);

export default router;
