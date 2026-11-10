import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { publishedPosts } from '../../lib/posts';

export const prerender = false;

const HASH = 'pangaea:views';

function redisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

async function command(args: (string | number)[]) {
  const env = redisEnv();
  if (!env) return null;
  const res = await fetch(env.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { result?: unknown };
  return body.result ?? null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function publishedIds() {
  const posts = await publishedPosts();
  return new Set(posts.map((post) => post.id));
}

function parseCounts(result: unknown) {
  const views: Record<string, number> = {};
  if (!Array.isArray(result)) return views;
  for (let i = 0; i < result.length; i += 2) {
    const slug = String(result[i] ?? '');
    const count = Number(result[i + 1] ?? 0);
    if (slug && Number.isFinite(count)) views[slug] = count;
  }
  return views;
}

async function analyticsCounts(ids: Set<string>) {
  const token = process.env.VERCEL_ACCESS_TOKEN || process.env.VERCEL_TOKEN;
  if (!token) return {} as Record<string, number>;
  const projectId = process.env.VERCEL_PROJECT_ID || 'prj_yQJ2HJwnMKK8Lf1xb1Fu1vExprA9';
  const teamId = process.env.VERCEL_TEAM_ID || 'team_94z2L2r0X8hywHS0hi2ahkW7';
  const until = Date.now();
  const since = until - 366 * 24 * 60 * 60 * 1000;
  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
  url.searchParams.set('projectId', projectId);
  url.searchParams.set('teamId', teamId);
  url.searchParams.set('since', String(since));
  url.searchParams.set('until', String(until));
  url.searchParams.append('by', 'requestPath');
  url.searchParams.set('limit', '250');
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return {};
    const body = (await res.json()) as { data?: unknown };
    const rows = Array.isArray(body.data) ? body.data : [];
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const record = row as Record<string, unknown>;
      const path = String(record.requestPath || record.route || '');
      const match = path.match(/^\/posts\/([a-z0-9-]+)\/?$/);
      if (!match || !ids.has(match[1])) continue;
      const count = Number(record.count ?? record.total ?? record.value ?? record.visits ?? 0);
      if (Number.isFinite(count)) counts[match[1]] = (counts[match[1]] || 0) + count;
    }
    return counts;
  } catch {
    return {};
  }
}

export const GET: APIRoute = async () => {
  try {
    const ids = await publishedIds();
    const redisOn = Boolean(redisEnv());
    const stored = redisOn ? parseCounts(await command(['HGETALL', HASH])) : {};
    const analytics = await analyticsCounts(ids);
    if (!redisOn && Object.keys(analytics).length === 0) return json({ enabled: false, views: {} });
    const views: Record<string, number> = {};
    for (const id of ids) {
      views[id] = Math.max(Number(stored[id] || 0), Number(analytics[id] || 0));
    }
    return json({ enabled: true, views });
  } catch {
    return json({ enabled: false, views: {} });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return json({ enabled: false }, 403);
  if (!redisEnv()) return json({ enabled: false, views: null });

  let slug = '';
  try {
    const body = (await request.json()) as { slug?: unknown };
    slug = typeof body.slug === 'string' ? body.slug : '';
  } catch {
    return json({ enabled: false }, 400);
  }
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return json({ enabled: false }, 400);

  try {
    const ids = await publishedIds();
    if (!ids.has(slug)) return json({ enabled: false }, 404);

    const ip = (request.headers.get('x-forwarded-for') ?? '0').split(',')[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.SESSION_SECRET || 'pangaea-views';
    const stamp = createHash('sha256').update(`${salt}|${ip}|${slug}|${day}`).digest('hex').slice(0, 32);
    const fresh = await command(['SET', `pangaea:viewed:${stamp}`, '1', 'NX', 'EX', 86400]);
    if (fresh === 'OK') await command(['HINCRBY', HASH, slug, 1]);
    const views = parseCounts(await command(['HGETALL', HASH]));
    return json({ enabled: true, views: views[slug] ?? 0 });
  } catch {
    return json({ enabled: false, views: null });
  }
};
