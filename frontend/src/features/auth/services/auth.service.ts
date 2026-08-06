import { apiClient } from '../../../shared/utils/apiClient';
import type { AuthResponse, Usuario } from '../../../shared/types/usuario.types';

interface LoginCredentials {
  email: string;
  contrasena: string;
}

interface RegisterData {
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response;
  },

  refreshAccessToken: async (refreshToken: string): Promise<string> => {
    const response = await apiClient.post<{ accessToken: string }>('/api/auth/refresh', { refreshToken });
    return response.accessToken;
  },

  register: async (data: RegisterData): Promise<{ message: string; user: Usuario }> => {
    const response = await apiClient.post<{ message: string; user: Usuario }>('/api/auth/register', data);
    return response;
  },

  getUsers: async (search?: string, includeInactive = true): Promise<Usuario[]> => {
    return await apiClient.get<Usuario[]>('/api/auth/users', {
      params: { search, includeInactive },
    });
  },

  updateUser: async (id: string, data: { nombre?: string; email?: string; rol?: string; activo?: boolean }): Promise<Usuario> => {
    return await apiClient.put<Usuario>(`/api/auth/users/${id}`, data);
  },

  deactivateUser: async (id: string): Promise<Usuario> => {
    return await apiClient.patch<Usuario>(`/api/auth/users/${id}/deactivate`, {});
  },
};
