import { defineMiddleware } from 'astro:middleware';

/**
 * /write is intentionally open for now. The two API endpoints below still
 * gate themselves on having real API credentials (ANTHROPIC_API_KEY for
 * scaffold, GITHUB_TOKEN for publish) so an open URL can't actually do
 * anything destructive without those server-side secrets, but anyone who
 * finds the URL can scaffold drafts. To re-gate later, set WRITE_PASSWORD
 * on Vercel and restore the basic-auth block (kept in git history).
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  return next();
});
