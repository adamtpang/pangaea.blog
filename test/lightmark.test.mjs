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

test('homepage has complete metadata, identity schema, useful content, and real actions', async () => {
  const html = await read('.vercel/output/static/index.html');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
  const description = metaContent(html, 'description');
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const visibleText = textFromHtml(html);
  const paragraphTexts = [...html.matchAll(/<p\b[^>]*>([^]*?)<\/p>/gi)].map((match) => textFromHtml(match[1]));
  const chunkable = paragraphTexts.filter((paragraph) => {
    const count = words(paragraph).length;
    return count >= 25 && count <= 120 && !/^(it|this|that|these|they|he|she|we|you)\b/i.test(paragraph);
  });

  assert.ok(title.length >= 20 && title.length <= 65, `title length was ${title.length}`);
  assert.ok(description.length >= 70 && description.length <= 170, `description length was ${description.length}`);
  assert.equal(canonical, 'https://pangaea.blog/');
  assert.equal(h1Count, 1);
  assert.ok(words(visibleText).length >= 250, `homepage had ${words(visibleText).length} visible words`);
  assert.ok(chunkable.length / paragraphTexts.length >= 0.35, 'at least 35% of paragraphs must stand alone');
  assert.match(html, /href="\/about\/"/);
  assert.match(html, /href="\/contact\/"/);
  assert.match(html, /href="\/privacy\/"/);
  assert.match(visibleText, /Start reading the essays/i);
  assert.match(visibleText, /no paid plan, subscription, trial, or paywall/i);

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
