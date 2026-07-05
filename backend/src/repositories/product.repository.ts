import { db } from '../config/database';
import { Product } from '../types/product.types';

export const productRepository = {
  async getAll(categoryId?: string): Promise<Product[]> {
    if (categoryId) {
      const result = await db.query(
        'SELECT *, "imgUrl" AS "imageUrl" FROM producto WHERE categoria_id = $1',
        [categoryId]
      );
      return result.rows as Product[];
    }
    const result = await db.query('SELECT *, "imgUrl" AS "imageUrl" FROM producto');
    return result.rows as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const result = await db.query(
      'SELECT *, "imgUrl" AS "imageUrl" FROM producto WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Product;
  },
};
