import React from 'react';
import { ProductCard } from './ProductCard';
import { useProducts } from "../hooks/useProducts";
import { SkeletonLoader } from "../../../shared/components/iu/SkeletonLoader";

interface ProductListProps {
  selectedCategoryId?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId }) => {
  const { products, loading, error } = useProducts(selectedCategoryId);

  if (loading) {
    return (
      <div className="py-6">
        <SkeletonLoader variant="card" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg px-4 text-lg">
        <p>Error al cargar productos: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center text-lg">No hay productos disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
