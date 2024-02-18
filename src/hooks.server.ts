import { defaultUser, getUserFromCookies } from '$lib/server/Auth';
import { redirect, type Handle } from '@sveltejs/kit';

const publicRouts = ['/', '/login', '/api/login'];
// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookies(event.cookies);

  if (!user && !publicRouts.includes(event.url.pathname)) {
    // Redirect to login page if user is not logged in
    console.log('redirecting to login');
    redirect(301, '/login');
  }

  // Can be used to store data that should be available to all hooks
  event.locals = {
    isAuthanticated: !!user,
    user: user || defaultUser,
  };

  console.log('event.locals', event.locals);

  return resolve(event);
}) satisfies Handle;
