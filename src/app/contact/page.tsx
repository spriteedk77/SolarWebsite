import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { LineCTA, PhoneCTA } from '@/components/cta/ContactCTAs';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFaqs } from '@/content';
import { getSiteData, isGoogleMapsEmbed } from '@/cms/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ติดต่อเรา', path: '/contact' },
];

export async function generateMetadata(): Promise<Metadata> {
  const { site, contact, serviceAreas } = await getSiteData();
  return buildMetadata({
    title: `ติดต่อ ${site.name}`,
    description: `ติดต่อ ${site.name} โทร ${contact.phone} หรือ LINE ${contact.lineId} ให้บริการ${serviceAreas.map((a) => a.name).join(' ')} สอบถามและส่งข้อมูลเพื่อประเมินระบบ Solar`,
    path: '/contact',
  });
}

export default async function ContactPage() {
  const [{ site, contact, serviceAreas }, faqs] = await Promise.all([
    getSiteData(),
    getFaqs(),
  ]);
  return (
    <>
      <PageHero
        width="default"
        crumbs={crumbs}
        title={`ติดต่อ ${site.name}`}
        lead="สอบถามเรื่องระบบ Solar นัดหมายสำรวจ หรือส่งบิลค่าไฟและรูปหลังคาให้ทีมงานประเมินเบื้องต้น"
      />
      <Section tone="white" width="default">
        <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-14">
          <section
            aria-labelledby="contact-company-title"
            className="min-w-0"
          >
            <h2 id="contact-company-title" className="text-h2">
              {site.name}
            </h2>
            <p className="mt-2 text-body text-ink-600">{site.legalNameShort}</p>
            <address className="mt-6 border-t border-hairline pt-6 text-body not-italic text-ink-700">
              <p className="font-semibold text-navy-900">ที่อยู่สำนักงาน</p>
              <p className="mt-3">{contact.address.street}</p>
              <p>{contact.address.district}</p>
              <p>
                จังหวัด{contact.address.province} {contact.address.postalCode}
              </p>
              <div className="mt-5 space-y-1">
                <a
                  className="flex min-h-11 items-center gap-3 font-semibold text-navy-900"
                  href={contact.phoneHref}
                >
                  <Icon
                    name="phone"
                    className="h-5 w-5 shrink-0 text-solar-600"
                  />
                  {contact.phone}
                </a>
                <a
                  className="flex min-h-11 items-center gap-3 font-semibold text-navy-900"
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    name="line"
                    className="h-5 w-5 shrink-0 text-line-500"
                  />
                  <span className="break-all">LINE {contact.lineId}</span>
                </a>
              </div>
              {contact.businessHours && (
                <p className="mt-4 text-caption">
                  เวลาทำการ: {contact.businessHours}
                </p>
              )}
            </address>
            <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row">
              <LineCTA size="lg" />
              <PhoneCTA size="lg" label="โทรหาทีมงาน" />
            </div>
          </section>
          <section
            aria-labelledby="office-location-title"
            className="min-w-0 rounded-card border border-hairline bg-paper-soft p-6 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <Icon
                name="map-pin"
                className="h-6 w-6 shrink-0 text-solar-600"
              />
              <h2 id="office-location-title" className="text-h3">
                ที่ตั้งสำนักงาน
              </h2>
            </div>
            {isGoogleMapsEmbed(contact.googleMapsEmbedUrl) ? (
              <iframe
                src={contact.googleMapsEmbedUrl}
                title={`แผนที่สำนักงาน ${site.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-6 aspect-[4/3] w-full rounded-lg border-0"
              />
            ) : (
              <div className="mt-6 space-y-4">
                <p className="text-h3">
                  {contact.address.district}
                  <br />
                  จังหวัด{contact.address.province}
                </p>
                <p className="text-body text-ink-700">
                  {contact.addressLines.join(' ')}
                </p>
                <p className="border-t border-hairline pt-4 text-body text-ink-700">
                  กรุณาติดต่อทีมงานก่อนเข้าพบ
                  เพื่อนัดหมายและรับเส้นทางมายังสำนักงาน
                </p>
                <a
                  href={contact.googleBusinessProfileUrl || contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-solar-700 underline underline-offset-4"
                >
                  {contact.googleBusinessProfileUrl
                    ? 'เปิดตำแหน่งสำนักงาน'
                    : 'สอบถามเส้นทางทาง LINE'}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </a>
              </div>
            )}
          </section>
        </div>
        <section
          aria-labelledby="contact-areas-title"
          className="mt-12 border-t border-hairline pt-8"
        >
          <h2 id="contact-areas-title" className="text-h2">
            พื้นที่ให้บริการ
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {serviceAreas.map((area) => (
              <li
                key={area.slug}
                id={area.slug}
                className="flex scroll-mt-20 items-center gap-2 rounded-lg bg-paper-soft px-4 py-3 text-body font-medium text-navy-900"
              >
                <Icon
                  name="map-pin"
                  className="h-4 w-4 shrink-0 text-solar-600"
                />
                {area.name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-caption text-ink-600">
            พื้นที่อื่น ๆ ติดต่อทีมงานเพื่อพิจารณาเป็นรายกรณี
          </p>
        </section>
      </Section>
      <LeadSection
        source="contact"
        title="ต้องการประเมินระบบ Solar?"
        lead="ส่งบิลค่าไฟและรูปหลังคาให้ทีมงานวิเคราะห์เบื้องต้น ไม่มีค่าใช้จ่ายและยังไม่ต้องตัดสินใจ"
      />
      <FaqSection
        faqs={faqs.filter((faq) => faq.topic === 'บริการ')}
        title="คำถามเกี่ยวกับการให้บริการ"
        lead="ข้อมูลสำหรับเตรียมตัวก่อนติดต่อและนัดหมายสำรวจ"
        tone="white"
      />
      <JsonLd id="schema-contact" data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
