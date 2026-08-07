import { Product, CreateProductPayload, UpdateProductPayload } from '../types/product.types';
import { productRepository } from '../repositories/product.repository';

export const productService = {
  async listAllProducts(categoryId?: string, includeInactive = false): Promise<Product[]> {
    const products = await productRepository.getAll(categoryId, includeInactive);
    return products;
  },

  async getProductDetails(id: string): Promise<Product | null> {
    const product = await productRepository.getById(id);
    return product;
  },

  async createProduct(data: CreateProductPayload): Promise<Product> {
    const product = await productRepository.create(data);
    return product;
  },

  async updateProduct(id: string, data: UpdateProductPayload): Promise<Product | null> {
    const existing = await productRepository.getById(id);
    if (!existing) return null;
    const updated = await productRepository.update(id, data);
    return updated;
  },

  async deleteProduct(id: string): Promise<Product | null> {
    const existing = await productRepository.getById(id);
    if (!existing) return null;
    const deleted = await productRepository.remove(id);
    return deleted;
  },
};
