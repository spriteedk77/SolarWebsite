import type { BusinessType } from '@/content/types';
import { Icon } from '@/components/ui/Icon';

/** Compact tile used in the "for business" section — segment plus its pain point. */
export function BusinessTypeCard({ type }: { type: BusinessType }) {
  return (
    <li className="flex gap-4 rounded-card border border-white/10 bg-navy-800 p-5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-brand">
        <Icon name={type.icon} className="h-5.5 w-5.5" />
      </span>
      <div>
        <h3 className="text-body font-semibold text-white">{type.label}</h3>
        <p className="mt-1 text-caption text-navy-200">{type.pain}</p>
      </div>
    </li>
  );
}
