import bcrypt from 'bcrypt';
import { authRepository } from '../repositories/auth.repository';
import { Usuario } from '../types/usuario.types';

export const authService = {
  async verifyCredentials(email: string, contrasena: string): Promise<Usuario | null> {
    const user = await authRepository.findByEmail(email);

    if (user && await bcrypt.compare(contrasena, user.contrasena)) {
      const { contrasena: _, ...userWithoutPassword } = user;
      return userWithoutPassword as Usuario;
    }
    return null;
  },
};
