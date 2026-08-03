import { TarjetaDashboard, PedidosRecientes, ProductosMasVendidos, ResumenSemanal, UserForm, AdminProducts, AdminCategories, DemoBanner } from '../features/admin/components';
import React, { useState } from 'react';
import { useDashboardSummary } from '../features/admin/hooks/useDashboardSummary';
import { RefreshCw, LayoutDashboard, Package, Tag, Users, Info } from 'lucide-react';

type TabType = 'dashboard' | 'productos' | 'categorias' | 'usuarios';

export const AdminPage = () => {
  const { summary, loading, error, refetch } = useDashboardSummary();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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
        <button
          onClick={refetch}
          className="mt-4 flex items-center gap-2 px-4 py-2 mx-auto bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </button>
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

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productos' as TabType, label: 'Productos', icon: Package },
    { id: 'categorias' as TabType, label: 'Categorías', icon: Tag },
    { id: 'usuarios' as TabType, label: 'Usuarios', icon: Users },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
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

      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <DemoBanner onResetComplete={refetch} />
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3">
            <Info className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm">
              Las ventas y los gráficos consideran los pedidos con estado <strong>"entregado"</strong> y las cancelaciones
              marcadas como <strong>"cliente canceló tarde y ya estaba pagado"</strong>. El ticket promedio considera solo los
              pedidos <strong>"entregado"</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <TarjetaDashboard
              title="Ventas esta semana"
              value={`S/ ${summary?.weeklyComparison.thisWeekSales.toFixed(2) || '0.00'}`}
              footer={`${summary?.weeklyComparison.salesChange ?? 0 >= 0 ? '+' : ''}${summary?.weeklyComparison.salesChange ?? 0}% vs semana pasada`}
              color="gradient"
            />
            <TarjetaDashboard
              title="Categoría top"
              value={summary?.topCategory.name || 'N/A'}
              footer={`S/ ${summary?.topCategory.totalSales.toFixed(2) || '0.00'} en ventas`}
              color="white"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PedidosRecientes />
            <ProductosMasVendidos />
          </div>
          <div className="w-full">
            <ResumenSemanal />
          </div>
        </div>
      )}

      {activeTab === 'productos' && (
        <AdminProducts />
      )}

      {activeTab === 'categorias' && (
        <AdminCategories />
      )}

      {activeTab === 'usuarios' && (
        <div className="max-w-md">
          <UserForm onUserCreated={() => {}} />
        </div>
      )}
    </div>
  );
};
