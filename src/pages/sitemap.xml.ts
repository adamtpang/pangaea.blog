import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

const SITE_URL = 'https://pangaea.blog';
const EPOCH = new Date('1971-01-01').valueOf();

const staticPaths = [
  '/',
  '/1000/',
  '/about/',
  '/apps/',
  '/archive/',
  '/cities/',
  '/contact/',
  '/favorites/',
  '/graph/',
  '/podcast/',
  '/posts/',
  '/privacy/',
  '/reels/',
  '/start/',
  '/vlog/',
  '/work/',
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

export const GET: APIRoute = async () => {
  const [posts, episodes, vlogs, favorites, reels] = await Promise.all([
    getCollection('posts', ({ data }) => !data.draft && data.date.valueOf() >= EPOCH),
    getCollection('episodes', ({ data }) => !data.draft),
    getCollection('vlogs', ({ data }) => !data.draft),
    getCollection('favorites', ({ data }) => !data.draft),
    getCollection('reels', ({ data }) => !data.draft && data.rendered),
  ]);

  const contentPaths = [
    ...posts.map((entry) => `/posts/${entry.slug}/`),
    ...episodes.map((entry) => `/podcast/${entry.slug}/`),
    ...vlogs.map((entry) => `/vlog/${entry.slug}/`),
    ...favorites.map((entry) => `/favorites/${entry.slug}/`),
    ...reels.map((entry) => `/reels/${entry.slug}/`),
  ];

  const paths = Array.from(new Set([...staticPaths, ...contentPaths])).sort();
  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, SITE_URL).toString())}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    }
  );
};
