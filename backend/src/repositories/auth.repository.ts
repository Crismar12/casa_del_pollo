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

  async getAll(search?: string, includeInactive = false): Promise<Usuario[]> {
    const conditions: string[] = [];
    const params: (string | boolean)[] = [];
    let idx = 1;

    if (!includeInactive) {
      conditions.push(`activo = $${idx++}`);
      params.push(true);
    }
    if (search) {
      conditions.push(`(nombre ILIKE $${idx} OR email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await db.query(`SELECT idusuario, nombre, email, rol, activo FROM usuario${where} ORDER BY nombre ASC`, params);
    return result.rows as Usuario[];
  },

  async update(id: string, data: { nombre?: string; email?: string; rol?: string; activo?: boolean }): Promise<Usuario | null> {
    const fields: string[] = [];
    const values: (string | boolean)[] = [];
    let idx = 1;

    if (data.nombre !== undefined) {
      fields.push(`nombre = $${idx++}`);
      values.push(data.nombre);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(data.email);
    }
    if (data.rol !== undefined) {
      fields.push(`rol = $${idx++}`);
      values.push(data.rol);
    }
    if (data.activo !== undefined) {
      fields.push(`activo = $${idx++}`);
      values.push(data.activo);
    }
    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await db.query(
      `UPDATE usuario SET ${fields.join(', ')} WHERE idusuario = $${idx} RETURNING idusuario, nombre, email, rol, activo`,
      values
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Usuario;
  },

  async deactivate(id: string): Promise<Usuario | null> {
    const result = await db.query(
      "UPDATE usuario SET activo = false WHERE idusuario = $1 RETURNING idusuario, nombre, email, rol, activo",
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Usuario;
  },
};
