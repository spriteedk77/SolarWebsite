import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { LeadSection } from '@/components/sections/LeadSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getFaqs } from '@/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph, serviceSchema } from '@/lib/schema';
import { isSegment, type LeadSegment } from '@/lib/quote-params';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ประเมินระบบฟรี', path: '/quote' },
];

export const metadata: Metadata = buildMetadata({
  title: 'ขอประเมินระบบ Solar ฟรี — ส่งบิลค่าไฟให้ทีมวิศวกรวิเคราะห์',
  description:
    'ส่งบิลค่าไฟและรูปหลังคาให้ทีม NP88 Solar วิเคราะห์เบื้องต้น ไม่มีค่าใช้จ่ายและยังไม่ผูกมัด รับแนวทางระบบที่เหมาะกับการใช้ไฟจริงของคุณ',
  path: '/quote',
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export default async function QuotePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Deep links from the marketing pages carry the visitor's context so the form
  // arrives partly answered instead of asking again.
  const rawSegment = first(params.segment);
  const segment: LeadSegment | undefined = isSegment(rawSegment) ? rawSegment : undefined;
  const packageSlug = first(params.package).slice(0, 60) || undefined;

  // Set by the no-JavaScript submit path, which redirects back here.
  const submitted = first(params.sent) === '1';
  const submitError = first(params.error).slice(0, 200) || undefined;

  const faqs = await getFaqs();
  const relevant = faqs.filter((faq) => ['ขนาดระบบ', 'บริการ'].includes(faq.topic));

  const leadCopy: Record<LeadSegment, { title: string; lead: string }> = {
    home: {
      title: 'ส่งข้อมูลบ้านของคุณให้ทีมงานประเมิน',
      lead: 'กรอกเท่าที่มีข้อมูลตอนนี้ก็ได้ ทีมงานจะแจ้งกลับว่าบ้านของคุณควรติดระบบขนาดเท่าไร และควรมีแบตเตอรี่หรือไม่',
    },
    business: {
      title: 'ส่งข้อมูลกิจการให้ทีมวิศวกรประเมิน',
      lead: 'ยิ่งมีบิลค่าไฟย้อนหลังหลายเดือน ตัวเลขที่ประเมินได้ก็ยิ่งใกล้เคียงของจริง ส่วนที่ยังไม่พร้อมส่งทีหลังทาง LINE ได้',
    },
  };

  const copy = segment
    ? leadCopy[segment]
    : {
        title: 'ส่งข้อมูลให้ทีมงานประเมิน',
        lead: 'กรอกเท่าที่มีข้อมูลตอนนี้ก็ได้ ส่วนที่ยังไม่พร้อมส่งทีหลังทาง LINE ได้ตลอด',
      };

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ประเมินระบบฟรี"
        title="อยากรู้ว่าระบบแบบไหนเหมาะกับคุณ?"
        lead="ส่งบิลค่าไฟ + รูปหลังคา ให้ทีม NP88 Solar วิเคราะห์เบื้องต้น เราจะแจ้งกลับว่าระบบขนาดเท่าไรน่าจะเหมาะ ควรมีแบตเตอรี่หรือไม่ และสิ่งที่ต้องตรวจสอบเพิ่มเติมมีอะไรบ้าง"
      />

      <LeadSection
        variant="full"
        source={segment ? `quote-${segment}` : 'quote-page'}
        title={copy.title}
        lead={copy.lead}
        segment={segment}
        packageSlug={packageSlug}
        submitted={submitted}
        submitError={submitError}
      />

      <ProcessSection tone="white" />

      <FaqSection
        faqs={relevant}
        tone="soft"
        title="คำถามก่อนขอประเมิน"
        lead="คำถามที่ลูกค้ามักถามก่อนส่งข้อมูลมาให้ทีมงาน"
      />

      <JsonLd
        id="schema-quote"
        data={graph(
          breadcrumbSchema(crumbs),
          serviceSchema({
            name: 'บริการประเมินระบบ Solar เบื้องต้น',
            description:
              'วิเคราะห์บิลค่าไฟ พื้นที่หลังคา และรูปแบบการใช้พลังงาน เพื่อเสนอแนวทางระบบ Solar ที่เหมาะสม',
            path: '/quote',
            serviceType: 'Solar system assessment',
          }),
        )}
      />
    </>
  );
}
