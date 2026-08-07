import React from 'react';

type SkeletonVariant = 'text' | 'title' | 'card' | 'avatar' | 'table-row' | 'chart' | 'button';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full',
  title: 'h-6 w-3/4',
  card: 'h-40 w-full',
  avatar: 'h-12 w-12 rounded-full',
  'table-row': 'h-10 w-full',
  chart: 'h-64 w-full',
  button: 'h-10 w-24',
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'table-row') {
    return (
      <div className="space-y-3">
        {items.map(i => (
          <div key={i} className={`flex gap-4 ${className}`}>
            <div className={`${baseClass} h-10 flex-1`} style={{ width, height }} />
            <div className={`${baseClass} h-10 flex-1`} />
            <div className={`${baseClass} h-10 flex-1`} />
            <div className={`${baseClass} h-10 w-16`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {items.map(i => (
          <div key={i} className={`${baseClass} ${variantStyles[variant]} p-4 ${className}`} style={{ width, height }}>
            <div className={`${baseClass} h-4 w-3/4 mb-3`} />
            <div className={`${baseClass} h-3 w-full mb-2`} />
            <div className={`${baseClass} h-3 w-5/6`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map(i => (
        <div
          key={i}
          className={`${baseClass} ${variantStyles[variant]}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
};
