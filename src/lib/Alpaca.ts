import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

// Docs: https://github.com/alpacahq/alpaca-trade-api-js
// Docs: https://alpaca.markets/learn/fetch-historical-data/

export type TimeFrame = '1Min' | '15Min' | '30Min' | '1Hour' | '1Day' | '1Week';
export const CSV_START = 'Symbol,Timestamp,Open,Close,Low,High,VWAP';
export const INITIAL_CAPITAL = 100_000;
export const START_DATE = new Date('2024-02-26'); // The date the AI began trading

const historyUrl = 'https://data.alpaca.markets/v2/stocks';
const accountUrl = 'https://paper-api.alpaca.markets/v2/account';
interface RawData {
  bars: {
    c: number;
    h: number;
    l: number;
    n: number;
    o: number;
    t: string;
    v: number;
    vw: number;
  }[];
  next_page_token?: string;
  symbol: string;
}

/**
 * Fetches historical stock data from Alpaca for the given symbol and time frame all at once
 * @param symbols Array of stock symbols to fetch data for (Example: 'AAPL', 'GOOGL', 'TSLA')
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @param keyId Alpaca API key ID
 * @param secretKey Alpaca API secret key
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const data = await getHistoricalStockDataAwait('AAPL', new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 */
export async function getHistoricalStockDataAwait(symbol: string, start: Date, end: Date, timeframe: TimeFrame, keyId: string, secretKey: string) {
  const bars = getHistoricalStockData(symbol, start, end, timeframe, keyId, secretKey);
  const data: AlpacaBar[] = [];
  for await (const value of bars) {
    data.push(value);
  }
  return data;
}

/**
 * Fetches historical stock data from Alpaca for the given symbol and time frame
 * @param symbols Array of stock symbols to fetch data for (Example: 'AAPL', 'GOOGL', 'TSLA')
 * @param start Start date
 * @param end End date
 * @param timeframe Interval of the data (Example: '1Day', '1Hour', '15Min', '1Min')
 * @param limit Optional value to limit the number of bars to be returned
 * @param keyId Alpaca API key ID
 * @param secretKey Alpaca API secret key
 * @returns AsyncGenerator Can be used to iterate over the bars `for await (const value of bars) { console.log(value); }`
 * @example
 * const bars = getHistoricalStockData('AAPL', new Date('2021-01-01'), new Date('2021-12-31'), '1Day');
 * for await (const value of bars) {
 *  console.log(value);
 * }
 */
export async function* getHistoricalStockData(symbol: string, start: Date, end: Date, timeframe: TimeFrame, keyId: string, secretKey: string) {
  console.log('Fetching historical stock data for', symbol, 'from', start, 'to', end, 'with timeframe', timeframe);
  let pageToken: string | undefined;
  do {
    const chunk = await fetchStockData(symbol, start, end, timeframe, keyId, secretKey, pageToken);
    pageToken = chunk.next_page_token; // Can only load 1000 bars at a time - use this to load the next page
    for (const bar of chunk.bars) {
      yield {
        ClosePrice: bar.c,
        HighPrice: bar.h,
        LowPrice: bar.l,
        OpenPrice: bar.o,
        TradeCount: bar.n,
        Symbol: chunk.symbol,
        Timestamp: bar.t,
        Volume: bar.v,
        VWAP: bar.vw,
      } as AlpacaBar;
    }
  } while (pageToken);
}

async function fetchStockData(symbol: string, start: Date, end: Date, timeframe: TimeFrame, keyId: string, secretKey: string, pageToken?: string) {
  const url = new URL(`${historyUrl}/${symbol}/bars`);
  url.searchParams.append('start', start.toISOString());
  url.searchParams.append('end', end.toISOString());
  url.searchParams.append('timeframe', timeframe);
  url.searchParams.append('adjustment', 'split');
  url.searchParams.append('limit', '10000'); // Max limit
  if (pageToken) url.searchParams.append('page_token', pageToken);
  const response = await fetch(url, {
    headers: {
      'APCA-API-KEY-ID': keyId,
      'APCA-API-SECRET-KEY': secretKey,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch stock data:', response.statusText);
    return {
      bars: [],
      next_page_token: undefined,
      symbol,
    } as RawData;
  }

  return (await response.json()) as RawData;
}

/**
 * Converts the bars to a CSV string in the style of `Symbol,Date,Open,High,Low,Close,Volume`
 * @param bars AlpacaBars
 * @returns CSV string
 */
export function toStockFileString(bars: AlpacaBar[]) {
  let file = CSV_START + '\n';
  for (const bar of bars) {
    file += toStockString(bar) + '\n';
  }
  return file;
}

/**
 * Converts single bar to a CSV string in the style of 'Symbol,Timestamp,Open,Close,Low,High,VWAP'
 * @param bars AlpacaBar
 * @returns CSV string
 */
export function toStockString(bar: AlpacaBar) {
  return `${bar.Symbol},${bar.Timestamp},${bar.OpenPrice},${bar.ClosePrice},${bar.LowPrice},${bar.HighPrice},${bar.VWAP}`;
}

export async function getPortfolioValue(keyId: string, secretKey: string) {
  const response = await fetch(accountUrl, {
    headers: {
      'APCA-API-KEY-ID': keyId,
      'APCA-API-SECRET-KEY': secretKey,
    },
  });
  const data = await response.json();
  return data.portfolio_value as number;
}
