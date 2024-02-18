import { PASSWORD } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = generateJWTSecret(PASSWORD);
const expiresIn = 60 * 60 * 24 * 7; // 7 days
export const cookieName = '__session';

export interface User {
  name: string;
}

export const defaultUser: User = { name: 'Crabuser' };

export async function getUserFromCookies(cookies: Cookies): Promise<User | undefined> {
  const token = cookies.get(cookieName);
  console.log('token', token, cookies.getAll());
  if (!token) return;

  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    if (typeof sub !== 'string') throw new Error('Invalid token');
    return { name: sub.toString() };
  } catch (e) {
    cookies.delete(cookieName, { path: '/' });
    console.error(e);
  }
}

export function loginUser(username: string, password: string, cookies: Cookies) {
  if (password !== PASSWORD) return false;

  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn });
  cookies.set(cookieName, token, { path: '/', sameSite: 'strict', secure: true, httpOnly: true, maxAge: expiresIn });
  return true;
}

function generateJWTSecret(secret: string) {
  return createHash('sha256').update(secret).digest('hex');
}
