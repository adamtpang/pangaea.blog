import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

type RGB = { r: number; g: number; b: number };

export type PagePalette = {
  paper: string;
  ink: string;
  inkSoft: string;
  inkMute: string;
  accent: string;
  accentDeep: string;
  gold: string;
  rule: string;
  surface: string;
  player: string;
  spotifyTheme: 0 | 1;
};

const channel = (n: number) => {
  const s = n / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = (c: RGB) =>
  0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);

export const contrast = (a: RGB, b: RGB) => {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

const hex = (c: RGB) =>
  '#' + [c.r, c.g, c.b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('');

const parse = (value: string): RGB => {
  const n = value.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
};

const mix = (a: RGB, b: RGB, t: number): RGB => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
});

/** Nudge a sampled color until it clears WCAG contrast, keeping its hue. */
export const ensureContrast = (fg: RGB, bg: RGB, min: number): RGB => {
  let cur = fg;
  const darken = luminance(bg) > 0.5;
  const target = darken ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  for (let i = 0; i < 24; i++) {
    if (contrast(cur, bg) >= min) return { r: clamp(cur.r), g: clamp(cur.g), b: clamp(cur.b) };
    cur = mix(cur, target, 0.16);
  }
  return darken ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
};

type Swatch = RGB & { n: number };

const average = (pixels: RGB[]): Swatch => {
  const acc = pixels.reduce(
    (sum, p) => ({ r: sum.r + p.r, g: sum.g + p.g, b: sum.b + p.b }),
    { r: 0, g: 0, b: 0 },
  );
  const n = pixels.length || 1;
  return { r: acc.r / n, g: acc.g / n, b: acc.b / n, n: pixels.length };
};

/** Median cut. Population is kept because every pixel is a vote. */
const medianCut = (pixels: RGB[], depth: number): Swatch[] => {
  if (pixels.length === 0) return [];
  if (depth === 0 || pixels.length < 2) return [average(pixels)];
  const range = (key: keyof RGB) => {
    let min = 255;
    let max = 0;
    for (const p of pixels) {
      min = Math.min(min, p[key]);
      max = Math.max(max, p[key]);
    }
    return max - min;
  };
  const key: keyof RGB =
    range('r') >= range('g') && range('r') >= range('b') ? 'r' : range('g') >= range('b') ? 'g' : 'b';
  const sorted = pixels.slice().sort((a, b) => a[key] - b[key]);
  const mid = Math.floor(sorted.length / 2);
  return [
    ...medianCut(sorted.slice(0, mid), depth - 1),
    ...medianCut(sorted.slice(mid), depth - 1),
  ];
};

const chroma = (c: RGB) => Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);

export async function paletteFromFile(file: string): Promise<PagePalette> {
  const { data, info } = await sharp(file)
    .resize(48, 48, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += info.channels) {
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  const swatches = medianCut(pixels, 3).sort((a, b) => luminance(b) - luminance(a));
  const total = swatches.reduce((sum, s) => sum + s.n, 0) || 1;
  const light = swatches.find((s) => s.n / total >= 0.08) ?? swatches[0];
  const paper = { r: clamp(light.r), g: clamp(light.g), b: clamp(light.b) };
  const darkest = swatches[swatches.length - 1];
  const ink = ensureContrast(darkest, paper, 7);
  const inkSoft = ensureContrast(mix(ink, paper, 0.22), paper, 5.5);
  const muteSource =
    swatches.find((s) => luminance(s) < luminance(paper) * 0.55 && luminance(s) > luminance(ink) + 0.02) ??
    mix(ink, paper, 0.35);
  const inkMute = ensureContrast(muteSource, paper, 4.5);

  const colorful = swatches
    .filter((s) => chroma(s) >= 18)
    .sort((a, b) => chroma(b) - chroma(a))[0];
  const accentSource = colorful ?? swatches.find((s) => luminance(s) < 0.4) ?? darkest;
  let accent = ensureContrast(accentSource, paper, 4.5);
  if (contrast(accent, ink) < 1.3) accent = ensureContrast(mix(accent, paper, 0.25), paper, 4.5);
  const accentDeep = ensureContrast(mix(accent, { r: 0, g: 0, b: 0 }, 0.25), paper, 4.5);

  const player = mix(paper, ink, luminance(paper) > 0.5 ? 0.07 : 0.14);
  const surface = mix(paper, { r: 255, g: 255, b: 255 }, luminance(paper) > 0.5 ? 0.35 : 0.08);
  const rule = mix(paper, accent, 0.28);

  return {
    paper: hex(paper),
    ink: hex(ink),
    inkSoft: hex(inkSoft),
    inkMute: hex(inkMute),
    accent: hex(accent),
    accentDeep: hex(accentDeep),
    gold: hex(accent),
    rule: hex(rule),
    surface: hex(surface),
    player: hex(player),
    spotifyTheme: luminance(player) > 0.45 ? 1 : 0,
  };
}

export async function paletteForPublicImage(src?: string): Promise<PagePalette | null> {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return null;
  const file = path.join(process.cwd(), 'public', decodeURIComponent(src));
  if (!existsSync(file)) return null;
  try {
    return await paletteFromFile(file);
  } catch {
    return null;
  }
}

export function paletteStyle(p: PagePalette): string {
  const light = luminance(parse(p.paper)) > 0.4;
  return [
    `--paper:${p.paper}`,
    `--paper-2:${p.surface}`,
    `--paper-3:${p.player}`,
    `--surface:${p.surface}`,
    `--ink:${p.ink}`,
    `--ink-soft:${p.inkSoft}`,
    `--ink-mute:${p.inkMute}`,
    `--accent:${p.accent}`,
    `--accent-deep:${p.accentDeep}`,
    `--accent-tint:${p.player}`,
    `--gold:${p.gold}`,
    `--gold-soft:${p.rule}`,
    `--rule:${p.rule}`,
    `--rule-soft:${p.player}`,
    `--bg:${p.paper}`,
    `--muted:${p.inkMute}`,
    `--land:${p.gold}`,
    `--player:${p.player}`,
    `color-scheme:${light ? 'light' : 'dark'}`,
  ].join(';');
}
