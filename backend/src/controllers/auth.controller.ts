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

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const users = await authService.listUsers(search, includeInactive);
      res.json(users);
    } catch (error: unknown) {
      logger.error('Error in authController.getUsers:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Internal server error fetching users' });
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await authService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(user);
    } catch (error: unknown) {
      logger.error('Error in authController.getUserById:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Internal server error fetching user' });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, email, rol, activo } = req.body;
      const existing = await authService.getUserById(id);
      if (!existing) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const currentUserId = (req as any).user?.id;
      if (String(id) === String(currentUserId) && rol !== undefined && rol !== existing.rol) {
        res.status(403).json({ error: 'No puedes cambiar tu propio rol' });
        return;
      }

      const user = await authService.updateUser(id, { nombre, email, rol, activo });
      res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('duplicate key')) {
        res.status(409).json({ error: 'El email ya está en uso' });
        return;
      }
      logger.error('Error in authController.updateUser:', message);
      res.status(500).json({ error: 'Internal server error updating user' });
    }
  },

  async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUserId = (req as any).user?.id;
      const user = await authService.deactivateUser(id, currentUserId);
      res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'No puedes desactivar tu propia cuenta') {
        res.status(403).json({ error: message });
        return;
      }
      if (message.includes('not found')) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      logger.error('Error in authController.deactivateUser:', message);
      res.status(500).json({ error: 'Internal server error deactivating user' });
    }
  },
};
