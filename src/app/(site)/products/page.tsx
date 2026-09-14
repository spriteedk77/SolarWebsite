import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { ProductCard } from '@/components/cards/ProductCard';
import { Note } from '@/components/ui/Note';
import { Badge } from '@/components/ui/Badge';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getBrands, getProducts } from '@/content';
import type { ProductCategory } from '@/content/types';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';
import { disclaimers } from '@/lib/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'สินค้าและเทคโนโลยี', path: '/products' },
];

export const metadata: Metadata = buildMetadata({
  title: 'สินค้าและเทคโนโลยี — แผงโซลาร์ อินเวอร์เตอร์ แบตเตอรี่ และ Optimizer',
  description:
    'อุปกรณ์ที่ NP88 Solar ใช้ในงานติดตั้งจริง ทั้งแผงโซลาร์ JA Solar และ AIKO อินเวอร์เตอร์ Deye แบตเตอรี่ Dyness Smart PV Optimizer และระบบติดตามพลังงาน',
  path: '/products',
  keywords: ['แผงโซลาร์ JA Solar', 'AIKO', 'Deye inverter', 'Dyness battery'],
});

const categoryOrder: ProductCategory[] = [
  'แผงโซลาร์',
  'อินเวอร์เตอร์',
  'แบตเตอรี่',
  'Optimizer',
  'Monitoring',
];

export default async function ProductsPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  const grouped = products.reduce<Record<string, typeof products>>((acc, product) => {
    (acc[product.category] ??= []).push(product);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="สินค้าและเทคโนโลยี"
        title="อุปกรณ์ที่ใช้ในงานติดตั้งของ NP88 Solar"
        lead="เราเลือกอุปกรณ์ตามความเหมาะสมของแต่ละงาน ไม่ได้ใช้ยี่ห้อเดียวกับทุกโครงการ หน้านี้แสดงเฉพาะอุปกรณ์ที่ใช้จริงในงานที่ผ่านมา"
        image={{ src: '/images/placeholder/equipment-inverter-room.svg', alt: '' }}
      >
        <ul className="mt-7 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <li key={brand}>
              <Badge tone="onNavy" className="px-4 py-2 text-body">
                {brand}
              </Badge>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section tone="white" width="wide">
        <Note tone="info" label="เกี่ยวกับข้อมูลในหน้านี้">
          รายการนี้คืออุปกรณ์ที่ใช้ในโครงการที่ผ่านมาของ NP88 Solar
          ไม่ได้หมายถึงสถานะตัวแทนจำหน่ายอย่างเป็นทางการ ความเป็นพาร์ทเนอร์ หรือการรับรองใด ๆ
          สเปกที่แสดงจำกัดเฉพาะค่าที่ปรากฏในข้อมูลโครงการ
          รายละเอียดทางเทคนิคฉบับเต็มโปรดอ้างอิงเอกสารของผู้ผลิตแต่ละราย
        </Note>

        <div className="mt-12 space-y-16">
          {categoryOrder
            .filter((category) => grouped[category]?.length)
            .map((category) => (
              <section key={category} aria-labelledby={`cat-${category}`} className="scroll-mt-20">
                <h2 id={`cat-${category}`} className="text-h2">
                  {category}
                </h2>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ul>
              </section>
            ))}
        </div>

        <Note tone="caution" label="เรื่องการรับประกัน" className="mt-12">
          {disclaimers.warranty}
        </Note>
      </Section>

      <LeadSection
        source="products"
        title="ไม่แน่ใจว่าควรเลือกอุปกรณ์แบบไหน?"
        lead="การเลือกอุปกรณ์ควรมาหลังจากรู้ขนาดระบบที่เหมาะสมแล้ว ส่งบิลค่าไฟให้ทีมงานประเมินก่อน แล้วเราจะเสนออุปกรณ์ที่เหมาะกับงานของคุณ"
      />

      <JsonLd id="schema-products" data={graph(breadcrumbSchema(crumbs))} />
    </>
  );
}
