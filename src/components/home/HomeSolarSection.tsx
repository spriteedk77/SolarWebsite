import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { HomePackageCard } from '@/components/sections/HomePackageCard';

const pillars = [
  {
    icon: 'panel' as const,
    title: 'Solar',
    body: 'ผลิตไฟใช้เองในช่วงกลางวัน ลดปริมาณไฟที่ต้องซื้อจากการไฟฟ้า',
  },
  {
    icon: 'battery' as const,
    title: 'Battery',
    body: 'เก็บพลังงานส่วนที่ผลิตเกินไว้ใช้ช่วงเย็นและกลางคืน',
  },
  {
    icon: 'monitor' as const,
    title: 'Energy Management',
    body: 'ดูการผลิตและการใช้พลังงานของบ้านได้เองผ่านแอปพลิเคชัน',
  },
  {
    icon: 'shield' as const,
    title: 'Backup Power',
    body: 'มีไฟสำรองสำหรับวงจรที่กำหนดไว้เมื่อไฟดับ',
  },
];

/** Section 7 — residential. */
export function HomeSolarSection() {
  return (
    <Section tone="soft" labelledBy="home-solar-title" width="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading
            id="home-solar-title"
            eyebrow="สำหรับบ้าน"
            title="บ้านยุคใหม่ ใช้พลังงานอย่างชาญฉลาด"
            lead="ระบบสำหรับที่พักอาศัยไม่ได้มีแค่การติดแผงบนหลังคา แต่คือการจัดการพลังงานทั้งบ้าน ตั้งแต่การผลิต การเก็บ ไปจนถึงการเลือกใช้ในแต่ละช่วงเวลา"
          />

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
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

          <div className="mt-8">
            <ButtonLink href="/solar-home" variant="ghost" size="lg">
              ดูรายละเอียด Solar สำหรับบ้าน
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HomePackageCard />
        </div>
      </div>
    </Section>
  );
}
