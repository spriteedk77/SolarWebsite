import { contact, cta, serviceAreas, site } from './site';
import type { ImageAsset } from '@/content/types';

type Mutable<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends readonly (infer U)[]
  ? Mutable<U>[]
  : T extends object
  ? { -readonly [K in keyof T]: Mutable<T[K]> }
  : T;

/* ==========================================================================
   QUICK EDIT: Homepage history
   --------------------------------------------------------------------------
   The "ประวัติและความเป็นมา" section under the hero. Edit the four values
   below and nothing else — `HistorySection` reads them directly and adds no
   copy of its own.

   `historyParagraphs` renders in order, one <p> each; add or remove entries
   freely. `historyQuote` is set apart from the body as the pull quote.

   ⚠️ CONTENT RULE: this section states how NP88 Solar works, and nothing that
   would need proof. Do not add a founding year, founder names, team size,
   awards, certifications, engineering licences, partnerships or an
   installation count here — see src/lib/pending.ts for what is still
   unconfirmed.
   ========================================================================= */
export const homepageHistory = {
  historyEyebrow: 'ABOUT NP88 SOLAR',
  historyTitle: 'ประวัติและความเป็นมาของ NP88 Solar',
  historyParagraphs: [
    'NP88 Solar ภายใต้ NP88 Engineering Co., Ltd. ให้บริการด้าน Solar Rooftop โดยให้ความสำคัญกับการสำรวจ วิเคราะห์รูปแบบการใช้พลังงาน และออกแบบระบบให้เหมาะกับพื้นที่และลักษณะการใช้งานจริงของลูกค้า',
    'ตั้งแต่บ้านพักอาศัย ธุรกิจ SME ร้านค้า สำนักงาน คลินิก คลังสินค้า ไปจนถึงโรงงานและอาคารพาณิชย์',
    'ทีมงานดูแลตั้งแต่การสำรวจ วิเคราะห์ ออกแบบ ติดตั้ง ไปจนถึงบริการหลังการขาย เพื่อให้ระบบ Solar เป็นส่วนหนึ่งของการบริหารพลังงานในระยะยาว',
  ],
  historyQuote:
    'แนวคิดของ NP88 Solar ไม่ได้เริ่มจากคำถามว่าต้องติดกี่แผง แต่เริ่มจากการทำความเข้าใจว่าระบบแบบใดเหมาะสมและคุ้มค่ากับการใช้พลังงานของลูกค้า',

  /**
   * Legacy repository fallback for the full-width history background.
   *
   * `src` is empty until NP88 Solar supplies the photograph: the section then
   * renders a branded navy/green background rather than an empty image frame.
   * To install a repository snapshot photograph, put
   * the file in `public/images/about/` and fill in all three fields:
   *
   *   src:      '/images/about/history-background.jpg'
   *   alt:      what is pictured — NP88 Solar must confirm it
   *   position: object-position, e.g. '25% 50%' to keep the subject left
   *
   * Supply it as a 16:9 image — 2400×1350 or larger.
   */
  historyImage: {
    src: '',
    alt: '',
    position: '50% 50%',
  },
} as const;

export type SiteData = {
  site: Mutable<typeof site>;
  contact: Mutable<typeof contact> & { businessHours: string };
  serviceAreas: Mutable<typeof serviceAreas>;
  cta: Mutable<typeof cta>;
  homepage: {
    headline: string;
    description: string;
    serviceMessage: string;
    heroImage?: ImageAsset;
    historyBackground?: ImageAsset;
    historyImagePosition: 'left' | 'center' | 'right';
  };
  footerInformation: string;
};

/** The versioned preview snapshot. Live CMS mode never silently falls back to it. */
export const defaultSiteData: SiteData = {
  site: { ...site },
  contact: {
    ...contact,
    address: { ...contact.address },
    addressLines: [...contact.addressLines],
    businessHours: '',
  },
  serviceAreas: serviceAreas.map((area) => ({ ...area })),
  cta: { ...cta },
  homepage: {
    headline: 'ออกแบบระบบพลังงาน\nให้เหมาะกับธุรกิจของคุณ',
    description:
      'พร้อมสำรวจ ออกแบบ และติดตั้ง Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน เลือกระบบให้เหมาะกับการใช้ไฟและพื้นที่ติดตั้ง',
    serviceMessage: 'CONTACT',
    historyImagePosition: 'left',
  },
  footerInformation:
    'ให้บริการสำรวจ ออกแบบ ติดตั้ง และดูแลระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงานในภาคเหนือ',
};
