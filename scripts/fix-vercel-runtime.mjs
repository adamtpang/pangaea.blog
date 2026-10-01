// @astrojs/vercel v7 only knows Node 18 and 20, so on a Node 24 build it
// stamps every function "nodejs18.x", which Vercel rejects. Rewrite the
// stamp to the Node version the build actually ran on. Remove this once the
// site is on Astro 5 and @astrojs/vercel v8.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = '.vercel/output/functions';
const runtime = `nodejs${process.versions.node.split('.')[0]}.x`;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name === '.vc-config.json') {
      const config = JSON.parse(readFileSync(path, 'utf-8'));
      if (config.runtime === 'nodejs18.x') {
        config.runtime = runtime;
        writeFileSync(path, JSON.stringify(config, null, '\t'));
        console.log(`[fix-vercel-runtime] ${path} -> ${runtime}`);
      }
    }
  }
}

if (existsSync(root)) walk(root);
