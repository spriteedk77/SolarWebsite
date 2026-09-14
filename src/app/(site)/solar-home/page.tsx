import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { Note } from '@/components/ui/Note';
import { HomePackageCard } from '@/components/sections/HomePackageCard';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { KnowledgeSection } from '@/components/sections/KnowledgeSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getArticles, getFaqs } from '@/content';
import { buildMetadata } from '@/lib/seo';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
} from '@/lib/schema';
import { disclaimers, quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'สำหรับบ้าน', path: '/solar-home' },
];

export const metadata: Metadata = buildMetadata({
  title: 'Solar สำหรับบ้าน — ระบบ Solar + Battery สำหรับที่พักอาศัย เชียงใหม่',
  description:
    'ติดตั้งโซลาร์เซลล์สำหรับบ้านพักอาศัยในเชียงใหม่และภาคเหนือ ทั้งระบบ On-Grid และ Solar + Battery พร้อมระบบติดตามพลังงาน เลือกขนาดระบบจากบิลค่าไฟและพฤติกรรมการใช้ไฟจริง',
  path: '/solar-home',
  keywords: [
    'ติดตั้งโซลาร์เซลล์บ้าน',
    'โซลาร์เซลล์เชียงใหม่',
    'Solar Battery',
    'ติด Solar เชียงใหม่',
  ],
});

const pillars = [
  {
    icon: 'panel' as const,
    title: 'Solar',
    body: 'ผลิตไฟใช้เองในช่วงกลางวัน ลดปริมาณไฟที่ต้องซื้อจากการไฟฟ้า เหมาะกับบ้านที่มีคนอยู่กลางวันหรือเปิดแอร์เป็นประจำ',
  },
  {
    icon: 'battery' as const,
    title: 'Battery',
    body: 'เก็บพลังงานที่ผลิตเกินความต้องการไว้ใช้ช่วงเย็นและกลางคืน แทนที่จะปล่อยให้สูญไป',
  },
  {
    icon: 'monitor' as const,
    title: 'Energy Management',
    body: 'ระบบเลือกใช้พลังงานจากแหล่งที่เหมาะสมโดยอัตโนมัติ และแสดงข้อมูลให้ดูผ่านแอปพลิเคชัน',
  },
  {
    icon: 'shield' as const,
    title: 'Backup Power',
    body: 'เมื่อไฟดับ ระบบยังจ่ายไฟให้วงจรที่กำหนดไว้ล่วงหน้าได้ ต้องออกแบบตั้งแต่ต้นว่าจะให้อุปกรณ์ใดทำงานต่อ',
  },
];

const suitability = [
  {
    title: 'เหมาะมาก',
    tone: 'good' as const,
    items: [
      'มีคนอยู่บ้านช่วงกลางวัน หรือทำงานที่บ้าน',
      'เปิดเครื่องปรับอากาศเป็นประจำในช่วงบ่าย',
      'ค่าไฟต่อเดือนค่อนข้างสูงและสม่ำเสมอ',
      'หลังคามีพื้นที่ว่างและไม่มีเงาบังมาก',
    ],
  },
  {
    title: 'ควรพิจารณาเพิ่มเติม',
    tone: 'consider' as const,
    items: [
      'ใช้ไฟหนักเฉพาะช่วงกลางคืน — ควรดูเรื่องแบตเตอรี่ประกอบ',
      'หลังคาเก่าหรือใกล้ต้องเปลี่ยน — ควรซ่อมก่อนติดตั้ง',
      'มีต้นไม้ใหญ่หรืออาคารข้างเคียงบังแดดบางช่วง',
      'วางแผนจะต่อเติมบ้านหรือเปลี่ยนการใช้งานในอนาคต',
    ],
  },
];

