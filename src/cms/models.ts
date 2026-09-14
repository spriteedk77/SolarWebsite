import { z } from 'zod';

const text = z.string().min(1);
const optionalText = z
  .string()
  .nullish()
  .transform((value) => value || undefined);
export const imageModel = z.object({
  src: text.refine(
    (value) =>
      value.startsWith('/images/') ||
      /^https:\/\/cdn\.sanity\.io\/images\//.test(value),
  ),
  alt: text,
  width: z.number().positive(),
  height: z.number().positive(),
  caption: optionalText,
  placeholder: z.boolean().optional(),
});
export const richBlockModel = z
  .object({ _type: text, _key: z.string().optional() })
  .passthrough();
export type RichBlock = z.infer<typeof richBlockModel>;
const common = {
  id: text,
  slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  summary: text,
  publishedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  seoTitle: optionalText,
  seoDescription: optionalText,
  richContent: z.array(richBlockModel).min(1),
};
export const projectModel = z.object({
  ...common,
  customerName: optionalText,
  customerType: z
    .enum([
      'residential',
      'sme',
      'restaurant',
      'shop',
      'clinic',
      'office',
      'warehouse',
      'factory',
      'commercial',
    ])
    .optional()
    .nullable()
    .transform((v) => v || undefined),
  location: text,
  province: text,
  systemCapacityKw: z.number().positive(),
  phase: z.enum(['1 เฟส', '3 เฟส']),
  solarPanel: text,
  panelQuantity: z.number().int().positive(),
  inverter: optionalText,
  battery: optionalText,
  optimizer: optionalText,
  systemType: text,
  zeroExport: z.boolean().default(false),
  monitoring: optionalText,
  estimatedSavingsThbPerMonth: z
    .number()
    .nonnegative()
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
  gallery: z.array(imageModel).min(1),
  featured: z.boolean().default(false),
  standards: z
    .array(z.string())
    .nullish()
    .transform((v) => v ?? undefined),
  servicesIncluded: z
    .array(z.string())
    .nullish()
    .transform((v) => v ?? undefined),
  warranty: z
    .array(z.object({ label: text, value: text, note: optionalText }))
    .nullish()
    .transform((v) => v ?? undefined),
});
export const ARTICLE_CATEGORIES = [
  'พื้นฐาน Solar',
  'สำหรับบ้าน',
  'สำหรับธุรกิจ',
  'เทคโนโลยี',
  'ความคุ้มค่า',
  'ในพื้นที่ภาคเหนือ',
] as const;
export const articleModel = z.object({
  ...common,
  category: z.enum(ARTICLE_CATEGORIES),
  tags: z.array(z.string()).default([]),
  featuredImage: imageModel,
  author: optionalText,
  featured: z.boolean().default(false),
  related: z
    .array(z.string())
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  faq: z
    .array(z.object({ question: text, answer: text }))
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
});
export const promotionModel = z.object({
  slug: text,
  title: text,
  price: z.number().nonnegative(),
  systemSize: z.number().positive(),
  phase: text,
  solarPanel: text,
  panelQuantity: z.number().int().positive(),
  battery: optionalText,
  includedServices: z.array(text),
  terms: text,
  image: imageModel.optional().nullable(),
  active: z.boolean(),
  startDate: z.iso.datetime().nullish(),
  endDate: z.iso.datetime().nullish(),
});
export type Promotion = z.infer<typeof promotionModel>;
export function isActivePromotion(p: Promotion, now = new Date()): boolean {
  return (
    p.active &&
    (!p.startDate || Date.parse(p.startDate) <= now.getTime()) &&
    (!p.endDate || Date.parse(p.endDate) > now.getTime())
  );
}

/** Never allow editor links to execute script or escape into protocol-relative URLs. */
export function safeContentHref(value: unknown): string | undefined {
  if (typeof value !== 'string' || /[\u0000-\u0020\\]/.test(value))
    return undefined;
  if (/^\/(?!\/)/.test(value) || value.startsWith('#')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
