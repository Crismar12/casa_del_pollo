import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { adminDashboardService } from '../services/adminDashboard.service';

interface DemoBannerProps {
  onResetComplete?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onResetComplete }) => {
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    const success = await adminDashboardService.resetDemoData();
    setResetting(false);
    setShowConfirm(false);
    if (success) {
      onResetComplete?.();
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Modo Demo — Los datos se reinician con el botón
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Credenciales: admin@demo.com / admin123
            </p>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={resetting}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            Restablecer datos
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-700 dark:text-amber-300">¿Borrar todo y recargar?</span>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {resetting ? 'Restableciendo...' : 'Sí, restablecer'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={resetting}
              className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-white dark:bg-gray-800 border border-amber-300 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/30 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
