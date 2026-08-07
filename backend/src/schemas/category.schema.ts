import { z } from 'zod';

export const createCategorySchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(100, 'Nombre muy largo'),
  descripcion: z.string().optional(),
});

export const updateCategorySchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().optional(),
  activo: z.boolean().optional(),
});
