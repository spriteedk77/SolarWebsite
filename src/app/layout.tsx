import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Thai, Noto_Sans_Thai } from 'next/font/google';
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
import { titleTemplate } from '@/lib/seo';
import { localeMeta } from '@/lib/i18n';
import { logPendingRegister } from '@/lib/pending';

/**
 * Typography.
 *
 * Noto Sans Thai carries body copy — its Thai loops stay open at small sizes,
 * which matters for long-form reading. IBM Plex Sans Thai sets headings: the
 * slightly more structured letterforms suit an engineering brand. Both are
 * self-hosted by next/font, so there is no render-blocking request to Google
 * and no layout shift from a late webfont swap.
 */
const notoThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-thai',
  display: 'swap',
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-plex-thai',
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
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#08192b',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  logPendingRegister();

  return (
    <html
      lang={localeMeta.th.htmlLang}
      className={`${notoThai.variable} ${plexThai.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main" className="skip-link">
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <Header />

        <main id="main">{children}</main>

        <Footer />
        <MobileContactBarSpacer />
        <MobileContactBar />
        <CookieConsent />

        <JsonLd id="schema-organization" data={graph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
