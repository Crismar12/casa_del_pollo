import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive('ID de producto inválido'),
  quantity: z.coerce.number().int().positive('Cantidad debe ser al menos 1'),
  price: z.coerce.number().positive('Precio debe ser positivo'),
});

export const createOrderSchema = z.object({
  clientId: z.coerce.number().int().positive('ID de cliente requerido'),
  userId: z.coerce.number().int().positive('ID de usuario requerido'),
  nombrecliente: z.string().min(1, 'Nombre del cliente es requerido'),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto'),
});

const ORDER_STATUSES = ['pendiente', 'en preparación', 'en reparto', 'entregado', 'cancelado'] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, { message: 'Estado inválido' }),
  motivoCancelacion: z.string().optional(),
});
