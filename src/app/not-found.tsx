import { SiteShell } from '@/components/layout/SiteShell';
import { NotFoundContent } from '@/components/layout/NotFoundContent';

/**
 * A URL that matches no route at all lands here, outside the (site) group, so
 * this one has to bring the site's chrome with it.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
