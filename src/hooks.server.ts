import { defaultUser, getUserFromCookies, hasAdminToken } from '$lib/server/Auth';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

const publicRouts = ['/', '/robots.txt'];
const onlyNonAuthRouts = ['/login', '/api/login'];
const allowedUnauthRouts = [...publicRouts, ...onlyNonAuthRouts];

// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookies(event.cookies);
  const isAuthanticated = hasAdminToken(event.request.headers.get('admin-token'));

  if (!user && !allowedUnauthRouts.includes(event.url.pathname) && !isAuthanticated) {
    // Redirect to login page if user is not logged in
    console.log('Redirecting to login page', event.url.pathname);
    redirect(301, '/login');
  }
  if (user && onlyNonAuthRouts.includes(event.url.pathname)) {
    // Redirect to home page if user is logged in
    console.log('Redirecting to home page', event.url.pathname);
    redirect(301, '/');
  }

  // Can be used to store data that should be available to all hooks
  event.locals = {
    isAuthanticated: !!user,
    user: user || defaultUser,
  };

  return resolve(event);
}) satisfies Handle;

// Executes when an error is thrown in a route. Ignores 404 errors
export const handleError: HandleServerError = (async ({ error, status, message }) => {
  if (status === 404) {
    console.log(`${error}`.split('\n')[0].replace('Error:', '404'));
  } else console.error(error);

  return {
    message,
    status,
  };
}) satisfies HandleServerError;
