import type { SiteInfoValues } from './model';

export type Field = {
  name: keyof SiteInfoValues;
  label: string;
  help?: string;
  multiline?: boolean;
  placeholder?: string;
};

export type FieldGroup = {
  id: string;
  title: string;
  description: string;
  fields: Field[];
};

/**
 * The form, in the order someone would fill it in.
 *
 * Labels are the ones already in the schema, so the short form and the document
 * editor call the same thing by the same name.
 */
export const fieldGroups: FieldGroup[] = [
  {
    id: 'contact',
    title: 'ช่องทางติดต่อ',
    description: 'แสดงบนหัวเว็บ ท้ายเว็บ หน้าติดต่อ และแถบล่างบนมือถือ',
    fields: [
      { name: 'phone', label: 'เบอร์โทรที่แสดง', placeholder: '095-697-1915' },
      {
        name: 'phoneE164',
        label: 'เบอร์โทรรูปแบบสากล',
        help: 'ใช้สำหรับปุ่มโทรออกและข้อมูลที่ Google อ่าน ขึ้นต้นด้วย +66 แล้วตัด 0 ตัวแรก',
        placeholder: '+66956971915',
      },
      { name: 'lineId', label: 'LINE ID', placeholder: '@np88solar' },
      {
        name: 'lineUrl',
        label: 'ลิงก์ LINE',
        placeholder: 'https://line.me/R/ti/p/@np88solar',
      },
      {
        name: 'facebookUrl',
        label: 'ลิงก์ Facebook',
        help: 'เว้นว่างได้ ถ้าเว้นว่างจะไม่แสดง Facebook ที่ไหนเลย',
      },
      {
        name: 'businessHours',
        label: 'เวลาทำการ',
        help: 'เว้นว่างไว้จนกว่าจะยืนยันเวลาจริง ห้ามเดา',
      },
      { name: 'googleBusinessProfileUrl', label: 'ลิงก์ Google Business Profile', help: 'เว้นว่างได้ ถ้ายังไม่มีลิงก์ที่ยืนยันแล้ว' },
      { name: 'googleMapsEmbedUrl', label: 'ลิงก์ฝัง Google Maps', help: 'เว้นว่างได้ หรือวาง URL ที่ได้จาก Share → Embed a map เท่านั้น' },
    ],
  },
  {
    id: 'identity',
    title: 'ชื่อและคำอธิบายบริษัท',
    description: 'ใช้ในหัวเว็บ ท้ายเว็บ และข้อมูลที่ Google กับ Facebook อ่าน',
    fields: [
      { name: 'companyName', label: 'ชื่อบริษัทที่แสดงบนเว็บ' },
      { name: 'legalName', label: 'ชื่อนิติบุคคล' },
      { name: 'tagline', label: 'สโลแกน' },
      { name: 'description', label: 'คำอธิบายบริษัท', multiline: true },
    ],
  },
  {
    id: 'address',
    title: 'ที่อยู่และพื้นที่ให้บริการ',
    description: 'แสดงบนหน้าติดต่อ ท้ายเว็บไซต์ และหน้าแรก',
    fields: [
      { name: 'street', label: 'เลขที่ หมู่ ถนน ตำบล' },
      { name: 'district', label: 'อำเภอ' },
      { name: 'province', label: 'จังหวัด' },
      { name: 'postalCode', label: 'รหัสไปรษณีย์' },
      {
        name: 'serviceAreas',
        label: 'พื้นที่ให้บริการ',
        help: 'กรอกชื่อจังหวัดและชื่ออังกฤษ ระบบจะสร้างรหัสภายในให้อัตโนมัติ',
        multiline: true,
      },
    ],
  },
  {
    id: 'homepage',
    title: 'ข้อความหน้าแรก',
    description: 'ส่วนบนสุดของหน้าแรก และข้อความท้ายเว็บไซต์',
    fields: [
      {
        name: 'homepageServiceMessage',
        label: 'ข้อความเล็กเหนือหัวเรื่อง',
        placeholder: 'CONTACT',
      },
      {
        name: 'homepageHeadline',
        label: 'หัวเรื่องหน้าแรก',
        help: 'กด Enter เพื่อขึ้นบรรทัดใหม่ได้',
        multiline: true,
      },
      { name: 'homepageDescription', label: 'คำอธิบายหน้าแรก', multiline: true },
      { name: 'primaryCTA', label: 'ข้อความปุ่มประเมินระบบ' },
      { name: 'secondaryCTA', label: 'ข้อความปุ่มดูผลงาน' },
      {
        name: 'footerInformation',
        label: 'คำอธิบายท้ายเว็บไซต์',
        multiline: true,
      },
    ],
  },
];
