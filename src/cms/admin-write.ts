import 'server-only';
import { createClient, type SanityClient } from '@sanity/client';

/**
 * The only thing in this codebase that can change content.
 *
 * The write token lives in the hosting environment and is read here, on the
 * server, and nowhere else — it is never sent to a browser and never reaches a
 * client component. Everything that calls into this module has already proved
 * the request is signed in; see src/lib/admin-session.ts.
 *
 * Reading is a different client (src/cms/client.ts) with no token at all,
 * because the website's pages have no business holding one.
 */

const API_VERSION = '2026-01-01';

export type WriteConfig =
  | { ready: true; client: SanityClient }
  | { ready: false; missing: string[] };

export function adminWriteClient(): WriteConfig {
  const projectId = process.env.SANITY_PROJECT_ID?.trim();
  const dataset = process.env.SANITY_DATASET?.trim();
  const token = process.env.SANITY_WRITE_TOKEN?.trim();

  const missing = [
    !projectId && 'SANITY_PROJECT_ID',
    !dataset && 'SANITY_DATASET',
    !token && 'SANITY_WRITE_TOKEN',
  ].filter((value): value is string => Boolean(value));
  if (missing.length) return { ready: false, missing };

  return {
    ready: true,
    client: createClient({
      projectId,
      dataset,
      token,
      apiVersion: API_VERSION,
      // Content just written must be readable immediately; a CDN cache would
      // show the editor what the page looked like before they saved.
      useCdn: false,
      perspective: 'raw',
    }),
  };
}

export const COMPANY_ID = 'company';
export const SETTINGS_ID = 'siteSettings';
export const draftId = (id: string) => `drafts.${id}`;
