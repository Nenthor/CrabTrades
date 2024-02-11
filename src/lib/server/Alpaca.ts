import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import Alpaca from '@alpacahq/alpaca-trade-api';
import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

// Docs: https://github.com/alpacahq/alpaca-trade-api-js

export type TimeFrame = '1Min' | '15Min' | '30Min' | '1Hour' | '1Day' | '1Week';

/**
 * Fetches historical stock data from Alpaca for the given symbols and time frame
 * @param symbols Array of stock symbols to fetch data for (Example: ['AAPL', 'GOOGL', 'TSLA'])
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const bars = getHistoricalStockData(['AAPL', 'GOOGL'], new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 * for await (const value of bars) {
 *  console.log(value);
 * }
 */
export function getHistoricalStockData(symbols: string[], start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  const alpaca = new Alpaca({ keyId: ALPACA_KEY, secretKey: ALPACA_SECRET, paper: true });

  console.log('Fetching historical stock data for', symbols, 'from', start, 'to', end, 'with timeframe', timeframe);

  const bars = alpaca.getMultiBarsAsyncV2(symbols, {
    timeframe: timeframe,
    start: start.toISOString(),
    end: end.toISOString(),
    limit,
  });

  return bars;
}

/**
 * Fetches historical stock data from Alpaca for the given symbols and time frame all at once
 * @param symbols Array of stock symbols to fetch data for (Example: ['AAPL', 'GOOGL', 'TSLA'])
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const data = await getHistoricalStockDataAwait(['AAPL', 'GOOGL'], new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 */
export async function getHistoricalStockDataAwait(symbols: string[], start: Date, end: Date, timeframe: TimeFrame, limit?: number) {
  const bars = getHistoricalStockData(symbols, start, end, timeframe, limit);
  const data: AlpacaBar[] = [];
  for await (const value of bars) {
    data.push(value);
  }
  return data;
}

/**
 * Converts the bars to a CSV string in the style of `Symbol,Date,Open,High,Low,Close,Volume`
 * @param bars AsyncGenerator of AlpacaBar
 * @returns CSV string
 */
export async function toStockFileString(bars: AsyncGenerator<AlpacaBar, void, unknown>) {
  let file = 'Symbol,Date,Open,High,Low,Close,Volume\n';
  for await (const bar of bars) {
    file += toStockString(bar) + '\n';
  }
  return file;
}

/**
 * Converts single bar to a CSV string in the style of `Symbol,Date,Open,High,Low,Close,Volume`
 * @param bars AlpacaBar
 * @returns CSV string
 */
export function toStockString(bar: AlpacaBar) {
  return `${bar.Symbol},${bar.Timestamp},${bar.OpenPrice},${bar.HighPrice},${bar.LowPrice},${bar.ClosePrice},${bar.Volume}`;
}
