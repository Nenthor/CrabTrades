import { type Handle } from '@sveltejs/kit';

// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  event.locals = {}; // Can be used to store data that should be available to all hooks

  return resolve(event);
}) satisfies Handle;
