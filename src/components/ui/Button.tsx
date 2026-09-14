import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Buttons and button-shaped links.
 *
 * Note on `className`: it is merged after the variant classes, but Tailwind
 * resolves conflicting utilities by stylesheet order, not by class-attribute
 * order. So do NOT pass display utilities (`hidden`, `block`, `lg:inline-flex`)
 * here — they fight the built-in `inline-flex`. Put responsive visibility on a
 * wrapper element instead.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'line' | 'outline-light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold ' +
  // Long Thai labels can wrap within their container at narrow widths.
  'max-w-full min-w-0 whitespace-normal text-center transition-colors duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

/** Accent buttons use dark navy text for readable contrast. */
const variants: Record<Variant, string> = {
  // Solar Orange is the single highest-priority action on any page.
  // Hover/active shades are chosen to stay above 4.5:1 with the same ink.
  primary:
    'bg-flare-500 text-navy-950 hover:bg-flare-400 active:bg-flare-600 shadow-card',
  secondary: 'bg-solar-600 text-white hover:bg-solar-700 active:bg-solar-800',
  ghost:
    'bg-white text-navy-900 border border-hairline hover:border-solar-400 hover:text-solar-700',
  line: 'bg-line-500 text-navy-950 hover:bg-line-600',
  'outline-light':
    'border border-white/35 text-white hover:bg-white/10 hover:border-white/60',
};

const sizes: Record<Size, string> = {
  // `sm` still clears the 44px touch target; only the padding and type shrink.
  sm: 'min-h-11 px-3.5 py-2 text-caption',
  md: 'min-h-11 px-5 py-2.5 text-body',
  lg: 'min-h-13 px-7 py-3.5 text-body-lg',
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<
    React.ComponentPropsWithoutRef<'a'>,
    'href' | 'className' | 'children'
  >;

type ButtonProps = CommonProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function ButtonLink({
  children,
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  ...rest
}: LinkProps) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  );

  if (external || href.startsWith('http') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http')
          ? { rel: 'noopener noreferrer', target: '_blank' }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
