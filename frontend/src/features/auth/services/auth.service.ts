import { apiClient } from '../../../shared/utils/apiClient';
import type { AuthResponse } from '../../../shared/types/usuario.types';

interface LoginCredentials {
  email: string;
  contrasena: string;
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
};
