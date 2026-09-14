import { z } from 'zod';

/**
 * The fields NP88 actually changes, and the rules they have to satisfy.
 *
 * Deliberately not every field in the schema: this is the short form for the
 * things that move — who to call, where to find them, what the homepage says.
 * Anything longer-form stays in the document editor, where it belongs.
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
  for (const key of SETTINGS_FIELDS) values[key] = str(settings?.[key]);
  return values as SiteInfoValues;
}

/**
 * What to write back, split by document.
 *
 * Only the fields this form owns are returned. Everything else on those
 * documents — service areas, the Google Business links, the approval flag — is
 * left exactly as it is, so editing a phone number cannot quietly drop a field
 * this form does not show.
 */
export function toPatches(values: SiteInfoValues): {
  company: Record<string, unknown>;
  settings: Record<string, unknown>;
} {
  const company: Record<string, unknown> = {};
  for (const key of COMPANY_FIELDS) company[key] = values[key].trim();
  company.address = Object.fromEntries(
    ADDRESS_FIELDS.map((key) => [key, values[key].trim()]),
  );

  const settings: Record<string, unknown> = {};
  for (const key of SETTINGS_FIELDS) settings[key] = values[key].trim();

  return { company, settings };
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
