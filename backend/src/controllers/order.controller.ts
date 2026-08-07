import { Request, Response } from 'express';
import { orderService, OrderBusinessHoursError, InactiveProductError } from '../services/order.service';
import { CreateOrderPayload, OrderStatusLockedError, MissingCancelReasonError } from '../types/order.types';

export const orderController = {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderPayload: CreateOrderPayload = req.body;
      const newOrder = await orderService.processNewOrder(orderPayload, req.ip);
      res.status(201).json(newOrder);
    } catch (error: unknown) {
      if (error instanceof OrderBusinessHoursError) {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error instanceof InactiveProductError) {
        res.status(400).json({ error: error.message });
        return;
      }
      throw error;
    }
  },

  async getOrders(req: Request, res: Response): Promise<void> {
    const { status, page, limit, search, fechaDesde, fechaHasta, minTotal, maxTotal } = req.query;
    const pageNumber = page ? parseInt(page as string, 10) : undefined;
    const limitNumber = limit ? parseInt(limit as string, 10) : undefined;

    const filters = {
      search: search as string | undefined,
      fechaDesde: fechaDesde as string | undefined,
      fechaHasta: fechaHasta as string | undefined,
      minTotal: minTotal ? Number(minTotal) : undefined,
      maxTotal: maxTotal ? Number(maxTotal) : undefined,
    };

    const { orders, totalCount } = await orderService.listAllOrders(
      status as string | undefined, pageNumber, limitNumber, filters
    );
    res.json({ orders, totalCount });
  },

  async getOrderById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(parseInt(id, 10));
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  },

  async getActiveOrdersCount(req: Request, res: Response): Promise<void> {
    const count = await orderService.getActiveOrdersCount();
    res.json({ count });
  },

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, motivoCancelacion } = req.body;
      const updatedOrder = await orderService.updateOrderStatus(parseInt(id, 10), status, motivoCancelacion);
      if (updatedOrder) {
        res.json(updatedOrder);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error: unknown) {
      if (error instanceof OrderStatusLockedError) {
        res.status(409).json({ error: error.message });
        return;
      }
      if (error instanceof MissingCancelReasonError) {
        res.status(400).json({ error: error.message });
        return;
      }
      throw error;
    }
  },
};
