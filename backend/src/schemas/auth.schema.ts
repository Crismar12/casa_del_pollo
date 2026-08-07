import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ message: 'Email es requerido' }).min(1, 'Email es requerido'),
  contrasena: z.string({ message: 'Contraseña es requerida' }).min(1, 'Contraseña es requerida'),
});

export const registerSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().min(1, 'Email es requerido').email('Formato de email inválido'),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['admin', 'vendedor'], { message: 'Rol debe ser admin o vendedor' }),
});

export const updateUserSchema = z.object({
  nombre: z.string().min(1).optional(),
  email: z.string().email('Formato de email inválido').optional(),
  rol: z.enum(['admin', 'vendedor']).optional(),
  activo: z.boolean().optional(),
});
