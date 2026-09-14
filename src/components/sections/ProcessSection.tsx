import { Section, SectionHeading } from '@/components/ui/Section';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { processSteps } from '@/content/th/pages';

/** Section 8 — the full engagement, survey through after-sales. */
export function ProcessSection({ tone = 'white' }: { tone?: 'white' | 'soft' }) {
  return (
    <Section tone={tone} labelledBy="process-title" width="wide">
      <SectionHeading
        id="process-title"
        eyebrow="ขั้นตอนการทำงาน"
        title="ครบตั้งแต่สำรวจ ถึงดูแลหลังติดตั้ง"
        lead="ทุกขั้นตอนมีสิ่งที่คุณจะได้เห็นและตรวจสอบได้ ไม่ใช่แค่รอจนติดตั้งเสร็จ"
      />
      <div className="mt-10">
        <ProcessSteps steps={processSteps} columns={3} />
      </div>
    </Section>
  );
}
