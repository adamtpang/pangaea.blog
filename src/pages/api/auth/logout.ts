import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/session';

export const prerender = false;

const clear = (cookies: { delete: (n: string, o?: object) => void }) =>
  cookies.delete(SESSION_COOKIE, { path: '/' });

export const POST: APIRoute = async ({ cookies }) => {
  clear(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  clear(cookies);
  return redirect('/daily', 302);
};
