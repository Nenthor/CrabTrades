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

  const arrAAPL = await getHistoricalStockDataAwait('AAPL', lastWeek, today, '1Hour', ALPACA_KEY, ALPACA_SECRET);
  const arrMSFT = await getHistoricalStockDataAwait('MSFT', lastWeek, today, '1Hour', ALPACA_KEY, ALPACA_SECRET);

  const arrPriceAAPL = [];
  for (let index = 0; index < arrAAPL.length; index++) {
    arrPriceAAPL.push(arrAAPL[index].OpenPrice);
  }

  const arrTimestamp = [];
  for (let index = 0; index < arrAAPL.length; index++) {
    arrTimestamp.push(arrAAPL[index].Timestamp);
  }

  const arrPriceMSFT = [];
  for (let index = 0; index < arrMSFT.length; index++) {
    arrPriceMSFT.push(arrMSFT[index].OpenPrice);
  }

  const arrBUYAAPL = [];
  const arrSELLAAPL = [];

  const arrBUYMSFT = [];
  const arrSELLMSFT = [];

  var indexLength = arr.length;

  if (arr.length > 25) {
    //once db has more entries then 25 => check only 25 entries
    indexLength = 25;
  }

  for (let index = 0; index < indexLength /*once db is full change to static value*/; index++) {
    var indexConv = arr.length - index - 1; //to read array backwards
    var fromArrDate = new Date(arr[indexConv].date);
    var fromArrDay = fromArrDate.getDay();

    if (arr[indexConv].decision == 'BUY' && fromArrDate < today && fromArrDate > lastWeek && fromArrDay != 6 && fromArrDay != 0) {
      //add if statement checking lables l8ter if needed current setup works for single stock

      if (arr[indexConv].symbol == 'AAPL') {
        arrBUYAAPL.push({ x: arr[indexConv].date, y: arr[indexConv].lastPrice, r: 3 });
      }

      if (arr[indexConv].symbol == 'MSFT') {
        arrBUYMSFT.push({ x: arr[indexConv].date, y: arr[indexConv].lastPrice, r: 3 });
      }
    } else if (arr[indexConv].decision == 'SELL' && fromArrDate < today && fromArrDate > lastWeek) {
      //add if statement checking lables l8ter if needed current setup works for single stock

      if (arr[indexConv].symbol == 'AAPL') {
        arrSELLAAPL.push({ x: arr[indexConv].date, y: arr[indexConv].lastPrice, r: 3 });
      }

      if (arr[indexConv].symbol == 'MSFT') {
        arrSELLMSFT.push({ x: arr[indexConv].date, y: arr[indexConv].lastPrice, r: 3 });
      }
    }
  }

  console.log(arrSELLAAPL); //DELETE LATER THIS IS DEBUG
  console.log(arrBUYAAPL);

  //ON ALL LINE CHARTS pointRadius has to be 0  apply to admin graphing l8ter

  let chartProps1: ChartProps = {
    xLabels: arrTimestamp,
    datasets: [
      {
        type: 'bubble',
        label: 'BUY',
        data: arrBUYAAPL,
        pointRadius: 3,
        backgroundColor: '#10ff00',
        hoverBackgroundColor: '#10ff00',
      },
      {
        type: 'bubble',
        label: 'SELL',
        data: arrSELLAAPL,
        pointRadius: 3,
        backgroundColor: '#ff0000', //color is not optimal, almost same color as graph
        hoverBackgroundColor: '#ff0000',
      },
      {
        type: 'line',
        label: 'AAPL',
        backgroundColor: '#b42f1744',
        hoverBackgroundColor: '#b42f1744',
        data: arrPriceAAPL,
        pointRadius: 0,
      },
    ],
  };

  let chartProps2: ChartProps = {
    //due to does not work as intended
    //other charts replicate pattern from above
    xLabels: arrTimestamp, //not sure if timestamp form MSFT and AAPL is the same
    datasets: [
      {
        type: 'bubble',
        label: 'BUY',
        data: arrBUYMSFT,
        pointRadius: 3,
        backgroundColor: '#10ff00',
        hoverBackgroundColor: '#10ff00',
      },
      {
        type: 'bubble',
        label: 'SELL',
        data: arrSELLMSFT,
        pointRadius: 3,
        backgroundColor: '#ff0000', //color is not optimal, almost same color as graph
        hoverBackgroundColor: '#ff0000',
      },
      {
        type: 'line',
        label: 'MSFT',
        backgroundColor: '#b42f1744',
        hoverBackgroundColor: '#b42f1744',
        data: arrPriceMSFT,
        pointRadius: 0,
      },
    ],
  };

  return [chartProps2, chartProps1, chartProps2, chartProps2];
}
