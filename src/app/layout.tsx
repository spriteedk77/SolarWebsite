import type { Metadata, Viewport } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

import { site } from '@/lib/site';
import { publicAssetPath } from '@/lib/utils';
import { titleTemplate } from '@/lib/seo';
import { localeMeta } from '@/lib/i18n';

/**
 * The document itself — and nothing else.
 *
 * The website's header, footer and contact bar moved down into (site), so
 * that /admin can render the content Studio full-screen without the site's
 * chrome around it. Everything that genuinely belongs to every page — the
 * language, the font, the icons — stays here.
 */

/** Self-hosted Prompt from Google Fonts; only the four weights used by the site. */
const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `NP88 Solar — ติดตั้งโซลาร์เซลล์เชียงใหม่ ออกแบบระบบ Solar Rooftop ด้วยหลักวิศวกรรม`,
    template: titleTemplate,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalNameShort }],
  creator: site.legalNameShort,
  publisher: site.legalNameShort,
  formatDetection: { telephone: true, address: false, email: false },
  // Generated from the official square logo by scripts/generate-icons.mjs.
  // Declared here rather than through src/app/icon.* so every href runs
  // through publicAssetPath and resolves under the GitHub Pages base path.
  icons: {
    icon: [
      { url: publicAssetPath('/favicon.ico'), sizes: '16x16 32x32 48x48' },
      {
        url: publicAssetPath('/logo/favicon-16.png'),
        type: 'image/png',
        sizes: '16x16',
      },
      {
        url: publicAssetPath('/logo/favicon-32.png'),
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: publicAssetPath('/logo/icon-192.png'),
        type: 'image/png',
        sizes: '192x192',
      },
    ],
    apple: [
      {
        url: publicAssetPath('/logo/apple-touch-icon.png'),
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#001D78',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={localeMeta.th.htmlLang}
      className={prompt.variable}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
