import { apiClient } from "../../../shared/utils/apiClient"; 
import type { CreateProductPayload } from "../types/product.types";

interface BackendProduct {
  id: string;
  idproducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: boolean;
  imageUrl?: string;
  categoria_id?: number | null;
}

export const getProductos = async (categoryId?: string, includeInactive = false): Promise<BackendProduct[]> => {
  try {
    const data = await apiClient.get<BackendProduct[]>("/api/products", {
      params: { categoryId, includeInactive },
    });
    return data;
  } catch (error: unknown) {
    console.error("Error al obtener productos del backend:", error instanceof Error ? error.message : error);
    return [];
  }
};

export const createProduct = async (payload: CreateProductPayload): Promise<BackendProduct> => {
  return await apiClient.post<BackendProduct>("/api/products", payload);
};

export const updateProduct = async (id: string, payload: Partial<CreateProductPayload>): Promise<BackendProduct> => {
  return await apiClient.put<BackendProduct>(`/api/products/${id}`, payload);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/products/${id}`);
};