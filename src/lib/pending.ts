/**
 * Content-confirmation register.
 *
 * The build rule for this site is: never invent customer names, locations,
 * prices, certifications, warranties, licences, approvals, partnership status,
 * installation counts or savings figures. Anything that came from marketing
 * material but has not been confirmed by NP88 Solar is registered here so it
 * can be reviewed in one place before launch.
 *
 * `npm run dev` prints this register to the server console on first render.
 */

export type ConfirmationStatus =
  /** Value is shown on the site but must be signed off before production. */
  | 'confirm-before-production'
  /** No value exists yet — a visible placeholder is rendered instead. */
  | 'missing';

export type PendingItem = {
  id: string;
  status: ConfirmationStatus;
  where: string;
  note: string;
};

/*
 * There is deliberately no "[awaiting confirmation]" placeholder string any
 * more. Unconfirmed content is not published with a caveat — it is not
 * published at all, and the page is written so its absence reads naturally.
 */

export const pendingRegister: PendingItem[] = [
  {
    id: 'site-count',
    status: 'confirm-before-production',
    where: 'Homepage trust section, About page',
    note:
      'แสดง "700+ ไซต์งาน" ตามสื่อประชาสัมพันธ์ชุดล่าสุด แต่สื่อชุดก่อนหน้าระบุ 600+ ' +
      'ต้องให้ NP88 Solar ยืนยันตัวเลขที่ถูกต้องและวันที่อ้างอิงก่อนขึ้นใช้งานจริง',
  },
  {
    id: 'project-shop-home-owner',
    status: 'confirm-before-production',
    where: '/projects/shop-home-178kw',
    note:
      'ชื่อลูกค้าและตำบล/อำเภอที่แน่นอนของโครงการ 178.56 kW (ระบุในสื่อว่าบริเวณห้างฉัตร ลำปาง) ' +
      'ต้องยืนยันก่อนเผยแพร่ รวมถึงการขออนุญาตใช้ชื่อลูกค้า',
  },
  {
    id: 'project-savings-figures',
    status: 'confirm-before-production',
    where: 'ทุกหน้าโครงการ',
    note:
      'ตัวเลขประหยัดต่อเดือน (120,000 / 24,000 / 14,000 บาท) นำมาจากสื่อประชาสัมพันธ์เดิม ' +
      'ต้องยืนยันสมมติฐานที่ใช้คำนวณ และแสดง disclaimer ทุกจุด (ทำแล้ว)',
  },
  {
    id: 'warranty-terms',
    status: 'confirm-before-production',
    where: '/projects/8items-clinic, /products',
    note:
      'ประกันอินเวอร์เตอร์ 10 ปี / แผง 12 ปี (ตัวสินค้า) 25 ปี (ประสิทธิภาพ) / งานติดตั้ง 3 ปี ' +
      'ระบุไว้ในสื่อของโครงการเฉพาะราย ห้ามนำไปใช้กับทุกสินค้าโดยอัตโนมัติ',
  },
  {
    id: 'home-package-promo',
    status: 'confirm-before-production',
    where: '/solar-home',
    note:
      'แพ็กเกจ SigenEnergy NEO 5 kW ราคา 259,000 บาท พร้อมฟรีประกันภัยตามเงื่อนไข ' +
      'ดูแลหลังการขาย 3 ปี ล้างแผง 3 ครั้ง — ต้องยืนยันว่ายังเป็นโปรโมชั่นปัจจุบันและวันหมดอายุ',
  },
  {
    id: 'opening-hours',
    status: 'missing',
    where: 'Footer, /contact, LocalBusiness structured data',
    note: 'ยังไม่มีเวลาทำการที่ยืนยัน — ยังไม่ใส่ openingHours ใน structured data',
  },
  {
    id: 'gbp-and-map',
    status: 'missing',
    where: '/contact',
    note:
      'ต้องการลิงก์ Google Business Profile และพิกัดแผนที่ที่ยืนยันแล้ว ' +
      '(ตั้งค่าผ่าน NEXT_PUBLIC_GBP_URL และ NEXT_PUBLIC_MAPS_EMBED_URL)',
  },
  {
    id: 'company-registration',
    status: 'missing',
    where: 'Footer, /about, /privacy',
    note:
      'เลขทะเบียนนิติบุคคล เลขประจำตัวผู้เสียภาษี ปีที่ก่อตั้ง และอีเมลติดต่อ (รวมถึงอีเมลสำหรับเรื่อง PDPA)',
  },
  {
    id: 'engineering-credentials',
    status: 'missing',
    where: '/about, Engineering section',
    note:
      'ใบอนุญาตประกอบวิชาชีพวิศวกรรม (กว.) ใบรับรอง หรือการขึ้นทะเบียนใด ๆ — ' +
      'ห้ามกล่าวอ้างจนกว่าจะได้รับเอกสารยืนยัน',
  },
  {
    id: 'photography',
    status: 'missing',
    where: 'ทั้งเว็บไซต์',
    note:
      'ต้องการภาพถ่ายงานติดตั้งจริงความละเอียดสูง (ดู docs/photo-brief.md) ' +
      'ระหว่างนี้ใช้ภาพ placeholder ที่ระบุชัดเจนว่ารอไฟล์จริง',
  },
];

let printed = false;

/** Logs the register once per server start, in development only. */
export function logPendingRegister() {
  if (printed || process.env.NODE_ENV === 'production') return;
  printed = true;
  const missing = pendingRegister.filter((i) => i.status === 'missing').length;
  const confirm = pendingRegister.length - missing;
  console.info(
    `\n[NP88 Solar] Content register: ${confirm} item(s) awaiting client confirmation, ` +
      `${missing} item(s) missing. See src/lib/pending.ts\n`,
  );
}
