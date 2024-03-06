import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { INITIAL_CAPITAL, START_DATE, getHistoricalStockDataAwait, getPortfolioValue } from '$lib/Alpaca';
import { readCurrent, readDB } from '$lib/server/Crabbase';
import type { ChartProps, HomepageStats } from '$lib/types';
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

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDay() - 1); //probably up for deletion
  today.setMinutes(today.getMinutes() - 16);

  const arrALP = await getHistoricalStockDataAwait('AAPL', lastWeek, today, '1Hour', ALPACA_KEY, ALPACA_SECRET);

  const arrPrice = [];
  for (let index = 0; index < arrALP.length; index++) {
    arrPrice.push(arrALP[index].OpenPrice);
  }

  const arrTimestamp = [];
  for (let index = 0; index < arrALP.length; index++) {
    arrTimestamp.push(arrALP[index].Timestamp);
  }

  const arrBUY = [];
  const arrSELL = [];

  var indexLength = arr.length;

  if (arr.length > 25) {
    //once db has more entries then 25 => check only 25 entries
    indexLength = 25;
  }

  for (let index = 0; index < indexLength /*once db is full change to static value*/; index++) {
    var fromArrDate = new Date(arr[arr.length - index - 1].date);
    var fromArrDay = fromArrDate.getDay();

    if (arr[index].decision == 'BUY' && fromArrDate < today && fromArrDate > lastWeek && fromArrDay !== 6 && fromArrDay !== 0) {
      //add if statement checking lables l8ter if needed current setup works for single stock
      arrBUY.push({ x: arr[index].date, y: arr[index].lastPrice, r: 3 });
    } else if (arr[index].decision == 'SELL' && fromArrDate < today && fromArrDate > lastWeek) {
      //add if statement checking lables l8ter if needed current setup works for single stock
      arrSELL.push({ x: arr[index].date, y: arr[index].lastPrice, r: 3 });
    }
  }

  console.log(arrSELL); //DELETE LATER THIS IS DEBUG
  console.log(arrBUY);

  //ON ALL LINE CHARTS pointRadius has to be 0  apply to admin graphing l8ter

  let chartProps1: ChartProps = {
    xLabels: arrTimestamp,
    datasets: [
      {
        type: 'bubble',
        label: 'BUY',
        data: arrBUY,
        pointRadius: 3,
        backgroundColor: '#10ff00',
        hoverBackgroundColor: '#10ff00',
      },
      {
        type: 'bubble',
        label: 'SELL',
        data: arrSELL,
        pointRadius: 3,
        backgroundColor: '#ff0000', //color is not optimal, almost same color as graph
        hoverBackgroundColor: '#ff0000',
      },
      {
        type: 'line',
        label: 'AAPL',
        backgroundColor: '#b42f1744',
        hoverBackgroundColor: '#b42f1744',
        data: arrPrice,
        pointRadius: 0,
      },
    ],
  };

  let chartProps2: ChartProps = {
    //other charts replicate pattern from above
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
