import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const base = process.env.NEXT_PUBLIC_BASE_PATH || '/SolarWebsite';
const failures = [];
const targets = new Set();
let pages = 0;
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(file);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"]*)"/g)) {
      const url = match[1].replaceAll('&amp;', '&').split(/[?#]/)[0];
      if (url !== base && !url.startsWith(`${base}/`)) {
        failures.push(
          `${path.relative(root, file)}: missing base path: ${url}`,
        );
        continue;
      }
      targets.add(url.slice(base.length) || '/');
    }
  }
}
await scan(root);
for (const target of targets) {
  const file = path.resolve(root, `.${decodeURIComponent(target)}`);
  if (file !== root && !file.startsWith(root + path.sep)) {
    failures.push(`Outside export: ${target}`);
    continue;
  }
  const exists = await stat(file).catch(() => undefined);
  if (
    !exists ||
    (exists.isDirectory() &&
      !(await stat(path.join(file, 'index.html')).catch(() => undefined)))
  )
    failures.push(`Missing export: ${target}`);
}
if (!pages) failures.push('No exported HTML pages');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Static preview OK: ${pages} HTML pages, ${targets.size} local links/assets, base path ${base}`,
);
