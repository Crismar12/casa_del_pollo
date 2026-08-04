import { db } from '../config/database';
import { Product, CreateProductPayload, UpdateProductPayload } from '../types/product.types';

export const productRepository = {
  async getAll(categoryId?: string, includeInactive = false): Promise<Product[]> {
    const conditions: string[] = [];
    const params: (string | boolean)[] = [];
    let paramIndex = 1;

    if (!includeInactive) {
      conditions.push(`activo = $${paramIndex++}`);
      params.push(true);
    }
    if (categoryId) {
      conditions.push(`categoria_id = $${paramIndex++}`);
      params.push(categoryId);
    }

    const whereClause = conditions.length > 0
      ? ` WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await db.query(
      `SELECT *, "imgUrl" AS "imageUrl" FROM producto${whereClause}`,
      params
    );
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

  async create(data: CreateProductPayload): Promise<Product> {
    const result = await db.query(
      `INSERT INTO producto (nombre, descripcion, precio, "imgUrl", categoria_id, stock, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *, "imgUrl" AS "imageUrl"`,
      [
        data.nombre,
        data.descripcion ?? '',
        data.precio,
        data.imgUrl ?? null,
        data.categoria_id ?? null,
        data.stock ?? 0,
        data.activo ?? true,
      ]
    );
    return result.rows[0] as Product;
  },

  async update(id: string, data: UpdateProductPayload): Promise<Product | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (data.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push(`descripcion = $${paramIndex++}`);
      values.push(data.descripcion);
    }
    if (data.precio !== undefined) {
      fields.push(`precio = $${paramIndex++}`);
      values.push(data.precio);
    }
    if (data.imgUrl !== undefined) {
      fields.push(`"imgUrl" = $${paramIndex++}`);
      values.push(data.imgUrl);
    }
    if (data.categoria_id !== undefined) {
      fields.push(`categoria_id = $${paramIndex++}`);
      values.push(data.categoria_id);
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(data.stock);
    }
    if (data.activo !== undefined) {
      fields.push(`activo = $${paramIndex++}`);
      values.push(data.activo);
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const result = await db.query(
      `UPDATE producto SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *, "imgUrl" AS "imageUrl"`,
      values
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Product;
  },

  async remove(id: string): Promise<Product | null> {
    const result = await db.query(
      'DELETE FROM producto WHERE id = $1 RETURNING *, "imgUrl" AS "imageUrl"',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Product;
  },
};
