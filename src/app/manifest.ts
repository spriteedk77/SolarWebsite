import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { publicAssetPath } from '@/lib/utils';

/**
 * Web app manifest.
 *
 * A route rather than a static `public/site.webmanifest`: `start_url` and the
 * icon paths have to carry the GitHub Pages base path on the preview build and
 * no prefix anywhere else, which a checked-in JSON file cannot do.
 *
 * Icons come from the official square logo via `scripts/generate-icons.mjs`.
 */
/**
 * The manifest has no request-dependent input, and `output: 'export'` refuses
 * to collect a metadata route that has not said so.
 */
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.legalNameShort}`,
    short_name: site.name,
    description:
      'ออกแบบและติดตั้งระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน ในเชียงใหม่และภาคเหนือ',
    lang: site.language,
    start_url: publicAssetPath('/'),
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#001D78',
    icons: [
      {
        src: publicAssetPath('/logo/favicon-32.png'),
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: publicAssetPath('/logo/icon-192.png'),
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: publicAssetPath('/logo/icon-512.png'),
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
