import { SESSION_COOKIE, verifySession } from './session';

/*
  Shared access control for every /api/daily/* endpoint (sync, seeds, polish).
  One function, one policy, so a change here can't drift between endpoints.

  Two ways in, both fail closed:
    1. A GitHub sign-in session cookie (the normal path).
    2. The legacy x-daily-key passphrase, kept so existing devices and
       scripted access keep working.
  With neither OAuth nor a password configured on the server, every endpoint
  refuses (503) rather than serving anything — a public URL can never expose
  the journal, or the seed prompts drawn from private notes, by default.
*/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Length-independent-ish comparison, so the response time does not leak the key. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Returns null when authorized, or the Response to send back when not. */
export function authorizeDailyRequest(request: Request, sessionCookie?: string): Response | null {
  if (verifySession(sessionCookie)) return null;

  const expected = process.env.DAILY_PASSWORD || process.env.WRITE_PASSWORD;
  const oauthReady = Boolean(
    process.env.GITHUB_OAUTH_CLIENT_ID && process.env.GITHUB_OAUTH_CLIENT_SECRET
  );

  if (!expected && !oauthReady) {
    return json(
      { error: 'Sign in to use this. Set up GitHub sign-in, or set DAILY_PASSWORD.', configured: false },
      503
    );
  }

  const given = request.headers.get('x-daily-key') ?? '';
  if (expected && given && safeEqual(given, expected)) return null;

  return json({ error: 'Sign in to sync.', oauth: oauthReady }, 401);
}
