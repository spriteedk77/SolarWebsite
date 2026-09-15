import { z } from 'zod';
import { imageModel } from './models';

const text = z.string().min(1);
const https = z.url().refine((value) => value.startsWith('https://'));
export const serviceAreaModel = z.object({
  slug: text.regex(/^[a-z0-9-]+$/),
  name: text,
  nameEn: text,
  primary: z.boolean().default(false),
});

/** The exact shape the public website and every admin publisher agree on. */
export const companyModel = z.object({
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
  serviceAreas: z.array(serviceAreaModel).min(1),
  googleBusinessProfileUrl: https.optional().nullable(),
  googleMapsEmbedUrl: z.string().optional().nullable(),
});

export const settingsModel = z.object({
  homepageHeadline: text,
  homepageDescription: text,
  homepageServiceMessage: text,
  primaryCTA: text.max(50),
  secondaryCTA: text.max(50),
  footerInformation: text,
  heroImage: imageModel.optional().nullable(),
  historyBackground: imageModel.optional().nullable(),
  historyImagePosition: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.enum(['left', 'center', 'right']).default('left'),
  ),
  /** Kept read-only for a safe migration from the old field name. */
  executivePortrait: imageModel.optional().nullable(),
});
