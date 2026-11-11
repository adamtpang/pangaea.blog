import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const cache = new Map<string, { first: Date | null; last: Date | null }>();

function gitIso(args: string[]): Date | null {
  try {
    const out = execFileSync('git', args, { encoding: 'utf8', cwd: process.cwd() }).trim();
    const line = out.split('\n').find(Boolean);
    if (!line) return null;
    const date = new Date(line);
    return Number.isNaN(date.valueOf()) ? null : date;
  } catch {
    return null;
  }
}

export function gitDates(filePath: string) {
  const hit = cache.get(filePath);
  if (hit) return hit;
  const rel = path.isAbsolute(filePath) ? path.relative(process.cwd(), filePath) : filePath;
  const value = {
    first: gitIso(['log', '--follow', '--diff-filter=A', '--format=%aI', '-1', '--', rel]),
    last: gitIso(['log', '-1', '--format=%aI', '--', rel]),
  };
  cache.set(filePath, value);
  return value;
}

export function postFile(id: string, filePath?: string) {
  if (filePath && existsSync(filePath)) return filePath;
  for (const ext of ['.md', '.mdx']) {
    const rel = path.join('src/content/posts', `${id}${ext}`);
    if (existsSync(path.join(process.cwd(), rel))) return rel;
  }
  return filePath;
}

const REAL_DATE = new Date('1971-01-01').valueOf();

/** Frontmatter publish date, or the first git commit when that date was never set. */
export function createdAt(date: Date, filePath?: string): Date {
  if (date.valueOf() >= REAL_DATE) return date;
  if (!filePath) return date;
  return gitDates(filePath).first ?? date;
}

/** Frontmatter `updated`, or the last git commit of the file. */
export function updatedAt(date: Date, updated: Date | undefined, filePath?: string): Date {
  if (updated && !Number.isNaN(updated.valueOf())) return updated;
  if (!filePath) return date;
  return gitDates(filePath).last ?? date;
}

/** A small cover for the directory. Written once under public/images/thumbs. */
export async function thumbSrc(src?: string): Promise<string | undefined> {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return undefined;
  const source = path.join(process.cwd(), 'public', decodeURIComponent(src));
  if (!existsSync(source)) return undefined;
  const name = path.basename(src, path.extname(src));
  const rel = `/images/thumbs/${name}.webp`;
  const dest = path.join(process.cwd(), 'public', rel);
  if (!existsSync(dest)) {
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(source)
      .resize(160, 208, { fit: 'cover', position: 'north' })
      .webp({ quality: 68 })
      .toFile(dest);
  }
  return rel;
}
