import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { getHistoricalStockDataAwait, toStockFileString } from '$lib/Alpaca';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  const symbol = request.headers.get('symbol') || '';
  const startDate = request.headers.get('startdate') || '';
  const endDate = request.headers.get('enddate') || '';
  const timeframe: any = request.headers.get('timeframe') || '';
  const type = request.headers.get('type') || 'json'; // optional, default to json

  if (!symbol || !startDate || !endDate || !timeframe || !type) {
    return new Response('Missing required parameters', { status: 400 });
  }

  if (type !== 'csv' && type !== 'json') {
    return new Response('Invalid type', { status: 400 });
  }

  const data = await getHistoricalStockDataAwait(symbol, new Date(startDate), new Date(endDate), timeframe, ALPACA_KEY, ALPACA_SECRET);
  const body = type === 'json' ? JSON.stringify(data) : toStockFileString(data);

  return new Response(body, { status: 200 });
}) satisfies RequestHandler;
