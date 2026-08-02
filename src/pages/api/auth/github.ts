import type { APIRoute } from 'astro';
import { randomToken } from '../../../lib/session';

/* Step 1 of GitHub sign-in: bounce to GitHub with a one-time state value. */

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response(
      JSON.stringify({
        error:
          'GitHub sign-in is not configured. Set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET.',
      }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    );
  }

  // CSRF: the state we send must come back unchanged.
  const state = randomToken();
  cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', new URL('/api/auth/callback', url.origin).toString());
  // read:user is the least we can ask for and still learn who signed in.
  authorize.searchParams.set('scope', 'read:user');
  authorize.searchParams.set('state', state);

  return redirect(authorize.toString(), 302);
};
