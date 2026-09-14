/**
 * Single source of truth for NP88 Solar's NAP (name / address / phone) data,
 * navigation and contact channels.
 *
 * ⚠️ CONTENT RULE: nothing in this file may be invented. Every value here is
 * taken from material supplied by NP88 Solar. Anything unconfirmed is marked
 * with `PENDING` (see `src/lib/pending.ts`) and must be signed off before the
 * site goes to production.
 */

export const site = {
  name: 'NP88 Solar',
  legalName: 'บริษัท เอ็นพี88 เอ็นจิเนียริ่ง จำกัด (NP88 Engineering Co., Ltd.)',
  legalNameShort: 'NP88 Engineering Co., Ltd.',
  tagline: 'Engineering Your Energy Future.',
  description:
    'NP88 Solar ให้บริการสำรวจ วิเคราะห์ ออกแบบ และติดตั้งระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน ในเชียงใหม่ ลำพูน ลำปาง เชียงราย และพะเยา',

  /** Override with NEXT_PUBLIC_SITE_URL once the production domain is live. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.np88solar.com',

  locale: 'th_TH',
  language: 'th',
} as const;

export const contact = {
  phone: '095-697-1915',
  /** E.164 for tel: links and structured data. */
  phoneE164: '+66956971915',
  phoneHref: 'tel:+66956971915',

  lineId: '@np88solar',
  lineUrl: 'https://line.me/R/ti/p/@np88solar',

  /** Replace with the address NP88 Solar uses on invoices if it differs. */
  address: {
    street: '52/4 หมู่ 8 ตำบลบ้านแม',
    streetEn: '52/4 Moo 8, Ban Mae Subdistrict',
    district: 'อำเภอสันป่าตอง',
    districtEn: 'San Pa Tong District',
    province: 'เชียงใหม่',
    provinceEn: 'Chiang Mai',
    postalCode: '50120',
    country: 'TH',
    countryName: 'ประเทศไทย',
  },

  addressLines: [
    '52/4 หมู่ 8 ตำบลบ้านแม',
    'อำเภอสันป่าตอง จังหวัดเชียงใหม่ 50120',
  ],

  /** Set once the Google Business Profile / Maps place is confirmed. */
  googleBusinessProfileUrl: process.env.NEXT_PUBLIC_GBP_URL || '',
  googleMapsEmbedUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL || '',
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    'https://www.facebook.com/share/1BMxmsmdZK/?mibextid=wwXIfr',
} as const;

/**
 * Year shown in the footer copyright line.
 *
 * Every page is statically prerendered, so `new Date()` at render time would be
 * frozen at build time and silently go stale on 1 January. An explicit constant
 * makes that visible: bump it as part of the release checklist, or wire it to a
 * build-time env var if releases become less frequent than yearly.
 */
export const copyrightYear = Number(process.env.NEXT_PUBLIC_COPYRIGHT_YEAR) || 2026;

/** Provinces NP88 Solar serves, used for local SEO and the quote form. */
export const serviceAreas = [
  { slug: 'chiang-mai', name: 'เชียงใหม่', nameEn: 'Chiang Mai', primary: true },
  { slug: 'lamphun', name: 'ลำพูน', nameEn: 'Lamphun', primary: false },
  { slug: 'chiang-rai', name: 'เชียงราย', nameEn: 'Chiang Rai', primary: false },
  { slug: 'lampang', name: 'ลำปาง', nameEn: 'Lampang', primary: false },
  { slug: 'phayao', name: 'พะเยา', nameEn: 'Phayao', primary: false },
] as const;

export type NavItem = {
  href: string;
  label: string;
  /** Short description shown in the mobile menu. */
  hint?: string;
};

export const primaryNav: NavItem[] = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/solutions', label: 'โซลูชัน', hint: 'ระบบ Solar แต่ละแบบเหมาะกับใคร' },
  { href: '/solar-home', label: 'สำหรับบ้าน', hint: 'Solar + Battery สำหรับที่พักอาศัย' },
  { href: '/solar-business', label: 'สำหรับธุรกิจ', hint: 'โรงงาน สำนักงาน ร้านค้า คลังสินค้า' },
  { href: '/projects', label: 'ผลงานติดตั้ง', hint: 'ระบบที่ติดตั้งจริงพร้อมสเปก' },
  { href: '/products', label: 'สินค้าและเทคโนโลยี', hint: 'แผง อินเวอร์เตอร์ แบตเตอรี่' },
  { href: '/knowledge', label: 'บทความความรู้', hint: 'ทำความเข้าใจ Solar ก่อนตัดสินใจ' },
  { href: '/about', label: 'เกี่ยวกับเรา', hint: 'ทีมงานและแนวทางการทำงาน' },
  { href: '/contact', label: 'ติดต่อเรา', hint: 'โทร LINE และที่ตั้งบริษัท' },
];

