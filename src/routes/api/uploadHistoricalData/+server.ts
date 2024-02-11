import { getHistoricalStockData, toStockString } from '$lib/server/Alpaca';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  const symbol = request.headers.get('symbol') || '';
  const startDate = request.headers.get('startdate') || '';
  const endDate = request.headers.get('enddate') || '';
  const timeframe: any = request.headers.get('timeframe') || '';

  if (!symbol || !startDate || !endDate || !timeframe) {
    return new Response('Missing required parameters', { status: 400 });
  }

  const data = getHistoricalStockData([symbol], new Date(startDate), new Date(endDate), timeframe);

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue('start');
      for await (const value of data) {
        controller.enqueue(toStockString(value) + '\n');
      }
      controller.close();
    },
    cancel() {
      data.return();
    },
  });

  return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}) satisfies RequestHandler;
