import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Modal } from './Modal';
import { useOrders } from '../../orders/hooks/useOrders';
import { ORDER_STATUS, CANCEL_REASONS, getCancelReasonLabel, type Order, type OrderStatus } from '../../orders/types/order.types';
import { getOrderDetails } from '../../orders/services/order.service';
import { Button } from '../../../shared/components/iu';
import { SkeletonLoader } from '../../../shared/components/iu/SkeletonLoader';
import { formatDateLocal, formatDateTimeLocal } from '../../../shared/utils/dateUtils';
import { exportOrderToPdf } from './ExportOrderPdf';

type PedidosRecientesProps = {
  title?: string;
  onOrderUpdated?: () => void;
};

const statusColors: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
  [ORDER_STATUS.PREPARING]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  [ORDER_STATUS.DELIVERING]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  [ORDER_STATUS.CANCELED]: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

export const PedidosRecientes: React.FC<PedidosRecientesProps> = ({
  title = 'Pedidos Recientes',
  onOrderUpdated,
}) => {
  const { orders, loading, error, updateStatus, currentPage, totalPages, goToPage } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null);
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  const handleOpenModal = async (order: Order) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const details = await getOrderDetails(order.id);
      setSelectedOrder(details);
    } catch (err) {
      console.error('Error fetching order details for modal:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setConfirmStatus(null);
    setCancelReason(null);
  };

  const handleStatusChange = async (newStatus: OrderStatus, motivoCancelacion?: string) => {
    if (selectedOrder) {
      await updateStatus(selectedOrder.id, newStatus, motivoCancelacion);
      const reasonMeta = motivoCancelacion
        ? CANCEL_REASONS.find(r => r.value === motivoCancelacion)
        : null;
      setSelectedOrder(prev => prev ? {
        ...prev,
        status: newStatus,
        motivoCancelacion,
        contabilizarVenta: reasonMeta?.contabilizaVenta ?? null,
      } : null);
      onOrderUpdated?.();
    }
  };

  const handleStatusClick = (status: OrderStatus) => {
    if (status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELED) {
      setConfirmStatus(status);
      setCancelReason(null);
      return;
    }
    handleStatusChange(status);
  };

  const handleConfirmStatusChange = () => {
    if (confirmStatus === ORDER_STATUS.CANCELED) {
      if (cancelReason) {
        handleStatusChange(ORDER_STATUS.CANCELED, cancelReason);
      }
    } else if (confirmStatus) {
      handleStatusChange(confirmStatus);
    }
    setConfirmStatus(null);
    setCancelReason(null);
  };

  if (loading) return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/40 p-6"><SkeletonLoader variant="table-row" count={3} /></div>;
  if (error) return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/40 p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/40 p-6">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-100">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3">ID Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {order.id}
                </th>
                <td className="px-6 py-4">{order.client}</td>
                <td className="px-6 py-4">{formatDateLocal(order.createdAt)}</td>
                <td className="px-6 py-4">S/ {Number(order.total).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(order)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      aria-label="Ver detalles del pedido"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => exportOrderToPdf(order)}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-600"
                      aria-label="Exportar PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              onClick={() => goToPage(page)}
              variant={currentPage === page ? 'info' : 'secondary'}
              className="px-4 py-2"
            >
              {page}
            </Button>
          ))}
          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            className="p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalLoading ? (
          <div className="py-4">
            <SkeletonLoader variant="card" />
          </div>
        ) : (
          selectedOrder && (
            <div className="p-2 text-gray-800 dark:text-gray-100">
              <h4 className="text-xl font-bold mb-4 text-center">Detalles del Pedido</h4>

              <div className="flex flex-col gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                  <p className="font-bold text-black dark:text-white">{selectedOrder.id}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="font-bold text-black dark:text-white">{selectedOrder.client}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="font-bold text-black dark:text-white">{formatDateTimeLocal(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                <div className="bg-red-100 dark:bg-red-900/30 bg-opacity-50 p-3 rounded-lg mb-4 text-center">
                  <p className="text-sm text-red-800 dark:text-red-300">Total</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-300">S/ {Number(selectedOrder.total).toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Productos</p>
                <ul className="list-disc list-inside">
                  {selectedOrder.products.map((product) => (
                    <li key={product.id} className="text-black dark:text-white">
                      <span className="font-bold">{product.name}</span> (x{product.quantity})
                    </li>
                  ))}
                </ul>
              </div>

              {selectedOrder.notas && (
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 p-3 rounded-lg mb-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-medium">Notas del pedido</p>
                  <p className="text-black dark:text-white">{selectedOrder.notas}</p>
                </div>
              )}

              <div className="flex flex-col items-center mt-4">
                {selectedOrder.status === ORDER_STATUS.DELIVERED ? (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Pedido entregado — estado final, ya no se puede modificar.
                    </p>
                  </div>
                ) : selectedOrder.status === ORDER_STATUS.CANCELED ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                      Pedido cancelado — estado final, ya no se puede modificar.
                    </p>
                    {selectedOrder.motivoCancelacion && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Motivo: {getCancelReasonLabel(selectedOrder.motivoCancelacion, selectedOrder.contabilizarVenta)}
                      </p>
                    )}
                  </div>
                ) : confirmStatus === ORDER_STATUS.DELIVERED ? (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 rounded-lg px-4 py-3 text-center w-full">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                      ¿Quieres marcar este pedido como entregado?
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">
                      Esta acción es irreversible: una vez entregado, no podrás volver a cambiar el estado del pedido.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => setConfirmStatus(null)}
                        variant="secondary"
                        className="px-4 py-2"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleConfirmStatusChange}
                        variant="info"
                        className="px-4 py-2"
                      >
                        Confirmar entrega
                      </Button>
                    </div>
                  </div>
                ) : confirmStatus === ORDER_STATUS.CANCELED ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-lg px-4 py-3 text-center w-full">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                      ¿Deseas cancelar este pedido?
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                      Esta acción es irreversible: una vez cancelado, no podrás volver a cambiar el estado del pedido. Selecciona el motivo de la cancelación.
                    </p>
                    <div className="flex flex-col gap-2 mb-4 text-left">
                      {CANCEL_REASONS.map((reason) => (
                        <label
                          key={reason.value}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer ${
                            cancelReason === reason.value
                              ? 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="cancelReason"
                            value={reason.value}
                            checked={cancelReason === reason.value}
                            onChange={() => setCancelReason(reason.value)}
                            className="accent-red-600"
                          />
                          {reason.label}{" "}
                          <span className="text-xs opacity-70">
                            ({reason.contabilizaVenta ? "sin reembolso" : "no contabilizado"})
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => setConfirmStatus(null)}
                        variant="secondary"
                        className="px-4 py-2"
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={handleConfirmStatusChange}
                        disabled={!cancelReason}
                        gradient
                        className="px-4 py-2"
                      >
                        Confirmar cancelación
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cambiar Estado:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {Object.values(ORDER_STATUS).map((status) => {
                        const isSelected = selectedOrder.status === status;
                        const borderColorClass =
                          status === ORDER_STATUS.PENDING ? 'border-orange-500' :
                          status === ORDER_STATUS.PREPARING ? 'border-yellow-500' :
                          status === ORDER_STATUS.DELIVERING ? 'border-blue-500' :
                          status === ORDER_STATUS.DELIVERED ? 'border-green-500' :
                          'border-red-500';

                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusClick(status)}
                            className={`px-3 py-1 rounded-md text-sm font-semibold
                              ${statusColors[status]}
                              ${isSelected ? `border-2 ${borderColorClass}` : 'border border-transparent'}
                            `}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};
