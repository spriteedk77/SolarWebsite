import { Section, SectionHeading } from '@/components/ui/Section';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import type { Faq } from '@/content/types';

/** Section 12 — FAQ. The FAQPage structured data is emitted by the page. */
export function FaqSection({
  faqs,
  tone = 'soft',
  title = 'คำถามที่พบบ่อย',
  lead = 'คำถามที่ลูกค้าถามบ่อยที่สุดก่อนตัดสินใจติดตั้ง หากไม่พบคำตอบที่ต้องการ ทีมงานยินดีตอบให้ทาง LINE หรือโทรศัพท์',
}: {
  faqs: Faq[];
  tone?: 'white' | 'soft';
  title?: string;
  lead?: string;
}) {
  return (
    <Section tone={tone} labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow="คำถามที่พบบ่อย" title={title} lead={lead} />
      <div className="mt-8">
        <FAQAccordion items={faqs} openFirst />
      </div>
    </Section>
  );
}
