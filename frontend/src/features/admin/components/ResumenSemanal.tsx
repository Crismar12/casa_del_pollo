import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useWeeklySalesSummary } from '../hooks/useWeeklySalesSummary';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-red-600">S/ {Number(payload[0].value).toFixed(2)}</p>
    </div>
  );
};

export const ResumenSemanal: React.FC = () => {
  const { summary, loading, error } = useWeeklySalesSummary();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-600">Cargando resumen semanal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-red-500 h-80 flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (summary.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-80 flex items-center justify-center">
        <p className="text-gray-500">No hay datos de ventas para esta semana.</p>
      </div>
    );
  }

  const maxVal = Math.max(...summary.map(d => d.earnings), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Resumen Semanal de Ventas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={summary}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 13, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `S/${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }} />
          <Bar
            dataKey="earnings"
            name="Ganancias"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {summary.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.earnings === maxVal ? '#dc2626' : '#fca5a5'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
