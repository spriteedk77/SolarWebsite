import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { Note } from '@/components/ui/Note';
import { BusinessTypeCard } from '@/components/cards/BusinessTypeCard';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { EngineeringSection } from '@/components/sections/EngineeringSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getBusinessTypes, getFaqs, getProjects } from '@/content';
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
  { name: 'สำหรับธุรกิจ', path: '/solar-business' },
];

export const metadata: Metadata = buildMetadata({
  title:
    'Solar Rooftop สำหรับธุรกิจและโรงงาน — ลดค่าไฟด้วยระบบที่ออกแบบจากโหลดจริง',
  description:
    'ออกแบบและติดตั้ง Solar Rooftop สำหรับโรงงาน คลังสินค้า สำนักงาน ร้านค้า ร้านอาหาร คลินิก และ SME ในเชียงใหม่และภาคเหนือ วิเคราะห์บิลค่าไฟและโหลดจริงก่อนเสนอขนาดระบบ',
  path: '/solar-business',
  keywords: [
    'โซลาร์เซลล์โรงงาน',
    'Solar Rooftop โรงงาน',
    'Solar สำหรับธุรกิจ',
    'ลดค่าไฟโรงงาน',
    'ติดตั้งโซลาร์เซลล์เชียงใหม่',
  ],
});

const businessBenefits = [
  {
    icon: 'analysis' as const,
    title: 'เห็นตัวเลขก่อนตัดสินใจ',
    body: 'เสนอขนาดระบบพร้อมประมาณการพลังงานที่ผลิตได้ ค่าไฟที่ลดลง และสมมติฐานที่ใช้คำนวณทั้งหมด',
  },
  {
    icon: 'design' as const,
    title: 'ออกแบบจากโหลดจริง',
    body: 'ใช้บิลค่าไฟย้อนหลังและตารางเวลาทำงานจริงเป็นตัวตั้ง ไม่ใช่การเสนอขนาดระบบตามงบประมาณ',
  },
  {
    icon: 'shield' as const,
    title: 'รองรับเงื่อนไขการเชื่อมต่อ',
    body: 'ติดตั้งระบบ Zero Export และดำเนินการด้านเอกสารตามเงื่อนไขของแต่ละงาน',
  },
  {
    icon: 'monitor' as const,
    title: 'ตรวจสอบผลได้ตลอดเวลา',
    body: 'ระบบ Monitoring ทำให้ฝ่ายอาคารหรือฝ่ายผลิตเห็นการผลิตไฟจริง ไม่ต้องรอดูจากบิลค่าไฟ',
  },
  {
    icon: 'install' as const,
    title: 'วางแผนติดตั้งรอบการผลิต',
    body: 'นัดหมายช่วงหยุดจ่ายไฟล่วงหน้าให้กระทบการดำเนินงานน้อยที่สุด',
  },
  {
    icon: 'support' as const,
    title: 'ดูแลต่อเนื่องหลังส่งมอบ',
    body: 'ติดตามการทำงานของระบบและให้บริการหลังการขายตามขอบเขตที่ตกลงไว้',
  },
];

const assessmentInputs = [
  'บิลค่าไฟย้อนหลัง 6–12 เดือน',
  'ประเภทผู้ใช้ไฟและขนาดมิเตอร์',
  'ตารางเวลาทำการหรือรอบการผลิต',
  'พื้นที่หลังคาและชนิดของหลังคา',
  'ตำแหน่งอุปกรณ์บนหลังคาที่ทำให้เกิดเงาบัง',
  'แผนการขยายกิจการในอนาคต',
];

