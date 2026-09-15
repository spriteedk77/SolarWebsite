import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldUseSanity } from '../src/cms/source-mode';

test('configured runtime uses Sanity without relying on a Netlify-only flag', () => {
  assert.equal(
    shouldUseSanity({
      SANITY_PROJECT_ID: 'mtnue2wm',
      SANITY_DATASET: 'production',
    }),
    true,
  );
});

test('static previews remain pinned to the repository snapshot', () => {
  const configured = {
    SANITY_PROJECT_ID: 'mtnue2wm',
    SANITY_DATASET: 'production',
  };

  assert.equal(shouldUseSanity({ ...configured, GITHUB_PAGES: 'true' }), false);
  assert.equal(
    shouldUseSanity({ ...configured, NEXT_PUBLIC_STATIC_PREVIEW: '1' }),
    false,
  );
});

test('an incomplete CMS configuration never silently starts live mode', () => {
  assert.equal(shouldUseSanity({}), false);
  assert.equal(shouldUseSanity({ SANITY_PROJECT_ID: 'mtnue2wm' }), false);
  assert.equal(shouldUseSanity({ SANITY_DATASET: 'production' }), false);
  assert.equal(
    shouldUseSanity({ SANITY_PROJECT_ID: '   ', SANITY_DATASET: 'production' }),
    false,
  );
});
