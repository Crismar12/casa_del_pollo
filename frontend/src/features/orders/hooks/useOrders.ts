import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus } from "../services/order.service";
import type { Order, OrderStatus } from "../types";

const ITEMS_PER_PAGE = 6;

export interface OrderFiltersState {
  search?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  minTotal?: string;
  maxTotal?: string;
}

export const useOrders = (initialStatusFilter?: OrderStatus) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(initialStatusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<OrderFiltersState>({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filterParams: Record<string, string | number | undefined> = {};
      if (filters.search) filterParams.search = filters.search;
      if (filters.fechaDesde) filterParams.fechaDesde = filters.fechaDesde;
      if (filters.fechaHasta) filterParams.fechaHasta = filters.fechaHasta;
      if (filters.minTotal) filterParams.minTotal = Number(filters.minTotal);
      if (filters.maxTotal) filterParams.maxTotal = Number(filters.maxTotal);

      const { orders: fetchedOrders, totalCount } = await getOrders(statusFilter, currentPage, ITEMS_PER_PAGE, filterParams);
      setOrders(fetchedOrders);
      setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus, motivoCancelacion?: string) => {
    const previousOrders = orders;
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus, motivoCancelacion: motivoCancelacion || o.motivoCancelacion } : o
    );
    setOrders(updatedOrders);

    try {
      await updateOrderStatus(orderId, newStatus, motivoCancelacion);
    } catch (err) {
      setOrders(previousOrders);
      const errorMessage = err instanceof Error ? err.message : "Failed to update order status.";
      setError(errorMessage);
      console.error(err);
    }
  };

  const filterByStatus = (status: OrderStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const applyFilters = (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return { orders, loading, error, updateStatus, filterByStatus, applyFilters, currentFilter: statusFilter, currentPage, totalPages, goToPage, filters };
};
