import { defaultUser, getUserFromCookies } from '$lib/server/Auth';
import { redirect, type Handle } from '@sveltejs/kit';

const publicRouts = ['/'];
const onlyNonAuthRouts = ['/login', '/api/login'];
const allowedUnauthRouts = [...publicRouts, ...onlyNonAuthRouts];

// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookies(event.cookies);

  if (!user && !allowedUnauthRouts.includes(event.url.pathname)) {
    // Redirect to login page if user is not logged in
    redirect(301, '/login');
  }
  if (user && onlyNonAuthRouts.includes(event.url.pathname)) {
    // Redirect to home page if user is logged in
    redirect(301, '/');
  }

  // Can be used to store data that should be available to all hooks
  event.locals = {
    isAuthanticated: !!user,
    user: user || defaultUser,
  };

  console.log('event.locals', event.locals);

  return resolve(event);
}) satisfies Handle;
