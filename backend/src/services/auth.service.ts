import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository';
import { Usuario } from '../types/usuario.types';
import { tokenConfig } from '../config/tokens';

interface AuthTokens {
  user: Omit<Usuario, 'contrasena'>;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async verifyCredentials(email: string, contrasena: string): Promise<AuthTokens | null> {
    const user = await authRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return null;
    }

    const { contrasena: _, ...userWithoutPassword } = user;

    const accessOptions: SignOptions = { expiresIn: tokenConfig.accessExpiration as unknown as number };
    const refreshOptions: SignOptions = { expiresIn: tokenConfig.refreshExpiration as unknown as number };

    const accessToken = jwt.sign(
      { id: userWithoutPassword.idusuario, email: userWithoutPassword.email, rol: userWithoutPassword.rol },
      tokenConfig.accessSecret,
      accessOptions
    );

    const refreshToken = jwt.sign(
      { id: userWithoutPassword.idusuario },
      tokenConfig.refreshSecret,
      refreshOptions
    );

    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  verifyRefreshToken(token: string): { id: string } | null {
    try {
      const payload = jwt.verify(token, tokenConfig.refreshSecret) as { id: string };
      return payload;
    } catch {
      return null;
    }
  },

  generateAccessToken(userId: string, email: string, rol: string): string {
    const options: SignOptions = { expiresIn: tokenConfig.accessExpiration as unknown as number };
    return jwt.sign(
      { id: userId, email, rol },
      tokenConfig.accessSecret,
      options
    );
  },
};
