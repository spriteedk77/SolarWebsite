import type { Metadata } from 'next';

import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { WhyNP88 } from '@/components/home/WhyNP88';
import { BusinessSection } from '@/components/home/BusinessSection';
import { HomeSolarSection } from '@/components/home/HomeSolarSection';
import { SolutionsGrid } from '@/components/sections/SolutionsGrid';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { EngineeringSection } from '@/components/sections/EngineeringSection';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { KnowledgeSection } from '@/components/sections/KnowledgeSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import {
  getArticles,
  getBrands,
  getBusinessTypes,
  getFaqs,
  getFeaturedProjects,
  getSolutions,
} from '@/content';
import { buildMetadata } from '@/lib/seo';
import { faqSchema, graph, serviceSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title:
    'ติดตั้งโซลาร์เซลล์เชียงใหม่ — ออกแบบระบบ Solar Rooftop จากการใช้ไฟจริง | NP88 Solar',
  description:
    'NP88 Solar โดย NP88 Engineering ให้บริการสำรวจ วิเคราะห์ ออกแบบ และติดตั้ง Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน ในเชียงใหม่ ลำพูน ลำปาง เชียงราย พะเยา ส่งบิลค่าไฟให้ประเมินฟรี',
  path: '/',
  titleAbsolute: true,
  keywords: [
    'ติดตั้งโซลาร์เซลล์เชียงใหม่',
    'โซลาร์เซลล์เชียงใหม่',
    'Solar Rooftop เชียงใหม่',
    'ติด Solar เชียงใหม่',
    'โซลาร์เซลล์โรงงาน',
    'Solar สำหรับธุรกิจ',
  ],
});

export default async function HomePage() {
  const [solutions, businessTypes, projects, brands, articles, faqs] = await Promise.all([
    getSolutions(),
    getBusinessTypes(),
    getFeaturedProjects(undefined, 3),
    getBrands(),
    getArticles(),
    getFaqs(),
  ]);

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Who we build for. No unverified installation count: see TrustStrip. */}
      <TrustStrip />

      {/* 3 — Evidence first. Real specs sit directly under the hero so a factory
              owner can judge the work before reading any argument for it. */}
      <FeaturedProjects projects={projects} />

      {/* 4 — The argument: designed from real consumption, not panel count. */}
      <WhyNP88 />

      {/* 5 — Solutions */}
      <SolutionsGrid solutions={solutions} tone="white" />

      {/* 6 — For business */}
      <BusinessSection types={businessTypes} />

      {/* 7 — Solar for home */}
      <HomeSolarSection />

      {/* 8 — Process: the single place the step-by-step is spelled out. */}
      <ProcessSection />

      {/* 9 — Engineering: only the points not already covered above. */}
      <EngineeringSection limit={4} />

      {/* 10 — Brands & technology */}
      <BrandsSection brands={brands} />

      {/* 11 — Knowledge centre */}
      <KnowledgeSection articles={articles.slice(0, 3)} />

      {/* 12 — FAQ */}
      <FaqSection faqs={faqs} tone="soft" />

      {/* 13 — Lead generation */}
      <LeadSection source="homepage" />

      <JsonLd
        id="schema-home"
        data={graph(
          serviceSchema({
            name: 'ออกแบบและติดตั้งระบบ Solar Rooftop',
            description:
              'บริการสำรวจ วิเคราะห์การใช้พลังงาน ออกแบบระบบ ติดตั้ง ดำเนินการด้านเอกสาร และบริการหลังการขาย สำหรับบ้าน ธุรกิจ และโรงงาน',
            path: '/',
          }),
          faqSchema(faqs),
        )}
      />
    </>
  );
}
