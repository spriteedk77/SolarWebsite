import { cn } from '@/lib/utils';

type Tone = 'solar' | 'navy' | 'flare' | 'neutral' | 'onNavy';

const tones: Record<Tone, string> = {
  solar: 'bg-solar-50 text-solar-800 border-solar-200',
  navy: 'bg-navy-50 text-navy-800 border-navy-200',
  flare: 'bg-flare-50 text-flare-800 border-flare-200',
  neutral: 'bg-paper-soft text-ink-700 border-hairline',
  onNavy: 'bg-white/10 text-white border-white/20',
};

export function Badge({
  children,
  tone = 'solar',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
