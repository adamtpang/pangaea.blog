import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

function textFromHtml(html) {
  return html
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/<(script|style|svg|template)\b[^>]*>[^]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|apos|#\d+|#x[\da-f]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(value) {
  return value.split(/\s+/).filter(Boolean);
}

function metaContent(html, name) {
  const match = html.match(
    new RegExp(`<meta[^>]+name=(["'])${name}\\1[^>]+content=(["'])(.*?)\\2`, 'i')
  );
  return match?.[3] ?? '';
}

function flattenSchema(value) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(flattenSchema);
  return [value, ...(Array.isArray(value['@graph']) ? value['@graph'].flatMap(flattenSchema) : [])];
}

test('homepage is an essay directory with the thousand-essay bar', async () => {
  const html = await read('.vercel/output/static/index.html');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
  const description = metaContent(html, 'description');
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1[ >]/gi) ?? []).length;
  const visibleText = textFromHtml(html);

  assert.ok(title.length >= 20 && title.length <= 65, `title length was ${title.length}`);
  assert.match(title, /^Pangaea/);
  assert.match(description, /Adam Pang/);
  assert.ok(description.length >= 70 && description.length <= 170, `description length was ${description.length}`);
  assert.equal(canonical, 'https://pangaea.blog/');
  assert.equal(h1Count, 1);
  assert.match(visibleText, /Essays/);
  assert.match(visibleText, /Deathmoney/);
  assert.match(visibleText, /Updated/);
  assert.match(html, /data-created="2026-09-08"/);
  assert.match(html, /data-sort="latest"/);
  assert.match(html, /data-sort="popular"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /\/images\/thumbs\/deathmoney\.webp/);
  assert.match(html, /href="\/posts\/deathmoney\/"/);
  assert.doesNotMatch(visibleText, /The Ceiling Is Human/);
  assert.doesNotMatch(html, /\/podcast/);
  assert.ok(!html.includes('/posts/the-ceiling-is-human'), 'unpublished essay still on the homepage');
  assert.match(visibleText, /1 \/ 1000 essays/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuenow="1"/);
  assert.match(html, /aria-valuemin="0"/);
  assert.match(html, /aria-valuemax="1000"/);

  // Unpublished drafts never leak onto the homepage.
  assert.ok(!html.includes('href="/posts/agency-is-the-only-skill/"'), 'draft essay linked from homepage');

  for (const path of ['/about/', '/contact/', '/privacy/', '/rss.xml']) {
    assert.ok(html.includes(`href="${path}"`), `missing link to ${path}`);
  }

  // The page makes no commercial claims it cannot back: no prices, no paid tier.
  assert.doesNotMatch(visibleText, /[$€£]\s?\d|per month|free trial|pricing/i);
  assert.ok(html.includes('href="https://adampang.substack.com/subscribe"'));

  const jsonLd = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([^]*?)<\/script>/gi)]
    .flatMap((match) => flattenSchema(JSON.parse(match[1])));
  const types = new Set(jsonLd.flatMap((node) => Array.isArray(node['@type']) ? node['@type'] : [node['@type']]).filter(Boolean));
  assert.ok(types.has('Organization'));
  assert.ok(types.has('Person'));
  assert.ok(types.has('WebSite'));
  assert.equal(jsonLd.find((node) => node['@type'] === 'Organization')?.name, 'Pangaea');
});

test('trust routes are built, identify the operator, and disclose actual site behavior', async () => {
  const [about, contact, privacy] = await Promise.all([
    read('.vercel/output/static/about/index.html'),
    read('.vercel/output/static/contact/index.html'),
    read('.vercel/output/static/privacy/index.html'),
  ]);

  assert.ok(words(textFromHtml(about)).length >= 150);
  assert.ok(words(textFromHtml(contact)).length >= 100);
  assert.ok(words(textFromHtml(privacy)).length >= 350);
  assert.match(textFromHtml(about), /personal publication of Adam Pang/i);
  assert.match(contact, /https:\/\/adampang\.com\/about#how-to-reach-me/);
  for (const term of ['PostHog', 'Substack', 'Google Fonts', 'YouTube', 'Spotify', 'SoundCloud', 'localStorage', 'GitHub', 'session cookie']) {
    assert.match(textFromHtml(privacy), new RegExp(term, 'i'));
  }
});

test('discovery files expose a valid sitemap and truthful agent guidance', async () => {
  const [robots, sitemap, llms] = await Promise.all([
    read('.vercel/output/static/robots.txt'),
    read('.vercel/output/static/sitemap.xml'),
    read('.vercel/output/static/llms.txt'),
  ]);

  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /Sitemap: https:\/\/pangaea\.blog\/sitemap\.xml/);
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  for (const path of ['about', 'contact', 'privacy']) {
    assert.match(sitemap, new RegExp(`<loc>https://pangaea\\.blog/${path}/</loc>`));
    assert.match(llms, new RegExp(`https://pangaea\\.blog/${path}/`));
  }
  assert.match(llms, /operated by Adam Pang/i);
  assert.match(llms, /no paid plan, subscription, or paywall/i);
  assert.match(sitemap, /<loc>https:\/\/pangaea\.blog\/posts\/deathmoney\/<\/loc>/);
  assert.doesNotMatch(sitemap, /the-ceiling-is-human/);
  assert.doesNotMatch(sitemap, /\/podcast/);
});

