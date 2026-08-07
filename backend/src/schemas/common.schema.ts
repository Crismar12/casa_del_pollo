import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
}).passthrough();

export const orderFiltersSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  minTotal: z.string().optional(),
  maxTotal: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
