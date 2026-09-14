'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/admin/config';

/**
 * The content admin, served from this site at /admin.
 *
 * A catch-all because the Studio routes itself: every pane, document and tab
 * is a path below /admin, and Next has to hand all of them to the same page.
 *
 * Client-side in full, for two reasons that both come from the config: it
 * loads `sanity`, which reaches for React context the server runtime does not
 * have, and it holds functions — the menu, the document actions — which cannot
 * be serialized across a server/client boundary. The Studio is a browser
 * application talking to Sanity directly, so there is nothing to render on the
 * server anyway. Route metadata lives in the layout, which is a server file.
 */
export default function AdminPage() {
  return <NextStudio config={config} />;
}
