import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MobileContactBar,
  MobileContactBarSpacer,
} from '@/components/layout/MobileContactBar';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { JsonLd } from '@/components/seo/JsonLd';
import { graph, organizationSchema, websiteSchema } from '@/lib/schema';
import { getSiteData } from '@/cms/site';
import { SiteProvider } from '@/components/SiteProvider';
import { logPendingRegister } from '@/lib/pending';
import { ScrollEffects } from './ScrollEffects';

/**
 * Everything a visitor sees around a page: header, footer, mobile contact bar,
 * consent banner and the organization structured data.
 *
 * A component rather than only a layout, because the not-found page has to be
 * reachable from two places. Next resolves an unmatched URL against the
 * not-found at the root of app/, which is outside the (site) group and so gets
 * none of this; without a shared shell that page would either lose the site's
 * chrome or duplicate it.
 */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  logPendingRegister();
  const data = await getSiteData();

  return (
    <SiteProvider value={data}>
      <a href="#main" className="skip-link">
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <Header />

      <ScrollEffects>{children}</ScrollEffects>

      <Footer />
      <MobileContactBarSpacer />
      <MobileContactBar />
      <CookieConsent />

      <JsonLd
        id="schema-organization"
        data={graph(organizationSchema(data), websiteSchema(data))}
      />
    </SiteProvider>
  );
}
