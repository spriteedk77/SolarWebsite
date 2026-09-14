import { cn } from '@/lib/utils';

/**
 * NP88 Solar wordmark.
 *
 * Mark: a solar array in perspective under a rising sun — panel + sun, the two
 * shapes the brand is already recognised by, rendered in the existing
 * navy / solar-blue / orange palette.
 *
 * ⚠️ If NP88 Solar supplies the original logo artwork, replace the SVG in this
 * component and in /public/images/brand/np88-solar-logo.svg with the official
 * files. This is a faithful reconstruction in the brand colours, not the
 * registered mark.
 */
export function Logo({
  className,
  variant = 'dark',
  showTagline = false,
}: {
  className?: string;
  /** `dark` = navy text for light backgrounds; `light` = white text on navy. */
  variant?: 'dark' | 'light';
  showTagline?: boolean;
}) {
  const wordColor = variant === 'light' ? '#ffffff' : '#08192b';
  const subColor = variant === 'light' ? '#bcdcfd' : '#4c5b6a';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="48" height="48" rx="11" fill="#08192b" />
        {/* sun */}
        <circle cx="24" cy="18.5" r="6.5" fill="#ffc021" />
        <g stroke="#f2861e" strokeWidth="1.8" strokeLinecap="round">
          <path d="M24 6.5v2.4M24 28.1v2.4M11.7 18.5h2.4M33.9 18.5h2.4M15.3 9.8l1.7 1.7M31 26l1.7 1.7M32.7 9.8 31 11.5M17 26l-1.7 1.7" />
        </g>
        {/* array */}
        <path d="M9 39.5 13.5 29h21L39 39.5z" fill="#0b63ce" />
        <g stroke="#8ac5fb" strokeWidth="1.2" strokeLinecap="round">
          <path d="M16.6 29 13.2 39.5M24 29v10.5M31.4 29l3.4 10.5M12.2 33.2h23.6" />
        </g>
      </svg>

      <span className="flex flex-col leading-none">
        {/* The orange half of the wordmark is the brand's own colour and is
            kept exactly as-is. WCAG 1.4.3 exempts logotypes from the contrast
            minimum; no other orange text on the site relies on that exemption. */}
        <span className="font-display text-[1.35rem] font-bold tracking-tight">
          <span style={{ color: wordColor }}>NP88</span>{' '}
          <span style={{ color: '#f2861e' }}>Solar</span>
        </span>
        {showTagline && (
          <span
            className="mt-1 text-[0.7rem] font-medium tracking-wide"
            style={{ color: subColor }}
          >
            Engineering Your Energy Future.
          </span>
        )}
      </span>
    </span>
  );
}
