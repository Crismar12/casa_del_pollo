export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface CreateCategoryPayload {
  nombre: string;
  descripcion?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;