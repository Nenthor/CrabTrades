import { writeOrder } from '$lib/server/Crabbase';
import type { Order } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  const symbol = request.headers.get('symbol')?.toString().trim();
  const date = request.headers.get('date')?.toString().trim();
  const decision = request.headers.get('decision')?.toString().trim();
  const quantityString = request.headers.get('quantity')?.toString().trim();

  if (symbol && date && decision && quantityString && (decision === 'BUY' || decision === 'SELL')) {
    let quantity = parseFloat(quantityString);

    const order: Order = {
      symbol: symbol,
      date: new Date(date),
      decision: decision,
      quantity: isNaN(quantity) ? -1 : quantity,
    };

    var success = await writeOrder(order);

    if (success) {
      return new Response(JSON.stringify({ type: 'success', message: 'Wrote order to firestore database' }), {
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ type: 'error', message: 'ERROR: write order to firestore database FAILED' }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ type: 'error', message: 'Missing required parameters' }), {
    headers: { 'content-type': 'application/json' },
  });
}) satisfies RequestHandler;
