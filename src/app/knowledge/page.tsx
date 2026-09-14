import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { KnowledgeCard } from '@/components/cards/KnowledgeCard';
import { Badge } from '@/components/ui/Badge';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getArticles } from '@/content';
import type { ArticleCategory } from '@/content/types';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'บทความความรู้', path: '/knowledge' },
];

export const metadata: Metadata = buildMetadata({
  title: 'บทความความรู้เรื่อง Solar Rooftop — เข้าใจระบบก่อนตัดสินใจ',
  description:
    'รวมบทความอธิบายเรื่อง Solar Rooftop ตั้งแต่พื้นฐาน การเลือกขนาดระบบ ความแตกต่างของ On-Grid Hybrid Off-Grid ไปจนถึงการคำนวณความคุ้มค่าและระยะเวลาคืนทุน',
  path: '/knowledge',
  keywords: ['Solar Rooftop คืออะไร', 'ติด Solar กี่ kW', 'ระยะเวลาคืนทุน Solar'],
});

export default async function KnowledgePage() {
  const articles = await getArticles();

  // Group by category, preserving the newest-first order inside each group.
  const categories = articles.reduce<Record<string, typeof articles>>((acc, article) => {
    (acc[article.category] ??= []).push(article);
    return acc;
  }, {});

  const categoryOrder: ArticleCategory[] = [
    'พื้นฐาน Solar',
    'สำหรับบ้าน',
    'สำหรับธุรกิจ',
    'เทคโนโลยี',
    'ความคุ้มค่า',
    'ในพื้นที่ภาคเหนือ',
  ];

  const collection = {
    '@type': 'CollectionPage',
    name: 'บทความความรู้เรื่อง Solar Rooftop',
    url: absoluteUrl('/knowledge'),
    inLanguage: 'th-TH',
    hasPart: articles.map((article) => ({
      '@type': 'Article',
      headline: article.title,
      url: absoluteUrl(`/knowledge/${article.slug}`),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
    })),
  };

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="บทความความรู้"
        title="เข้าใจ Solar ก่อนตัดสินใจลงทุน"
        lead="บทความในหน้านี้อธิบายวิธีคิดและวิธีคำนวณ ไม่ใช่การขาย เป้าหมายคือให้คุณประเมินข้อเสนอที่ได้รับจากผู้ติดตั้งรายใดก็ได้ด้วยตัวเอง"
      >
        <ul className="mt-7 flex flex-wrap gap-2">
          {categoryOrder
            .filter((category) => categories[category]?.length)
            .map((category) => (
              <li key={category}>
                <a href={`#${encodeURIComponent(category)}`}>
                  <Badge tone="onNavy" className="px-4 py-2">
                    {category}
                  </Badge>
                </a>
              </li>
            ))}
        </ul>
      </PageHero>

      <Section tone="white" width="wide">
        <div className="space-y-16">
          {categoryOrder
            .filter((category) => categories[category]?.length)
            .map((category) => (
              <section
                key={category}
                id={encodeURIComponent(category)}
                aria-labelledby={`cat-${encodeURIComponent(category)}`}
                className="scroll-mt-28"
              >
                <h2 id={`cat-${encodeURIComponent(category)}`} className="text-h2">
                  {category}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categories[category].map((article) => (
                    <KnowledgeCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </Section>

      <LeadSection
        source="knowledge"
        title="อ่านแล้วยังไม่แน่ใจว่าระบบแบบไหนเหมาะกับคุณ?"
        lead="ส่งบิลค่าไฟและรูปหลังคาให้ทีมงานดู แล้วเราจะอธิบายให้ฟังว่าตัวเลขของคุณบอกอะไร"
      />

      <JsonLd id="schema-knowledge" data={graph(breadcrumbSchema(crumbs), collection)} />
    </>
  );
}
