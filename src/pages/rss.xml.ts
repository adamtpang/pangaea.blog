import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const epoch = new Date('1971-01-01').valueOf();
  const posts = (
    await getCollection('posts', ({ data }) => !data.draft && data.date.valueOf() >= epoch)
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Pangaea Essays',
    description: 'Essays across time, by Adam Pang.',
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
