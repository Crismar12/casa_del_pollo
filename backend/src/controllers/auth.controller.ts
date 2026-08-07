import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const { email, contrasena } = req.body;
    const result = await authService.verifyCredentials(email, contrasena);
    if (result) {
      res.json({ message: 'Login successful', ...result });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
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
  },

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, email, contrasena, rol } = req.body;
      const user = await authService.register(nombre, email, contrasena, rol);
      res.status(201).json({ message: 'User created', user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'Email already registered') {
        res.status(409).json({ error: message });
        return;
      }
      throw error;
    }
  },

  async getUsers(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string | undefined;
    const includeInactive = req.query.includeInactive === 'true';
    const users = await authService.listUsers(search, includeInactive);
    res.json(users);
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await authService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  },

  async updateUser(req: Request, res: Response): Promise<void> {
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
  },

  async deactivateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const currentUserId = (req as any).user?.id;
    const user = await authService.deactivateUser(id, currentUserId);
    res.json(user);
  },
};
