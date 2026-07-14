import { useState, useEffect, useCallback } from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { setRefreshTokenFn } from '../utils/apiClient';
import type { Usuario } from '../types/usuario.types';

const STORAGE_KEYS = {
  usuario: 'usuario',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.usuario);
    const storedAccessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

    if (storedUser && storedAccessToken && storedRefreshToken) {
      setUsuario(JSON.parse(storedUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.usuario);
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, contrasena: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.login({ email, contrasena });
      localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(authResponse.user));
      localStorage.setItem(STORAGE_KEYS.accessToken, authResponse.accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, authResponse.refreshToken);
      setUsuario(authResponse.user);
      return authResponse.user;
    } catch (error) {
      console.error('Login failed:', error);
      setUsuario(null);
      localStorage.removeItem(STORAGE_KEYS.usuario);
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEYS.usuario);
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  }, []);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }, []);

  const getRefreshToken = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.refreshToken);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) return null;

    try {
      const newAccessToken = await authService.refreshAccessToken(refreshToken);
      localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken);
      return newAccessToken;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    setRefreshTokenFn(refreshAccessToken);
  }, [refreshAccessToken]);

  return { usuario, loading, login, logout, getAccessToken, getRefreshToken, refreshAccessToken };
};
