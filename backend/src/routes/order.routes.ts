import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { orderCreateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authMiddleware);

router.post('', authorize('admin', 'vendedor'), orderCreateLimiter, orderController.createOrder);
router.get('/', authorize('admin', 'vendedor'), orderController.getOrders);
router.get('/active-count', authorize('admin', 'vendedor'), orderController.getActiveOrdersCount);
router.get('/:id', authorize('admin', 'vendedor'), orderController.getOrderById);
router.patch('/:id/status', authorize('admin'), orderController.updateOrderStatus);

export default router;
