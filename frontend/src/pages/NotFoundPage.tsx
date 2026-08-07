import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      <SearchX className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" strokeWidth={1} />
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">404</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        <Home className="w-4 h-4" />
        Volver al inicio
      </button>
    </div>
  );
};
