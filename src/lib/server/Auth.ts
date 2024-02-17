import { PASSWORD } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';
const expiresIn = 60 * 60 * 24 * 7;
export const cookieName = 'crabauth';

export interface User {
  name: string;
}

export const defaultUser: User = { name: 'Crabuser' };

export async function getUserFromCookies(cookies: Cookies): Promise<User | undefined> {
  const token = cookies.get(cookieName);
  if (!token) return;

  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    if (typeof sub !== 'string') throw new Error('Invalid token');

    return { name: sub.toString() };
  } catch (e) {
    console.error(e);
  }
}

export function loginUser(username: string, password: string, cookies: Cookies) {
  if (password !== PASSWORD) return false;

  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn });
  cookies.set(cookieName, token, { path: '/', sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 7 });
  return true;
}
