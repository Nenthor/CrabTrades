import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import Alpaca from '@alpacahq/alpaca-trade-api';
import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

// Docs: https://github.com/alpacahq/alpaca-trade-api-js
// Environment variables ALPACA_KEY and ALPACA_SECRET must be set

export type TimeFrame = '1Min' | '15Min' | '30Min' | '1Hour' | '1Day' | '1Week';

/**
 * Fetches historical stock data from Alpaca for the given symbol and time frame
 * @param symbols Array of stock symbols to fetch data for (Example: 'AAPL', 'GOOGL', 'TSLA')
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const bars = getHistoricalStockData('AAPL', new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 * for await (const value of bars) {
 *  console.log(value);
 * }
 */
export function getHistoricalStockData(symbol: string, start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  const alpaca = new Alpaca({ keyId: ALPACA_KEY, secretKey: ALPACA_SECRET, paper: true });

  console.log('Fetching historical stock data for', symbol, 'from', start, 'to', end, 'with timeframe', timeframe);

  const bars = alpaca.getMultiBarsAsyncV2([symbol], {
    timeframe: timeframe,
    start: start.toISOString(),
    end: end.toISOString(),
    adjustment: 'split',
    limit,
  });

  return bars;
}

/**
 * Fetches historical stock data from Alpaca for the given symbol and time frame all at once
 * @param symbols Array of stock symbols to fetch data for (Example: 'AAPL', 'GOOGL', 'TSLA')
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const data = await getHistoricalStockDataAwait('AAPL', new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 */
export async function getHistoricalStockDataAwait(symbol: string, start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  const bars = getHistoricalStockData(symbol, start, end, timeframe, limit);
  const data: AlpacaBar[] = [];
  for await (const value of bars) {
    data.push(value);
  }
  return data;
}
