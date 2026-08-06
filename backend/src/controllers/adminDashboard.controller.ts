import { Request, Response } from 'express';
import { adminDashboardService } from '../services/adminDashboard.service';
import { db } from '../config/database';
import { runSeed } from '../seed';
import { logger } from '../utils/logger';

export const adminDashboardController = {
  async getMostSoldProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await adminDashboardService.getMostSoldProducts();
      res.json(products);
    } catch (error: unknown) {
      logger.error('Error in adminDashboardController.getMostSoldProducts:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener productos más vendidos' });
    }
  },

  async getWeeklySalesSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await adminDashboardService.getWeeklySalesSummary();
      res.json(summary);
    } catch (error: unknown) {
      logger.error('Error in adminDashboardController.getWeeklySalesSummary:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener resumen semanal de ventas' });
    }
  },

  async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const salesToday = await adminDashboardService.getSalesToday();
      const ordersToday = await adminDashboardService.getOrdersToday();
      const averageTicket = await adminDashboardService.getAverageTicket();
      const cancellationRate = await adminDashboardService.getCancellationRate();

      const salesYesterday = await adminDashboardService.getSalesYesterday();
      const ordersYesterday = await adminDashboardService.getOrdersYesterday();
      const averageTicketYesterday = await adminDashboardService.getAverageTicketYesterday();

      const weeklyComparison = await adminDashboardService.getWeeklyComparison();
      const topCategory = await adminDashboardService.getTopCategory();

      res.json({
        salesToday,
        ordersToday,
        averageTicket,
        cancellationRate,
        salesYesterday,
        ordersYesterday,
        averageTicketYesterday,
        weeklyComparison,
        topCategory,
      });
    } catch (error: unknown) {
      logger.error('Error in adminDashboardController.getDashboardSummary:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el resumen del dashboard' });
    }
  },

  async resetDemoData(_req: Request, res: Response): Promise<void> {
    const client = await db.connect();
    try {
      await runSeed(client);
      res.json({ message: 'Datos de demo restablecidos exitosamente' });
    } catch (error: unknown) {
      logger.error('Error in adminDashboardController.resetDemoData:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Error al restablecer datos de demo' });
    } finally {
      client.release();
    }
  },
};
