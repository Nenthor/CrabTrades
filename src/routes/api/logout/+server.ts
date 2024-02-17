import { cookieName } from '$lib/server/Auth';
import { type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ locals, cookies }) => {
  if (!locals.isAuthanticated) {
    return new Response('Not logged in', { status: 400 });
  }

  cookies.delete(cookieName, { path: '/' });
  return new Response('Logged out', { status: 200 });
}) satisfies RequestHandler;
