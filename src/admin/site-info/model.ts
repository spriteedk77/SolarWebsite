import { z } from 'zod';
import { defaultSiteData } from '@/lib/site-data';

/**
 * The fields NP88 actually changes, and the rules they have to satisfy.
 *
 * The short form owns every company/contact/homepage field used publicly;
 * longer editorial content stays in its dedicated article/project editor.
 *
 * The shape below is the same one src/cms/site.ts validates when the website
 * reads it back, so a value this form accepts cannot be one the site then
 * refuses to render.
 */

const required = (label: string) => z.string().trim().min(1, `กรุณากรอก${label}`);
const httpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), {
      message: `${label} ต้องขึ้นต้นด้วย https://`,
    });

export const siteInfoSchema = z.object({
  // — ช่องทางติดต่อ —
  phone: required('เบอร์โทร'),
  phoneE164: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, 'ต้องเป็นรูปแบบสากล เช่น +66956971915'),
  lineId: required('LINE ID'),
  lineUrl: httpsUrl('ลิงก์ LINE').refine((v) => v !== '', {
    message: 'กรุณากรอกลิงก์ LINE',
  }),
  facebookUrl: httpsUrl('ลิงก์ Facebook'),
  businessHours: z.string().trim(),
  googleBusinessProfileUrl: httpsUrl('ลิงก์ Google Business'),
  googleMapsEmbedUrl: httpsUrl('ลิงก์แผนที่ฝัง').refine((value) => {
    if (!value) return true;
    try { const url = new URL(value); return ['www.google.com', 'maps.google.com'].includes(url.hostname) && url.pathname.startsWith('/maps/embed'); }
    catch { return false; }
  }, 'ต้องใช้ลิงก์ Embed map จาก Google Maps'),

  // — ชื่อและคำอธิบาย —
  companyName: required('ชื่อบริษัทที่แสดง'),
  legalName: required('ชื่อนิติบุคคล'),
  tagline: required('สโลแกน'),
  description: required('คำอธิบายบริษัท'),

  // — ที่อยู่ —
  street: required('เลขที่ หมู่ ถนน ตำบล'),
  district: required('อำเภอ'),
  province: required('จังหวัด'),
  postalCode: required('รหัสไปรษณีย์'),
  serviceAreas: z
    .string()
    .trim()
    .min(1, 'กรุณากรอกพื้นที่ให้บริการอย่างน้อย 1 จังหวัด')
    .superRefine((value, context) => {
      const lines = value.split(/\r?\n/).filter((line) => line.trim());
      const slugs = new Set<string>();
      for (const [index, line] of lines.entries()) {
        const parts = line.split('|').map((part) => part.trim());
        if (parts.length < 3 || parts.length > 4 || parts.slice(0, 3).some((part) => !part)) {
          context.addIssue({
            code: 'custom',
            message: `พื้นที่ลำดับที่ ${index + 1} ต้องมีชื่อจังหวัดและชื่ออังกฤษ`,
          });
          continue;
        }
        const slug = parts[2];
        if (!/^[a-z0-9-]+$/.test(slug))
          context.addIssue({
            code: 'custom',
            message: `ระบบสร้างชื่อในลิงก์ของพื้นที่ลำดับที่ ${index + 1} ไม่สำเร็จ กรุณาตรวจชื่ออังกฤษ`,
          });
        if (slugs.has(slug))
          context.addIssue({ code: 'custom', message: `ชื่ออังกฤษของพื้นที่ลำดับที่ ${index + 1} ซ้ำกับจังหวัดอื่น` });
        slugs.add(slug);
      }
    }),

  // — หน้าแรก —
  homepageHeadline: required('หัวเรื่องหน้าแรก'),
  homepageDescription: required('คำอธิบายหน้าแรก'),
  homepageServiceMessage: required('ข้อความเหนือหัวเรื่อง'),
  primaryCTA: required('ข้อความปุ่มประเมินระบบ').max(
    50,
    'ปุ่มยาวเกิน 50 ตัวอักษร จะตกบรรทัด',
  ),
  secondaryCTA: required('ข้อความปุ่มดูผลงาน').max(
    50,
    'ปุ่มยาวเกิน 50 ตัวอักษร จะตกบรรทัด',
  ),
  footerInformation: required('คำอธิบายท้ายเว็บไซต์'),
});

