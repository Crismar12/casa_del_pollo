import React from 'react';
import { ORDER_STATUS, type OrderStatus } from '../../features/orders/types/order.types';

interface OrderStatusTagProps {
  status: OrderStatus;
  isInteractive?: boolean; 
  isSelected?: boolean; 
  onClick?: (status: OrderStatus) => void; 
}

const statusColors: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'bg-orange-100 text-orange-800',
  [ORDER_STATUS.PREPARING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.DELIVERING]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELED]: 'bg-red-100 text-red-800',
};

const statusBorderColors: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'border-orange-500',
  [ORDER_STATUS.PREPARING]: 'border-yellow-500',
  [ORDER_STATUS.DELIVERING]: 'border-blue-500',
  [ORDER_STATUS.DELIVERED]: 'border-green-500',
  [ORDER_STATUS.CANCELED]: 'border-red-500',
};

export const OrderStatusTag: React.FC<OrderStatusTagProps> = ({
  status,
  isInteractive = false,
  isSelected = false,
  onClick,
}) => {
  const baseClasses = `px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`;

  if (isInteractive) {
    const interactiveClasses = `
      ${baseClasses}
      ${isSelected ? `border-2 ${statusBorderColors[status]}` : 'border border-transparent'}
      cursor-pointer transition-all duration-200
    `;
    return (
      <button onClick={() => onClick && onClick(status)} className={interactiveClasses}>
        {status}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {status}
    </span>
  );
};