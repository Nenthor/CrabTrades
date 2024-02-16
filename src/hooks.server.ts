import { fileExists } from '$lib/server/Bucket';
import { type Handle } from '@sveltejs/kit';

// Executes before route specific hooks
export const handle: Handle = (async ({ event, resolve }) => {
  event.locals = {}; // Can be used to store data that should be available to all hooks

  setTimeout(async () => {
    console.time('Server execution time1');
    const bool = await fileExists('historical-stock-data', 'NotFound.txt');
    console.timeEnd('Server execution time1');
  }, 500);

  setTimeout(async () => {
    console.time('Server execution time2');
    const bool = await fileExists('historical-stock-data', 'text.txt');
    console.timeEnd('Server execution time2');
  }, 600);

  setTimeout(async () => {
    console.time('Server execution time3');
    const bool = await fileExists('historical-stock-data', 'NotFound.txt');
    console.timeEnd('Server execution time3');
  }, 700);

  setTimeout(async () => {
    console.time('Server execution time4');
    const bool = await fileExists('historical-stock-data', 'text.txt');
    console.timeEnd('Server execution time4');
  }, 800);

  return resolve(event);
}) satisfies Handle;
