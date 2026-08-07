

export class OrderStatusLockedError extends Error {
  constructor() {
    super('No se puede cambiar el estado de un pedido que ya fue entregado o cancelado.');
    this.name = 'OrderStatusLockedError';
  }
}

export class MissingCancelReasonError extends Error {
  constructor() {
    super('Debes indicar el motivo de cancelación del pedido.');
    this.name = 'MissingCancelReasonError';
  }
}

export interface CancelReason {
  motivo: string;
  label: string;
  contabilizaVenta: boolean;
}

export const CANCEL_REASONS: CancelReason[] = [
  {
    motivo: 'error_cocina_o_demora',
    label: 'Error de cocina / Demora de envío',
    contabilizaVenta: false,
  },
  {
    motivo: 'cliente_no_encontrado_o_rechazo',
    label: 'Cliente no se encontró / Rechazó en puerta',
    contabilizaVenta: false,
  },
  {
    motivo: 'cliente_cancelo_tarde_pagado',
    label: 'Cliente canceló tarde (ya pagado)',
    contabilizaVenta: true,
  },
];

export const getCancelReason = (motivo: string): CancelReason | undefined =>
  CANCEL_REASONS.find((reason) => reason.motivo === motivo);

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
  motivo_cancelacion?: string | null;
  contabilizar_venta?: boolean;
}

export interface DetallePedido {
  iddetalle: number;
  idpedido: number;
  cantidad: number;
  subtotal: number;
  idproducto: number;
}
