import geoip from 'geoip-lite';
import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
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

export class InactiveProductError extends Error {
  constructor(productName?: string) {
    super(productName
      ? `El producto "${productName}" no está disponible actualmente.`
      : 'Uno o más productos del pedido no están disponibles.');
    this.name = 'InactiveProductError';
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

    let total = 0;
    const verifiedItems: Omit<DetallePedido, 'iddetalle'>[] = [];

    for (const item of items) {
      const product = await productRepository.getById(String(item.productId));
      if (!product) {
        throw new InactiveProductError(`ID ${item.productId}`);
      }
      if (!product.activo) {
        throw new InactiveProductError(product.nombre || undefined);
      }
      const dbPrice = Number(product.precio);
      const subtotal = dbPrice * item.quantity;
      total += subtotal;
      verifiedItems.push({
        idpedido: 0,
        idproducto: item.productId,
        cantidad: item.quantity,
        subtotal,
      });
    }

    
    const newOrder = await orderRepository.createOrder({
      idcliente: clientId,
      idusuario: userId,
      nombrecliente,
      direccion,
      notas,
      estado: 'pendiente', 
      total,
    });

    for (const detail of verifiedItems) {
      detail.idpedido = newOrder.idpedido;
    }

    await orderRepository.createOrderDetails(verifiedItems);

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