export default async function SolarHomePage() {
  const { cta } = await getSiteData();
  const [articles, faqs] = await Promise.all([getArticles(), getFaqs()]);

  const homeFaqs = faqs.filter((faq) =>
    ['ทั่วไป', 'การใช้งาน', 'ขนาดระบบ'].includes(faq.topic),
  );
  const homeArticles = articles.filter((article) =>
    [
      'home-solar-sizing-by-electricity-bill',
      'is-solar-battery-necessary',
      'what-is-solar-rooftop',
    ].includes(article.slug),
  );

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="สำหรับบ้าน"
        title="บ้านยุคใหม่ ใช้พลังงานอย่างชาญฉลาด"
        lead="ระบบสำหรับที่พักอาศัยไม่ได้มีแค่การติดแผงบนหลังคา แต่คือการจัดการพลังงานทั้งบ้าน ตั้งแต่การผลิต การเก็บ ไปจนถึงการเลือกใช้ในแต่ละช่วงเวลา"
        image={{ src: '/images/placeholder/home-package.svg', alt: '' }}
        actions={
          <>
            <ButtonLink href={quoteLinks.home} variant="primary" size="lg">
              {cta.primary}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="#package" variant="outline-light" size="lg">
              ดูแพ็กเกจสำหรับบ้าน
            </ButtonLink>
          </>
        }
      />

      {/* Four pillars */}
      <Section tone="white" labelledBy="pillars-title" width="wide">
        <SectionHeading
          id="pillars-title"
          eyebrow="องค์ประกอบของระบบ"
          title="สี่ส่วนที่ทำงานร่วมกันในบ้านหนึ่งหลัง"
          lead="ไม่ใช่ทุกบ้านต้องมีครบทั้งสี่ส่วน ทีมงานจะประเมินจากบิลค่าไฟและพฤติกรรมการใช้ไฟว่าบ้านของคุณควรเริ่มจากส่วนใด"
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-card border border-hairline bg-white p-6 shadow-card"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                <Icon name={pillar.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-h3">{pillar.title}</h3>
              <p className="mt-2 text-caption text-ink-700">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Suitability */}
      <Section tone="soft" labelledBy="suitability-title" width="wide">
        <SectionHeading
          id="suitability-title"
          eyebrow="บ้านแบบไหนเหมาะ"
          title="ประเมินเบื้องต้นด้วยตัวเองก่อนได้"
          lead="ไม่ใช่ทุกบ้านจะได้ผลตอบแทนเท่ากัน ลองดูว่าบ้านของคุณใกล้เคียงกับข้อไหนมากที่สุด"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {suitability.map((group) => (
            <div
              key={group.title}
              className="rounded-card border border-hairline bg-white p-6 shadow-card sm:p-8"
            >
              <h3 className="flex items-center gap-2.5 text-h3">
                <Icon
                  name={group.tone === 'good' ? 'check' : 'info'}
                  className={
                    group.tone === 'good'
                      ? 'h-6 w-6 text-solar-600'
                      : 'h-6 w-6 text-flare-600'
                  }
                />
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-body text-ink-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Note tone="info" label="ยังไม่แน่ใจ?" className="mt-8">
          {disclaimers.sizing} ส่งบิลค่าไฟและรูปหลังคาให้ทีมงานดูก่อนได้
          ไม่มีค่าใช้จ่ายและยังไม่ต้องตัดสินใจ
        </Note>
      </Section>

      {/* Promotional package */}
      <Section
        tone="white"
        labelledBy="package-title"
        width="wide"
        id="package"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="package-title"
              eyebrow="แพ็กเกจปัจจุบัน"
              title="แพ็กเกจ Solar + Battery สำหรับบ้าน"
              lead="แพ็กเกจสำเร็จรูปเหมาะกับบ้านที่มีลักษณะการใช้ไฟตรงกับที่ออกแบบไว้ หากการใช้ไฟของคุณต่างออกไป ทีมงานจะเสนอระบบที่ออกแบบเฉพาะให้แทน"
            />

            <ul className="mt-7 space-y-3 text-body text-ink-700">
              {[
                'เหมาะกับบ้านที่มีระบบไฟฟ้า 1 เฟส',
                'มีแบตเตอรี่ในชุด จึงใช้พลังงานต่อได้หลังแดดหมด',
                'ราคาและเงื่อนไขเป็นไปตามโปรโมชั่นในช่วงเวลาที่กำหนด',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon
                    name="check"
                    className="mt-1.5 h-5 w-5 shrink-0 text-flare-600"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <Note tone="caution" label="ก่อนตัดสินใจ" className="mt-7">
              แพ็กเกจนี้คิดจากขนาดระบบมาตรฐาน ไม่ได้ประเมินจากบิลค่าไฟของบ้านคุณ
              แนะนำให้ส่งบิลค่าไฟให้ทีมงานตรวจสอบก่อนว่าขนาดนี้เหมาะสมหรือไม่
            </Note>
          </div>

          <div className="lg:col-span-7">
            <HomePackageCard />
          </div>
        </div>
      </Section>

      <ProcessSection tone="soft" />

      <KnowledgeSection articles={homeArticles} />

      <FaqSection faqs={homeFaqs} tone="soft" />

      <LeadSection
        source="solar-home"
        title="อยากรู้ว่าบ้านของคุณควรติดระบบขนาดไหน?"
        lead="ส่งบิลค่าไฟย้อนหลังและรูปหลังคา ทีมงานจะประเมินเบื้องต้นให้ว่าขนาดระบบเท่าไรจึงเหมาะสม และควรมีแบตเตอรี่หรือไม่"
      />

      <JsonLd
        id="schema-solar-home"
        data={graph(
          breadcrumbSchema(crumbs),
          await serviceSchema({
            name: 'Solar Rooftop สำหรับบ้านพักอาศัย',
            description:
              'ออกแบบและติดตั้งระบบ Solar และ Solar + Battery สำหรับบ้านพักอาศัย พร้อมระบบติดตามพลังงานและบริการหลังการขาย',
            path: '/solar-home',
            serviceType: 'Residential solar rooftop installation',
          }),
          faqSchema(homeFaqs),
        )}
      />
    </>
  );
}
