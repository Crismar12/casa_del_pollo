import { db } from '../config/database';
import { Usuario } from '../types/usuario.types';

export const authRepository = {
  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Usuario;
  },
};
