import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { designFactors } from '@/content/th/pages';

/**
 * The company's core argument, stated before any product.
 *
 * The four-step "approach" cards that used to live here were a shortened copy
 * of the six-step process further down the page; keeping both made the homepage
 * say the same thing twice. The argument and the factors stay here — the steps
 * are shown once, in the process section, which this links to.
 */
const pillars = [
  {
    icon: 'survey' as const,
    title: 'สำรวจก่อนเสนอ',
    body: 'ประเมินจากหน้างานจริงทุกโครงการ ไม่ใช้แบบสำเร็จรูป',
  },
  {
    icon: 'design' as const,
    title: 'ออกแบบเฉพาะงาน',
    body: 'ขนาดระบบและอุปกรณ์เลือกตามโหลดและหลังคาของแต่ละที่',
  },
  {
    icon: 'support' as const,
    title: 'ดูแลหลังติดตั้ง',
    body: 'ติดตามการทำงานของระบบและให้บริการหลังการขายต่อเนื่อง',
  },
];

export function WhyNP88() {
  return (
    <Section tone="soft" labelledBy="why-title" width="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="why-title"
            eyebrow="แนวทางการทำงาน"
            title="Solar ที่ดี ไม่ได้เริ่มจากจำนวนแผง"
            lead="แต่เริ่มจากการเข้าใจการใช้พลังงานจริงของคุณ คำถามแรกจึงไม่ใช่ “ต้องติดกี่แผง” แต่เป็น “ระบบแบบไหนเหมาะและคุ้มค่ากับธุรกิจของคุณ”"
          />

          <ul className="mt-8 space-y-5">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-solar-700 shadow-card">
                  <Icon name={pillar.icon} className="h-5.5 w-5.5" />
                </span>
                <div>
                  <h3 className="text-body font-semibold text-navy-900">{pillar.title}</h3>
                  <p className="mt-1 text-caption text-ink-700">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <Link
              href="#process-title"
              className="inline-flex items-center gap-2 font-semibold text-solar-700 underline-offset-4 hover:underline"
            >
              ดูขั้นตอนการทำงานทั้งหมด 6 ขั้นตอน
              <Icon name="arrow-right" className="h-4.5 w-4.5" />
            </Link>
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-card border border-hairline bg-white p-6 shadow-card sm:p-8">
            <h3 className="text-h3">สิ่งที่นำมาพิจารณาก่อนเสนอระบบ</h3>
            <p className="mt-2 text-caption text-ink-600">
              ทุกข้อนี้มีผลต่อขนาดระบบที่เหมาะสมและตัวเลขความคุ้มค่าที่เสนอ
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {designFactors.map((factor) => (
                <li key={factor} className="flex items-start gap-2.5 text-body text-ink-700">
                  <Icon name="check" className="mt-1.5 h-4.5 w-4.5 shrink-0 text-flare-600" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
