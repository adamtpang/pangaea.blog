import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const rifts = (await getCollection('rifts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Pangaea',
    description:
      'A weekly catalog of one app, one essay, one song. Curations from the supercontinent of Adam Pang’s curiosities.',
    site: context.site!,
    items: rifts.map((rift) => ({
      title: `№ ${String(rift.data.number).padStart(3, '0')} — ${rift.data.title}`,
      pubDate: rift.data.date,
      description: rift.data.blurb ?? '',
      link: `/rifts/${rift.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
