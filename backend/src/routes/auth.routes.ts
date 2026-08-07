import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { loginLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, updateUserSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/register', authMiddleware, authorize('admin'), validate(registerSchema), authController.register);

// Admin: list, edit, deactivate users
router.get('/users', authMiddleware, authorize('admin'), authController.getUsers);
router.get('/users/:id', authMiddleware, authorize('admin'), authController.getUserById);
router.put('/users/:id', authMiddleware, authorize('admin'), validate(updateUserSchema), authController.updateUser);
router.patch('/users/:id/deactivate', authMiddleware, authorize('admin'), authController.deactivateUser);

export default router;
