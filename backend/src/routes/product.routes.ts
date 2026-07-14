import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authMiddleware);

router.get('/', authorize('admin', 'vendedor'), productController.getProducts);
router.get('/:id', authorize('admin', 'vendedor'), productController.getProductById);

export default router;
