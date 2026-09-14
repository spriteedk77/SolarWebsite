import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { Note } from '@/components/ui/Note';
import { LineCTA, PhoneCTA } from '@/components/cta/ContactCTAs';
import { ButtonLink } from '@/components/ui/Button';
import { FaqSection } from '@/components/sections/FaqSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getFaqs } from '@/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';
import { contact, cta, quoteLinks, serviceAreas, site } from '@/lib/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ติดต่อเรา', path: '/contact' },
];

export const metadata: Metadata = buildMetadata({
  title: 'ติดต่อ NP88 Solar — โทร 095-697-1915 · LINE @np88solar',
  description:
    'ติดต่อ NP88 Solar สำนักงานอำเภอสันป่าตอง จังหวัดเชียงใหม่ โทร 095-697-1915 หรือแชตทาง LINE @np88solar ให้บริการเชียงใหม่ ลำพูน เชียงราย ลำปาง พะเยา',
  path: '/contact',
  keywords: ['ติดต่อ NP88 Solar', 'ช่างโซลาร์เซลล์เชียงใหม่'],
});

export default async function ContactPage() {
  const faqs = await getFaqs();
  const serviceFaqs = faqs.filter((faq) => faq.topic === 'บริการ');

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ติดต่อเรา"
        title="คุยกับทีม NP88 Solar"
        lead="สะดวกช่องทางไหนติดต่อได้ทันที หากมีบิลค่าไฟหรือรูปหลังคาอยู่แล้ว ส่งมาทาง LINE ได้เลย ทีมงานจะดูให้และแจ้งกลับว่าควรเริ่มจากอะไร"
        actions={
          <>
            <PhoneCTA size="lg" variant="primary" label={`โทร ${contact.phone}`} />
            <LineCTA size="lg" />
          </>
        }
      />

      <Section tone="white" width="wide" labelledBy="channels-title">
        <h2 id="channels-title" className="sr-only">
          ช่องทางการติดต่อ
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Phone */}
          <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
              <Icon name="phone" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-h3">โทรศัพท์</h3>
            <p className="mt-2 text-caption text-ink-700">
              เหมาะสำหรับสอบถามเบื้องต้นหรือเรื่องเร่งด่วน
            </p>
            <a
              href={contact.phoneHref}
              className="mt-4 inline-block font-display text-h3 font-bold text-navy-900 hover:text-solar-700"
            >
              {contact.phone}
            </a>
          </div>

          {/* LINE */}
          <div className="rounded-card border border-line-500/30 bg-white p-6 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-line-500/10 text-line-600">
              <Icon name="line" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-h3">LINE</h3>
            <p className="mt-2 text-caption text-ink-700">
              ช่องทางที่สะดวกที่สุดสำหรับส่งบิลค่าไฟและรูปหลังคา
            </p>
            <p className="mt-4 font-display text-h3 font-bold text-navy-900">{contact.lineId}</p>
            <LineCTA size="lg" className="mt-4" fullWidth label="เปิดแชต LINE" />
          </div>

          {/* Form */}
          <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-flare-50 text-flare-600">
              <Icon name="document" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-h3">แบบฟอร์มขอประเมินระบบ</h3>
            <p className="mt-2 text-caption text-ink-700">
              กรอกข้อมูลพร้อมแนบไฟล์ได้ในครั้งเดียว เหมาะกับงานที่มีรายละเอียดมาก
            </p>
            <ButtonLink href={quoteLinks.general} variant="primary" size="lg" fullWidth className="mt-4">
              ไปที่แบบฟอร์ม
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Location + service areas */}
      <Section tone="soft" width="wide" labelledBy="location-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="location-title"
              eyebrow="ที่ตั้ง"
              title="สำนักงานอำเภอสันป่าตอง จังหวัดเชียงใหม่"
            />

            <address className="mt-6 space-y-1 text-body not-italic text-ink-700">
              <p className="font-semibold text-navy-900">{site.name}</p>
              <p>{site.legalNameShort}</p>
              {contact.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>

            {contact.googleBusinessProfileUrl && (
              <a
                href={contact.googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-solar-700 underline-offset-4 hover:underline"
              >
                <Icon name="map-pin" className="h-5 w-5" />
                ดูใน Google Business Profile
              </a>
            )}

            {/* Neutral until confirmed hours are supplied; no claim either way. */}
            <Note tone="info" label="การติดต่อ" className="mt-6">
              ส่งข้อความทาง LINE {contact.lineId} ได้ตลอดเวลา ทีมงานจะตอบกลับในเวลาทำการ
              หากเป็นเรื่องเร่งด่วน โทร {contact.phone} จะได้รับการติดต่อกลับเร็วที่สุด
            </Note>
          </div>

          <div className="lg:col-span-7">
            {contact.googleMapsEmbedUrl ? (
              <div className="overflow-hidden rounded-card border border-hairline bg-white">
                <iframe
                  src={contact.googleMapsEmbedUrl}
                  title="แผนที่สำนักงาน NP88 Solar อำเภอสันป่าตอง จังหวัดเชียงใหม่"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-96 w-full border-0"
                />
              </div>
            ) : (
              /* Customer-facing fallback: shows the address and the quickest
                 way to get directions, with no mention of configuration. The
                 embedded map appears once NEXT_PUBLIC_MAPS_EMBED_URL is set. */
              <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-card border border-hairline bg-white p-8 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                  <Icon name="map-pin" className="h-6 w-6" />
                </span>
                <p className="mt-4 text-body font-semibold text-navy-900">
                  สำนักงาน {site.name}
                </p>
                <p className="mt-2 max-w-md text-body text-ink-700">
                  {contact.addressLines.join(' ')}
                </p>
                <p className="mt-4 text-caption text-ink-600">
                  ต้องการเส้นทางหรือนัดหมายเข้าพบ ติดต่อทีมงานได้ที่{' '}
                  <a href={contact.phoneHref} className="font-semibold text-solar-700">
                    {contact.phone}
                  </a>{' '}
                  หรือ LINE{' '}
                  <a
                    href={contact.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-solar-700"
                  >
                    {contact.lineId}
                  </a>
                </p>
              </div>
            )}

            <div className="mt-6 rounded-card border border-hairline bg-white p-6">
              <h3 className="text-h3">พื้นที่ให้บริการ</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceAreas.map((area) => (
                  <li
                    key={area.slug}
                    id={area.slug}
                    className="flex items-center gap-2.5 scroll-mt-28 text-body text-ink-700"
                  >
                    <Icon name="map-pin" className="h-4.5 w-4.5 shrink-0 text-solar-600" />
                    ติดตั้งโซลาร์เซลล์{area.name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-caption text-ink-600">
                อยู่นอกพื้นที่เหล่านี้? ติดต่อทีมงานเพื่อพิจารณาเป็นรายกรณี
              </p>
            </div>
          </div>
        </div>
      </Section>

      <FaqSection
        faqs={serviceFaqs}
        tone="white"
        title="คำถามเกี่ยวกับการให้บริการ"
        lead="หากไม่พบคำตอบที่ต้องการ ติดต่อทีมงานได้โดยตรงทาง LINE หรือโทรศัพท์"
      />

      <Section tone="navy" width="wide" spacing="tight" labelledBy="contact-cta-title">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              id="contact-cta-title"
              tone="dark"
              title="พร้อมให้ทีมงานประเมินระบบให้แล้วใช่ไหม?"
              lead="ส่งบิลค่าไฟและรูปหลังคามาให้ดูก่อนได้ ไม่มีค่าใช้จ่ายและยังไม่ต้องตัดสินใจ"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5">
            <ButtonLink href={quoteLinks.general} variant="primary" size="lg">
              {cta.primary}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
            <LineCTA size="lg" />
          </div>
        </div>
        <p className="mt-6 text-caption text-navy-200">
          ข้อมูลที่คุณส่งมาจะถูกใช้เพื่อประเมินระบบและติดต่อกลับเท่านั้น ดูรายละเอียดที่{' '}
          <Link href="/privacy" className="font-semibold text-white underline underline-offset-4">
            ประกาศความเป็นส่วนตัว
          </Link>
        </p>
      </Section>

      <JsonLd id="schema-contact" data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
