import { Logo } from '@/components/brand/Logo';

/**
 * The company's own mark in the Studio's top bar, in place of the project name
 * Sanity shows by default.
 *
 * The site's own Logo component, not a second copy of it: same official
 * artwork, same rule that it is only ever scaled. `light` puts it on the white
 * plate it needs, because the Studio's top bar is now the site's navy and the
 * wordmark is navy on transparent.
 */
export function StudioLogo() {
  return <Logo variant="light" className="h-5 sm:h-5 lg:h-5" />;
}
