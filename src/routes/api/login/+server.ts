import { RECAPTCHA_SECRET } from '$env/static/private';
import { loginUser } from '$lib/server/Auth';
import { type RequestHandler } from '@sveltejs/kit';

const RECAPTCHA_URL = `https://google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=token`;
const RECAPTCHA_MINIMUM_SCORE = 0.8;

export const POST = (async ({ request, cookies, url }) => {
  const username = request.headers.get('username')?.toString().trim();
  const password = request.headers.get('password')?.toString().trim();
  const token = request.headers.get('token')?.toString().trim();

  if (!username || !password || !token) {
    return getResponse('error', 'Username or password missing.');
  }
  if (!checkDataIntegrity(username, password)) {
    return getResponse('error', 'Only letters, numbers and underscores are allowed.');
  }

  // Get Recaptcha Score
  const score = await createScore(token);
  if (score < RECAPTCHA_MINIMUM_SCORE) {
    return getResponse('error', 'Recaptcha failed. Try again.');
  }

  const success = loginUser(username, password, cookies);
  if (!success) {
    return getResponse('error', 'Invalid username or password.');
  }

  console.log('login successful');

  // Successful login
  return getResponse('success', 'Login successful.');
}) satisfies RequestHandler;

function getResponse(type: string, message: string) {
  return new Response(JSON.stringify({ type, message }), {
    headers: { 'content-type': 'application/json' },
  });
}

function checkDataIntegrity(username: string, password: string) {
  const regExp = /^[\w]+$/; // Only letters, numbers and underscores
  return regExp.test(username) && regExp.test(password);
}

async function createScore(token: string) {
  const recaptcha = await fetch(RECAPTCHA_URL.replace('token', token)).then(async (res) => await res.json());

  // Return recaptcha score. Higher is better.
  if (!recaptcha || !recaptcha.success) return 0;
  else return recaptcha.score;
}
