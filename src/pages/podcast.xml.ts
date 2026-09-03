import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import {
  episodeDisplayTitle,
  PODCAST_PROMISE,
  PODCAST_TITLE,
  SUMMON_DISCLOSURE,
} from '../lib/podcast';

const xml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET(context: APIContext) {
  const episodes = (
    await getCollection(
      'episodes',
      ({ data }) => !data.draft && Boolean(data.audio_url && data.audio_bytes)
    )
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const cover = new URL('/podcast/cover.png', context.site).href;
  const feed = new URL('/podcast.xml', context.site).href;

  return rss({
    title: PODCAST_TITLE,
    description: PODCAST_PROMISE,
    site: context.site!,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    },
    customData:
      '<language>en-us</language>' +
      '<itunes:author>Adam Pang</itunes:author>' +
      '<itunes:type>episodic</itunes:type>' +
      '<itunes:explicit>false</itunes:explicit>' +
      '<itunes:category text="Society &amp; Culture" />' +
      '<itunes:image href="' + xml(cover) + '" />' +
      '<atom:link href="' + xml(feed) + '" rel="self" type="application/rss+xml" />',
    items: episodes.map((episode) => {
      const description = [
        episode.data.blurb ?? '',
        episode.data.format === 'summon' ? SUMMON_DISCLOSURE : '',
      ]
        .filter(Boolean)
        .join(' ');

      return {
        title: episodeDisplayTitle(episode.data),
        pubDate: episode.data.date,
        description,
        link: '/podcast/' + episode.slug + '/',
        categories: [
          episode.data.format.toUpperCase(),
          ...(episode.data.tags ?? []),
        ],
        enclosure: {
          url: episode.data.audio_url!,
          length: episode.data.audio_bytes!,
          type: episode.data.audio_type,
        },
        customData:
          '<itunes:episodeType>full</itunes:episodeType>' +
          (episode.data.feed_number
            ? '<itunes:episode>' + episode.data.feed_number + '</itunes:episode>'
            : '') +
          (episode.data.duration
            ? '<itunes:duration>' + xml(episode.data.duration) + '</itunes:duration>'
            : '') +
          '<itunes:explicit>' + episode.data.explicit + '</itunes:explicit>',
      };
    }),
  });
}
