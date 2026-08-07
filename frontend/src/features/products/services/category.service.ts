import type { Category } from "../types/category.types";
import { apiClient } from "../../../shared/utils/apiClient";

export const getCategories = async (includeInactive = false): Promise<Category[]> => {
  try {
    const data = await apiClient.get<Category[]>("/api/categories", {
      params: { includeInactive },
    });
    return data;
  } catch (error: unknown) {
    console.error("Error al obtener categorías del backend:", error instanceof Error ? error.message : error);
    return [];
  }
};

export const createCategory = async (data: { nombre: string; descripcion?: string }): Promise<Category> => {
  return await apiClient.post<Category>("/api/categories", data);
};

export const updateCategory = async (id: string, data: { nombre?: string; descripcion?: string; activo?: boolean }): Promise<Category> => {
  return await apiClient.put<Category>(`/api/categories/${id}`, data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/${id}`);
};