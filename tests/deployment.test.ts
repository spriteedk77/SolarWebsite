import test from 'node:test';
import assert from 'node:assert/strict';
import { isPreviewHost, isPreviewDeployment } from '../src/lib/deployment';

test('build-platform subdomains are previews, the company domain is not', () => {
  for (const url of [
    'https://np88solar.netlify.app',
    'https://deploy-preview-3--np88solar.netlify.app',
    'https://np88-solar.vercel.app',
    'https://spriteedk77.github.io/SolarWebsite',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ])
    assert.equal(isPreviewHost(url), true, url);

  for (const url of ['https://www.np88solar.com', 'https://np88solar.com'])
    assert.equal(isPreviewHost(url), false, url);
});

test('an address that cannot be read counts as a preview, never as a launch', () => {
  // Getting this backwards would skip the production checklist by accident,
  // which is the one direction that must not be possible.
  for (const value of ['', '   ', 'not-a-url', undefined, null])
    assert.equal(isPreviewHost(value), true, String(value));
});

test('a real domain on any reported address makes it a launch', (t) => {
  const keys = [
    'NEXT_PUBLIC_SITE_URL',
    'URL',
    'VERCEL_PROJECT_PRODUCTION_URL',
  ] as const;
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  t.after(() => {
    for (const k of keys)
      saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k]);
  });
  const set = (values: Partial<Record<(typeof keys)[number], string>>) => {
    for (const k of keys) delete process.env[k];
    for (const [k, v] of Object.entries(values)) process.env[k] = v;
  };

  set({});
  assert.equal(isPreviewDeployment(), true, 'nothing configured');

  set({ NEXT_PUBLIC_SITE_URL: 'https://np88solar.netlify.app' });
  assert.equal(isPreviewDeployment(), true, 'netlify subdomain only');

  // The case that matters: a custom domain is attached and the canonical URL
  // was not updated. Netlify rewrites URL on its own, so the checklist still
  // starts being enforced.
  set({
    NEXT_PUBLIC_SITE_URL: 'https://np88solar.netlify.app',
    URL: 'https://www.np88solar.com',
  });
  assert.equal(isPreviewDeployment(), false, 'custom domain reported by host');

  set({ VERCEL_PROJECT_PRODUCTION_URL: 'www.np88solar.com' });
  assert.equal(isPreviewDeployment(), false, 'vercel production domain');
});
