import { db } from '../config/database';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.types';

export const categoryRepository = {
  async getAll(includeInactive = false): Promise<Category[]> {
    if (!includeInactive) {
      const result = await db.query("SELECT * FROM categorias WHERE activo = true");
      return result.rows as Category[];
    }
    const result = await db.query('SELECT * FROM categorias');
    return result.rows as Category[];
  },

  async getById(id: string): Promise<Category | null> {
    const result = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Category;
  },

  async create(data: CreateCategoryPayload): Promise<Category> {
    const result = await db.query(
      'INSERT INTO categorias (nombre, descripcion, activo) VALUES ($1, $2, $3) RETURNING *',
      [data.nombre, data.descripcion ?? null, data.activo ?? true]
    );
    return result.rows[0] as Category;
  },

  async update(id: string, data: UpdateCategoryPayload): Promise<Category | null> {
    const fields: string[] = [];
    const values: (string | boolean | null)[] = [];
    let paramIndex = 1;

    if (data.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push(`descripcion = $${paramIndex++}`);
      values.push(data.descripcion);
    }
    if (data.activo !== undefined) {
      fields.push(`activo = $${paramIndex++}`);
      values.push(data.activo);
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const result = await db.query(
      `UPDATE categorias SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Category;
  },

  async remove(id: string): Promise<Category | null> {
    const result = await db.query(
      "UPDATE categorias SET activo = false WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Category;
  },
};
