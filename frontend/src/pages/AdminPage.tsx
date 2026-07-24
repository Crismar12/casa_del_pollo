import { TarjetaDashboard, PedidosRecientes, ProductosMasVendidos, ResumenSemanal, UserForm } from '../features/admin/components';
import { ProductForm } from '../features/products/components';
import { getProductos } from '../features/products/services/product.service';
import React, { useState, useEffect, useCallback } from 'react';
import { useDashboardSummary } from '../features/admin/hooks/useDashboardSummary';
import { RefreshCw, Users, ChevronDown, ChevronUp, Package, Pencil } from 'lucide-react';

export const AdminPage = () => {
  const { summary, loading, error, refetch } = useDashboardSummary();
  const [showUsers, setShowUsers] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Array<{
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imageUrl?: string;
    categoria_id?: number | null;
    activo: boolean;
  }>>([]);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProductos();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  useEffect(() => {
    if (showProducts) {
      fetchProducts();
    }
  }, [showProducts, fetchProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Cargando resumen del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>Error al cargar el resumen del dashboard: {error}</p>
      </div>
    );
  }


  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;


  const getComparisonFooter = (todayValue: number, yesterdayValue: number, unit: string = '', isCurrency: boolean = false) => {
    const formatValue = (value: number) => {
      if (isCurrency) {
        return `S/ ${value.toFixed(2)}`;
      }
      return value.toFixed(0); 
    };

    if (yesterdayValue === 0) {
      return todayValue > 0 ? `+${formatValue(todayValue)} que ayer` : `Sin ${unit} ayer`;
    }

    const difference = todayValue - yesterdayValue;
    const percentage = (difference / yesterdayValue) * 100;
    const sign = percentage >= 0 ? '+' : '';

    
    if (Math.abs(percentage) < 0.5) { 
      return `0% que ayer`;
    }

    return `${sign}${percentage.toFixed(0)}% que ayer`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Actualizar datos del dashboard"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <TarjetaDashboard
          title="Ventas hoy"
          value={`S/ ${summary?.salesToday.toFixed(2) || '0.00'}`}
          footer={getComparisonFooter(summary?.salesToday || 0, summary?.salesYesterday || 0, 'ventas', true)}
          color="gradient"
        />
        <TarjetaDashboard
          title="Pedidos Hoy"
          value={summary?.ordersToday.toString() || '0'}
          footer={getComparisonFooter(summary?.ordersToday || 0, summary?.ordersYesterday || 0, 'pedidos', false)}
          color="white"
        />
        <TarjetaDashboard
          title="Ticket promedio"
          value={`S/ ${summary?.averageTicket.toFixed(2) || '0.00'}`}
          footer={getComparisonFooter(summary?.averageTicket || 0, summary?.averageTicketYesterday || 0, 'ticket', true)}
          color="gradient"
        />
        <TarjetaDashboard
          title="Tasa de cancelación"
          value={formatPercentage(summary?.cancellationRate || 0)}
          footer="De todas las ventas" 
          color="white"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PedidosRecientes />
        <ProductosMasVendidos />
      </div>
      <div className="w-full">
        <ResumenSemanal />
      </div>

      <div className="mt-8">
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestionar Usuarios
          </span>
          {showUsers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showUsers && (
          <div className="mt-4 max-w-md">
            <UserForm onUserCreated={() => {}} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => { setShowProducts(!showProducts); setEditingProduct(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gestionar Productos
          </span>
          {showProducts ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showProducts && (
          <div className="mt-4 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Existentes</h3>
              {products.length === 0 ? (
                <p className="text-gray-500">No hay productos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Precio</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="bg-white border-b">
                          <td className="px-4 py-3 font-medium text-gray-900">{p.nombre}</td>
                          <td className="px-4 py-3">S/ {p.precio.toFixed(2)}</td>
                          <td className="px-4 py-3">{p.stock}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {p.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => { setEditingProduct(p); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="max-w-md">
              <ProductForm
                product={editingProduct}
                onProductSaved={() => { fetchProducts(); setEditingProduct(null); }}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};