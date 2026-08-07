import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/session';
import { authorizeDailyRequest } from '../../../lib/dailyAuth';
import { DAILY_SEEDS } from '../../../data/dailySeeds';

/*
  /api/daily/seeds — today's rotating prompt picks.

  Gated behind the same auth as sync: some seeds come from private Obsidian
  notes, not just public Farcaster casts, so an unauthenticated visitor to
  /daily gets no seeds at all rather than a redacted subset. Deterministic by
  (date, round): the picks are stable through the day, and "shuffle" just
  bumps round and re-derives a different 3, no server state needed.
*/

export const prerender = false;

function hashPick(key: string, poolSize: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % poolSize;
}

function pickThree(dateKey: string, round: number) {
  const pool = DAILY_SEEDS;
  const n = Math.min(3, pool.length);
  const used = new Set<number>();
  const picked: typeof pool = [];
  for (let i = 0; i < n; i++) {
    let idx = hashPick(`${dateKey}:${round}:${i}`, pool.length);
    let guard = 0;
    while (used.has(idx) && guard++ < pool.length) idx = (idx + 1) % pool.length;
    used.add(idx);
    picked.push(pool[idx]);
  }
  return picked;
}

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const denied = authorizeDailyRequest(request, cookies.get(SESSION_COOKIE)?.value);
  if (denied) return denied;

  const today = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const round = Math.max(0, Math.min(50, Number(url.searchParams.get('round')) || 0));

  return new Response(JSON.stringify({ seeds: pickThree(today, round) }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
