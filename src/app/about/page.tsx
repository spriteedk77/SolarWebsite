import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Figure } from '@/components/ui/Figure';
import { Icon } from '@/components/ui/Icon';
import { ContactChannels } from '@/components/cta/ContactChannels';
import { Badge } from '@/components/ui/Badge';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { EngineeringSection } from '@/components/sections/EngineeringSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { segments } from '@/content/th/pages';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';
import { getSiteData } from '@/cms/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'เกี่ยวกับเรา', path: '/about' },
];

export const metadata: Metadata = buildMetadata({
  title: 'เกี่ยวกับ NP88 Solar — พาร์ทเนอร์ด้านพลังงานในเชียงใหม่',
  description:
    'NP88 Solar โดย NP88 Engineering Co., Ltd. ตั้งอยู่ที่อำเภอสันป่าตอง จังหวัดเชียงใหม่ ให้บริการออกแบบและติดตั้งระบบ Solar Rooftop ด้วยแนวทางที่เริ่มจากการใช้ไฟจริงของลูกค้า',
  path: '/about',
});

const principles = [
  {
    icon: 'analysis' as const,
    title: 'เริ่มจากข้อมูล ไม่ใช่จากจำนวนแผง',
    body: 'ทุกข้อเสนอเริ่มจากบิลค่าไฟและพฤติกรรมการใช้ไฟจริง ระบบที่เสนอจึงมีเหตุผลรองรับทุกตัวเลข',
  },
  {
    icon: 'design' as const,
    title: 'ออกแบบเฉพาะงาน',
    body: 'ไม่มีแบบสำเร็จรูปที่ใช้ได้กับทุกหลังคา เราออกแบบจากโครงสร้าง ระบบไฟฟ้า และเงาบังของแต่ละสถานที่',
  },
  {
    icon: 'value' as const,
    title: 'พูดเรื่องความคุ้มค่าอย่างตรงไปตรงมา',
    body: 'เราแสดงสมมติฐานที่ใช้คำนวณทั้งหมด และไม่รับประกันตัวเลขการประหยัดที่ควบคุมไม่ได้',
  },
  {
    icon: 'support' as const,
    title: 'ดูแลต่อหลังติดตั้ง',
    body: 'งานไม่ได้จบที่วันส่งมอบ ระบบต้องทำงานได้จริงตลอดอายุการใช้งาน',
  },
];

