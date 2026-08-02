import crypto from 'node:crypto';

/*
  Tiny signed-cookie session. No database, no session store: the cookie IS the
  session, HMAC-signed so it cannot be forged, and short enough to stay well
  under the 4KB cookie limit.

  Single-user by design. Pangaea has exactly one author, so "logged in" means
  "GitHub says you are the allowed login", and there is nothing else to model.
*/

export const SESSION_COOKIE = 'pangaea_session';

/** Signing key. Falls back to WRITE_PASSWORD so there is one less var to set. */
function secret(): string {
  return process.env.SESSION_SECRET || process.env.WRITE_PASSWORD || '';
}

/** Who is allowed in. Defaults to the repo owner. */
export function allowedLogins(): string[] {
  const raw = process.env.ALLOWED_GITHUB_LOGINS || process.env.GITHUB_OWNER || 'adamtpang';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export interface Session {
  login: string;
  exp: number;
}

function hmac(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('base64url');
}

/** Returns null when no signing secret is configured, so callers fail closed. */
export function signSession(login: string, maxAgeSec = 60 * 60 * 24 * 365): string | null {
  const key = secret();
  if (!key) return null;
  const body: Session = { login, exp: Math.floor(Date.now() / 1000) + maxAgeSec };
  const data = Buffer.from(JSON.stringify(body), 'utf-8').toString('base64url');
  return `${data}.${hmac(data, key)}`;
}

export function verifySession(token?: string | null): Session | null {
  const key = secret();
  if (!key || !token) return null;

  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const data = token.slice(0, dot);
  const mac = token.slice(dot + 1);

  const expected = hmac(data, key);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const body = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as Session;
    if (typeof body.login !== 'string' || typeof body.exp !== 'number') return null;
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    if (!allowedLogins().includes(body.login.toLowerCase())) return null;
    return body;
  } catch {
    return null;
  }
}

export function randomToken(bytes = 16): string {
  return crypto.randomBytes(bytes).toString('hex');
}
