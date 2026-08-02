import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifySession } from '../../../lib/session';

/* Who is signed in, and is sign-in even available? Drives the /daily UI. */

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const session = verifySession(cookies.get(SESSION_COOKIE)?.value);
  return new Response(
    JSON.stringify({
      login: session?.login ?? null,
      // Is GitHub sign-in wired up on this deployment?
      oauth: Boolean(process.env.GITHUB_OAUTH_CLIENT_ID && process.env.GITHUB_OAUTH_CLIENT_SECRET),
      // Is the legacy passphrase route still available as a fallback?
      passphrase: Boolean(process.env.DAILY_PASSWORD || process.env.WRITE_PASSWORD),
    }),
    { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } }
  );
};
