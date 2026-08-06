import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  minDuration?: number;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ minDuration = 1500, onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setFadeOut(true);
      const exitTimer = setTimeout(() => {
        setVisible(false);
        onFinish?.();
      }, 400);
      return () => clearTimeout(exitTimer);
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [minDuration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-400 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className={`transform transition-all duration-500 ${fadeOut ? 'scale-90' : 'scale-100'}`}>
        <div className="text-7xl mb-4 animate-bounce">🐔</div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        El Paraíso del Pollo
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Gestor de Pedidos</p>
    </div>
  );
};
