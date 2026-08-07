import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  async getProducts(req: Request, res: Response): Promise<void> {
    const categoryId = req.query.categoryId as string | undefined;
    const includeInactive = req.query.includeInactive === 'true';
    const products = await productService.listAllProducts(categoryId, includeInactive);
    res.json(products);
  },

  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.getProductDetails(id);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  },

  async createProduct(req: Request, res: Response): Promise<void> {
    const { nombre, precio, descripcion, imgUrl, categoria_id, stock, activo } = req.body;
    const product = await productService.createProduct({
      nombre,
      precio,
      descripcion,
      imgUrl,
      categoria_id,
      stock,
      activo,
    });
    res.status(201).json(product);
  },

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  },

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.deleteProduct(id);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({ message: 'Producto eliminado correctamente' });
  },
};
