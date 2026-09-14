/**
 * Schema.org builders.
 *
 * Rule: structured data may only assert facts that appear on the page and that
 * NP88 Solar has confirmed. No aggregateRating, no review markup, no awards,
 * no certifications, and no openingHours until real hours are supplied.
 */

import { site } from './site';
import { getSiteData } from '@/cms/site';
import { defaultSiteData, type SiteData } from './site-data';
import { absoluteUrl, DEFAULT_OG_PATH, socialImageUrl } from './seo';
import type { Article, Project } from '@/content/types';

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema(data: SiteData = defaultSiteData) {
  const { contact, site, serviceAreas } = data;
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalNameShort,
    alternateName: ['NP88 Engineering', 'เอ็นพี88 โซลาร์'],
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: contact.phoneE164,
    image: absoluteUrl(DEFAULT_OG_PATH),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo/np88-logo-square.png'),
      width: 1254,
      height: 1254,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.streetEn,
      addressLocality: contact.address.districtEn,
      addressRegion: contact.address.provinceEn,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    areaServed: serviceAreas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area.nameEn,
    })),
    knowsLanguage: ['th', 'en'],
    ...(contact.facebookUrl || contact.googleBusinessProfileUrl
      ? {
          sameAs: [
            contact.facebookUrl,
            contact.googleBusinessProfileUrl,
          ].filter(Boolean),
        }
      : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phoneE164,
      contactType: 'sales',
      areaServed: 'TH',
      availableLanguage: ['Thai', 'English'],
    },
    // openingHoursSpecification is intentionally omitted — hours are not confirmed.
  };
}

export function websiteSchema(data: SiteData = defaultSiteData) {
  const { site } = data;
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: 'th-TH',
    publisher: { '@id': ORG_ID },
  };
}

export async function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  const { serviceAreas } = await getSiteData();
  return {
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? 'Solar Rooftop design and installation',
    url: absoluteUrl(input.path),
    provider: { '@id': ORG_ID },
    areaServed: serviceAreas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area.nameEn,
    })),
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(article: Article) {
  const url = absoluteUrl(`/knowledge/${article.slug}`);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: 'th-TH',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.category,
    keywords: article.tags.join(', '),
    // Google rejects SVG here, so vector placeholders resolve to the PNG.
    image: socialImageUrl({ url: article.featuredImage.src }),
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Projects are described as CreativeWork rather than Product — they are
 * completed installations, not items for sale, and carry no price or rating.
 */
export function projectSchema(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    description: project.summary,
    url,
    inLanguage: 'th-TH',
    datePublished: project.publishedAt,
    image: socialImageUrl({ url: project.gallery[0]?.src ?? DEFAULT_OG_PATH }),
    creator: { '@id': ORG_ID },
    locationCreated: {
      '@type': 'Place',
      name: project.location,
      address: {
        '@type': 'PostalAddress',
        addressRegion: project.province,
        addressCountry: 'TH',
      },
    },
    about: {
      '@type': 'Thing',
      name: `ระบบ Solar Rooftop ขนาด ${project.systemCapacityKw} kW`,
    },
  };
}

/** Wraps one or more nodes into a single @graph document. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
