/**
 * Localisation scaffolding.
 *
 * Thai is the production language and is served from the root path (`/`,
 * `/projects`, …). English is not built yet, but every layer of the site is
 * already locale-aware so it can be added without restructuring:
 *
 *   1. UI chrome strings live in `src/content/<locale>/ui.ts`.
 *   2. Editorial content lives in `src/content/<locale>/{projects,articles,…}.ts`
 *      and is read through the loaders in `src/content/index.ts`, which fall
 *      back to Thai for anything not yet translated.
 *   3. Pages take an optional `locale` and build their metadata through
 *      `buildMetadata()`, which emits `alternates.languages` automatically.
 *
 * To add English later: create `src/content/en/*`, move the current route files
 * into `src/app/[locale]/` (or add an `/en` route group that renders the same
 * page components with `locale="en"`), and flip `enabledLocales`.
 */

export const locales = ['th', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'th';

/** Locales that are actually built and linked. Add 'en' when EN content ships. */
export const enabledLocales: Locale[] = ['th'];

export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string }> = {
  th: { htmlLang: 'th', ogLocale: 'th_TH', label: 'ไทย' },
  en: { htmlLang: 'en', ogLocale: 'en_US', label: 'English' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Path prefix for a locale. Thai is served at the root, so it has none. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/** Builds a href for a route in a given locale. */
export function localeHref(path: string, locale: Locale = defaultLocale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `${localePrefix(locale)}${clean === '/' ? '' : clean}` || '/';
}