export type SiteInfoValues = z.infer<typeof siteInfoSchema>;

/** Which document each field is stored on. */
const COMPANY_FIELDS = [
  'phone',
  'phoneE164',
  'lineId',
  'lineUrl',
  'facebookUrl',
  'businessHours',
  'googleBusinessProfileUrl',
  'googleMapsEmbedUrl',
  'companyName',
  'legalName',
  'tagline',
  'description',
] as const;

const ADDRESS_FIELDS = ['street', 'district', 'province', 'postalCode'] as const;

const SETTINGS_FIELDS = [
  'homepageHeadline',
  'homepageDescription',
  'homepageServiceMessage',
  'primaryCTA',
  'secondaryCTA',
  'footerInformation',
] as const;

type Doc = Record<string, unknown> | null | undefined;

const str = (value: unknown): string =>
  typeof value === 'string' ? value : '';

/** Form values from whatever the two documents currently hold. */
export function fromDocuments(company: Doc, settings: Doc): SiteInfoValues {
  const address = (company?.address ?? {}) as Record<string, unknown>;
  const values = {} as Record<string, string>;
  for (const key of COMPANY_FIELDS) values[key] = str(company?.[key]);
  for (const key of ADDRESS_FIELDS) values[key] = str(address[key]);
  values.serviceAreas = formatServiceAreas(company?.serviceAreas);
  for (const key of SETTINGS_FIELDS) values[key] = str(settings?.[key]);
  return values as SiteInfoValues;
}

/**
 * What to write back, split by document.
 *
 * Only the fields this form owns are returned. Everything else on those
 * documents — images, country metadata and the approval flag — is
 * left exactly as it is, so editing a phone number cannot quietly drop a field
 * this form does not show.
 */
export function toPatches(values: SiteInfoValues): {
  company: Record<string, unknown>;
  settings: Record<string, unknown>;
} {
  const company: Record<string, unknown> = {};
  for (const key of COMPANY_FIELDS) {
    const value = values[key].trim();
    company[key] = ['facebookUrl', 'googleBusinessProfileUrl', 'googleMapsEmbedUrl'].includes(key) && !value ? null : value;
  }
  // One key per address line rather than one `address` object. Writing the
  // object would replace it, and it holds two fields this form does not show —
  // the country code and its name — which the website requires and which a
  // save would otherwise silently delete.
  for (const key of ADDRESS_FIELDS)
    company[`address.${key}`] = values[key].trim();
  company.serviceAreas = parseServiceAreas(values.serviceAreas);

  const settings: Record<string, unknown> = {};
  for (const key of SETTINGS_FIELDS) settings[key] = values[key].trim();

  return { company, settings };
}

type ServiceArea = { name: string; nameEn: string; slug: string; primary: boolean };

function formatServiceAreas(value: unknown): string {
  if (!Array.isArray(value)) return '';
  return value
    .filter((area): area is Record<string, unknown> => Boolean(area) && typeof area === 'object')
    .map((area) =>
      [str(area.name), str(area.nameEn), str(area.slug), area.primary ? 'หลัก' : ''].join(' | ').replace(/ \| $/, ''),
    )
    .join('\n');
}

export function parseServiceAreas(value: string): ServiceArea[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, nameEn, , primary = ''] = line.split('|').map((part) => part.trim());
      return { name, nameEn, slug: createServiceAreaSlug(nameEn), primary: ['หลัก', 'yes', 'true', '1'].includes(primary.toLowerCase()) };
    });
}

/** Internal route key; staff never need to know or type this value. */
export function createServiceAreaSlug(nameEn: string): string {
  return nameEn
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Address fields the form does not show but the website cannot render without.
 *
 * Written only where they are absent, which is repair rather than content: an
 * earlier version of this form replaced the whole address object and dropped
 * them, and the values are the ones this repository has always shipped.
 */
export function requiredAddressDefaults(): Record<string, unknown> {
  const { country, countryName } = defaultSiteData.contact.address;
  return { 'address.country': country, 'address.countryName': countryName };
}

/** Field errors keyed by field name, or null when the values are usable. */
export function validate(
  values: SiteInfoValues,
): Partial<Record<keyof SiteInfoValues, string>> | null {
  const result = siteInfoSchema.safeParse(values);
  if (result.success) return null;
  const errors: Partial<Record<keyof SiteInfoValues, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof SiteInfoValues;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
