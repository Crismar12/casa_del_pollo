import { Router } from 'express';
import { clientController } from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authMiddleware);

router.post('', authorize('admin', 'vendedor'), clientController.createClient);

export default router;
