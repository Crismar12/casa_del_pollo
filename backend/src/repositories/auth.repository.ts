import { db } from '../config/database';
import { Usuario } from '../types/usuario.types';

export const authRepository = {
  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Usuario;
  },

  async findById(id: string): Promise<Usuario | null> {
    const result = await db.query('SELECT * FROM usuario WHERE idusuario = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Usuario;
  },

  async create(nombre: string, email: string, contrasena: string, rol: string): Promise<Usuario> {
    const result = await db.query(
      'INSERT INTO usuario (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, contrasena, rol]
    );
    return result.rows[0] as Usuario;
  },
};
