import { SiteShell } from '@/components/layout/SiteShell';

/**
 * The website's pages.
 *
 * A route group, so it adds no URL segment — /contact is still /contact. It
 * exists so the site's chrome has somewhere to live that /admin is not inside
 * of: the content Studio needs the whole window, with no header above it.
 */
export const revalidate = 60;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
