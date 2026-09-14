import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { engineeringPoints } from '@/content/th/pages';

/**
 * Engineering credibility.
 *
 * Every line describes work NP88 Solar actually performs. There are no claims
 * about certifications, licences or approvals — those may only be added once
 * the documents are supplied (see docs/content-confirmation.md).
 *
 * `limit` keeps the homepage to the four points that are not already covered by
 * the solutions and process sections; the business and about pages show all of
 * them, and the homepage links through.
 */
export function EngineeringSection({
  limit,
  moreHref = '/solar-business',
}: {
  limit?: number;
  moreHref?: string;
}) {
  const points = limit ? engineeringPoints.slice(0, limit) : engineeringPoints;
  const hasMore = points.length < engineeringPoints.length;

  return (
    <Section tone="navy-grid" labelledBy="engineering-title" width="wide">
      <SectionHeading
        id="engineering-title"
        tone="dark"
        eyebrow="งานวิศวกรรม"
        title="ออกแบบด้วยหลักวิศวกรรม ไม่ใช่แค่ติดแผงบนหลังคา"
        lead="ระบบที่ดีต้องพิจารณาทั้งโครงสร้าง ระบบไฟฟ้า ความปลอดภัย และการดูแลระยะยาวไปพร้อมกัน ไม่ใช่แค่เลือกอุปกรณ์จากแคตตาล็อก"
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <li key={point.title} className="rounded-card border border-white/10 bg-navy-800 p-5">
            <Icon name="check" className="h-5 w-5 text-flare-600" />
            <h3 className="mt-3 text-body font-semibold text-white">{point.title}</h3>
            <p className="mt-1.5 text-caption text-navy-200">{point.body}</p>
          </li>
        ))}
      </ul>

      {hasMore && (
        <p className="mt-8">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-2 font-semibold text-sky-brand underline-offset-4 hover:text-white hover:underline"
          >
            ดูขอบเขตงานวิศวกรรมทั้งหมด
            <Icon name="arrow-right" className="h-4.5 w-4.5" />
          </Link>
        </p>
      )}
    </Section>
  );
}
