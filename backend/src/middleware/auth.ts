import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../config/tokens';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, tokenConfig.accessSecret) as { id: string; email: string; rol: string };
    req.user = { id: payload.id, email: payload.email, rol: payload.rol };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
