import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pangaea.blog',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
