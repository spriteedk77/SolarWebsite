import { contact, cta, serviceAreas, site } from './site';

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

export type SiteData = {
  site: Mutable<typeof site>;
  contact: Mutable<typeof contact> & { businessHours: string };
  serviceAreas: Mutable<typeof serviceAreas>;
  cta: Mutable<typeof cta>;
  homepage: { headline: string; description: string; serviceMessage: string };
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
      'NP88 Solar ให้บริการสำรวจ วิเคราะห์ ออกแบบ และติดตั้งระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงาน พร้อมดูแลตั้งแต่เริ่มต้นจนถึงบริการหลังการขาย',
    serviceMessage: 'พร้อมสำรวจ และติดตั้ง',
  },
  footerInformation:
    'ให้บริการสำรวจ ออกแบบ ติดตั้ง และดูแลระบบ Solar Rooftop สำหรับบ้าน ธุรกิจ และโรงงานในภาคเหนือ',
};
