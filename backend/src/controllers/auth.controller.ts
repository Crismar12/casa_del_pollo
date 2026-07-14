import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, contrasena } = req.body;
      const result = await authService.verifyCredentials(email, contrasena);

      if (result) {
        res.json({ message: 'Login successful', ...result });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error: unknown) {
      logger.error('Error in authController.login:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }

      const payload = authService.verifyRefreshToken(refreshToken);

      if (!payload) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
        return;
      }

      const { authRepository } = await import('../repositories/auth.repository');
      const user = await authRepository.findById(payload.id);

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      const accessToken = authService.generateAccessToken(user.idusuario, user.email, user.rol);
      res.json({ accessToken });
    } catch (error: unknown) {
      logger.error('Error in authController.refreshToken:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Internal server error during token refresh' });
    }
  },

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, email, contrasena, rol } = req.body;

      if (!nombre || !email || !contrasena || !rol) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const user = await authService.register(nombre, email, contrasena, rol);
      res.status(201).json({ message: 'User created', user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'Email already registered') {
        res.status(409).json({ error: message });
      } else {
        logger.error('Error in authController.register:', message);
        res.status(500).json({ error: 'Internal server error during registration' });
      }
    }
  },
};
