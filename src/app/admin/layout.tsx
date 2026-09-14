import type { Metadata, Viewport } from 'next';

/**
 * The Studio renders its own full-page shell — its own header, navigation and
 * theme — so it must not inherit the website's chrome. This layout replaces
 * the site layout for everything under /admin and adds nothing of its own.
 *
 * Nothing here is rendered per request: the page shell is identical for
 * everyone, and who may read or change anything is decided by the Sanity
 * login, not by this route.
 */
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'จัดการเนื้อหา — NP88 Solar',
  // Keep the admin out of search results. It is not a secret — the Studio
  // asks for a login — but it is not a page anyone should arrive at from
  // Google either.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
