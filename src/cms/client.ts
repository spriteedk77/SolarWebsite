import 'server-only';
import { createClient } from '@sanity/client';

export function usesSanity() {
  const source = process.env.CONTENT_SOURCE || 'local';
  if (!['local', 'sanity'].includes(source))
    throw new Error('CONTENT_SOURCE must be local or sanity');
  return source === 'sanity';
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
  return sanityClient().fetch<T>(
    query,
    {},
    { next: { revalidate: 60, tags: ['cms'] } },
  );
}
