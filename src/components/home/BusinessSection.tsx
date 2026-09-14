import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BusinessTypeCard } from '@/components/cards/BusinessTypeCard';
import type { BusinessType } from '@/content/types';

/** Section 5 — the business-focused block. One CTA only. */
export function BusinessSection({ types }: { types: BusinessType[] }) {
  return (
    <section aria-labelledby="business-title" className="on-navy relative isolate bg-navy-900">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/placeholder/business-rooftop.svg"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-navy-950/68" />
      </div>

      <Container width="wide">
        <div className="py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="business-title"
                tone="dark"
                eyebrow="สำหรับธุรกิจ"
                title="Solar Rooftop สำหรับธุรกิจ"
                lead="เปลี่ยนพื้นที่หลังคาให้ช่วยบริหารต้นทุนค่าไฟของธุรกิจในระยะยาว โดยเริ่มจากการวิเคราะห์โหลดจริง ไม่ใช่การเสนอขนาดระบบสำเร็จรูป"
              />

              <ul className="mt-7 space-y-3 text-body text-navy-100">
                {[
                  'วิเคราะห์บิลค่าไฟย้อนหลังและช่วงเวลาที่ใช้ไฟหนักที่สุด',
                  'ตรวจสอบโครงสร้างหลังคาและระบบไฟฟ้าเดิมก่อนออกแบบ',
                  'เสนอขนาดระบบพร้อมตัวเลขความคุ้มค่าและสมมติฐานที่ใช้คำนวณ',
                  'ออกแบบเผื่อการขยายระบบเมื่อธุรกิจเติบโต',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Icon name="check" className="mt-1.5 h-5 w-5 shrink-0 text-flare-600" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {/* Goes to the business page, so the label describes that —
                    not the assessment, which has its own wording. */}
                <ButtonLink href="/solar-business" variant="primary" size="lg">
                  ดูรายละเอียด Solar สำหรับธุรกิจ
                  <Icon name="arrow-right" className="h-5 w-5" />
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-caption font-semibold tracking-wide text-sky-brand uppercase">
                ประเภทธุรกิจที่ดูแล
              </h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {types.map((type) => (
                  <BusinessTypeCard key={type.id} type={type} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
