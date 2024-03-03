import { defaultUser, getUserFromCookies, hasAdminToken } from '$lib/server/Auth';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

const publicRouts = ['/', '/robots.txt', '/images', '/fonts', '/favicon.ico'];
const onlyNonAuthRouts = ['/login', '/api/login'];
const allowedUnauthRouts = [...publicRouts, ...onlyNonAuthRouts];

// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  const user = await getUserFromCookies(event.cookies);
  const isAuthanticated = hasAdminToken(event.request.headers.get('admin-token'));

  if (!user && !isAllowedUnauthRoute(event.url.pathname) && !isAuthanticated) {
    // Redirect to login page if user is not logged in
    console.log('Redirecting to login page', event.url.pathname);
    return redirect(301, '/login');
  }
  if (user && onlyNonAuthRouts.includes(event.url.pathname)) {
    // Redirect to home page if user is logged in
    return redirect(301, '/');
  }

  // Set Headers
  const response = await resolve(event);
  setHeaders(response.headers, event.url.origin);

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

function setHeaders(headers: Headers, origin: string) {
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Referrer-Policy', 'strict-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-XSS-Protection', '0');
  headers.set(
    'Permissions-Policy',
    'geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()',
  );
}

function isAllowedUnauthRoute(path: string) {
  for (const route of allowedUnauthRouts) {
    if (path.startsWith(route)) return true;
  }
  return false;
}
