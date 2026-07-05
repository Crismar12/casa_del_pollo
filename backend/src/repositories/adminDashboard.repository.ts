import { db } from '../config/database';
import { MostSoldProduct, DailySalesData } from '../types/adminDashboard.types';

export const adminDashboardRepository = {
  async getMostSoldProducts(limit: number = 5): Promise<MostSoldProduct[]> {
    const detalleResult = await db.query(
      'SELECT idproducto, cantidad FROM detallepedido'
    );

    const aggregatedSales: { [key: number]: number } = {};
    detalleResult.rows.forEach((item: { idproducto: number; cantidad: number }) => {
      aggregatedSales[item.idproducto] = (aggregatedSales[item.idproducto] || 0) + item.cantidad;
    });

    const sortedProductSales = Object.entries(aggregatedSales)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, limit);

    const topProductIds = sortedProductSales.map(([id]) => parseInt(id));

    if (topProductIds.length === 0) {
      return [];
    }

    const productsResult = await db.query(
      `SELECT p.idproducto, p.nombre, p.categoria_id, c.nombre AS categoria_nombre
       FROM producto p
       LEFT JOIN categorias c ON p.categoria_id = c.idcategoria
       WHERE p.idproducto = ANY($1)`,
      [topProductIds]
    );

    const totalSalesAmount = Object.values(aggregatedSales).reduce((sum, count) => sum + (count as number), 0);

    const result: MostSoldProduct[] = sortedProductSales.map(([id, salesAmount]) => {
      const product = productsResult.rows.find((p: { idproducto: number }) => p.idproducto === parseInt(id));
      return {
        id: product?.idproducto.toString() || '',
        name: product?.nombre || 'Unknown',
        category: product?.categoria_nombre || 'Unknown',
        salesAmount: salesAmount as number,
        percentage: totalSalesAmount > 0 ? parseFloat(((salesAmount as number / totalSalesAmount) * 100).toFixed(2)) : 0,
      };
    });

    return result;
  },

  async getWeeklySalesSummary(): Promise<DailySalesData[]> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const todayISO = today.toISOString().split('T')[0];
    const sevenDaysAgoISO = sevenDaysAgo.toISOString().split('T')[0];

    const result = await db.query(
      'SELECT fecha, total FROM pedido WHERE fecha >= $1 AND fecha <= $2 ORDER BY fecha ASC',
      [sevenDaysAgoISO, todayISO]
    );

    const dailySalesMap: { [key: string]: number } = {};
    result.rows.forEach((pedido: { fecha: string; total: number }) => {
      const day = pedido.fecha;
      dailySalesMap[day] = (dailySalesMap[day] || 0) + pedido.total;
    });

    const dailyResult: DailySalesData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      dailyResult.push({
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', ''),
        earnings: dailySalesMap[dayString] || 0,
      });
    }

    return dailyResult;
  },

  async getSalesToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM pedido WHERE fecha = $1 AND estado = 'entregado'",
      [today]
    );
    return parseFloat(result.rows[0].total) || 0;
  },

  async getOrdersToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query('SELECT COUNT(*) FROM pedido WHERE fecha = $1', [today]);
    return parseInt(result.rows[0].count, 10) || 0;
  },

  async getAverageTicket(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query(
      "SELECT COALESCE(AVG(total), 0) AS promedio FROM pedido WHERE fecha = $1 AND estado = 'entregado'",
      [today]
    );
    return parseFloat(parseFloat(result.rows[0].promedio).toFixed(2)) || 0;
  },

  async getCancellationRate(): Promise<number> {
    const totalResult = await db.query('SELECT COUNT(*) FROM pedido');
    const totalOrdersCount = parseInt(totalResult.rows[0].count, 10);

    if (totalOrdersCount === 0) return 0;

    const cancelledResult = await db.query(
      "SELECT COUNT(*) FROM pedido WHERE estado = 'cancelado'"
    );
    const cancelledOrdersCount = parseInt(cancelledResult.rows[0].count, 10);

    return parseFloat(((cancelledOrdersCount / totalOrdersCount) * 100).toFixed(2));
  },

  async getSalesYesterday(): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    const result = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM pedido WHERE fecha = $1 AND estado = 'entregado'",
      [yesterdayISO]
    );
    return parseFloat(result.rows[0].total) || 0;
  },

  async getOrdersYesterday(): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    const result = await db.query('SELECT COUNT(*) FROM pedido WHERE fecha = $1', [yesterdayISO]);
    return parseInt(result.rows[0].count, 10) || 0;
  },

  async getAverageTicketYesterday(): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    const result = await db.query(
      "SELECT COALESCE(AVG(total), 0) AS promedio FROM pedido WHERE fecha = $1 AND estado = 'entregado'",
      [yesterdayISO]
    );
    return parseFloat(parseFloat(result.rows[0].promedio).toFixed(2)) || 0;
  },
};
