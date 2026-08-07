import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.use(authMiddleware);

router.get('/', authorize('admin', 'vendedor'), categoryController.getCategories);
router.get('/:id', authorize('admin', 'vendedor'), categoryController.getCategoryById);
router.post('/', authorize('admin'), validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', authorize('admin'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authorize('admin'), categoryController.deleteCategory);

export default router;
