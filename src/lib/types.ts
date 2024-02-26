import type { Cookies } from '@sveltejs/kit';

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

export interface Order {
  symbol: string;
  date: string;
  decision: string;
  portfolioValue: number;
  quantity: number;
}

export interface Statics {
  text: string;
  stuff: string;
  value: number;
}

export interface Auth {
  state: string;
  username: string;
  password: string;
  cookies: Cookies;
}
