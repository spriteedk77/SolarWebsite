'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNav } from '@/lib/site';
import { cn } from '@/lib/utils';

export function DesktopNav() {
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    // Switches at xl, not lg: nine Thai labels plus the logo and CTA need more
    // than 1024px before they start wrapping.
    <nav aria-label="เมนูหลัก" className="hidden xl:block">
      <ul className="flex items-center gap-0.5">
        {primaryNav.map((item) => {
          const current = isCurrent(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'relative inline-flex h-12 items-center rounded-md px-2.5 text-[0.95rem] font-medium whitespace-nowrap transition-colors',
                  current
                    ? 'text-solar-700'
                    : 'text-ink-700 hover:text-navy-900 hover:bg-navy-50',
                )}
              >
                {item.label}
                {/* Current page is marked by an underline as well as colour.
                    Sat low in the taller box so it clears Thai below-vowels
                    (ุ ู ฺ) and the descenders in ญ / ฐ. */}
                {current && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 bottom-1 h-0.5 rounded-full bg-flare-600"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
