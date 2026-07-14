import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/register', authMiddleware, authorize('admin'), authController.register);

export default router;
