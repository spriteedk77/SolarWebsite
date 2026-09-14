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
  // Favicon comes from src/app/icon.svg (Next's file convention).
  manifest: publicAssetPath('/site.webmanifest'),
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
