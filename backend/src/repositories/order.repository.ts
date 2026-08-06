import { db } from '../config/database';
import { Pedido, DetallePedido, OrderStatusLockedError, MissingCancelReasonError, getCancelReason } from '../types/order.types';

function localDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface CreatePedidoPayload {
  idcliente: number;
  idusuario: number;
  nombrecliente: string;
  direccion?: string;
  notas?: string;
  estado: string;
  total: number;
}

interface ProductDetailFromJoin {
  nombre: string;
  precio: number;
}

export const orderRepository = {
  async createOrder(orderData: CreatePedidoPayload): Promise<Pedido> {
    const fecha = localDateStr();
    const now = new Date();
    const result = await db.query(
      `INSERT INTO pedido (fecha, created_at, idcliente, idusuario, nombrecliente, direccion, notas, estado, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        fecha,
        now,
        orderData.idcliente,
        orderData.idusuario,
        orderData.nombrecliente,
        orderData.direccion,
        orderData.notas,
        'pendiente',
        orderData.total,
      ]
    );
    return result.rows[0] as Pedido;
  },

  async createOrderDetails(orderDetails: Omit<DetallePedido, 'iddetalle'>[]): Promise<DetallePedido[]> {
    const values: (string | number)[] = [];
    const placeholders: string[] = [];

    orderDetails.forEach((detail, index) => {
      const offset = index * 4;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`
      );
      values.push(detail.idpedido, detail.idproducto, detail.cantidad, detail.subtotal);
    });

    const result = await db.query(
      `INSERT INTO detallepedido (idpedido, idproducto, cantidad, subtotal)
       VALUES ${placeholders.join(', ')} RETURNING *`,
      values
    );
    return result.rows as DetallePedido[];
  },

  async getAllOrders(status?: string, page: number = 1, limit: number = 6): Promise<{ orders: Pedido[], totalCount: number }> {
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) FROM pedido';
    let dataQuery = 'SELECT * FROM pedido';
    const params: (string | number)[] = [];
    const countParams: (string | number)[] = [];
    let paramIndex = 1;

    if (status) {
      countQuery += ` WHERE estado = $${paramIndex}`;
      dataQuery += ` WHERE estado = $${paramIndex}`;
      params.push(status);
      countParams.push(status);
      paramIndex++;
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    dataQuery += ' ORDER BY created_at DESC, idpedido DESC';
    dataQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const dataResult = await db.query(dataQuery, params);
    return { orders: dataResult.rows as Pedido[], totalCount };
  },

  async getOrderById(orderId: number): Promise<Pedido & { products: { idproducto: number; name: string; quantity: number; price: number; subtotal: number }[] } | null> {
    const orderResult = await db.query('SELECT * FROM pedido WHERE idpedido = $1', [orderId]);
    if (orderResult.rows.length === 0) return null;

    const detailsResult = await db.query(
      'SELECT iddetalle, idpedido, idproducto, cantidad, subtotal FROM detallepedido WHERE idpedido = $1',
      [orderId]
    );

    const detailsData = detailsResult.rows;
    const productIds = [...new Set(detailsData.map((d: { idproducto: number }) => d.idproducto))];

    if (productIds.length === 0) {
      return { ...orderResult.rows[0], products: [] };
    }

    const productsResult = await db.query(
      `SELECT idproducto, nombre, precio FROM producto WHERE idproducto = ANY($1)`,
      [productIds]
    );

    const productMap = new Map<number, ProductDetailFromJoin>();
    productsResult.rows.forEach((p: { idproducto: number; nombre: string; precio: number }) => {
      productMap.set(p.idproducto, { nombre: p.nombre, precio: p.precio });
    });

    const products = detailsData.map((detail: { idproducto: number; cantidad: number; subtotal: number }) => {
      const productInfo = productMap.get(detail.idproducto) || { nombre: 'Unknown', precio: 0 };
      return {
        idproducto: detail.idproducto,
        name: productInfo.nombre,
        quantity: detail.cantidad,
        price: productInfo.precio,
        subtotal: detail.subtotal,
      };
    });

    return { ...orderResult.rows[0], products };
  },

  async updateOrderStatus(orderId: number, newStatus: string, motivoCancelacion?: string): Promise<Pedido | null> {
    const current = await db.query('SELECT estado FROM pedido WHERE idpedido = $1', [orderId]);
    if (current.rows.length === 0) return null;

    const currentEstado = current.rows[0].estado as string;
    if (currentEstado === 'entregado' || currentEstado === 'cancelado') {
      throw new OrderStatusLockedError();
    }

    if (newStatus === 'cancelado') {
      const reason = getCancelReason(motivoCancelacion || '');
      if (!reason) {
        throw new MissingCancelReasonError();
      }

      const result = await db.query(
        `UPDATE pedido SET estado = 'cancelado', motivo_cancelacion = $1, contabilizar_venta = $2
         WHERE idpedido = $3 RETURNING *`,
        [reason.motivo, reason.contabilizaVenta, orderId]
      );
      if (result.rows.length === 0) return null;
      return result.rows[0] as Pedido;
    }

    const result = await db.query(
      'UPDATE pedido SET estado = $1 WHERE idpedido = $2 RETURNING *',
      [newStatus, orderId]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0] as Pedido;
  },

  async getActiveOrdersCount(): Promise<number> {
    const result = await db.query(
      "SELECT COUNT(*) FROM pedido WHERE estado NOT IN ('entregado', 'cancelado')"
    );
    return parseInt(result.rows[0].count, 10) || 0;
  },
};
