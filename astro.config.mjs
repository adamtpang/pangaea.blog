import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';
import wikiLinkPlugin from 'remark-wiki-link';

// Wiki-link config: turn [[Some Post]] into a real link to /posts/some-post/
// This is the foundation for the future Obsidian-style graph view.
const wikiLink = [
  wikiLinkPlugin,
  {
    pageResolver: (name) => [
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    ],
    hrefTemplate: (permalink) => `/posts/${permalink}/`,
    aliasDivider: '|',
  },
];

export default defineConfig({
  site: 'https://pangaea.blog',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [mdx({ remarkPlugins: [wikiLink] })],
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [wikiLink],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
