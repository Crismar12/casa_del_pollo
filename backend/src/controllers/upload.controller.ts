import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { logger } from '../utils/logger';

export const uploadController = {
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No se envió ningún archivo' });
        return;
      }

      const b64 = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: 'productos',
            transformation: [{ width: 800, height: 800, crop: 'limit' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        );
      });

      res.json({ imageUrl: result.secure_url });
    } catch (error: unknown) {
      logger.error('Error en uploadController.uploadImage:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error al subir la imagen' });
    }
  },
};
