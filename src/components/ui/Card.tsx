import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Card surface.
 *
 * `Card` never renders a link itself — it only provides the surface and, when
 * `interactive` is set, the hover/focus affordance for a card whose heading
 * uses `StretchedLink`. It used to take an `href` it did nothing with, which
 * read as if the card were the link; the boolean says what actually happens.
 *
 * Pairing is deliberate: one real `<a>` in the tab order (the heading), with
 * its hit area stretched over the card. Anything inside the card that must stay
 * selectable or separately clickable needs `relative z-10` to sit above that
 * stretched area — see `ProjectCard`'s specification list.
 */
type Props = {
  children: React.ReactNode;
  className?: string;
  /** Adds hover/focus elevation for a card containing a `StretchedLink`. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
  tone?: 'white' | 'soft' | 'navy';
  /** Anchor target, so a card can be deep-linked (e.g. /solutions#battery). */
  id?: string;
};

const tones = {
  white: 'bg-white border-hairline',
  soft: 'bg-paper-soft border-hairline',
  navy: 'bg-navy-800 border-white/10 text-navy-100',
};

export function Card({
  children,
  className,
  interactive = false,
  as: Tag = 'div',
  tone = 'white',
  id,
}: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        'relative overflow-hidden rounded-card border shadow-card',
        tones[tone],
        interactive &&
          'group transition-shadow duration-200 hover:shadow-card-hover focus-within:shadow-card-hover',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The card's single real link, with its hit area stretched over the surface. */
export function StretchedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'after:absolute after:inset-0 after:rounded-card after:content-[""]',
        className,
      )}
    >
      {children}
    </Link>
  );
}
