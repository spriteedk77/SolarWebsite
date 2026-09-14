import { Section, SectionHeading } from '@/components/ui/Section';
import { KnowledgeCard } from '@/components/cards/KnowledgeCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Article } from '@/content/types';

/** Section 11 — knowledge centre teaser. */
export function KnowledgeSection({ articles }: { articles: Article[] }) {
  return (
    <Section tone="white" labelledBy="knowledge-title" width="wide">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="knowledge-title"
          eyebrow="บทความความรู้"
          title="เข้าใจ Solar ก่อนตัดสินใจลงทุน"
          lead="บทความที่อธิบายวิธีคิดและวิธีคำนวณ เพื่อให้คุณประเมินข้อเสนอที่ได้รับจากผู้ติดตั้งรายใดก็ได้"
        />
        <ButtonLink href="/knowledge" variant="ghost" className="shrink-0 self-start md:self-auto">
          อ่านบทความทั้งหมด
          <Icon name="arrow-right" className="h-5 w-5" />
        </ButtonLink>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <KnowledgeCard key={article.id} article={article} />
        ))}
      </div>
    </Section>
  );
}
