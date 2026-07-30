export interface MostSoldProduct {
  id: string;
  name: string;
  category: string;
  salesAmount: number;
  percentage?: number;
}

export interface DailySalesData {
  day: string;
  earnings: number;
}

export interface DashboardSummary {
  salesToday: number;
  ordersToday: number;
  averageTicket: number;
  cancellationRate: number;
  salesYesterday: number;
  ordersYesterday: number;
  averageTicketYesterday: number;
  weeklyComparison: WeeklyComparison;
  topCategory: TopCategory;
}

export interface WeeklyComparison {
  thisWeekSales: number;
  lastWeekSales: number;
  thisWeekOrders: number;
  lastWeekOrders: number;
  salesChange: number;
  ordersChange: number;
}

export interface TopCategory {
  name: string;
  totalSales: number;
  orderCount: number;
}
