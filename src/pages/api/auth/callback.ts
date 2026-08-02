import type { APIRoute } from 'astro';
import { SESSION_COOKIE, signSession, allowedLogins } from '../../../lib/session';

/*
  Step 2 of GitHub sign-in: trade the code for a token, ask GitHub who it
  belongs to, and mint a session only if that login is on the allowlist.
  The GitHub access token is used once here and never stored.
*/

export const prerender = false;

/** Send the user back to /daily with a readable reason rather than a blank error page. */
function fail(redirect: (url: string, status?: 302) => Response, why: string) {
  return redirect(`/daily?auth=${encodeURIComponent(why)}`, 302);
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail(redirect, 'not-configured');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = cookies.get('oauth_state')?.value;
  cookies.delete('oauth_state', { path: '/' });

  if (!code) return fail(redirect, 'no-code');
  if (!state || !expected || state !== expected) return fail(redirect, 'bad-state');

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: new URL('/api/auth/callback', url.origin).toString(),
      }),
    });
    const token = (await tokenRes.json())?.access_token;
    if (!token) return fail(redirect, 'no-token');

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'pangaea-auth',
      },
    });
    if (!userRes.ok) return fail(redirect, 'user-lookup-failed');
    const login = (await userRes.json())?.login;
    if (typeof login !== 'string') return fail(redirect, 'user-lookup-failed');

    if (!allowedLogins().includes(login.toLowerCase())) return fail(redirect, 'not-allowed');

    const session = signSession(login);
    // No signing secret configured means we cannot mint a trustworthy session.
    if (!session) return fail(redirect, 'no-session-secret');

    cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return redirect('/daily?auth=ok', 302);
  } catch {
    return fail(redirect, 'error');
  }
};
