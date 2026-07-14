import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken);

export default router;
