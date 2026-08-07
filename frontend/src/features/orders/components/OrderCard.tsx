import React, { useState } from 'react';
import type { Order } from '../types';
import { Card } from '../../../shared/components/iu';
import { SkeletonLoader } from '../../../shared/components/iu/SkeletonLoader';
import { OrderTimeline } from './OrderTimeline';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getOrderDetails } from '../services/order.service';
import { formatDateTimeLocal } from '../../../shared/utils/dateUtils';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order: initialOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const orderToDisplay = orderDetails || initialOrder;

  const handleToggleExpand = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !orderDetails) {
      setLoading(true);
      const details = await getOrderDetails(initialOrder.id);
      console.log('Order details from API:', details);
      setOrderDetails(details);
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 transition-all duration-300">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-1">
            <h3 className="font-bold text-xl mb-1 dark:text-gray-100">Pedido #{orderToDisplay.id.substring(0, 8)}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cliente: {orderToDisplay.client}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDateTimeLocal(orderToDisplay.createdAt)}</p>
          </div>
          <div className="md:col-span-2">
            <OrderTimeline currentStatus={orderToDisplay.status} />
          </div>
          <div className="md:col-span-1 text-right">
            <p className="font-bold text-xl text-red-600 dark:text-red-400">S/. {Number(orderToDisplay.total).toFixed(2)}</p>
            <button
              onClick={handleToggleExpand}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center ml-auto">
              {isExpanded ? 'Ver menos' : 'Ver detalles'}
              {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in-down">
            {loading ? (
              <SkeletonLoader variant="card" />
            ) : (
              <>
                <h4 className="font-semibold mb-2 dark:text-gray-100">Detalles del Pedido:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Método de Pago:</strong> {orderToDisplay.paymentMethod}</p>
                    <p><strong>Estado:</strong> <span className="font-medium p-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{orderToDisplay.status}</span></p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1 dark:text-gray-100">Productos:</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {orderToDisplay.products.map(p => (
                        <li key={p.id}>{p.name} (x{p.quantity})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
