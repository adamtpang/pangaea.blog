import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import { unified } from '@astrojs/markdown-remark';
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
  // Astro 5 removed output: 'hybrid'. Static output plus prerender = false
  // on the server routes is the same split.
  output: 'static',
  adapter: vercel(),
  // Keep the pre-v7 HTML whitespace rules so inline text does not collapse.
  compressHTML: true,
  legacy: {
    // Keeps the collection schema at src/content/config.ts.
    collectionsBackwardsCompat: true,
  },
  integrations: [mdx()],
  build: {
    format: 'directory',
  },
  markdown: {
    processor: unified({ remarkPlugins: [wikiLink] }),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
