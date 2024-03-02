import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { INITIAL_CAPITAL, START_DATE, getHistoricalStockDataAwait, getPortfolioValue } from '$lib/Alpaca';
import { readCurrent, readDB } from '$lib/server/Crabbase';
import type { ChartProps, HomepageStats } from '$lib/types';
import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
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

    readCurrent().then((o) => {
      data.orders = o.length;
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

async function getTestCharts() {
  const arr = await readDB();
  const arrDate = [];

  for (let index = 0; index < arr.length; index++) {
    const element: ChartProps = {
      datasets: [],
      xLabels: [],
    };
    arrDate.push(arr[index].date);
  }

  for (let index = 0; index < arr.length; index++) {
    const element: ChartProps = {
      datasets: [],
      xLabels: [],
    };
    arrDate.push(arr[index].date);
  }

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const today = new Date();
  today.setMinutes(today.getMinutes() - 16);

  const arrALP = await getHistoricalStockDataAwait('AAPL', lastWeek, today, '1Hour', ALPACA_KEY, ALPACA_SECRET);
  console.log(arrALP);

  const arrPrice = [];
  for (let index = 0; index < arrALP.length; index++) {
    arrPrice.push(arrALP[index].OpenPrice);
  }

  const arrTimestamp = [];
  for (let index = 0; index < arrALP.length; index++) {
    arrTimestamp.push(arrALP[index].Timestamp);
  }

  let chartProps1: ChartProps = {
    xLabels: arrTimestamp,

    //aplaca

    /*
      new Date('2020-01-01').toISOString(),
      new Date('2020-02-01').toISOString(),
      new Date('2020-03-01').toISOString(),
      new Date('2020-04-01').toISOString(),
      new Date('2020-05-01').toISOString(),
      */

    datasets: [
      {
        type: 'bubble',
        label: 'X',
        data: [{ x: arr[0].date, y: arrPrice[0], r: 3 }],
        pointRadius: 3,
        backgroundColor: '#44e4ee',
        hoverBackgroundColor: '#44e4ee',
      },
      {
        type: 'line',
        label: 'AAPL',
        data: arrPrice,
      },
    ],
  };

  let chartProps2: ChartProps = {
    xLabels: [
      new Date('2020-01-01').toISOString(),
      new Date('2020-02-01').toISOString(),
      new Date('2020-03-01').toISOString(),
      new Date('2020-04-01').toISOString(),
      new Date('2020-06-01').toISOString(),
    ],
    datasets: [
      {
        type: 'line',
        label: 'AAPL',
        data: [42, 100, 50, 60, 40, 35, 20],
      },
    ],
  };

  return [chartProps2, chartProps1, chartProps2, chartProps2];
}
