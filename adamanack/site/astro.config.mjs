import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://adamanack.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    server: {
      fs: {
        // Allow Vite to serve files from the parent project (for keepers.json)
        allow: ['..'],
      },
    },
  },
});
