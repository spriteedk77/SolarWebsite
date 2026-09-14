import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
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
