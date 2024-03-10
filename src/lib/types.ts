export interface ChartProps {
  xLabels: string[];
  datasets: {
    type: 'line' | 'bubble';
    label: string;
    data: (number | { x: string; y: number; r: number })[];
    backgroundColor: string;
    pointRadius?: number;
    hitRadius?: number;
  }[];
}

export interface StockData {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Order {
  symbol: string;
  date: Date;
  decision: 'BUY' | 'SELL';
  quantity: number;
}

export interface Static {
  orderCount: number;
}

export interface Auth {
  username: string;
  password: string;
}

export interface HomepageStats {
  assetsValue: number;
  profit: number;
  orders: number;
  uptime: Date;
  charts: ChartProps[];
}
