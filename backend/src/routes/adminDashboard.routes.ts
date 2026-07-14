import { Router } from 'express';
import { adminDashboardController } from '../controllers/adminDashboard.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authMiddleware);

router.get('/most-sold', authorize('admin'), adminDashboardController.getMostSoldProducts);
router.get('/weekly-summary', authorize('admin'), adminDashboardController.getWeeklySalesSummary);
router.get('/summary', authorize('admin'), adminDashboardController.getDashboardSummary);

export default router;
