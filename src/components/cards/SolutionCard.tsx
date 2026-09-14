import type { Solution } from '@/content/types';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

/**
 * Solution card. Reads problem → outcome → detail, so a visitor learns whether
 * it applies to them before meeting any terminology.
 */
export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Card as="li" className="flex h-full flex-col p-6" id={solution.slug}>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
        <Icon name={solution.icon} className="h-6 w-6" />
      </span>

      <h3 className="mt-4 text-h3">{solution.title}</h3>
      <p className="mt-1 text-caption font-medium text-solar-700">{solution.forWho}</p>

      <dl className="mt-4 space-y-3 text-caption">
        <div>
          <dt className="font-semibold text-navy-900">ปัญหาที่พบบ่อย</dt>
          <dd className="mt-0.5 text-ink-700">{solution.problem}</dd>
        </div>
        <div>
          <dt className="font-semibold text-navy-900">สิ่งที่ระบบช่วยได้</dt>
          <dd className="mt-0.5 text-ink-700">{solution.outcome}</dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-2 border-t border-hairline pt-4 text-caption text-ink-700">
        {solution.points.map((point) => (
          <li key={point} className="flex gap-2.5">
            <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-flare-600" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
