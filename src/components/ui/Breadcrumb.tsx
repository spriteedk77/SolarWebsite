import Link from 'next/link';
import type { Crumb } from '@/lib/schema';
import { cn } from '@/lib/utils';

/**
 * Breadcrumb trail. The matching BreadcrumbList structured data is emitted by
 * the page using `breadcrumbSchema()` with the same crumbs.
 */
export function Breadcrumb({
  crumbs,
  tone = 'light',
  className,
}: {
  crumbs: Crumb[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <nav aria-label="เส้นทางนำทาง" className={cn('text-caption', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className={dark ? 'text-white' : 'text-ink-700'}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className={cn(
                    'underline-offset-4 hover:underline',
                    dark ? 'text-navy-100 hover:text-white' : 'text-solar-700',
                  )}
                >
                  {crumb.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className={dark ? 'text-navy-300' : 'text-ink-500'}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
