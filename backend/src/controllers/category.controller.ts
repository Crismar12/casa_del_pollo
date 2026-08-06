import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { logger } from '../utils/logger';

export const categoryController = {
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await categoryService.listAllCategories(includeInactive);
      res.json(categories);
    } catch (error: unknown) {
      logger.error('Error in categoryController.getCategories:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener categorías' });
    }
  },

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryDetails(id);
      if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      res.json(category);
    } catch (error: unknown) {
      logger.error('Error in categoryController.getCategoryById:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la categoría' });
    }
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        res.status(400).json({ error: 'El nombre de la categoría es requerido' });
        return;
      }
      const category = await categoryService.createCategory({ nombre: nombre.trim(), descripcion });
      res.status(201).json(category);
    } catch (error: unknown) {
      logger.error('Error in categoryController.createCategory:', error instanceof Error ? error.message : error);
      if (error instanceof Error && error.message.includes('duplicate key')) {
        res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor al crear la categoría' });
    }
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, descripcion, activo } = req.body;
      if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
        res.status(400).json({ error: 'El nombre no puede estar vacío' });
        return;
      }
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
      logger.error('Error in categoryController.updateCategory:', error instanceof Error ? error.message : error);
      if (error instanceof Error && error.message.includes('duplicate key')) {
        res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor al actualizar la categoría' });
    }
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.deleteCategory(id);
      if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error: unknown) {
      logger.error('Error in categoryController.deleteCategory:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar la categoría' });
    }
  },
};