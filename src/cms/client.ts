import 'server-only';
import { createClient } from '@sanity/client';
import { shouldUseSanity } from './source-mode';

export function usesSanity() {
  // GitHub Pages remains a frozen review copy. Everywhere else, explicit
  // Sanity configuration is authoritative—even when a host-only build flag is
  // unavailable inside the deployed runtime.
  return shouldUseSanity(process.env);
}

export function sanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset)
    throw new Error('Sanity requires SANITY_PROJECT_ID and SANITY_DATASET');
  return createClient({
    projectId,
    dataset,
    apiVersion: '2026-01-01',
    useCdn: false,
    perspective: 'published',
    token: process.env.SANITY_READ_TOKEN,
  });
}

/** Published content only, cached on the server. New slugs and sitemap refresh too. */
export async function queryPublished<T>(query: string): Promise<T> {
  // ISR keeps the live CMS current without forcing a request-only API inside
  // fallback detail routes. Admin publication also invalidates the `cms` tag,
  // so new slugs and edits do not require another deployment.
  return sanityClient().fetch<T>(
    query,
    {},
    { next: { revalidate: 60, tags: ['cms'] } },
  );
}
