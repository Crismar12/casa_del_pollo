export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string; 
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