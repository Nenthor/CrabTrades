import { ALPACA_KEY, ALPACA_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
  return { isAuthanticated: locals.isAuthanticated, user: locals.user, alpaca: { keyId: ALPACA_KEY, secretKey: ALPACA_SECRET } };
}) satisfies PageServerLoad;
