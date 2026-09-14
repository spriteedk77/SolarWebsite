import 'server-only';
import { cache } from 'react';
import { z } from 'zod';
import { defaultSiteData, type SiteData } from '@/lib/site-data';
import { queryPublished, usesSanity } from './client';

const text = z.string().min(1);
const https = z.url().refine((value) => value.startsWith('https://'));
const area = z.object({
  slug: text.regex(/^[a-z0-9-]+$/),
  name: text,
  nameEn: text,
  primary: z.boolean().default(false),
});
const company = z.object({
  companyName: text,
  legalName: text,
  tagline: text,
  description: text,
  phone: text,
  phoneE164: text.regex(/^\+[1-9]\d{7,14}$/),
  lineId: text,
  lineUrl: https,
  facebookUrl: https.optional().nullable(),
  businessHours: z.string().optional().nullable(),
  address: z.object({
    street: text,
    district: text,
    province: text,
    postalCode: text,
    country: text,
    countryName: text,
  }),
  serviceAreas: z.array(area).min(1),
  googleBusinessProfileUrl: https.optional().nullable(),
  googleMapsEmbedUrl: z.string().optional().nullable(),
});
const settings = z.object({
  homepageHeadline: text,
  homepageDescription: text,
  homepageServiceMessage: text,
  primaryCTA: text.max(50),
  secondaryCTA: text.max(50),
  footerInformation: text,
});

export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!usesSanity()) return defaultSiteData;
  const result = await queryPublished<{
    company: unknown;
    settings: unknown;
  }>(`{
    "company": *[_type == "company" && approvedForPublication == true && _id == "company"][0]{companyName,legalName,tagline,description,phone,phoneE164,lineId,lineUrl,facebookUrl,businessHours,address,serviceAreas,googleBusinessProfileUrl,googleMapsEmbedUrl},
    "settings": *[_type == "siteSettings" && approvedForPublication == true && _id == "siteSettings"][0]{homepageHeadline,homepageDescription,homepageServiceMessage,primaryCTA,secondaryCTA,footerInformation}
  }`);
  const c = company.parse(result.company);
  const s = settings.parse(result.settings);
  const addressLines = [
    c.address.street,
    `${c.address.district} จังหวัด${c.address.province} ${c.address.postalCode}`,
  ];
  return {
    site: {
      ...defaultSiteData.site,
      name: c.companyName,
      legalName: c.legalName,
      legalNameShort: c.legalName,
      tagline: c.tagline,
      description: c.description,
    },
    contact: {
      ...defaultSiteData.contact,
      phone: c.phone,
      phoneE164: c.phoneE164,
      phoneHref: `tel:${c.phoneE164}`,
      lineId: c.lineId,
      lineUrl: c.lineUrl,
      facebookUrl: c.facebookUrl || '',
      businessHours: c.businessHours || '',
      address: {
        ...c.address,
        streetEn: c.address.street,
        districtEn: c.address.district,
        provinceEn: c.address.province,
      },
      addressLines,
      googleBusinessProfileUrl: c.googleBusinessProfileUrl || '',
      googleMapsEmbedUrl: isGoogleMapsEmbed(c.googleMapsEmbedUrl)
        ? c.googleMapsEmbedUrl!
        : '',
    },
    serviceAreas: c.serviceAreas,
    cta: {
      ...defaultSiteData.cta,
      primary: s.primaryCTA,
      projects: s.secondaryCTA,
      phone: `โทร ${c.phone}`,
      line: `LINE ${c.lineId}`,
    },
    homepage: {
      headline: s.homepageHeadline,
      description: s.homepageDescription,
      serviceMessage: s.homepageServiceMessage,
    },
    footerInformation: s.footerInformation,
  };
});

export function isGoogleMapsEmbed(value?: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      ['www.google.com', 'maps.google.com'].includes(url.hostname) &&
      url.pathname.startsWith('/maps/embed')
    );
  } catch {
    return false;
  }
}
