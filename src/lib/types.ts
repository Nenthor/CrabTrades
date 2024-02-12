export interface ChartProps {
  xLabels: string[];
  datasets: {
    type: 'line' | 'bubble';
    label: string;
    data: number[];
    color?: string;
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

// You need to update CSV_START in Alpaca.ts as well
export const CSV_START_CLIENT = 'Symbol,Timestamp,Open,Close,Low,High,VWAP';
