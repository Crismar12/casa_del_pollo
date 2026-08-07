import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authMiddleware);

router.post('/', authorize('admin'), upload.single('image'), uploadController.uploadImage);

export default router;