export default async function AboutPage() {
  const { contact, serviceAreas, site } = await getSiteData();
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="เกี่ยวกับเรา"
        title="พาร์ทเนอร์ด้านพลังงาน ไม่ใช่ร้านขายแผงโซลาร์"
        lead="NP88 Solar ดำเนินงานโดย NP88 Engineering Co., Ltd. เราเชื่อว่าโครงการ Solar Rooftop ไม่ควรเริ่มจากคำถามว่า “ต้องติดกี่แผง” แต่ควรเริ่มจาก “ระบบแบบไหนเหมาะและคุ้มค่ากับธุรกิจของคุณ”"
        image={{ src: '/images/placeholder/about-team.svg', alt: '' }}
      />

      {/* Positioning */}
      <Section tone="white" labelledBy="position-title" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="position-title"
              eyebrow="แนวทางของเรา"
              title="Engineering Your Energy Future."
              lead="เราทำงานในฐานะผู้ช่วยวิเคราะห์ ออกแบบ และติดตั้งระบบพลังงาน ให้เหมาะกับการใช้พลังงานจริงของลูกค้า ตั้งแต่บ้านพักอาศัยไปจนถึงโรงงาน"
            />

            <p className="mt-6 text-body text-ink-700">
              ก่อนเสนอระบบใด ๆ เราพิจารณาปริมาณการใช้ไฟจริง ค่าไฟ
              พื้นที่หลังคาที่ใช้ได้ รูปแบบการใช้พลังงานในแต่ละช่วงเวลา
              เป้าหมายทางธุรกิจ ความปลอดภัย มาตรฐานงานวิศวกรรม การบำรุงรักษา
              และความเป็นไปได้ในการขยายระบบในอนาคต
            </p>
            <p className="mt-4 text-body text-ink-700">
              ผลลัพธ์ที่ลูกค้าได้รับจึงไม่ใช่แค่ใบเสนอราคา
              แต่คือเหตุผลว่าทำไมระบบจึงควรเป็นขนาดนี้ ทำไมจึงเลือกอุปกรณ์ชุดนี้
              และตัวเลขความคุ้มค่ามาจากสมมติฐานอะไรบ้าง
            </p>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid gap-5 sm:grid-cols-2">
              {principles.map((principle) => (
                <li
                  key={principle.title}
                  className="rounded-card border border-hairline bg-white p-6 shadow-card"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                    <Icon name={principle.icon} className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-3 text-body font-semibold text-navy-900">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-caption text-ink-700">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Company facts */}
      <Section tone="soft" labelledBy="company-title" width="wide">
        <SectionHeading
          id="company-title"
          eyebrow="ข้อมูลบริษัท"
          title="ตั้งอยู่ในเชียงใหม่ ให้บริการทั่วภาคเหนือตอนบน"
          lead="การมีทีมงานอยู่ในพื้นที่มีผลโดยตรงต่อความเร็วในการเข้าสำรวจหน้างานและการดูแลหลังติดตั้ง"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
            <h3 className="text-h3">ที่ตั้งสำนักงาน</h3>
            <address className="mt-4 space-y-1 text-body not-italic text-ink-700">
              <p className="font-semibold text-navy-900">
                {site.legalNameShort}
              </p>
              {contact.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <ContactChannels
              contact={contact}
              analytics="about"
              className="mt-4"
            />
          </div>

          <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
            <h3 className="text-h3">พื้นที่ให้บริการ</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceAreas.map((area) => (
                <li
                  key={area.slug}
                  className="flex items-center gap-2.5 text-body text-ink-700"
                >
                  <Icon
                    name="map-pin"
                    className="h-4.5 w-4.5 shrink-0 text-solar-600"
                  />
                  <span>
                    {area.name}
                    {area.primary && (
                      <span className="ml-2 text-caption text-ink-600">
                        (สำนักงานหลัก)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption text-ink-600">
              อยู่นอกพื้นที่เหล่านี้? สอบถามทีมงานเพื่อพิจารณาเป็นรายกรณี
            </p>
          </div>

          <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
            <h3 className="text-h3">ประเภทงานที่ดูแล</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {segments.map((segment) => (
                <li key={segment}>
                  <Badge tone="neutral">{segment}</Badge>
                </li>
              ))}
            </ul>
            {/* No installation count here until NP88 Solar confirms the figure
                and its reference date — the company's own material disagrees
                with itself (600+ vs 700+). */}
            <p className="mt-5 border-t border-hairline pt-4 text-caption text-ink-600">
              แต่ละประเภทมีรูปแบบการใช้ไฟและข้อจำกัดด้านโครงสร้างต่างกัน
              เราจึงออกแบบระบบแยกตามลักษณะงาน
              ไม่ใช้แบบสำเร็จรูปเดียวกับทุกหลังคา
            </p>
          </div>
        </div>
      </Section>

      {/* How we work */}
      <ProcessSection />

      <EngineeringSection />

      <Section tone="white" labelledBy="photos-title" width="wide">
        <SectionHeading
          id="photos-title"
          eyebrow="หน้างานจริง"
          title="งานของเราอยู่บนหลังคา ไม่ใช่ในโบรชัวร์"
          lead="ตั้งแต่การสำรวจหน้างาน การออกแบบระบบ ไปจนถึงการติดตั้งและตรวจสอบ ทุกขั้นตอนมีทีมงานของเราอยู่หน้างานจริง"
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              src: '/images/placeholder/about-team.svg',
              alt: 'ทีมงาน NP88 Solar ระหว่างการทำงานหน้างาน',
              caption: 'ทีมงานหน้างาน',
            },
            {
              src: '/images/placeholder/engineering-design.svg',
              alt: 'การออกแบบระบบและตรวจสอบข้อมูลการผลิตไฟ',
              caption: 'งานออกแบบและตรวจสอบระบบ',
            },
            {
              src: '/images/placeholder/project-array-detail.svg',
              alt: 'รายละเอียดการติดตั้งแผงโซลาร์บนหลังคา',
              caption: 'รายละเอียดงานติดตั้ง',
            },
          ].map((image) => (
            <Figure
              key={image.src + image.caption}
              image={{ ...image, width: 1600, height: 900, placeholder: true }}
              ratio="4/3"
              showCaption
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      </Section>

      <LeadSection source="about" />

      <JsonLd id="schema-about" data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
