import type { IconName } from '../types';

/** Reusable page copy blocks that are shared across several routes. */

export type Step = {
  number: string;
  title: string;
  body: string;
  icon: IconName;
};

/* The four-step "approach" list that used to live here was a shortened copy of
   `processSteps` below. The homepage now shows the steps once, in the process
   section, and states the argument separately. */

/** Factors weighed during design — supports the "why NP88" section. */
export const designFactors = [
  'พื้นที่หลังคาที่ใช้ได้จริง',
  'รูปแบบการใช้ไฟในแต่ละช่วงเวลา',
  'ค่าไฟและโครงสร้างอัตราค่าไฟ',
  'เป้าหมายด้านต้นทุนของเจ้าของ',
  'ระบบไฟฟ้าเดิมของอาคาร',
  'การใช้งานและการดูแลในระยะยาว',
];

/** Section 8 — end-to-end process. */
export const processSteps: Step[] = [
  {
    number: '01',
    title: 'ส่งบิลค่าไฟและข้อมูลพื้นที่',
    body: 'ส่งบิลค่าไฟย้อนหลังและรูปหลังคาผ่าน LINE หรือแบบฟอร์มบนเว็บไซต์ ขั้นตอนนี้ยังไม่มีค่าใช้จ่าย',
    icon: 'analysis',
  },
  {
    number: '02',
    title: 'วิเคราะห์การใช้พลังงาน',
    body: 'ทีมงานวิเคราะห์ปริมาณและช่วงเวลาการใช้ไฟ เพื่อประเมินว่าระบบแบบใดและขนาดเท่าใดจึงเหมาะสม',
    icon: 'value',
  },
  {
    number: '03',
    title: 'สำรวจหน้างาน',
    body: 'เข้าตรวจสอบหลังคา โครงสร้าง ระบบไฟฟ้า และเงาบังจริง เพื่อยืนยันข้อมูลก่อนออกแบบ',
    icon: 'survey',
  },
  {
    number: '04',
    title: 'ออกแบบระบบและประเมินความคุ้มค่า',
    body: 'จัดทำแบบระบบ รายการอุปกรณ์ และตัวเลขความคุ้มค่าพร้อมสมมติฐานที่ใช้คำนวณ',
    icon: 'design',
  },
  {
    number: '05',
    title: 'ติดตั้งและดำเนินการด้านเอกสาร',
    body: 'ติดตั้งตามแบบที่ออกแบบไว้ พร้อมดำเนินการด้านเอกสารการขออนุญาตที่เกี่ยวข้อง',
    icon: 'install',
  },
  {
    number: '06',
    title: 'Monitoring และบริการหลังการขาย',
    body: 'ส่งมอบพร้อมระบบติดตามการผลิตไฟ และดูแลระบบต่อเนื่องตามขอบเขตที่ตกลงไว้',
    icon: 'support',
  },
];

/**
 * Engineering credibility. Claims are limited to work scope only.
 *
 * Ordered so the first four are the points that appear nowhere else on the
 * homepage — the sections above already cover load-based sizing, Zero Export,
 * monitoring and after-sales, so those sit later and show on the deeper pages.
 */
export const engineeringPoints: { title: string; body: string }[] = [
  {
    title: 'งานระบบไฟฟ้า',
    body: 'พิจารณาจุดเชื่อมต่อกับระบบเดิม การแบ่งวงจร และอุปกรณ์ป้องกันทั้งฝั่ง DC และ AC ให้สอดคล้องกับระบบไฟฟ้าของอาคาร',
  },
  {
    title: 'โครงสร้างและหลังคา',
    body: 'ตรวจสอบชนิดหลังคา สภาพวัสดุ และการรับน้ำหนัก ก่อนกำหนดรูปแบบการยึดจับและตำแหน่งจุดยึด',
  },
  {
    title: 'การเลือกขนาดอินเวอร์เตอร์',
    body: 'คำนวณอัตราส่วนระหว่างกำลังผลิตของแผงกับกำลังของอินเวอร์เตอร์ และจำนวนแผงต่อสตริงให้อยู่ในช่วงที่เหมาะสม',
  },
  {
    title: 'การเดินสายและความปลอดภัย',
    body: 'ออกแบบเส้นทางเดินสาย การป้องกันสายจากแสงแดด และจุดตัดตอนที่เข้าถึงได้สำหรับงานบำรุงรักษา',
  },
  {
    title: 'Zero Export เมื่อจำเป็น',
    body: 'ติดตั้งและตั้งค่าระบบควบคุมไม่ให้ไฟไหลย้อนเข้าระบบจำหน่าย สำหรับงานที่มีเงื่อนไขดังกล่าว',
  },
  {
    title: 'ระบบติดตามการผลิตไฟ',
    body: 'ติดตั้ง Monitoring เพื่อให้เจ้าของระบบตรวจสอบผลการทำงานได้ด้วยตนเอง ไม่ต้องรอดูจากบิลค่าไฟ',
  },
  {
    title: 'บริการหลังการขาย',
    body: 'ดูแลต่อเนื่องหลังส่งมอบ ตามขอบเขตและเงื่อนไขที่ระบุไว้ในแต่ละโครงการ',
  },
];

/**
 * Residential promotional package.
 * ⚠️ ทุกค่าต้องยืนยันกับ NP88 Solar ก่อนเผยแพร่ (ดู pendingRegister: home-package-promo)
 */
export const homePackage = {
  name: 'SigenEnergy NEO',
  capacity: '5 kW 1 เฟส',
  panels: 'AIKO 670W จำนวน 8 แผง',
  battery: 'แบตเตอรี่ความจุ 7.52 kWh',
  priceThb: 259000,
  includes: [
    'ฟรีประกันภัยตามเงื่อนไข',
    'บริการหลังการขาย 3 ปี',
    'บริการล้างแผง 3 ครั้ง',
  ],
} as const;

/** Customer segments served — used in the trust section. */
export const segments = [
  'บ้านพักอาศัย',
  'ธุรกิจ SME',
  'ร้านค้า',
  'ร้านอาหาร',
  'คลินิก',
  'สำนักงาน',
  'โรงงาน',
  'คลังสินค้า',
  'อาคารพาณิชย์',
];
