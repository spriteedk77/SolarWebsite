import type { IconName } from '@/content/types';

/**
 * Inline stroke icons. Kept in-repo rather than pulled from an icon package:
 * it is a handful of paths, ships no extra JavaScript, and keeps the line
 * weight consistent with the engineering tone of the brand.
 *
 * Icons are decorative unless a `title` is given — meaning is always carried
 * by adjacent text as well, never by the icon alone.
 */

export type GlyphName =
  | IconName
  | 'phone'
  | 'facebook'
  | 'arrow-right'
  | 'check'
  | 'plus'
  | 'menu'
  | 'close'
  | 'upload'
  | 'info'
  | 'alert'
  | 'map-pin'
  | 'bolt'
  | 'document';

const paths: Record<GlyphName, React.ReactNode> = {
  home: <path d="M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  building: (
    <>
      <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21" />
      <path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21" />
      <path d="M3 21h18M7.5 8h4M7.5 12h4M7.5 16h4" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l5 3.5V10l5 3.5V10l5 3.5V21z" />
      <path d="M2 21h20M18 10V4h3v6" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M2 21h20M8 21v-7h8v7M8 17h8" />
    </>
  ),
  office: (
    <>
      <path d="M5 21V4h14v17" />
      <path d="M3 21h18M9 8h2M13 8h2M9 12h2M13 12h2M10.5 21v-4h3v4" />
    </>
  ),
  shop: (
    <>
      <path d="M4 9h16l-1 11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M3.5 9 5 4h14l1.5 5M9 13a3 3 0 0 0 6 0" />
    </>
  ),
  restaurant: (
    <>
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11" />
      <path d="M17 3c-1.5 1.5-2 3.5-2 5.5S15.5 12 17 12v9" />
    </>
  ),
  clinic: (
    <>
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M3 21h18M12 10v6M9 13h6" />
    </>
  ),
  panel: (
    <>
      <path d="M3 6h18l-2 9H5z" />
      <path d="M12 15v6M8 21h8M8.6 6l-1 9M15.4 6l1 9M4.3 10.5h15.4" />
    </>
  ),
  inverter: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h4M13 20l2-4h-2l2-4" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="7" width="16" height="11" rx="2" />
      <path d="M21 11v3M7 11v3M11 11v3M15 11v3" />
    </>
  ),
  hybrid: (
    <>
      <path d="M4 8h7l-2-3M20 16h-7l2 3" />
      <path d="M20 8h-4M4 16h4" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="6" cy="16" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M7 12l3-3 2.5 2.5L17 7" />
    </>
  ),
  optimizer: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <path d="M7 8V5M17 16v3M11 12h2" />
    </>
  ),
  analysis: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="m7 15 3.5-4 3 2.5L20 7" />
      <circle cx="20" cy="7" r="1.5" />
    </>
  ),
  survey: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5M11 8v6M8 11h6" />
    </>
  ),
  design: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16M9 9v11M13 13h7M13 16h7" />
    </>
  ),
  value: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M14.5 9.5A2.5 2.5 0 0 0 12 8h-.5a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4H12a2.5 2.5 0 0 1-2.5-1.5" />
    </>
  ),
  install: (
    <>
      <path d="M14.5 5.5a3.5 3.5 0 0 0 4.6 4.6L21 12l-9 9-3-3 9-9z" />
      <path d="m6 18-2 2M3 11l4-4M5 9l4 4" />
    </>
  ),
  support: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19v1a2 2 0 0 1-2 2h-3" />
    </>
  ),
  phone: (
    <path d="M7 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5L16 11l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
  ),
  facebook: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M15.2 7.8h-1.6a2 2 0 0 0-2 2V12m-1.7 0h3.7m-2 0v8.9" />
    </>
  ),
  'arrow-right': <path d="M5 12h13M13 6l6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  upload: <path d="M12 16V5m0 0L8 9m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4M12 17.2v.4" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5z" />,
  document: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
};

type Props = {
  name: GlyphName;
  className?: string;
  /** Provide only when the icon carries meaning no nearby text conveys. */
  title?: string;
  strokeWidth?: number;
};

export function Icon({ name, className = 'h-6 w-6', title, strokeWidth = 1.6 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
