import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ContactActions } from '@/components/cta/ContactCTAs';
import { LeadForm } from '@/components/forms/LeadForm';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import type { LeadSegment } from '@/lib/quote-params';

/**
 * Section 13 — the conversion block.
 *
 * Two variants:
 *  - `full` renders the assessment form inline (used on /quote)
 *  - `compact` is the closing band used at the end of every other page: one
 *    primary action plus phone and LINE, and nothing else competing with it.
 */
export async function LeadSection({
  variant = 'compact',
  title = 'อยากรู้ว่าระบบแบบไหนเหมาะกับคุณ?',
  lead = 'ส่งบิลค่าไฟ + รูปหลังคา ให้ทีม NP88 Solar วิเคราะห์เบื้องต้น ไม่มีค่าใช้จ่ายและยังไม่ต้องตัดสินใจ',
  source = 'section',
  segment,
  packageSlug,
  submitted = false,
  submitError,
}: {
  variant?: 'compact' | 'full';
  title?: string;
  lead?: string;
  source?: string;
  /** Pre-fills the form from the link the visitor arrived on. */
  segment?: LeadSegment;
  packageSlug?: string;
  /** Set by the no-JavaScript submit path after a redirect back. */
  submitted?: boolean;
  submitError?: string;
}) {
  const { contact } = await getSiteData();
  if (variant === 'full') {
    return (
      <Section tone="soft" labelledBy="lead-title" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="lead-title"
              eyebrow="ประเมินระบบฟรี"
              title={title}
              lead={lead}
            />

            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: 'document' as const,
                  title: 'ส่งบิลค่าไฟย้อนหลัง',
                  body: 'ยิ่งมีหลายเดือน ยิ่งเห็นรูปแบบการใช้ไฟชัดขึ้น',
                },
                {
                  icon: 'survey' as const,
                  title: 'ส่งรูปหลังคา',
                  body: 'ถ่ายให้เห็นพื้นที่ว่างและสิ่งกีดขวางรอบ ๆ',
                },
                {
                  icon: 'value' as const,
                  title: 'รับผลประเมินเบื้องต้น',
                  body: 'ทีมงานจะแจ้งแนวทางระบบที่เหมาะสมพร้อมเหตุผล',
                },
              ].map((step) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-solar-700 shadow-card">
                    <Icon name={step.icon} className="h-5.5 w-5.5" />
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-navy-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-caption text-ink-700">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-card border border-hairline bg-white p-5">
              <h3 className="text-body font-semibold text-navy-900">
                ติดต่อโดยตรง
              </h3>
              <p className="mt-3 space-y-2 text-body">
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-2.5 font-semibold text-navy-900 hover:text-solar-700"
                >
                  <Icon name="phone" className="h-5 w-5 text-solar-600" />
                  {contact.phone}
                </a>
              </p>
              <p className="mt-2 text-body">
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-semibold text-navy-900 hover:text-solar-700"
                >
                  <Icon name="line" className="h-5 w-5 text-line-500" />
                  LINE {contact.lineId}
                </a>
              </p>
              <p className="mt-3 text-caption text-ink-600">
                ส่งบิลค่าไฟและรูปหลังคาทาง LINE ได้โดยตรงเช่นกัน
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-card border border-hairline bg-white p-6 shadow-card sm:p-8">
              <LeadForm
                source={source}
                segment={segment}
                packageSlug={packageSlug}
                submitted={submitted}
                submitError={submitError}
              />
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="navy" labelledBy="lead-title" width="wide" spacing="tight">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <SectionHeading
            id="lead-title"
            tone="dark"
            title={title}
            lead={lead}
            as="h2"
          />
        </div>
        <div className="lg:col-span-5">
          <ContactActions tone="dark" />
          <p className="mt-4 text-caption text-navy-200">
            หรือกรอกรายละเอียดในแบบฟอร์มที่หน้า{' '}
            <Link
              href={quoteLinks.general}
              className="font-semibold text-white underline underline-offset-4"
            >
              ประเมินระบบฟรี
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
