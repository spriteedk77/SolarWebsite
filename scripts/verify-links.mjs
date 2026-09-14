#!/usr/bin/env node
/**
 * Crawls every internal link reachable from `/`, and checks:
 *   - every page returns HTTP 200
 *   - every `#fragment` link has a matching `id` on its destination page
 *   - every same-origin `<img src>` / asset resolves
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-links.mjs
 *
 * Exits non-zero (and prints every problem found) if anything is broken —
 * intended to fail a CI job, not just report.
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const seen = new Set();
const pages = new Map(); // path -> html
const problems = [];

async function get(path) {
  const res = await fetch(BASE + path);
  return { status: res.status, html: res.status === 200 ? await res.text() : '' };
}

async function crawl() {
  const queue = ['/'];
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);

    const { status, html } = await get(path);
    if (status !== 200) {
      problems.push(`${path} -> HTTP ${status}`);
      continue;
    }
    pages.set(path, html);

    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      const href = m[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const clean = href.split('#')[0].split('?')[0];
      if (!clean || clean.startsWith('/_next') || clean.startsWith('/api')) continue;
      if (!seen.has(clean)) queue.push(clean);
    }
  }
}

function checkAnchors() {
  for (const [path, html] of pages) {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/href="([^"]*#[^"]+)"/g)) {
      const href = m[1];
      if (href.startsWith('http')) continue;
      const [target, frag] = href.split('#');
      const decoded = decodeURIComponent(frag);
      const destPath = target === '' ? path : target.split('?')[0];
      const destHtml = pages.get(destPath);
      if (destHtml === undefined) {
        problems.push(`${path}: anchor target page not crawled: ${href}`);
        continue;
      }
      const destIds =
        destPath === path ? ids : new Set([...destHtml.matchAll(/\sid="([^"]+)"/g)].map((m2) => m2[1]));
      if (!destIds.has(frag) && !destIds.has(decoded)) {
        problems.push(`${path}: broken anchor ${href} (no id="${decoded}" on ${destPath})`);
      }
    }
  }
}

async function checkAssets() {
  const assets = new Set();
  for (const html of pages.values()) {
    for (const m of html.matchAll(/src="(\/[^"]+)"/g)) {
      const src = m[1];
      if (src.startsWith('/_next/static')) continue;
      assets.add(src.replace(/&amp;/g, '&'));
    }
  }
  for (const asset of assets) {
    const res = await fetch(BASE + asset);
    if (!res.ok) problems.push(`asset ${asset} -> HTTP ${res.status}`);
  }
  return assets.size;
}

const t0 = Date.now();
await crawl();
checkAnchors();
const assetCount = await checkAssets();

console.log(`[verify-links] crawled ${pages.size} page(s), ${assetCount} asset(s) in ${Date.now() - t0}ms`);

if (problems.length) {
  console.error(`[verify-links] ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log('[verify-links] OK — no broken links, anchors or assets.');
