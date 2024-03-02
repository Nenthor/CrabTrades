import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import { getHistoricalStockDataAwait } from '$lib/Alpaca';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  const symbol = request.headers.get('symbol') || '';
  const startDate = request.headers.get('startdate') || '';
  const endDate = request.headers.get('enddate') || '';
  const timeframe: any = request.headers.get('timeframe') || '';

  if (!symbol || !startDate || !endDate || !timeframe) {
    return new Response('Missing required parameters', { status: 400 });
  }

  const data = await getHistoricalStockDataAwait(symbol, new Date(startDate), new Date(endDate), timeframe, ALPACA_KEY, ALPACA_SECRET);

  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}) satisfies RequestHandler;
