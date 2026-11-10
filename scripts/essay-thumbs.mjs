import { existsSync } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.join(process.cwd(), 'public/images');
const thumbs = path.join(root, 'thumbs');
await mkdir(thumbs, { recursive: true });

if (!existsSync(root)) process.exit(0);
const files = await readdir(root);
for (const name of files) {
  if (!/\.(webp|png|jpe?g)$/i.test(name)) continue;
  const dest = path.join(thumbs, `${path.basename(name, path.extname(name))}.webp`);
  if (existsSync(dest)) continue;
  await sharp(path.join(root, name))
    .resize(160, 208, { fit: 'cover', position: 'north' })
    .webp({ quality: 68 })
    .toFile(dest);
}
