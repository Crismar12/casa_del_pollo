
import React from 'react';

type TarjetaDashboardProps = {
  title: string;
  value: string | number;
  footer?: string;
  color?: 'white' | 'gradient';
};

const colorClasses = {
  white: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100',
  gradient: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
};

export const TarjetaDashboard: React.FC<TarjetaDashboardProps> = ({
  title,
  value,
  footer,
  color = 'white',
}) => {
  return (
    <div className={`rounded-lg shadow-md dark:shadow-gray-900/40 p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow ${colorClasses[color]}`}>
      <div className="text-sm font-medium uppercase">{title}</div>
      <div className="text-4xl font-bold my-2">{value}</div>
      {footer && <div className="text-xs mt-4 opacity-60">{footer}</div>}
    </div>
  );
};
