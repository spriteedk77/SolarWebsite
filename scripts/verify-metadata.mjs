#!/usr/bin/env node
/**
 * Structural / SEO checks across the site's key routes: heading hierarchy,
 * image alt text, meta tags, JSON-LD validity, duplicate ids, lang attribute,
 * and (critically) that every social image is a raster file — LINE, Facebook
 * and Google all reject SVG for og:image / Article structured data, so this
 * is the regression test for that specific defect class.
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-metadata.mjs
 *
 * Exits non-zero on any hard failure. Duplicate heading *text* is printed as
 * a warning, not a failure — legitimate pages reuse a label (e.g. a footer
 * nav heading matching a content section heading) without it being a bug.
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

const ROUTES = [
  '/',
  '/solutions',
  '/solar-home',
  '/solar-business',
  '/projects',
  '/projects/8items-clinic-solar-battery-chiang-mai',
  '/projects/commercial-rooftop-178kw-lampang',
  '/products',
  '/knowledge',
  '/knowledge/how-much-can-solar-save',
  '/knowledge/what-is-solar-rooftop',
  '/about',
  '/contact',
  '/quote',
  '/privacy',
  '/cookie-policy',
];

const failures = [];
const warnings = [];
const fail = (route, msg) => failures.push(`${route}  ${msg}`);
const warn = (route, msg) => warnings.push(`${route}  ${msg}`);

function isRasterUrl(url) {
  const pathname = url.split('?')[0].split('#')[0].toLowerCase();
  return /\.(jpe?g|png|webp|gif)$/.test(pathname) || pathname.endsWith('/opengraph-image');
}

async function checkRoute(route) {
  const res = await fetch(BASE + route);
  if (!res.ok) {
    fail(route, `HTTP ${res.status}`);
    return;
  }
  const html = await res.text();

  // --- headings ---------------------------------------------------------
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  }));

  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) fail(route, `H1 count = ${h1s.length} (${h1s.map((h) => h.text).join(' | ')})`);

  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) fail(route, `heading jump h${prev} -> h${h.level}: "${h.text}"`);
    prev = h.level;
  }
  const dupes = headings.filter((h, i) => headings.findIndex((o) => o.text === h.text) !== i && h.text);
  if (dupes.length) warn(route, `duplicate heading text: ${[...new Set(dupes.map((d) => d.text))].join(' | ')}`);

  // --- images -------------------------------------------------------------
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) fail(route, `<img> without alt: ${m[0].slice(0, 90)}`);
  }

  // --- head meta ------------------------------------------------------------
  if (!/rel="canonical"/.test(html)) fail(route, 'missing canonical');

  const desc = /<meta name="description" content="([^"]*)"/.exec(html);
  if (!desc) fail(route, 'missing meta description');
  else if (desc[1].length < 70 || desc[1].length > 320) fail(route, `meta description length ${desc[1].length}`);

  const title = /<title>([^<]*)<\/title>/.exec(html);
  if (!title) fail(route, 'missing <title>');
  else if (title[1].length > 130) fail(route, `title length ${title[1].length}: ${title[1]}`);

  if (!/hreflang="th"/i.test(html)) fail(route, 'missing hreflang');
  if (!/<html[^>]+lang="th"/.test(html)) fail(route, 'missing lang="th"');

  // --- social images: must be raster, never SVG --------------------------
  for (const [prop, re] of [
    ['og:image', /property="og:image" content="([^"]*)"/],
    ['twitter:image', /name="twitter:image" content="([^"]*)"/],
  ]) {
    const match = re.exec(html);
    if (!match) fail(route, `missing ${prop}`);
    else if (!isRasterUrl(match[1])) fail(route, `${prop} is not a raster image: ${match[1]}`);
  }
  for (const m of html.matchAll(/"image":"([^"]*)"/g)) {
    if (!isRasterUrl(m[1])) fail(route, `structured-data image is not raster: ${m[1]}`);
  }

  // --- structured data ------------------------------------------------------
  const lds = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (lds.length === 0) fail(route, 'no JSON-LD');
  for (const ld of lds) {
    try {
      JSON.parse(ld[1].replace(/\\u003c/g, '<'));
    } catch (e) {
      fail(route, `invalid JSON-LD: ${e.message}`);
    }
  }

  // --- duplicate ids ----------------------------------------------------
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupIds.length) fail(route, `duplicate id(s): ${[...new Set(dupIds)].join(', ')}`);
}

const t0 = Date.now();
for (const route of ROUTES) await checkRoute(route);

for (const path of ['/sitemap.xml', '/robots.txt']) {
  const res = await fetch(BASE + path);
  if (!res.ok) fail(path, `HTTP ${res.status}`);
}

console.log(`[verify-metadata] checked ${ROUTES.length} route(s) in ${Date.now() - t0}ms`);

if (warnings.length) {
  console.warn(`[verify-metadata] ${warnings.length} warning(s) (not failing the build):`);
  for (const w of warnings) console.warn(`  ~ ${w}`);
}

if (failures.length) {
  console.error(`[verify-metadata] ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('[verify-metadata] OK — no structural or metadata problems.');
