import { RECAPTCHA_SECRET } from '$env/static/private';
import { loginUser } from '$lib/server/Auth';
import { type RequestHandler } from '@sveltejs/kit';

const RECAPTCHA_URL = `https://google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=token`;

export const POST = (async ({ request, cookies, url }) => {
  const form = await request.formData();
  const username = form.get('username')?.toString().trim();
  const password = form.get('password')?.toString().trim();
  const token = form.get('token')?.toString().trim();

  if (!username || !password || !token) {
    return getResponse('error', 'Username or password missing.');
  }
  if (!checkDataIntegrity(username, password)) {
    return getResponse('error', 'Only letters, numbers and underscores are allowed.');
  }

  const score = await createScore(token);
  console.log('score:', score);

  // Disable recaptcha for localhost
  if (score < 0.8 && url.hostname !== 'localhost') {
    return getResponse('error', 'Recaptcha failed. Try again.');
  }

  const success = loginUser(username, password, cookies);
  if (!success) {
    return getResponse('error', 'Invalid username or password.');
  }

  // Successful login - redirect to home page
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
  console.log('recaptcha:', recaptcha);
  // Return recaptcha score. Higher is better.
  if (recaptcha || !recaptcha.success) return 0;
  else return recaptcha.score;
}