export default async function SolarBusinessPage() {
  const { cta } = await getSiteData();
  const [types, projects, faqs] = await Promise.all([
    getBusinessTypes(),
    getProjects(),
    getFaqs(),
  ]);

  const businessFaqs = faqs.filter((faq) =>
    ['ขนาดระบบ', 'บริการ', 'ทั่วไป'].includes(faq.topic),
  );

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="สำหรับธุรกิจ"
        title="Solar Rooftop สำหรับธุรกิจ"
        lead="เปลี่ยนพื้นที่หลังคาให้ช่วยบริหารต้นทุนค่าไฟของธุรกิจในระยะยาว โดยเริ่มจากการวิเคราะห์การใช้ไฟจริง ไม่ใช่การเสนอขนาดระบบสำเร็จรูป"
        image={{ src: '/images/placeholder/business-rooftop.svg', alt: '' }}
        actions={
          <>
            <ButtonLink href={quoteLinks.business} variant="primary" size="lg">
              {cta.primary}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/projects" variant="outline-light" size="lg">
              {cta.projects}
            </ButtonLink>
          </>
        }
      />

      {/* Problem framing */}
      <Section tone="white" labelledBy="problem-title" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="problem-title"
              eyebrow="โจทย์ของธุรกิจ"
              title="ค่าไฟคือต้นทุนคงที่ที่ควบคุมได้ยากที่สุดก้อนหนึ่ง"
              lead="สำหรับธุรกิจส่วนใหญ่ ค่าไฟเพิ่มขึ้นตามการเติบโตของกิจการ และเกิดขึ้นในช่วงเวลาเดียวกับที่ระบบ Solar ผลิตไฟได้มากที่สุด นั่นคือช่วงที่ระบบเข้าไปแทนที่ได้ตรงที่สุด"
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="grid gap-5 sm:grid-cols-2">
              {businessBenefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="rounded-card border border-hairline bg-white p-5 shadow-card"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                    <Icon name={benefit.icon} className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-3 text-body font-semibold text-navy-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-caption text-ink-700">
                    {benefit.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Segments */}
      <Section tone="navy-grid" labelledBy="segments-title" width="wide">
        <SectionHeading
          id="segments-title"
          tone="dark"
          eyebrow="กลุ่มธุรกิจที่ดูแล"
          title="แต่ละประเภทกิจการมีรูปแบบการใช้ไฟไม่เหมือนกัน"
          lead="การออกแบบระบบจึงต้องเริ่มจากทำความเข้าใจว่ากิจการของคุณใช้ไฟอย่างไร ไม่ใช่ดูแค่ขนาดพื้นที่หลังคา"
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((type) => (
            <BusinessTypeCard key={type.id} type={type} />
          ))}
        </ul>
      </Section>

      {/* What we need to assess */}
      <Section tone="soft" labelledBy="inputs-title" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="inputs-title"
              eyebrow="การประเมิน"
              title="ข้อมูลที่ใช้ในการประเมินระบบสำหรับธุรกิจ"
              lead="ยิ่งข้อมูลครบ ตัวเลขที่เสนอก็ยิ่งใกล้เคียงของจริง ขั้นตอนนี้ยังไม่มีค่าใช้จ่ายและยังไม่ผูกมัด"
            />
            <ul className="mt-7 space-y-3">
              {assessmentInputs.map((input) => (
                <li
                  key={input}
                  className="flex items-start gap-3 text-body text-ink-700"
                >
                  <Icon
                    name="check"
                    className="mt-1.5 h-5 w-5 shrink-0 text-flare-600"
                  />
                  {input}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink
                href={quoteLinks.business}
                variant="primary"
                size="lg"
              >
                {cta.primary}
                <Icon name="arrow-right" className="h-5 w-5" />
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-card border border-hairline bg-white p-6 shadow-card sm:p-8">
              <h3 className="text-h3">สิ่งที่คุณจะได้รับกลับไป</h3>
              <ol className="mt-5 space-y-4">
                {[
                  {
                    title: 'ขนาดระบบที่เหมาะสม',
                    body: 'พร้อมเหตุผลว่าทำไมจึงเป็นขนาดนี้ และทำไมไม่ใหญ่กว่าหรือเล็กกว่านี้',
                  },
                  {
                    title: 'ประมาณการพลังงานที่ผลิตได้',
                    body: 'คำนวณจากพื้นที่ ทิศทางหลังคา และเงาบังที่ตรวจพบจากการสำรวจ',
                  },
                  {
                    title: 'ประมาณการค่าไฟที่ลดได้',
                    body: 'คิดจากอัตราค่าไฟจริงของกิจการและสัดส่วนพลังงานที่ถูกใช้ภายใน',
                  },
                  {
                    title: 'สมมติฐานที่ใช้คำนวณทั้งหมด',
                    body: 'เพื่อให้ตรวจสอบและเปรียบเทียบกับข้อเสนอจากผู้ติดตั้งรายอื่นได้',
                  },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-caption font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-body font-semibold text-navy-900">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-caption text-ink-700">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Note tone="caution" label="สิ่งที่เราจะไม่ทำ" className="mt-6">
                เราไม่รับประกันตัวเลขการประหยัดค่าไฟ {disclaimers.savingsShort}
              </Note>
            </div>
          </div>
        </div>
      </Section>

      <ProcessSection />

      {/* Three keeps the row complete at every breakpoint; the filter is kept
          so a future residential project does not leak onto the business page. */}
      <FeaturedProjects
        projects={projects
          .filter((p) => p.customerType !== 'residential')
          .slice(0, 3)}
      />

      <EngineeringSection />

      <FaqSection faqs={businessFaqs} tone="soft" />

      <LeadSection
        source="solar-business"
        title="ต้องการให้ทีม NP88 Solar วิเคราะห์ระบบสำหรับธุรกิจของคุณ?"
        lead="ส่งบิลค่าไฟย้อนหลังและข้อมูลพื้นที่ ทีมวิศวกรจะประเมินเบื้องต้นและติดต่อกลับพร้อมแนวทางที่เหมาะสม"
      />

      <JsonLd
        id="schema-business"
        data={graph(
          breadcrumbSchema(crumbs),
          await serviceSchema({
            name: 'Solar Rooftop สำหรับธุรกิจและโรงงาน',
            description:
              'ออกแบบและติดตั้งระบบ Solar Rooftop สำหรับโรงงาน คลังสินค้า สำนักงาน ร้านค้า ร้านอาหาร คลินิก และธุรกิจ SME',
            path: '/solar-business',
            serviceType: 'Commercial and industrial solar rooftop engineering',
          }),
          faqSchema(businessFaqs),
        )}
      />
    </>
  );
}
