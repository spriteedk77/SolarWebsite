import type { Metadata } from 'next';

/**
 * The admin sits outside the (site) group, so it never inherits the website's
 * header, footer or contact bar. It brings its own frame — see AdminShell.
 *
 * Nothing here is cached or prerendered: whether a request may see the form is
 * decided from its own cookie, every time.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'จัดการเนื้อหา — NP88 Solar',
  // Not a secret — it asks for a password — but not a page anyone should
  // arrive at from a search result either. robots.txt disallows it too.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
