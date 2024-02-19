import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
  return { isAuthanticated: locals.isAuthanticated, user: locals.user };
}) satisfies PageServerLoad;
