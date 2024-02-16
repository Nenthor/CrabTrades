import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

export const CSV_START = 'Symbol,Timestamp,Open,Close,Low,High,VWAP';

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
