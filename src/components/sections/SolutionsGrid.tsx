import { Section, SectionHeading } from '@/components/ui/Section';
import { SolutionCard } from '@/components/cards/SolutionCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Solution } from '@/content/types';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';

/** Shared between the homepage (section 4) and /solutions. */
export async function SolutionsGrid({
  solutions,
  withHeading = true,
  withCta = true,
  tone = 'soft',
}: {
  solutions: Solution[];
  withHeading?: boolean;
  withCta?: boolean;
  tone?: 'white' | 'soft';
}) {
  const { cta } = await getSiteData();
  return (
    <Section
      tone={tone}
      labelledBy={withHeading ? 'solutions-title' : undefined}
      width="wide"
    >
      {withHeading && (
        <SectionHeading
          id="solutions-title"
          eyebrow="โซลูชัน"
          title="เลือกจากปัญหาที่คุณเจอ ไม่ใช่จากชื่อเทคโนโลยี"
          lead="แต่ละระบบแก้ปัญหาคนละแบบ เริ่มจากดูว่าสถานการณ์ไหนใกล้เคียงกับของคุณที่สุด แล้วค่อยดูรายละเอียดทางเทคนิค"
        />
      )}

      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </ul>

      {withCta && (
        <div className="mt-10">
          <ButtonLink href={quoteLinks.general} variant="secondary" size="lg">
            {cta.primary}
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}
