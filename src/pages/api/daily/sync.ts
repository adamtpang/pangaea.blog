import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/session';
import { authorizeDailyRequest } from '../../../lib/dailyAuth';

/*
  /api/daily/sync — server-side persistence for the daily page.

  Store: a single JSON blob at `daily/entries.json` on a dedicated `daily`
  branch of the (private) repo. A separate branch keeps main's history clean,
  and every commit is tagged [skip ci] so writing 300 words never triggers a
  Vercel rebuild. Reuses the GITHUB_TOKEN that /write already needs, so this
  adds no new service.

  Auth: a shared passphrase in DAILY_PASSWORD (falling back to WRITE_PASSWORD),
  sent as `x-daily-key`. This endpoint FAILS CLOSED: with no passphrase set on
  the server it refuses to do anything, so a public URL can never expose the
  journal by default.

  The client stays local-first. This is a backup and a cross-device merge, not
  the source of truth: losing the network only means the page saves locally.
*/

export const prerender = false;

const OWNER = process.env.GITHUB_OWNER ?? 'adamtpang';
const REPO = process.env.GITHUB_REPO ?? 'pangaea.blog';
const DATA_BRANCH = process.env.DAILY_BRANCH ?? 'daily';
const BASE_BRANCH = process.env.GITHUB_BRANCH ?? 'main';
const DATA_PATH = 'daily/entries.json';

/** One day's page, as stored. */
interface Entry {
  text: string;
  words: number;
  title?: string;
  question?: string;
  updatedAt?: number;
  doneAt?: number;
}
type Entries = Record<string, Entry>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function gh(token: string, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'content-type': 'application/json',
      'user-agent': 'pangaea-daily',
      ...(init.headers ?? {}),
    },
  });
}

/** Keep only well-formed days, so a bad client cannot poison the store. */
function clean(raw: unknown): Entries {
  const out: Entries = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    const e = v as Record<string, unknown>;
    if (typeof e.text !== 'string') continue;
    if (e.text.length > 200_000) continue;
    out[k] = {
      text: e.text,
      words: typeof e.words === 'number' && e.words >= 0 ? Math.floor(e.words) : 0,
      ...(typeof e.title === 'string' ? { title: e.title.slice(0, 180) } : {}),
      ...(typeof e.question === 'string' ? { question: e.question.slice(0, 700) } : {}),
      ...(typeof e.updatedAt === 'number' ? { updatedAt: e.updatedAt } : {}),
      ...(typeof e.doneAt === 'number' ? { doneAt: e.doneAt } : {}),
    };
  }
  return out;
}

/**
 * Merge two sides. A day never shrinks: whichever version has more words wins,
 * and updatedAt breaks ties. That makes sync order-independent and means a
 * stale tab can never delete work done elsewhere.
 */
function merge(a: Entries, b: Entries): Entries {
  const out: Entries = { ...a };
  for (const [k, inc] of Object.entries(b)) {
    const cur = out[k];
    if (!cur) { out[k] = inc; continue; }
    if (inc.words > cur.words) { out[k] = inc; continue; }
    if (inc.words === cur.words && (inc.updatedAt ?? 0) > (cur.updatedAt ?? 0)) {
      out[k] = inc;
    }
  }
  return out;
}

/** Ensure the data branch exists, branching off the default branch once. */
async function ensureBranch(token: string): Promise<void> {
  const head = await gh(token, `/repos/${OWNER}/${REPO}/git/ref/heads/${DATA_BRANCH}`);
  if (head.ok) return;
  if (head.status !== 404) throw new Error(`GitHub ${head.status}: ${await head.text()}`);

  const base = await gh(token, `/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`);
  if (!base.ok) throw new Error(`GitHub ${base.status}: ${await base.text()}`);
  const sha = (await base.json())?.object?.sha;

  const made = await gh(token, `/repos/${OWNER}/${REPO}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${DATA_BRANCH}`, sha }),
  });
  // 422 means someone created it in parallel, which is fine.
  if (!made.ok && made.status !== 422) {
    throw new Error(`GitHub ${made.status}: ${await made.text()}`);
  }
}

/** Read the stored blob. Returns empty entries (and no sha) when absent. */
async function readStore(token: string): Promise<{ entries: Entries; sha?: string }> {
  const res = await gh(
    token,
    `/repos/${OWNER}/${REPO}/contents/${DATA_PATH}?ref=${DATA_BRANCH}`
  );
  if (res.status === 404) return { entries: {} };
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  const body = await res.json();
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(Buffer.from(body.content ?? '', 'base64').toString('utf-8'));
  } catch {
    parsed = {};
  }
  return { entries: clean(parsed), sha: body.sha };
}

async function writeStore(token: string, entries: Entries, sha?: string) {
  const days = Object.keys(entries).length;
  const res = await gh(token, `/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`, {
    method: 'PUT',
    body: JSON.stringify({
      // [skip ci] so saving a page never triggers a deploy.
      message: `daily: sync ${days} day${days === 1 ? '' : 's'} [skip ci]`,
      branch: DATA_BRANCH,
      content: Buffer.from(JSON.stringify(entries, null, 2), 'utf-8').toString('base64'),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const denied = authorizeDailyRequest(request, cookies.get(SESSION_COOKIE)?.value);
  if (denied) return denied;

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'GITHUB_TOKEN not configured.' }, 503);

  try {
    await ensureBranch(token);
    const { entries } = await readStore(token);
    return json({ entries, syncedAt: Date.now() });
  } catch (err) {
    return json({ error: String((err as Error).message ?? err) }, 502);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = authorizeDailyRequest(request, cookies.get(SESSION_COOKIE)?.value);
  if (denied) return denied;

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'GITHUB_TOKEN not configured.' }, 503);

  let incoming: Entries;
  try {
    const body = await request.json();
    incoming = clean(body?.entries);
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  try {
    await ensureBranch(token);
    const { entries: remote, sha } = await readStore(token);
    const merged = merge(remote, incoming);

    // Skip the commit when nothing actually changed, so idle tabs do not
    // write a commit every time they sync.
    const unchanged = JSON.stringify(remote) === JSON.stringify(merged);
    if (!unchanged) await writeStore(token, merged, sha);

    return json({ entries: merged, syncedAt: Date.now(), committed: !unchanged });
  } catch (err) {
    return json({ error: String((err as Error).message ?? err) }, 502);
  }
};
