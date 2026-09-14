/**
 * Regenerates the favicon / touch-icon set from the official square logo.
 *
 * Run by hand after `public/logo/np88-logo-square.png` changes:
 *
 *   node scripts/generate-icons.mjs
 *
 * `sharp` is not a declared dependency of this project — it ships with Next.js
 * for image optimisation, and this script is a one-off authoring tool, not part
 * of lint / test / build. The generated PNGs and the .ico are committed, so CI
 * and the GitHub Pages export never need to run it.
 *
 * The artwork is only resized, never cropped or recoloured: the square logo is
 * the registered mark and the whole canvas is part of it.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('public/logo/np88-logo-square.png');
const outDir = path.resolve('public/logo');

/** Sizes referenced from `metadata.icons` and the web app manifest. */
const pngTargets = [
  { file: 'favicon-16.png', size: 16 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'favicon-48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
];

/** The legacy /favicon.ico probe still made by some browsers and crawlers. */
const icoSizes = [16, 32, 48];

async function png(size) {
  return sharp(source)
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Packs PNG buffers into an ICO container. ICO has allowed embedded PNG since
 * Vista, which every browser that still asks for favicon.ico supports.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size; // width, 0 means 256
    entry[1] = size >= 256 ? 0 : size; // height
    entry[2] = 0; // palette colours
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([
    header,
    ...entries,
    ...images.map((image) => image.data),
  ]);
}

await mkdir(outDir, { recursive: true });

for (const target of pngTargets) {
  await writeFile(path.join(outDir, target.file), await png(target.size));
  console.log(`wrote public/logo/${target.file} (${target.size}px)`);
}

const icoImages = [];
for (const size of icoSizes) icoImages.push({ size, data: await png(size) });
await writeFile(path.resolve('public/favicon.ico'), ico(icoImages));
console.log(`wrote public/favicon.ico (${icoSizes.join(', ')}px)`);
