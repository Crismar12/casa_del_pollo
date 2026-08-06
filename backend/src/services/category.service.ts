import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.types';
import { categoryRepository } from '../repositories/category.repository';

export const categoryService = {
  async listAllCategories(includeInactive = false): Promise<Category[]> {
    return await categoryRepository.getAll(includeInactive);
  },

  async getCategoryDetails(id: string): Promise<Category | null> {
    return await categoryRepository.getById(id);
  },

  async createCategory(data: CreateCategoryPayload): Promise<Category> {
    return await categoryRepository.create(data);
  },

  async updateCategory(id: string, data: UpdateCategoryPayload): Promise<Category | null> {
    const existing = await categoryRepository.getById(id);
    if (!existing) return null;
    return await categoryRepository.update(id, data);
  },

  async deleteCategory(id: string): Promise<Category | null> {
    const existing = await categoryRepository.getById(id);
    if (!existing) return null;
    return await categoryRepository.remove(id);
  },
};