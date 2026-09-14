import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { contact, cta, quoteLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

type Size = 'md' | 'lg';

/** Phone call-to-action. The number is always visible, never icon-only. */
export function PhoneCTA({
  variant = 'ghost',
  size = 'md',
  className,
  label,
  fullWidth,
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline-light';
  size?: Size;
  className?: string;
  label?: string;
  fullWidth?: boolean;
}) {
  return (
    <ButtonLink
      href={contact.phoneHref}
      variant={variant}
      size={size}
      className={className}
      fullWidth={fullWidth}
      data-analytics="cta-phone"
    >
      <Icon name="phone" className="h-5 w-5" />
      <span>{label ?? contact.phone}</span>
    </ButtonLink>
  );
}

/**
 * LINE call-to-action. LINE is the channel most Thai customers actually use,
 * so it gets its own brand-coloured button rather than being folded into a
 * generic "contact" link.
 */
export function LineCTA({
  variant = 'line',
  size = 'md',
  className,
  label,
  fullWidth,
}: {
  variant?: 'line' | 'ghost' | 'outline-light';
  size?: Size;
  className?: string;
  label?: string;
  fullWidth?: boolean;
}) {
  return (
    <ButtonLink
      href={contact.lineUrl}
      external
      variant={variant}
      size={size}
      className={className}
      fullWidth={fullWidth}
      data-analytics="cta-line"
    >
      <Icon name="line" className="h-5 w-5" />
      <span>{label ?? `LINE ${contact.lineId}`}</span>
    </ButtonLink>
  );
}

/**
 * The standard closing block for a page: one primary action plus the two
 * direct channels. Deliberately only three actions — no competing CTAs.
 */
export function ContactActions({
  primaryHref = quoteLinks.general,
  primaryLabel = cta.primary,
  tone = 'light',
  className,
}: {
  primaryHref?: string;
  primaryLabel?: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap', className)}>
      <ButtonLink href={primaryHref} variant="primary" size="lg" data-analytics="cta-quote">
        {primaryLabel}
        <Icon name="arrow-right" className="h-5 w-5" />
      </ButtonLink>
      <LineCTA size="lg" />
      <PhoneCTA size="lg" variant={tone === 'dark' ? 'outline-light' : 'ghost'} />
    </div>
  );
}
