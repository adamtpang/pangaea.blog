import { defineMiddleware } from 'astro:middleware';

/**
 * Gate everything under /write and /api/write with HTTP Basic Auth.
 * Set WRITE_PASSWORD on Vercel. Username is ignored; only the password matters.
 * If WRITE_PASSWORD is unset in production, the route is locked closed.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const isProtected = url.pathname === '/write' || url.pathname.startsWith('/api/write');
  if (!isProtected) {
    return next();
  }

  const expected = import.meta.env.WRITE_PASSWORD ?? process.env.WRITE_PASSWORD;
  if (!expected) {
    return new Response('Backstage is locked: WRITE_PASSWORD not configured.', {
      status: 503,
      headers: { 'content-type': 'text/plain' },
    });
  }

  const auth = context.request.headers.get('authorization') ?? '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const [, password] = decoded.split(':');
      if (password === expected) {
        return next();
      }
    } catch {
      // fall through to challenge
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Pangaea backstage"',
      'content-type': 'text/plain',
    },
  });
});
