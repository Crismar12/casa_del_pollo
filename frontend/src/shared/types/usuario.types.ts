export interface Usuario {
  idusuario: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

export interface AuthResponse {
  message: string;
  user: Usuario;
  accessToken: string;
  refreshToken: string;
}