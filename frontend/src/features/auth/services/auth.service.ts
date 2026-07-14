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
};
