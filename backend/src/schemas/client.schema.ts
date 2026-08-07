import { z } from 'zod';

export const createClientSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().min(1, 'Email es requerido').email('Formato de email inválido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});
