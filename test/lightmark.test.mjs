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

test('homepage is the minimal masthead: metadata, identity schema, two entryways, and trust links', async () => {
  const html = await read('.vercel/output/static/index.html');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
  const description = metaContent(html, 'description');
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1[ >]/gi) ?? []).length;
  const visibleText = textFromHtml(html);

  // The homepage is deliberately a masthead, not an essay. The site name is the
  // whole title; the promise line and byline carry the description.
  assert.equal(title, 'Pangaea');
  assert.match(description, /Essays and conversations across time\./);
  assert.match(description, /By Adam Pang\./);
  assert.ok(description.length >= 20 && description.length <= 170, `description length was ${description.length}`);
  assert.equal(canonical, 'https://pangaea.blog/');
  assert.equal(h1Count, 1);
  assert.match(visibleText, /PANGAEA Essays and conversations across time\. By Adam Pang\./);
  assert.ok(words(visibleText).length <= 80, `homepage grew to ${words(visibleText).length} visible words; it is meant to stay a masthead`);

  // Exactly two entryways: read the essays, listen to the pod.
  const entryways = [...html.matchAll(/<nav[^>]+class="entryways"[^>]*>([^]*?)<\/nav>/gi)];
  assert.equal(entryways.length, 1, 'one entryways nav');
  const entryLinks = [...entryways[0][1].matchAll(/<a [^>]*href="([^"]+)"/gi)].map((match) => match[1]);
  assert.deepEqual(entryLinks, ['/posts/', '/podcast/']);
  assert.match(visibleText, /Read Essays/);
  assert.match(visibleText, /Listen Pangaea Pod/);

  // Trust links and both feeds stay reachable from the home footer.
  for (const path of ['/about/', '/contact/', '/privacy/', '/rss.xml', '/podcast.xml']) {
    assert.ok(html.includes(`href="${path}"`), `missing link to ${path}`);
  }

  // The page makes no commercial claims it cannot back.
  assert.doesNotMatch(visibleText, /subscribe|subscription|paywall|pricing|sign up/i);

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
  for (const term of ['Vercel Web Analytics', 'Google Fonts', 'YouTube', 'Spotify', 'SoundCloud', 'localStorage', 'GitHub', 'session cookie']) {
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
  assert.doesNotMatch(csp, /\*/);
});
