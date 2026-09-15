import { z } from 'zod';

const required = (label: string) => z.string().trim().min(1, `กรุณากรอก${label}`);
const optional = z.string().trim();

export const CUSTOMER_TYPES = [
  ['residential', 'บ้าน'], ['sme', 'ธุรกิจ SME'], ['restaurant', 'ร้านอาหาร'],
  ['shop', 'ร้านค้า'], ['clinic', 'คลินิก'], ['office', 'สำนักงาน'],
  ['warehouse', 'คลังสินค้า'], ['factory', 'โรงงาน'], ['commercial', 'อาคารพาณิชย์'],
] as const;

export const projectFieldsModel = z.object({
  title: required('ชื่อโครงการ'),
  slug: optional.refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), 'URL ไม่ถูกต้อง'),
  summary: required('คำอธิบายย่อ'),
  customerName: optional,
  customerType: z.enum(CUSTOMER_TYPES.map(([value]) => value) as [typeof CUSTOMER_TYPES[number][0], ...typeof CUSTOMER_TYPES[number][0][]]).or(z.literal('')),
  location: required('สถานที่'),
  province: required('จังหวัด'),
  systemCapacity: z.coerce.number().positive('กำลังติดตั้งต้องมากกว่า 0'),
  phase: z.enum(['1 เฟส', '3 เฟส']),
  solarPanels: required('รุ่นแผง Solar'),
  panelQuantity: z.coerce.number().int().positive('จำนวนแผงต้องเป็นจำนวนเต็มมากกว่า 0'),
  inverter: optional,
  battery: optional,
  optimizer: optional,
  systemType: required('ประเภทระบบ'),
  zeroExport: z.boolean(),
  monitoring: optional,
  estimatedSavings: z.union([z.literal(''), z.coerce.number().nonnegative('ผลประหยัดต้องไม่ติดลบ')]),
  standards: z.string(),
  servicesIncluded: z.string(),
  warranty: z.string(),
  publishedAt: required('วันที่เผยแพร่'),
  seoTitle: optional.max(100, 'ชื่อสำหรับ Google ยาวเกิน 100 ตัวอักษร'),
  seoDescription: optional.max(240, 'คำอธิบายสำหรับ Google ยาวเกิน 240 ตัวอักษร'),
  featured: z.boolean(),
});

export function lines(value: string) {
  return [...new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))];
}

export function warranties(value: string) {
  return lines(value).map((line) => {
    const [label = '', detail = '', note = ''] = line.split('|').map((part) => part.trim());
    return { label, value: detail, ...(note ? { note } : {}) };
  }).filter((item) => item.label && item.value);
}

export function warrantyText(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value.map((item) => {
    const row = item as { label?: string; value?: string; note?: string };
    return [row.label, row.value, row.note].filter(Boolean).join(' | ');
  }).join('\n');
}
