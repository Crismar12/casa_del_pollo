import type { Category } from "../types/category.types";
import { apiClient } from "../../../shared/utils/apiClient";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await apiClient.get<Category[]>("/api/categories");
    return data;
  } catch (error: unknown) {
    console.error("Error al obtener categorías del backend:", error instanceof Error ? error.message : error);
    return [];
  }
};

export const createCategory = async (data: { nombre: string; descripcion?: string }): Promise<Category> => {
  return await apiClient.post<Category>("/api/categories", data);
};

export const updateCategory = async (id: string, data: { nombre?: string; descripcion?: string }): Promise<Category> => {
  return await apiClient.put<Category>(`/api/categories/${id}`, data);
};