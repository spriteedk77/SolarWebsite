import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Note } from '@/components/ui/Note';
import type { GlyphName } from '@/components/ui/Icon';

const categories: { title: string; icon: GlyphName; body: string }[] = [
  {
    title: 'Solar Panels',
    icon: 'panel',
    body: 'แผงชนิด N-Type และแผงกระจกสองชั้น เลือกตามพื้นที่หลังคาและการใช้งานระยะยาว',
  },
  {
    title: 'Inverters',
    icon: 'inverter',
    body: 'อินเวอร์เตอร์สำหรับระบบ On-Grid และ Hybrid รองรับการตั้งค่า Zero Export',
  },
  {
    title: 'Battery Storage',
    icon: 'battery',
    body: 'ชุดแบตเตอรี่สำหรับเก็บพลังงานส่วนเกินไว้ใช้ช่วงที่ไม่มีแสงแดด',
  },
  {
    title: 'Optimizer',
    icon: 'optimizer',
    body: 'อุปกรณ์ระดับแผง ลดผลกระทบจากเงาบังและตรวจสอบการทำงานรายแผงได้',
  },
  {
    title: 'Monitoring',
    icon: 'monitor',
    body: 'ระบบติดตามการผลิตและการใช้พลังงานผ่านแอปพลิเคชัน',
  },
];

/**
 * Section 10 — technology used in NP88 Solar's own projects.
 *
 * The wording is "brands used in our installations", never "official dealer" or
 * "authorised partner": no partnership status has been confirmed.
 */
export function BrandsSection({ brands }: { brands: readonly string[] }) {
  return (
    <Section tone="soft" labelledBy="brands-title" width="wide">
      <SectionHeading
        id="brands-title"
        eyebrow="สินค้าและเทคโนโลยี"
        title="อุปกรณ์ที่ใช้ในงานติดตั้งของ NP88 Solar"
        lead="เลือกอุปกรณ์ตามความเหมาะสมของแต่ละงาน ไม่ใช่ตามยี่ห้อเดียวสำหรับทุกโครงการ"
      />

      <ul className="mt-8 flex flex-wrap items-center gap-3">
        {brands.map((brand) => (
          <li
            key={brand}
            className="rounded-lg border border-hairline bg-white px-5 py-3 font-display text-body-lg font-semibold text-navy-800"
          >
            {brand}
          </li>
        ))}
      </ul>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <li key={category.title} className="rounded-card border border-hairline bg-white p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
              <Icon name={category.icon} className="h-5.5 w-5.5" />
            </span>
            <h3 className="mt-3 text-body font-semibold text-navy-900">{category.title}</h3>
            <p className="mt-1.5 text-caption text-ink-700">{category.body}</p>
          </li>
        ))}
      </ul>

      <Note tone="info" label="เกี่ยวกับรายชื่อยี่ห้อ" className="mt-8">
        รายชื่อข้างต้นคือยี่ห้อของอุปกรณ์ที่ใช้ในโครงการที่ผ่านมาของ NP88 Solar
        ไม่ได้หมายถึงสถานะตัวแทนจำหน่ายอย่างเป็นทางการหรือความเป็นพาร์ทเนอร์ใด ๆ
      </Note>

      <div className="mt-8">
        <ButtonLink href="/products" variant="ghost" size="lg">
          ดูรายละเอียดสินค้าและเทคโนโลยี
          <Icon name="arrow-right" className="h-5 w-5" />
        </ButtonLink>
      </div>
    </Section>
  );
}
