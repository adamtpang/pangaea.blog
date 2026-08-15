#!/usr/bin/env node
// Generates a simple, on-brand placeholder cover SVG per post: paper
// background, a terracotta accent circle with a thin gold ring, the issue
// number in gold mono type. No photography, nothing invented as fact,
// just an identity mark, same spirit as Globe.astro's "antique plate."
//
// Usage: node scripts/gen-cover.mjs <slug> <number> <outDir>
// Writes <outDir>/<slug>.svg

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const PAPER = '#fbf7f0';
const ACCENT = '#b34a2f';
const ACCENT_DEEP = '#8f3721';
const GOLD = '#8a6d34';
const RULE = '#d9cfbe';

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function genCoverSvg(slug, number) {
  const h = hashSlug(slug);
  const cx = 160 + (h % 160); // 160-320
  const cy = 140 + ((h >> 8) % 120); // 140-260
  const r = 90 + ((h >> 16) % 60); // 90-150
  const numLabel = number !== undefined ? `№ ${String(number).padStart(3, '0')}` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
  <rect width="480" height="480" fill="${PAPER}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${RULE}" stroke-width="1"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="${ACCENT}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="${ACCENT_DEEP}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.62 - 10}" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.55"/>
  ${numLabel ? `<text x="28" y="452" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="2" fill="${GOLD}">${numLabel}</text>` : ''}
</svg>`;
}

function main() {
  const [, , slug, numberArg, outDir] = process.argv;
  if (!slug || !outDir) {
    console.error('Usage: node scripts/gen-cover.mjs <slug> <number|-> <outDir>');
    process.exit(1);
  }
  const number = numberArg && numberArg !== '-' ? Number(numberArg) : undefined;
  const svg = genCoverSvg(slug, number);
  const outPath = `${outDir}/${slug}.svg`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, svg, 'utf8');
  console.log(outPath);
}

main();
