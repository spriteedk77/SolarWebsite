import 'server-only';
import { createClient } from '@sanity/client';
import { connection } from 'next/server';

export function usesSanity() {
  // GitHub Pages is deliberately a frozen review copy. Netlify is the live
  // application and always reads Sanity, so there is no switch that can leave
  // a successful edit stranded in a second, hidden content source.
  if (process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_STATIC_PREVIEW === '1')
    return false;
  return process.env.NETLIFY === 'true';
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
  // Live content belongs to the request, not the deployment. This keeps a
  // content edit from requiring a new build and keeps an empty CMS from
  // making the application artifact itself impossible to deploy.
  await connection();
  return sanityClient().fetch<T>(
    query,
    {},
    { next: { revalidate: 60, tags: ['cms'] } },
  );
}
