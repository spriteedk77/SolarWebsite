import { cn } from '@/lib/utils';
import { Container } from './Container';

type SectionProps = {
  children: React.ReactNode;
  /** Visual ground. `navy` sets the `on-navy` focus-ring context. */
  tone?: 'white' | 'soft' | 'navy' | 'navy-grid';
  id?: string;
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
  /** Renders a <section> by default; pass 'div' inside an existing landmark. */
  as?: 'section' | 'div';
  /** Ties the section to its heading for assistive technology. */
  labelledBy?: string;
  spacing?: 'default' | 'tight' | 'loose';
  /**
   * `major` gives the section a minimum visual frame so it reads as a chapter
   * of the page rather than a strip after the hero.
   *
   * It is a floor, never a fixed height: the content still grows past it, and
   * the floor drops at each breakpoint so a phone gets natural height with
   * generous padding instead of a screen of empty space.
   *
   * Apply it deliberately. It suits sections carrying a substantial block of
   * content — about/history, solutions, projects, engineering, the major CTAs.
   * It does not suit the FAQ, disclaimers, small CTA strips or the footer, and
   * sections that already read well should be left alone.
   */
  frame?: 'none' | 'major';
};

const tones = {
  white: 'bg-paper text-ink-700',
  soft: 'bg-paper-soft text-ink-700',
  navy: 'on-navy bg-navy-900 text-navy-100',
  'navy-grid': 'on-navy bg-navy-900 bg-blueprint text-navy-100',
};

const spacings = {
  tight: 'py-12 md:py-16',
  default: 'py-16 md:py-24',
  loose: 'py-20 md:py-32',
};

/** Minimum frame for a major section. Mobile is deliberately unconstrained. */
const frames = {
  none: '',
  major: 'md:min-h-[34rem] lg:min-h-[42rem]',
};

export function Section({
  children,
  tone = 'white',
  id,
  className,
  width = 'default',
  as: Tag = 'section',
  labelledBy,
  spacing = 'default',
  frame = 'none',
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        tones[tone],
        spacings[spacing],
        frames[frame],
        frame !== 'none' && 'flex flex-col justify-center',
        className,
      )}
    >
      <Container width={width}>{children}</Container>
    </Tag>
  );
}

type HeadingProps = {
  /** Small label above the heading. Never the only carrier of meaning. */
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  /** h2 by default — h1 is reserved for the page title. */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = 'left',
  tone = 'light',
  as: Tag = 'h2',
  className,
}: HeadingProps) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-caption font-semibold tracking-wide uppercase',
            dark ? 'text-sky-brand' : 'text-solar-700',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          Tag === 'h1' ? 'text-h1' : 'text-h2',
          dark && 'text-white',
        )}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            'mt-4 text-body-lg',
            dark ? 'text-navy-100' : 'text-ink-600',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
