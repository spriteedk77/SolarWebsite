import { cn } from '@/lib/utils';
import { Icon } from './Icon';

/**
 * `onDark` exists as a real variant rather than something callers patch in via
 * `className`: colour utilities passed that way lose to the variant's own
 * classes depending on Tailwind's output order, which is how this component
 * once ended up rendering navy text on a navy background.
 */
type Tone = 'info' | 'caution' | 'onDark';

const tones: Record<Tone, { wrap: string; icon: string; label: string }> = {
  info: {
    wrap: 'bg-solar-50 border-solar-200 text-navy-800',
    icon: 'text-solar-600',
    label: 'ข้อมูลเพิ่มเติม',
  },
  caution: {
    wrap: 'bg-flare-50 border-flare-200 text-flare-900',
    icon: 'text-flare-600',
    label: 'ข้อควรทราบ',
  },
  onDark: {
    wrap: 'bg-white/5 border-white/20 text-navy-100',
    icon: 'text-sky-brand',
    label: 'หมายเหตุ',
  },
};

/**
 * An inline note. The tone is never the only signal — every note carries a
 * visible text label and an icon as well, so meaning survives without colour.
 */
export function Note({
  children,
  tone = 'info',
  label,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  label?: string;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <div className={cn('rounded-card border p-4 sm:p-5', t.wrap, className)}>
      <p className="mb-1 flex items-center gap-2 text-caption font-semibold">
        <Icon
          name={tone === 'caution' ? 'alert' : 'info'}
          className={cn('h-4.5 w-4.5 shrink-0', t.icon)}
        />
        {label ?? t.label}
      </p>
      <div className="text-caption leading-relaxed">{children}</div>
    </div>
  );
}

/** The savings/promotion/warranty disclaimers used throughout the site. */
export function Disclaimer({
  children,
  className,
  withIcon = true,
}: {
  children: React.ReactNode;
  className?: string;
  withIcon?: boolean;
}) {
  return (
    <p className={cn('flex items-start gap-2 text-caption text-ink-600', className)}>
      {withIcon && <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />}
      <span>{children}</span>
    </p>
  );
}

/*
 * `PendingNote` used to render the content-review register into the page. That
 * was the right call while the site was being reviewed internally, but it is
 * staff-facing copy and has no place in front of a customer. The register now
 * lives only in docs/content-confirmation.md and src/lib/pending.ts, which is
 * printed to the dev server console on start.
 *
 * The rule it enforced still stands: unconfirmed figures are not published at
 * all, rather than published with a caveat.
 */
