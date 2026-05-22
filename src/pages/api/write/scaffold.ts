import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Deprecated. /write no longer calls Anthropic; the editor now builds drafts
 * purely from the title + outline + cover form. Kept as a 410 so anything
 * that still pings this URL gets a clear signal rather than a confusing 503.
 */
export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error:
        'The AI scaffold endpoint has been retired. /write now builds drafts client-side from a title + outline + cover image. No Anthropic key needed.',
    }),
    {
      status: 410,
      headers: { 'content-type': 'application/json' },
    }
  );
};
