import geoip from 'geoip-lite';
import { orderRepository } from '../repositories/order.repository';
import { CreateOrderPayload, Pedido, DetallePedido } from '../types/order.types';

interface OrderProduct {
  idproducto: number;
  name: string;
  quantity: number;
  price: number;
}

export class OrderBusinessHoursError extends Error {
  constructor() {
    super('El restaurante está cerrado. Atendemos de 12:00 p.m. a 11:00 p.m.');
    this.name = 'OrderBusinessHoursError';
  }
}

const DEFAULT_TIMEZONE = 'America/Lima';

const getClientHour = (ip?: string): number => {
  let timeZone = DEFAULT_TIMEZONE;
  if (ip) {
    const lookup = geoip.lookup(ip);
    if (lookup?.timezone) timeZone = lookup.timezone;
  }

  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false }).format(new Date()),
    10
  );
  return hour === 24 ? 0 : hour;
};

const isWithinBusinessHours = (ip?: string): boolean => {
  const hour = getClientHour(ip);
  return hour >= 12 && hour < 23;
};

export const orderService = {
  async processNewOrder(payload: CreateOrderPayload, ip?: string): Promise<Pedido> {
    if (!isWithinBusinessHours(ip)) {
      throw new OrderBusinessHoursError();
    }

    const { clientId, userId, nombrecliente, direccion, notas, items } = payload;

    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    
    const newOrder = await orderRepository.createOrder({
      idcliente: clientId,
      idusuario: userId,
      nombrecliente,
      direccion,
      notas,
      estado: 'pendiente', 
      total,
    });

    
    const orderDetailsToCreate: Omit<DetallePedido, 'iddetalle'>[] = items.map(item => ({
      idpedido: newOrder.idpedido,
      idproducto: item.productId,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    
    await orderRepository.createOrderDetails(orderDetailsToCreate);

    return newOrder;
  },

  async listAllOrders(status?: string, page?: number, limit?: number): Promise<{ orders: Pedido[], totalCount: number }> {
    const { orders, totalCount } = await orderRepository.getAllOrders(status, page, limit);
    return { orders, totalCount };
  },

  async getOrderDetails(orderId: number): Promise<Pedido & { products: OrderProduct[] } | null> {
    return orderRepository.getOrderById(orderId);
  },

  async updateOrderStatus(orderId: number, newStatus: string, motivoCancelacion?: string): Promise<Pedido | null> {
    return orderRepository.updateOrderStatus(orderId, newStatus, motivoCancelacion);
  },

  async getActiveOrdersCount(): Promise<number> {
    return orderRepository.getActiveOrdersCount();
  },
};