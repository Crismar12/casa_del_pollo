import { Router } from 'express';
import { clientController } from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('', clientController.createClient);

export default router;
