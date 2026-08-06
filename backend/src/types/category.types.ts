export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateCategoryPayload {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;