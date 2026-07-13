import { Router } from 'express';
import { adminDashboardController } from '../controllers/adminDashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/most-sold', adminDashboardController.getMostSoldProducts);
router.get('/weekly-summary', adminDashboardController.getWeeklySalesSummary);
router.get('/summary', adminDashboardController.getDashboardSummary);

export default router;
