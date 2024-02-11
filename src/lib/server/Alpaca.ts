import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import Alpaca from '@alpacahq/alpaca-trade-api';
import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

// Docs: https://github.com/alpacahq/alpaca-trade-api-js

export enum TimeFrame {
  Minute = '1Min',
  QuaterHour = '15Min',
  HalfHour = '30Min',
  Hour = '1Hour',
  Day = '1Day',
  Week = '1Week',
}

export function getHistoricalStockData(symbols: string[], start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  if (symbols.length === 0) return [];
  if (start.getTime() >= end.getTime()) throw new Error('Start date must be before end date.');

  const alpaca = new Alpaca({ keyId: ALPACA_KEY, secretKey: ALPACA_SECRET, paper: true });

  const bars = alpaca.getMultiBarsAsyncV2(symbols, {
    timeframe: timeframe,
    start: start.toISOString(),
    end: end.toISOString(),
    limit,
  });

  /*
  // Use this to iterate over the bars:
  for await (const value of bars) {
    console.log(value);
  }
  */
  return bars;
}

export async function getHistoricalStockDataAwait(symbols: string[], start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  const bars = getHistoricalStockData(symbols, start, end, timeframe, limit);
  const data: AlpacaBar[] = [];
  for await (const value of bars) {
    data.push(value);
  }
  return data;
}
