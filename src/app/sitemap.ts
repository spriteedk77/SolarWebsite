import type { MetadataRoute } from 'next';
import { getArticles, getProjects } from '@/content';
import { site } from '@/lib/site';

/**
 * XML sitemap.
 *
 * Static routes are listed explicitly with hand-set priorities (the conversion
 * path ranks highest); project and article routes are generated from the same
 * content loaders the pages use, so the sitemap cannot drift from the site.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
    { url: '/', priority: 1, changeFrequency: 'monthly' },
    { url: '/quote', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/solar-business', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/solar-home', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/projects', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/solutions', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/knowledge', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/products', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/about', priority: 0.6, changeFrequency: 'yearly' },
    { url: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
      { url: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
    ] satisfies { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[]
  ).map((route) => ({ ...route, url: `${site.url}${route.url}`, lastModified: now }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(project.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}/knowledge/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
