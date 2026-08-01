

export class OrderStatusLockedError extends Error {
  constructor() {
    super('No se puede cambiar el estado de un pedido que ya fue entregado.');
    this.name = 'OrderStatusLockedError';
  }
}

export interface OrderItemPayload {
  productId: number; 
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  clientId: number;
  userId: number;
  nombrecliente: string;
  direccion?: string;
  notas?: string;
  items: OrderItemPayload[];
}

export interface Pedido {
  idpedido: number;
  fecha: string;
  created_at: string;
  estado: string;
  nombrecliente: string;
  direccion?: string;
  notas?: string;
  total: number;
  idcliente: number;
  idusuario: number;
}

export interface DetallePedido {
  iddetalle: number;
  idpedido: number;
  cantidad: number;
  subtotal: number;
  idproducto: number;
}
