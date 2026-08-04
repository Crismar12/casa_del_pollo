import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const products = await productService.listAllProducts(categoryId, includeInactive);
      res.json(products);
    } catch (error: unknown) {
      console.error('Error en productController.getProducts:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener productos' });
    }
  },

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductDetails(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json(product);
    } catch (error: unknown) {
      console.error('Error en productController.getProductById:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el producto' });
    }
  },

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, precio, descripcion, imgUrl, categoria_id, stock, activo } = req.body;
      if (!nombre || precio === undefined) {
        res.status(400).json({ error: 'Los campos nombre y precio son requeridos' });
        return;
      }
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
    } catch (error: unknown) {
      console.error('Error en productController.createProduct:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al crear el producto' });
    }
  },

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json(product);
    } catch (error: unknown) {
      console.error('Error en productController.updateProduct:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al actualizar el producto' });
    }
  },

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.deleteProduct(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error: unknown) {
      console.error('Error en productController.deleteProduct:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar el producto' });
    }
  },
};
