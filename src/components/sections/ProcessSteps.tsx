import type { Step } from '@/content/th/pages';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

/**
 * Numbered process list. The connecting rule is decorative only — the reading
 * order and the visible step numbers carry the sequence.
 */
export function ProcessSteps({
  steps,
  tone = 'light',
  columns = 3,
}: {
  steps: Step[];
  tone?: 'light' | 'dark';
  columns?: 2 | 3 | 4;
}) {
  const dark = tone === 'dark';
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <ol className={cn('grid gap-6', gridCols)}>
      {steps.map((step) => (
        <li
          key={step.number}
          className={cn(
            'relative flex flex-col rounded-card border p-6',
            dark ? 'border-white/10 bg-navy-800' : 'border-hairline bg-white shadow-card',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-lg',
                dark ? 'bg-white/10 text-sky-brand' : 'bg-solar-50 text-solar-700',
              )}
            >
              <Icon name={step.icon} className="h-5.5 w-5.5" />
            </span>
            {/* The numeral is the only visible carrier of sequence for sighted
                readers, so it is kept legible rather than used as a watermark.
                Screen readers get it from the sr-only prefix on the title. */}
            <span
              aria-hidden="true"
              className={cn(
                'font-display text-[2rem] font-bold leading-none',
                dark ? 'text-navy-300' : 'text-navy-400',
              )}
            >
              {step.number}
            </span>
          </div>

          <h3 className={cn('mt-4 text-h3', dark && 'text-white')}>
            <span className="sr-only">ขั้นตอนที่ {step.number}: </span>
            {step.title}
          </h3>
          <p className={cn('mt-2 text-caption', dark ? 'text-navy-200' : 'text-ink-700')}>
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
