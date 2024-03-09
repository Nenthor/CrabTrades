import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { INITIAL_CAPITAL, START_DATE, getHistoricalStockDataAwait, getPortfolioValue } from '$lib/Alpaca';
import { readDB, readStatic } from '$lib/server/Crabbase';
import type { ChartProps, HomepageStats, Order } from '$lib/types';
import type { PageServerLoad } from './$types';

let homepageStats: HomepageStats;
let lastFetch = 0;

export const load = (async ({ locals }) => {
  // Fetch homepage stats every minute. Otherwise, use the cached value.
  if (!homepageStats || Date.now() - lastFetch > 60_000) {
    lastFetch = Date.now();
    homepageStats = await getHomepageStats();
  }

  return { isAuthanticated: locals.isAuthanticated, user: locals.user, homepageStats };
}) satisfies PageServerLoad;

async function getHomepageStats(): Promise<HomepageStats> {
  return await new Promise(async (resolve) => {
    let maxFetches = 3;
    let data: HomepageStats = { assetsValue: 0, profit: 0, orders: 0, uptime: START_DATE, charts: await getTestCharts() };

    readStatic().then((s) => {
      data.orders = s.orderCount;
      maxFetches--;
      if (maxFetches <= 0) {
        resolve(data);
      }
    });
    getPortfolioValue(ALPACA_KEY, ALPACA_SECRET).then((v) => {
      data.assetsValue = v;
      data.profit = (v / INITIAL_CAPITAL - 1) * 100;
      maxFetches--;
      if (maxFetches <= 0) {
        resolve(data);
      }
    });
    getTestCharts().then((c) => {
      data.charts = c;
      maxFetches--;
      if (maxFetches <= 0) {
        resolve(data);
      }
    });
  });
}

// Finds two dates from datesArray that "surround" the targetDate
function findClosestDateIndex(datesArray: Date[], targetDate: Date): [number, number] {
  let minPositivDifference = Infinity;
  let minNegativeDifference = Infinity;

  let closestPositivIndex = -1;
  let closestNegativIndex = -1;

  for (let i = 0; i < datesArray.length; i++) {
    const currentDate = datesArray[i];
    const difference = currentDate.getTime() - targetDate.getTime();

    if (difference <= 0 && Math.abs(difference) < minNegativeDifference) {
      minNegativeDifference = Math.abs(difference);
      closestNegativIndex = i;
    }

    if (difference >= 0 && Math.abs(difference) < minPositivDifference) {
      minPositivDifference = Math.abs(difference);
      closestPositivIndex = i;
    }
  }

  return [closestNegativIndex, closestPositivIndex];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// After findClosestDateIndex() calculates average price of the two dates found
function getAveragePriceAtDate(date: Date, alpDates: Date[], alpPrices: number[]): number {
  const alpacaIndexes: [number, number] = findClosestDateIndex(alpDates, date);

  const aDate = alpDates[alpacaIndexes[0]];
  const bDate = alpDates[alpacaIndexes[1]];

  let dstFromA = date.getTime() - aDate.getTime();
  let dstBetweenAandB = bDate.getTime() - aDate.getTime();

  // Needs to be between 0 and 1
  let t = dstFromA / dstBetweenAandB;

  let averagePrice = lerp(alpPrices[alpacaIndexes[0]], alpPrices[alpacaIndexes[1]], t);

  return averagePrice;
}

async function getTestCharts() {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const today = new Date();
  today.setMinutes(today.getMinutes() - 16);

  const AIOrders = await readDB(lastWeek);

  // Sorts orders by stock symbol in different arrays
  const sortedOrders: Order[][] = [];
  for (let i = 0; i < AIOrders.length; i++) {
    let stock = AIOrders[i].symbol;
    const index = sortedOrders.findIndex((mapArr) => mapArr[0].symbol === stock);
    if (index === -1) sortedOrders.push([AIOrders[i]]);
    else sortedOrders[index].push(AIOrders[i]);
  }

  // Creates chart for each stock
  const chartProps: ChartProps[] = [];
  for (let stockIndex = 0; stockIndex < sortedOrders.length; stockIndex++) {
    const stockArr = sortedOrders[stockIndex];
    if (!stockArr || stockArr.length === 0) continue;

    const stockSymbol = stockArr[0].symbol;

    // Fetches stock data from Alpaca
    const alpacaStockData = await getHistoricalStockDataAwait(stockSymbol, lastWeek, today, '1Hour', ALPACA_KEY, ALPACA_SECRET);
    const alpacaPrices: number[] = [];
    const alpacaTimestamps: string[] = [];
    const alpacaDates: Date[] = [];

    for (let index = 0; index < alpacaStockData.length; index++) {
      alpacaPrices.push(alpacaStockData[index].OpenPrice);
      alpacaTimestamps.push(alpacaStockData[index].Timestamp);
      alpacaDates.push(new Date(alpacaStockData[index].Timestamp));
    }

    // Plot BUY and SELL points on the chart of alpaca
    const BUY_CHART = [];
    const SELL_CHART = [];
    for (let index = 0; index < stockArr.length; index++) {
      var indexConv = stockArr.length - index - 1; //to read array backwards
      var fromArrDate = stockArr[indexConv].date;
      // var size = Math.min(9, Math.max(4, stockArr[indexConv].quantity));
      var size = lerp(3, 6, Math.min(1, Math.max(0, stockArr[indexConv].quantity - 6 / 15.0)));

      if (fromArrDate.getTime() < new Date(alpacaTimestamps[0]).getTime()) continue;
      if (fromArrDate >= today) continue;

      let averagePrice = getAveragePriceAtDate(fromArrDate, alpacaDates, alpacaPrices);

      if (stockArr[indexConv].decision == 'BUY') BUY_CHART.push({ x: stockArr[indexConv].date.toISOString(), y: averagePrice, r: size });
      else if (stockArr[indexConv].decision == 'SELL') SELL_CHART.push({ x: stockArr[indexConv].date.toISOString(), y: averagePrice, r: size });
    }

    // Creates chart for that stock
    chartProps.push({
      xLabels: alpacaTimestamps,
      datasets: [
        {
          type: 'bubble',
          label: 'BUY',
          data: BUY_CHART,
          pointRadius: 3,
          backgroundColor: '#32cd32',
          hoverBackgroundColor: '#32cd32',
          hitRadius: 9,
        },
        {
          type: 'bubble',
          label: 'SELL',
          data: SELL_CHART,
          pointRadius: 3,
          backgroundColor: '#ff0000', //color is not optimal, almost same color as graph
          hoverBackgroundColor: '#ff0000',
          hitRadius: 9,
        },
        {
          type: 'line',
          label: stockSymbol,
          backgroundColor: '#b42f1744',
          hoverBackgroundColor: '#b42f1744',
          data: alpacaPrices,
          pointRadius: 0,
        },
      ],
    });
  }

  return chartProps;
}
