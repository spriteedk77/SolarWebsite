import type { Metadata, Viewport } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MobileContactBar,
  MobileContactBarSpacer,
} from '@/components/layout/MobileContactBar';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { JsonLd } from '@/components/seo/JsonLd';
import { graph, organizationSchema, websiteSchema } from '@/lib/schema';
import { site } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import { SiteProvider } from '@/components/SiteProvider';
import { publicAssetPath } from '@/lib/utils';
import { titleTemplate } from '@/lib/seo';
import { localeMeta } from '@/lib/i18n';
import { logPendingRegister } from '@/lib/pending';

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

export const revalidate = 60;

export const viewport: Viewport = {
  themeColor: '#001D78',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  logPendingRegister();
  const data = await getSiteData();

  return (
    <html
      lang={localeMeta.th.htmlLang}
      className={prompt.variable}
      suppressHydrationWarning
    >
      <body>
        <SiteProvider value={data}>
          <a href="#main" className="skip-link">
            ข้ามไปยังเนื้อหาหลัก
          </a>

          <Header />

          <main id="main">{children}</main>

          <Footer />
          <MobileContactBarSpacer />
          <MobileContactBar />
          <CookieConsent />

          <JsonLd
            id="schema-organization"
            data={graph(organizationSchema(data), websiteSchema(data))}
          />
        </SiteProvider>
      </body>
    </html>
  );
}
