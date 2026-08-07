import { Router } from 'express';
import { clientController } from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createClientSchema } from '../schemas/client.schema';

const router = Router();

router.use(authMiddleware);

router.post('', authorize('admin', 'vendedor'), validate(createClientSchema), clientController.createClient);

export default router;
