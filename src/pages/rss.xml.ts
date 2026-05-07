import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Pangaea',
    description:
      'A hub for the spoken & the written word. By Adam Pang. Music, philosophy, business — all of it on one map.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.blurb ?? '',
      link: `/posts/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
