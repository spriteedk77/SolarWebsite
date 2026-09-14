import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { SolutionsGrid } from '@/components/sections/SolutionsGrid';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/seo/JsonLd';

import { getFaqs, getSolutions } from '@/content';
import { buildMetadata } from '@/lib/seo';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
} from '@/lib/schema';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'โซลูชัน', path: '/solutions' },
];

export const metadata: Metadata = buildMetadata({
  title:
    'โซลูชัน Solar — On-Grid, Hybrid, Solar + Battery, Zero Export และ Monitoring',
  description:
    'เปรียบเทียบระบบ Solar แต่ละแบบว่าเหมาะกับใคร แก้ปัญหาอะไร และต้องพิจารณาอะไรก่อนเลือก ทั้งสำหรับบ้าน ธุรกิจ และโรงงาน โดย NP88 Solar เชียงใหม่',
  path: '/solutions',
  keywords: [
    'Solar Battery',
    'Zero Export',
    'Hybrid Solar',
    'Solar สำหรับธุรกิจ',
  ],
});

const comparison = [
  {
    question: 'ใช้ไฟหนักช่วงกลางวัน ต้องการลดค่าไฟเป็นหลัก',
    answer: 'ระบบ On-Grid',
    href: '/solutions#solar-business',
  },
  {
    question: 'ใช้ไฟหนักช่วงเย็นและกลางคืน',
    answer: 'Solar + Battery หรือระบบ Hybrid',
    href: '/solutions#battery',
  },
  {
    question: 'มีอุปกรณ์ที่หยุดทำงานไม่ได้เมื่อไฟดับ',
    answer: 'ระบบ Hybrid พร้อมวงจรสำรองไฟ',
    href: '/solutions#hybrid',
  },
  {
    question: 'ไม่ได้ขายไฟคืน และต้องคุมไม่ให้ไฟไหลย้อน',
    answer: 'ระบบ Zero Export',
    href: '/solutions#zero-export',
  },
  {
    question: 'ต้องการรู้ว่าระบบทำงานจริงหรือไม่',
    answer: 'Energy Monitoring',
    href: '/solutions#monitoring',
  },
];

export default async function SolutionsPage() {
  const [solutions, faqs] = await Promise.all([getSolutions(), getFaqs()]);

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="โซลูชัน"
        title="ระบบแบบไหนเหมาะกับคุณ?"
        lead="แต่ละระบบแก้ปัญหาคนละแบบ หน้านี้เริ่มจากสถานการณ์ที่คุณเจอ แล้วจึงอธิบายว่าระบบใดตอบโจทย์นั้น พร้อมข้อจำกัดที่ควรรู้ก่อนตัดสินใจ"
        actions={
          <ButtonLink href="/quote" variant="primary" size="lg">
            ให้ทีมงานช่วยเลือกระบบ
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
        }
      />

      {/* Quick chooser */}
      <Section
        tone="white"
        labelledBy="chooser-title"
        width="wide"
        spacing="tight"
      >
        <SectionHeading
          id="chooser-title"
          title="เริ่มจากสถานการณ์ของคุณ"
          lead="เลือกข้อที่ใกล้เคียงที่สุด แล้วดูรายละเอียดของระบบที่เกี่ยวข้อง"
        />
        <ul className="mt-8 divide-y divide-hairline overflow-hidden rounded-card border border-hairline">
          {comparison.map((row) => (
            <li key={row.question}>
              <a
                href={row.href}
                className="flex flex-col gap-2 bg-white px-5 py-4 hover:bg-paper-soft sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <span className="text-body text-ink-700">{row.question}</span>
                <span className="inline-flex items-center gap-2 text-body font-semibold text-solar-700">
                  {row.answer}
                  <Icon name="arrow-right" className="h-4.5 w-4.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <SolutionsGrid
        solutions={solutions}
        withHeading={false}
        withCta={false}
        tone="soft"
      />

      <ProcessSection />

      <FaqSection faqs={faqs} tone="soft" />

      <LeadSection source="solutions" />

      <JsonLd
        id="schema-solutions"
        data={graph(
          breadcrumbSchema(crumbs),
          ...(await Promise.all(
            solutions.map((solution) =>
              serviceSchema({
                name: solution.title,
                description: `${solution.problem} ${solution.outcome}`,
                path: `/solutions#${solution.slug}`,
              }),
            ),
          )),
          faqSchema(faqs),
        )}
      />
    </>
  );
}
