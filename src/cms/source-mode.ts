type CmsEnvironment = Record<string, string | undefined>;

/** Decide the content source from explicit CMS configuration, not host-only flags. */
export function shouldUseSanity(env: CmsEnvironment): boolean {
  if (env.GITHUB_PAGES === 'true' || env.NEXT_PUBLIC_STATIC_PREVIEW === '1')
    return false;

  return Boolean(env.SANITY_PROJECT_ID?.trim() && env.SANITY_DATASET?.trim());
}
