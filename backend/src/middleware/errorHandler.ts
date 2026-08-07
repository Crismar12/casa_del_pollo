import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { OrderBusinessHoursError, InactiveProductError } from '../services/order.service';
import { OrderStatusLockedError, MissingCancelReasonError } from '../types/order.types';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Unhandled error:', err.message);

  if (err instanceof OrderBusinessHoursError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof InactiveProductError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof OrderStatusLockedError) {
    res.status(409).json({ error: err.message });
    return;
  }
  if (err instanceof MissingCancelReasonError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err.message === 'No puedes desactivar tu propia cuenta') {
    res.status(403).json({ error: err.message });
    return;
  }
  if (err.message === 'No puedes cambiar tu propio rol') {
    res.status(403).json({ error: err.message });
    return;
  }
  if (err.message === 'Email already registered') {
    res.status(409).json({ error: err.message });
    return;
  }
  if (err.message.includes('duplicate key') || err.message.includes('llave duplicada')) {
    res.status(409).json({ error: 'Ya existe un registro con ese valor' });
    return;
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};
