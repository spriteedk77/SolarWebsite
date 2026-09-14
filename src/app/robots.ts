import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { isPreviewDeployment } from '@/lib/deployment';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // A staging address — np88solar.netlify.app, the GitHub Pages preview — is
  // the same content as the real site. Indexed, it competes with the company's
  // own domain for its own words. Only the launch invites crawlers.
  if (isPreviewDeployment())
    return { rules: [{ userAgent: '*', disallow: '/' }] };

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The lead endpoint accepts uploads and has nothing to index, and
        // /admin is the content Studio — a login screen to a crawler, and not
        // a page anyone should reach from search.
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
