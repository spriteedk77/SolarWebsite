import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Note } from '@/components/ui/Note';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { JsonLd } from '@/components/seo/JsonLd';

import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';
import { getSiteData } from '@/cms/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'นโยบายคุกกี้', path: '/cookie-policy' },
];

export const metadata: Metadata = buildMetadata({
  title: 'นโยบายคุกกี้ (Cookie Policy)',
  description:
    'นโยบายคุกกี้ของเว็บไซต์ NP88 Solar อธิบายประเภทของคุกกี้ที่ใช้ วัตถุประสงค์ และวิธีเปลี่ยนการตั้งค่าความยินยอม',
  path: '/cookie-policy',
});

const LAST_UPDATED = '14 กันยายน 2569';

export default async function CookiePolicyPage() {
  const { contact } = await getSiteData();
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ข้อมูลทางกฎหมาย"
        title="นโยบายคุกกี้"
        lead="หน้านี้อธิบายว่าเว็บไซต์ NP88 Solar ใช้คุกกี้ประเภทใดบ้าง เพื่ออะไร และคุณเปลี่ยนการตั้งค่าได้อย่างไร"
      >
        <p className="mt-6 text-caption text-navy-200">
          ปรับปรุงล่าสุด: {LAST_UPDATED}
        </p>
      </PageHero>

      <Section tone="white" width="narrow">
        <div className="prose-th">
          <h2>คุกกี้คืออะไร</h2>
          <p>
            คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่เว็บไซต์บันทึกไว้ในอุปกรณ์ของคุณ
            เพื่อให้เว็บไซต์ทำงานได้ตามปกติ จดจำการตั้งค่า
            หรือเก็บข้อมูลเชิงสถิติเกี่ยวกับการใช้งาน
          </p>

          <h2>ประเภทของคุกกี้ที่เว็บไซต์นี้ใช้</h2>

          <h3>1. คุกกี้ที่จำเป็น (Strictly necessary)</h3>
          <p>
            ใช้เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง เช่น
            การจดจำตัวเลือกความยินยอมเรื่องคุกกี้ของคุณ
            คุกกี้ประเภทนี้ไม่สามารถปิดได้ และไม่ได้ใช้เพื่อติดตามพฤติกรรมของคุณ
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">ชื่อ</th>
                <th scope="col">วัตถุประสงค์</th>
                <th scope="col">ระยะเวลา</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">np88-cookie-consent-v1</th>
                <td>
                  จดจำตัวเลือกความยินยอมเรื่องคุกกี้ของคุณ
                  (เก็บในเบราว์เซอร์ของคุณเอง)
                </td>
                <td>จนกว่าคุณจะล้างข้อมูลเบราว์เซอร์</td>
              </tr>
            </tbody>
          </table>

          <h3>2. คุกกี้เพื่อการวิเคราะห์ (Analytics)</h3>
          <p>
            ใช้เพื่อให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร
            หน้าใดมีประโยชน์ และส่วนใดควรปรับปรุง{' '}
            <strong>
              คุกกี้ประเภทนี้จะทำงานก็ต่อเมื่อคุณให้ความยินยอมเท่านั้น
            </strong>{' '}
            หากคุณไม่ยินยอม เว็บไซต์จะไม่โหลดสคริปต์วิเคราะห์ใด ๆ
          </p>

          <h3>3. คุกกี้เพื่อการตลาด (Marketing)</h3>
          <p>
            ใช้เพื่อวัดผลการโฆษณาและนำเสนอเนื้อหาที่เกี่ยวข้อง{' '}
            <strong>ทำงานก็ต่อเมื่อคุณให้ความยินยอมเท่านั้น</strong>{' '}
            เช่นเดียวกับคุกกี้เพื่อการวิเคราะห์
          </p>

          <Note tone="info" label="สถานะปัจจุบันของเว็บไซต์">
            ขณะนี้เว็บไซต์ยังไม่ได้ติดตั้งเครื่องมือวิเคราะห์หรือเครื่องมือโฆษณาใด
            ๆ หากมีการเพิ่มในอนาคต
            เครื่องมือเหล่านั้นจะถูกโหลดหลังจากได้รับความยินยอมของคุณเท่านั้น
            และจะมีการปรับปรุงรายการในหน้านี้ให้ตรงกับความเป็นจริง
          </Note>

          <h2>บริการของบุคคลภายนอก</h2>
          <p>
            หากคุณเลือกดูแผนที่ที่ฝังอยู่ในหน้า{' '}
            <Link href="/contact">ติดต่อเรา</Link>{' '}
            ผู้ให้บริการแผนที่อาจตั้งคุกกี้ของตนเองตามนโยบายของผู้ให้บริการรายนั้น
            การกดลิงก์ไปยัง LINE ก็อยู่ภายใต้นโยบายของผู้ให้บริการเช่นกัน
          </p>

          <h2>การเปลี่ยนการตั้งค่า</h2>
          <p>
            คุณเปลี่ยนตัวเลือกความยินยอมได้ตลอดเวลาด้วยปุ่มด้านล่างนี้
            หรือจะลบคุกกี้ทั้งหมดผ่านการตั้งค่าของเบราว์เซอร์ที่คุณใช้ก็ได้
          </p>
        </div>

        <div className="mt-8">
          <CookieSettingsButton />
        </div>

        <div className="prose-th mt-12">
          <h2>ติดต่อเรา</h2>
          <p>
            หากมีคำถามเกี่ยวกับนโยบายนี้ ติดต่อได้ที่ {contact.phone} หรือ LINE{' '}
            {contact.lineId} รายละเอียดเรื่องข้อมูลส่วนบุคคลโดยรวมอยู่ที่{' '}
            <Link href="/privacy">ประกาศความเป็นส่วนตัว</Link>
          </p>
        </div>
      </Section>

      <JsonLd id="schema-cookie" data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
