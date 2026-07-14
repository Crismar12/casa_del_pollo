import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authMiddleware);

router.get('/', authorize('admin', 'vendedor'), categoryController.getCategories);
router.get('/:id', authorize('admin', 'vendedor'), categoryController.getCategoryById);

export default router;
