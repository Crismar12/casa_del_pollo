import { Request, Response } from 'express';
import { adminDashboardService } from '../services/adminDashboard.service';
import { db } from '../config/database';
import { runSeed } from '../seed';

export const adminDashboardController = {
  async getMostSoldProducts(req: Request, res: Response): Promise<void> {
    const products = await adminDashboardService.getMostSoldProducts();
    res.json(products);
  },

  async getWeeklySalesSummary(req: Request, res: Response): Promise<void> {
    const summary = await adminDashboardService.getWeeklySalesSummary();
    res.json(summary);
  },

  async getDashboardSummary(req: Request, res: Response): Promise<void> {
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
  },

  async resetDemoData(_req: Request, res: Response): Promise<void> {
    const client = await db.connect();
    try {
      await runSeed(client);
      res.json({ message: 'Datos de demo restablecidos exitosamente' });
    } finally {
      client.release();
    }
  },
};
