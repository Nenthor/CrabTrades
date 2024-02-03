import { DB_TOKEN } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load = (() => {
  console.log('DB_TOKEN:', DB_TOKEN);
  return;
}) satisfies PageServerLoad;
