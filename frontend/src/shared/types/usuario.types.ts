export interface Usuario {
  idusuario: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  message: string;
  user: Usuario;
  accessToken: string;
  refreshToken: string;
}