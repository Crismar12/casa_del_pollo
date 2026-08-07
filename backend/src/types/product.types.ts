export interface Product {
  id: string;
  idproducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imageUrl?: string;
  categoria_id: number | null;
  stock: number;
  activo: boolean;
  created_at: string;
}

export interface CreateProductPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  imgUrl?: string;
  categoria_id?: number | null;
  stock?: number;
  activo?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
