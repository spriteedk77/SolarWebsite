/**
 * Is this deployment the one real customers reach?
 *
 * The hosts below hand out a subdomain per site or per branch —
 * np88solar.netlify.app, a Vercel preview, the GitHub Pages preview. Those are
 * addresses for the people building the site. The launch is the company's own
 * domain, and that is the only thing that should have to satisfy the full
 * production checklist or be allowed into a search index.
 *
 * Deciding by hostname rather than by the host's own "production" flag closes
 * the gap the other way round too: Netlify rewrites its `URL` the moment a
 * custom domain is attached, so the checklist starts being enforced then,
 * without anyone remembering to flip a setting.
 */
const PREVIEW_SUFFIXES = ['.netlify.app', '.vercel.app', '.github.io'];
const PREVIEW_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

export function isPreviewHost(url: string | undefined | null): boolean {
  if (!url) return true;
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    // Not a URL we can read — treat it as a preview rather than assume launch.
    return true;
  }
  if (!hostname) return true;
  if (PREVIEW_HOSTS.includes(hostname)) return true;
  return PREVIEW_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Every address this build believes it is served at: what the site advertises
 * as canonical, plus whatever the host reports as its own primary URL. One of
 * them naming a real domain is enough to call this a launch.
 */
export function deploymentUrls(): string[] {
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Netlify's primary URL — becomes the custom domain once one is attached.
    process.env.URL,
    // Vercel's equivalent, which omits the scheme.
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ].filter((value): value is string => Boolean(value));
}

/** True when no address this build answers on is a real domain. */
export function isPreviewDeployment(): boolean {
  const urls = deploymentUrls();
  if (!urls.length) return true;
  return urls.every(isPreviewHost);
}
