/**
 * Content loaders.
 *
 * Every page reads content through these functions rather than importing the
 * Thai data files directly. That gives us two things:
 *
 *  1. Locale fallback — when English content is added under `src/content/en/`,
 *     these loaders resolve it and fall back to Thai for anything untranslated.
 *  2. A single seam for a CMS — replacing the bodies of these functions with
 *     CMS queries requires no change to any page or component.
 *
 * They are async on purpose, so that swap does not become a breaking change.
 */

import { defaultLocale, type Locale } from '@/lib/i18n';
import type { Article, Faq, Product, Project, Solution, BusinessType } from './types';

import { projects as thProjects } from './th/projects';
import { articles as thArticles } from './th/articles';
import { products as thProducts, brands as thBrands } from './th/products';
import { solutions as thSolutions, businessTypes as thBusinessTypes } from './th/solutions';
import { faqs as thFaqs } from './th/faqs';

type Bundle = {
  projects: Project[];
  articles: Article[];
  products: Product[];
  solutions: Solution[];
  businessTypes: BusinessType[];
  faqs: Faq[];
  brands: readonly string[];
};

const bundles: Partial<Record<Locale, Bundle>> = {
  th: {
    projects: thProjects,
    articles: thArticles,
    products: thProducts,
    solutions: thSolutions,
    businessTypes: thBusinessTypes,
    faqs: thFaqs,
    brands: thBrands,
  },
  // en: { … } — add when English content ships.
};

function bundle(locale: Locale): Bundle {
  return bundles[locale] ?? bundles[defaultLocale]!;
}

const byNewest = <T extends { publishedAt: string }>(a: T, b: T) =>
  b.publishedAt.localeCompare(a.publishedAt);

/* ----------------------------------- projects ---------------------------- */

export async function getProjects(locale: Locale = defaultLocale): Promise<Project[]> {
  return [...bundle(locale).projects].sort(byNewest);
}

export async function getFeaturedProjects(
  locale: Locale = defaultLocale,
  limit = 4,
): Promise<Project[]> {
  const all = await getProjects(locale);
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProject(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<Project | undefined> {
  return bundle(locale).projects.find((p) => p.slug === slug);
}

/* ----------------------------------- articles ---------------------------- */

export async function getArticles(locale: Locale = defaultLocale): Promise<Article[]> {
  return [...bundle(locale).articles].sort(byNewest);
}

export async function getArticle(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<Article | undefined> {
  return bundle(locale).articles.find((a) => a.slug === slug);
}

export async function getRelatedArticles(
  slugs: string[] | undefined,
  locale: Locale = defaultLocale,
  limit = 3,
): Promise<Article[]> {
  const all = await getArticles(locale);
  if (!slugs?.length) return all.slice(0, limit);
  const picked = slugs
    .map((s) => all.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));
  return picked.slice(0, limit);
}

/* ----------------------------------- products ---------------------------- */

export async function getProducts(locale: Locale = defaultLocale): Promise<Product[]> {
  return bundle(locale).products;
}

export async function getBrands(locale: Locale = defaultLocale): Promise<readonly string[]> {
  return bundle(locale).brands;
}

/* ---------------------------------- solutions ---------------------------- */

export async function getSolutions(locale: Locale = defaultLocale): Promise<Solution[]> {
  return bundle(locale).solutions;
}

export async function getBusinessTypes(locale: Locale = defaultLocale): Promise<BusinessType[]> {
  return bundle(locale).businessTypes;
}

/* ------------------------------------- faqs ------------------------------ */

export async function getFaqs(locale: Locale = defaultLocale): Promise<Faq[]> {
  return bundle(locale).faqs;
}