export const footerNav = {
  services: {
    title: 'บริการ',
    links: [
      { href: '/solar-home', label: 'Solar สำหรับบ้าน' },
      { href: '/solar-business', label: 'Solar สำหรับธุรกิจ' },
      { href: '/solutions#battery', label: 'Solar + Battery' },
      { href: '/solutions#hybrid', label: 'Hybrid Solar System' },
      { href: '/solutions#zero-export', label: 'Zero Export' },
      { href: '/solutions#monitoring', label: 'Energy Monitoring' },
    ],
  },
  company: {
    title: 'บริษัท',
    links: [
      { href: '/about', label: 'เกี่ยวกับ NP88 Solar' },
      { href: '/projects', label: 'ผลงานติดตั้ง' },
      { href: '/products', label: 'สินค้าและเทคโนโลยี' },
      { href: '/knowledge', label: 'บทความความรู้' },
      { href: '/contact', label: 'ติดต่อเรา' },
      // Matches cta.primaryShort — declared below, so written out here.
      { href: '/quote', label: 'ประเมินระบบฟรี' },
    ],
  },
  legal: {
    title: 'ข้อมูลทางกฎหมาย',
    links: [
      { href: '/privacy', label: 'ประกาศความเป็นส่วนตัว' },
      { href: '/cookie-policy', label: 'นโยบายคุกกี้' },
    ],
  },
} as const;

/**
 * Site-wide CTA copy.
 *
 * The rule: **one destination + one purpose = one label.** Every link that
 * sends someone to /quote for a general assessment uses `cta.primary`, or
 * `cta.primaryShort` where the container is too narrow for the full phrase.
 * Labels only differ when the purpose differs (asking about a specific
 * package, submitting the form itself), because two different wordings for the
 * same action read as two different offers.
 *
 * Import these rather than typing the text inline, so wording cannot drift
 * between pages.
 */
export const cta = {
  /** Primary conversion action, used wherever there is room for it. */
  primary: 'ส่งบิลค่าไฟให้ประเมินฟรี',
  /** Same action, for narrow containers: header button, sticky mobile bar. */
  primaryShort: 'ประเมินระบบฟรี',
  /** The form's own submit button — a different action from navigating to it. */
  submit: 'ส่งข้อมูลให้ทีมประเมิน',
  /** Secondary navigation actions. */
  projects: 'ดูผลงานติดตั้ง',
  solutions: 'ดูโซลูชันทั้งหมด',
  /** Enquiry about one specific promotional package. */
  packageEnquiry: 'สอบถามแพ็กเกจนี้',
  /** Direct channels. */
  phone: `โทร ${contact.phone}`,
  line: `LINE ${contact.lineId}`,
} as const;

/** Query parameters the quote form understands, so links stay in sync. */
export const quoteLinks = {
  general: '/quote',
  home: '/quote?segment=home',
  business: '/quote?segment=business',
  package: (slug: string) => `/quote?package=${encodeURIComponent(slug)}`,
} as const;

/** Reused disclaimers — never promise guaranteed savings. */
export const disclaimers = {
  savings:
    'ตัวเลขการประหยัดเป็นค่าประมาณจากข้อมูลของแต่ละโครงการ ผลลัพธ์จริงขึ้นอยู่กับรูปแบบและปริมาณการใช้ไฟของแต่ละสถานประกอบการ',
  savingsShort:
    'ตัวเลขการประหยัดเป็นค่าประมาณ ขึ้นอยู่กับรูปแบบและปริมาณการใช้ไฟจริง',
  promotion:
    'ราคาและโปรโมชั่นอาจมีการเปลี่ยนแปลง โปรดสอบถามทีมงานก่อนตัดสินใจ',
  warranty:
    'เงื่อนไขการรับประกันเป็นไปตามที่ระบุในแต่ละโครงการและนโยบายของผู้ผลิตแต่ละราย ไม่ใช่เงื่อนไขเดียวกันทุกสินค้า',
  sizing:
    'ขนาดระบบที่เหมาะสมต้องประเมินจากบิลค่าไฟ พฤติกรรมการใช้ไฟ และพื้นที่หลังคาจริง ตัวเลขในหน้านี้ใช้เพื่อการทำความเข้าใจเบื้องต้นเท่านั้น',
} as const;