test('essay 002 stays in the repo but leaves the public site, and the goal counts published essays', async () => {
  const [source, indexHtml, rss] = await Promise.all([
    read('src/content/posts/the-ceiling-is-human.md'),
    read('.vercel/output/static/posts/index.html'),
    read('.vercel/output/static/rss.xml'),
  ]);

  assert.match(source, /^draft: true$/m);
  assert.match(source, /The Ceiling Is Human/);
  assert.match(indexHtml, /1 \/ 1000 essays/);
  assert.match(indexHtml, /role="progressbar"/);
  assert.match(indexHtml, /aria-valuenow="1"/);
  assert.match(indexHtml, /href="\/posts\/deathmoney\/"/);
  assert.doesNotMatch(indexHtml, /the-ceiling-is-human/);
  assert.doesNotMatch(indexHtml, /\/podcast/);
  assert.match(rss, /deathmoney/);
  assert.doesNotMatch(rss, /the-ceiling-is-human/);
  assert.doesNotMatch(rss, /The Ceiling Is Human/);

  await assert.rejects(read('.vercel/output/static/posts/the-ceiling-is-human/index.html'));
  await assert.rejects(read('.vercel/output/static/share/the-ceiling-is-human/index.html'));
  const deathmoney = await read('.vercel/output/static/posts/deathmoney/index.html');
  assert.match(deathmoney, /Deathmoney/);
});

test('the podcast is unpublished and its routes are not built', async () => {
  const episode = await read('src/content/episodes/001-braxton.md');
  assert.match(episode, /^draft: true$/m);
  assert.match(episode, /title: Braxton/);
  await assert.rejects(read('.vercel/output/static/podcast/index.html'));
  await assert.rejects(read('.vercel/output/static/podcast/001-braxton/index.html'));
  await assert.rejects(read('.vercel/output/static/podcast.xml'));
});

test('Deathmoney is one world: picture, song, and a palette from the picture', async () => {
  const html = await read('.vercel/output/static/posts/deathmoney/index.html');
  assert.match(html, /src="\/images\/deathmoney\.webp"/);
  assert.match(html, /skull holding a fan of hundred-dollar bills/);
  assert.match(html, /https:\/\/open\.spotify\.com\/embed\/track\/781V2Y5LPtcpgONEOadadE/);
  assert.match(html, /--paper:#/);
  assert.match(html, /--ink:#/);
  assert.match(html, /--accent:#/);
  const style = html.match(/style="([^"]*--paper:[^"]+)"/)?.[1] ?? '';
  const color = (name) => style.match(new RegExp(`${name}:(#[0-9a-f]{6})`))?.[1];
  const paper = color('--paper');
  const ink = color('--ink');
  const accent = color('--accent');
  assert.ok(paper && ink && accent, style);
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  assert.ok(ratio(ink, paper) >= 4.5, `ink contrast ${ratio(ink, paper)}`);
  assert.ok(ratio(accent, paper) >= 4.5, `accent contrast ${ratio(accent, paper)}`);
  assert.doesNotMatch(textFromHtml(html), /—|–/);
});

test('production header configuration enforces CSP and MIME protections', async () => {
  const config = JSON.parse(await read('vercel.json'));
  const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]));
  const csp = headers['content-security-policy'];

  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /fonts\.googleapis\.com/);
  assert.match(csp, /www\.youtube-nocookie\.com/);
  assert.match(csp, /script-src[^;]*https:\/\/us-assets\.i\.posthog\.com/);
  assert.match(csp, /connect-src[^;]*https:\/\/us\.i\.posthog\.com/);
  assert.doesNotMatch(csp, /\*/);
});
