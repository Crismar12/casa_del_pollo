import { z } from 'zod';

export const createProductSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  precio: z.number({ message: 'Precio es requerido' }).positive('Precio debe ser positivo'),
  descripcion: z.string().optional(),
  imgUrl: z.string().optional(),
  categoria_id: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0, 'Stock no puede ser negativo').optional(),
  activo: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  nombre: z.string().min(1).optional(),
  precio: z.number().positive('Precio debe ser positivo').optional(),
  descripcion: z.string().optional(),
  imgUrl: z.string().optional(),
  categoria_id: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0, 'Stock no puede ser negativo').optional(),
  activo: z.boolean().optional(),
});
