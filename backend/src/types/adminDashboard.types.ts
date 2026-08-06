export interface MostSoldProduct {
  id: string;
  name: string;
  category: string;
  salesAmount: number;
  revenue: number;
  percentage?: number; 
}

export interface DailySalesData {
  day: string;
  earnings: number;
}
