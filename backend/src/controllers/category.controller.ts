import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';

export const categoryController = {
  async getCategories(req: Request, res: Response): Promise<void> {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.listAllCategories(includeInactive);
    res.json(categories);
  },

  async getCategoryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const category = await categoryService.getCategoryDetails(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    res.json(category);
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion } = req.body;
      const category = await categoryService.createCategory({ nombre: nombre.trim(), descripcion });
      res.status(201).json(category);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        return;
      }
      throw error;
    }
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, descripcion, activo } = req.body;
      const category = await categoryService.updateCategory(id, {
        nombre: nombre?.trim(),
        descripcion,
        activo,
      });
      if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      res.json(category);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        return;
      }
      throw error;
    }
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const category = await categoryService.deleteCategory(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  },
};
