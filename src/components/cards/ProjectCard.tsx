import type { Project } from '@/content/types';
import { customerTypeLabels } from '@/content/types';
import { Card, StretchedLink } from '@/components/ui/Card';
import { Figure } from '@/components/ui/Figure';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { formatKw, formatThb } from '@/lib/utils';

/**
 * Project card.
 *
 * Leads with the specification — capacity, phase, panel, quantity — because
 * that is what a factory or business owner scans for. Savings figures always
 * carry the word "ประมาณ" and link through to the full disclaimer on the case
 * study page.
 */
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const href = `/projects/${project.slug}`;
  const cover = project.gallery[0];

  return (
    <Card as="article" interactive className="flex h-full flex-col">
      {cover && (
        <Figure
          image={cover}
          ratio="3/2"
          rounded={false}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="navy">{project.province}</Badge>
          {project.customerType && (
            <Badge tone="neutral">{customerTypeLabels[project.customerType]}</Badge>
          )}
          {project.zeroExport && <Badge tone="solar">Zero Export</Badge>}
          {project.battery && <Badge tone="flare">Solar + Battery</Badge>}
        </div>

        <h3 className="mt-3 text-h3 leading-snug">
          <StretchedLink href={href} className="hover:text-solar-700">
            {project.title}
          </StretchedLink>
        </h3>

        {/* Raised above the stretched link so the specification can be selected
            and copied — this card exists to be compared against a real quote.
            The image, title and footer row remain the click targets. */}
        <dl className="relative z-10 mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-4 text-caption select-text">
          <div>
            <dt className="text-ink-600">กำลังติดตั้ง</dt>
            <dd className="font-semibold text-navy-900">
              {formatKw(project.systemCapacityKw)} kW
            </dd>
          </div>
          <div>
            <dt className="text-ink-600">ระบบไฟฟ้า</dt>
            <dd className="font-semibold text-navy-900">{project.phase}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-ink-600">แผงโซลาร์</dt>
            <dd className="font-semibold text-navy-900">
              {project.solarPanel} × {project.panelQuantity} แผง
            </dd>
          </div>
        </dl>

        {project.estimatedSavingsThbPerMonth && (
          <p className="relative z-10 mt-4 rounded-lg bg-paper-soft px-3.5 py-2.5 text-caption text-ink-700 select-text">
            ประหยัดค่าไฟได้สูงสุดประมาณ{' '}
            <strong className="font-semibold text-navy-900">
              {formatThb(project.estimatedSavingsThbPerMonth)} บาท/เดือน
            </strong>
            <span className="mt-0.5 block text-[0.8125rem] text-ink-600">
              เป็นค่าประมาณของโครงการนี้ ขึ้นอยู่กับการใช้ไฟจริง
            </span>
          </p>
        )}

        <p className="mt-auto pt-5 text-caption font-semibold text-solar-700">
          <span className="inline-flex items-center gap-1.5">
            ดูรายละเอียดโครงการ
            <Icon name="arrow-right" className="h-4 w-4" />
          </span>
        </p>
      </div>
    </Card>
  );
}
