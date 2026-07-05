import { db } from '../config/database';
import { Category } from '../types/category.types';

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const result = await db.query('SELECT * FROM categorias');
    return result.rows as Category[];
  },

  async getById(id: string): Promise<Category | null> {
    const result = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Category;
  },
};
