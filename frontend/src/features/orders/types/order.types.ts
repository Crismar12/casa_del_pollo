import type { Product } from "../../products/types/product.types";

export interface ProductInCart extends Product {
  quantity: number;
}

export const ORDER_STATUS = {
  PENDING: "pendiente",
  PREPARING: "en preparación",
  DELIVERING: "en reparto",
  DELIVERED: "entregado",
  CANCELED: "cancelado",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const CANCEL_REASONS = [
  { value: "error_cocina_o_demora", label: "Error en cocina o demora", contabilizaVenta: false },
  { value: "cliente_no_encontrado_o_rechazo", label: "Cliente no encontrado o rechazó el pedido", contabilizaVenta: false },
  { value: "cliente_cancelo_tarde_pagado", label: "Cliente canceló tarde y ya estaba pagado", contabilizaVenta: true },
] as const;

export type CancelReasonValue = (typeof CANCEL_REASONS)[number]["value"];

export interface Order {
  id: string;
  client: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  products: ProductInCart[];
  paymentMethod: string;
  notas?: string;
  motivoCancelacion?: string | null;
}
