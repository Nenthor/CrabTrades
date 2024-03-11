import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { INITIAL_CAPITAL, START_DATE, getHistoricalStockDataAwait, getPortfolioValue, type AlpacaBar } from '$lib/Alpaca';
import { MAX_QUANTITY, MIN_QUANTITY, PLACEHOLDER_SYMBOLS, readDB, readStatic } from '$lib/server/Crabbase';
import type { ChartProps, HomepageStats, Order } from '$lib/types';
import type { PageServerLoad } from './$types';

const CACHE_TIME = 60; // seconds
const TIME_PERIOD = 10; // days
const MAX_BUBBLE_RADIUS = 8;
const MIN_BUBBLE_RADIUS = 4;
const MIN_SYMBOLS = 4;
let homepageStats: HomepageStats;
let lastFetch = 0;

export const load = (async ({ locals }) => {
  // Fetch homepage stats every minute. Otherwise, use the cached value.
  if (!homepageStats || Date.now() - lastFetch > CACHE_TIME * 1000) {
    lastFetch = Date.now();
    homepageStats = await getHomepageStats();
    console.log('Fetched in', Date.now() - lastFetch, 'ms');
  }

  return { isAuthanticated: locals.isAuthanticated, user: locals.user, homepageStats };
}) satisfies PageServerLoad;

async function getHomepageStats(): Promise<HomepageStats> {
  const promises = [];
  let data: HomepageStats = { assetsValue: 0, profit: 0, orders: 0, uptime: START_DATE, charts: [] };

  promises.push(readStatic().then((s) => (data.orders = s.orderCount)));
  promises.push(getChartProps().then((p) => (data.charts = p)));
  promises.push(
    getPortfolioValue(ALPACA_KEY, ALPACA_SECRET).then((v) => {
      data.assetsValue = v;
      data.profit = (data.assetsValue / INITIAL_CAPITAL - 1) * 100;
    }),
  );

  await Promise.all(promises);
  return data;
}

async function getChartProps(): Promise<ChartProps[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - TIME_PERIOD);

  // if start date weekend, set to friday
  if (startDate.getDay() === 6)
    startDate.setDate(startDate.getDate() - 1); // Saturday
  else if (startDate.getDay() === 0) startDate.setDate(startDate.getDate() - 2); // Sunday

  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() - 16); // Stock data is always delayed by 15 minutes

  // Get AI orders from database
  const orders = await readDB(startDate);

  // Fetch simultaneously stock data for all stocks in orders
  const map = new Map<string, { bars: AlpacaBar[]; buyOrders: Order[]; sellOrders: Order[] }>();
  const promises = [];
  for (const order of orders) {
    if (!map.has(order.symbol)) {
      map.set(order.symbol, { bars: [], buyOrders: [], sellOrders: [] });

      promises.push(
        getHistoricalStockDataAwait(order.symbol, startDate, endDate, '1Hour', ALPACA_KEY, ALPACA_SECRET).then((data) => {
          const symbolData = map.get(order.symbol);
          if (symbolData) symbolData.bars = data;
        }),
      );
    }

    if (order.decision === 'BUY') map.get(order.symbol)?.buyOrders.push(order);
    else if (order.decision === 'SELL') map.get(order.symbol)?.sellOrders.push(order);
  }

  // Load placeholder data for stocks if less than MIN_SYMBOLS
  let placeholderIndex = 0;
  while (map.size < MIN_SYMBOLS && placeholderIndex < PLACEHOLDER_SYMBOLS.length) {
    if (map.has(PLACEHOLDER_SYMBOLS[placeholderIndex])) {
      placeholderIndex++;
      continue;
    }

    const symbol = PLACEHOLDER_SYMBOLS[map.size];
    map.set(symbol, { bars: [], buyOrders: [], sellOrders: [] });
    promises.push(
      getHistoricalStockDataAwait(symbol, startDate, endDate, '1Hour', ALPACA_KEY, ALPACA_SECRET).then((data) => {
        const symbolData = map.get(symbol);
        if (symbolData) symbolData.bars = data;
      }),
    );
  }

  // Wait for all stock data to be fetched
  await Promise.all(promises);

  // Create chart for each stock
  const chartProps: ChartProps[] = [];
  for (const [symbol, data] of map) {
    const xLabels = data.bars.map((b) => b.Timestamp);
    const datasets: ChartProps['datasets'] = [
      {
        type: 'line',
        label: symbol,
        backgroundColor: '#b42f1750',
        data: data.bars.map((b) => b.ClosePrice),
      },
      {
        type: 'bubble',
        label: 'BUY',
        data: data.buyOrders.map((o) => ({ x: o.date.toISOString(), y: findBestYCoord(o.date, data.bars), r: getRadius(o.quantity) })),
        backgroundColor: '#0f0',
        hitRadius: MAX_BUBBLE_RADIUS,
      },
      {
        type: 'bubble',
        label: 'SELL',
        data: data.sellOrders.map((o) => ({ x: o.date.toISOString(), y: findBestYCoord(o.date, data.bars), r: getRadius(o.quantity) })),
        backgroundColor: '#f00',
        hitRadius: MAX_BUBBLE_RADIUS,
      },
    ];

    chartProps.push({ xLabels, datasets });
  }

  return chartProps;
}

function getRadius(quantity: number) {
  const r = lerp(MIN_BUBBLE_RADIUS, MAX_BUBBLE_RADIUS, Math.min(1, Math.max(0, (quantity - MIN_QUANTITY) / (MAX_QUANTITY - MIN_QUANTITY))));
  return Math.round(r * 10) / 10;
}

function findBestYCoord(x: Date, bars: AlpacaBar[]) {
  for (let i = 0; i < bars.length; i++) {
    if (new Date(bars[i].Timestamp).getTime() >= x.getTime()) {
      if (i === 0) return bars[i].ClosePrice;
      // (x - xMin) / (xMax - xMin)
      const percentage =
        (x.getTime() - new Date(bars[i - 1].Timestamp).getTime()) /
        (new Date(bars[i].Timestamp).getTime() - new Date(bars[i - 1].Timestamp).getTime());

      return lerp(
        bars[i - 1].ClosePrice, // Too early
        bars[i].ClosePrice, // Too late
        percentage,
      );
    }
  }
  return 0;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
