import React from 'react';
import { Drumstick, Soup, Coffee, PlusCircle } from 'lucide-react';
import { useMostSoldProducts } from '../hooks/useMostSoldProducts';

const productIcons: Record<string, React.ElementType> = {
  'Pollo': Drumstick,
  'Bebidas': Coffee,
  'Acompañamientos': Soup,
  'Postres': PlusCircle,
  'Promociones': Soup,
  'Unknown': PlusCircle,
};

type ProductosMasVendidosProps = {
  title?: string;
};

export const ProductosMasVendidos: React.FC<ProductosMasVendidosProps> = ({
  title = 'Productos más Vendidos',
}) => {
  const { products, loading, error } = useMostSoldProducts();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-600">Cargando productos más vendidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-red-500 h-48 flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-48 flex items-center justify-center">
        <p className="text-gray-500">No hay productos más vendidos disponibles.</p>
      </div>
    );
  }

  const maxSales = Math.max(...products.map(p => p.salesAmount), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {products.map((product, index) => {
          const Icon = productIcons[product.category] || productIcons.Unknown;
          const barWidth = (product.salesAmount / maxSales) * 100;
          return (
            <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-red-100 text-red-700' :
                index === 1 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </span>
              <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800 truncate">{product.name}</p>
                  <span className="text-sm font-semibold text-gray-700 ml-2">{product.salesAmount} uds</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-red-500 rounded-full h-1.5 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                {product.percentage !== undefined && (
                  <p className="text-xs text-gray-500 mt-0.5">{product.percentage}% del total</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
