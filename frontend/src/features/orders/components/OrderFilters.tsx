import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export interface OrderFiltersValue {
  search?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  minTotal?: string;
  maxTotal?: string;
}

interface OrderFiltersProps {
  onChange: (filters: OrderFiltersValue) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ onChange }) => {
  const [search, setSearch] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [expanded, setExpanded] = useState(false);

  const applyFilters = () => {
    onChange({
      search: search || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      minTotal: minTotal || undefined,
      maxTotal: maxTotal || undefined,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setFechaDesde('');
    setFechaHasta('');
    setMinTotal('');
    setMaxTotal('');
    onChange({});
  };

  const hasActiveFilters = search || fechaDesde || fechaHasta || minTotal || maxTotal;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
            expanded ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Total mínimo (S/)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minTotal}
              onChange={e => setMinTotal(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Total máximo (S/)</label>
            <input
              type="number"
              min="0"
              placeholder="999"
              value={maxTotal}
              onChange={e => setMaxTotal(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              onClick={applyFilters}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
