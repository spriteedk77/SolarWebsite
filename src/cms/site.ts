import 'server-only';
import { cache } from 'react';
import { defaultSiteData, type SiteData } from '@/lib/site-data';
import { queryPublished, usesSanity } from './client';
import { imageProjection } from './content';
export { companyModel, settingsModel } from './site-models';
import { companyModel, settingsModel } from './site-models';
/**
 * What the website needs before it can render this content.
 *
 * Exported so the admin can hold a document to the same standard *before*
 * publishing it. The alternative is finding out at deploy time, when the
 * failure is a site that will not build rather than a message in a form.
 */
export const settingsProjection = `{homepageHeadline,homepageDescription,homepageServiceMessage,primaryCTA,secondaryCTA,footerInformation,"heroImage":heroImage ${imageProjection},"executivePortrait":executivePortrait ${imageProjection}}`;

/**
 * Read one CMS document, or say what is wrong with it in words.
 *
 * A missing or invalid published document fails in words rather than as a bare
 * Zod stack trace. The hosted site never swaps to the repository snapshot: a
 * visible configuration problem is safer than showing stale content as if a
 * successful edit had gone live.
 */
function readOrExplain<T>(
  model: { parse: (value: unknown) => T; safeParse: (value: unknown) => { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } } },
  value: unknown,
  label: string,
): T {
  if (value === null || value === undefined)
    throw new Error(
      `ระบบเนื้อหายังไม่มี "${label}" ที่เผยแพร่และติ๊กยืนยันแล้ว ` +
        `— เปิด /admin บันทึกข้อมูลให้ครบ แล้วกดเผยแพร่`,
    );

  const result = model.safeParse(value);
  if (!result.success && result.error) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(ทั้งเอกสาร)'}: ${issue.message}`)
      .join('; ');
    throw new Error(
      `"${label}" ที่เผยแพร่ไว้ยังไม่ครบตามที่เว็บไซต์ต้องใช้ — ${problems}`,
    );
  }
  return model.parse(value);
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!usesSanity()) return defaultSiteData;
  const result = await queryPublished<{
    company: unknown;
    settings: unknown;
  }>(`{
    "company": *[_type == "company" && approvedForPublication == true && _id == "company"][0]{companyName,legalName,tagline,description,phone,phoneE164,lineId,lineUrl,facebookUrl,businessHours,address,serviceAreas,googleBusinessProfileUrl,googleMapsEmbedUrl},
    "settings": *[_type == "siteSettings" && approvedForPublication == true && _id == "siteSettings"][0]${settingsProjection}
  }`);
  const c = readOrExplain(companyModel, result.company, 'ข้อมูลบริษัท');
  const s = readOrExplain(
    settingsModel,
    result.settings,
    'หน้าแรกและข้อความหลัก',
  );
  const addressLines = [
    c.address.street,
    `${c.address.district} จังหวัด${c.address.province} ${c.address.postalCode}`,
  ];
  return {
    site: {
      ...defaultSiteData.site,
      name: c.companyName,
      legalName: c.legalName,
      legalNameShort: c.legalName,
      tagline: c.tagline,
      description: c.description,
    },
    contact: {
      ...defaultSiteData.contact,
      phone: c.phone,
      phoneE164: c.phoneE164,
      phoneHref: `tel:${c.phoneE164}`,
      lineId: c.lineId,
      lineUrl: c.lineUrl,
      facebookUrl: c.facebookUrl || '',
      businessHours: c.businessHours || '',
      address: {
        ...c.address,
        streetEn: c.address.street,
        districtEn: c.address.district,
        provinceEn: c.address.province,
      },
      addressLines,
      googleBusinessProfileUrl: c.googleBusinessProfileUrl || '',
      googleMapsEmbedUrl: isGoogleMapsEmbed(c.googleMapsEmbedUrl)
        ? c.googleMapsEmbedUrl!
        : '',
    },
    serviceAreas: c.serviceAreas,
    cta: {
      ...defaultSiteData.cta,
      primary: s.primaryCTA,
      projects: s.secondaryCTA,
      phone: `โทร ${c.phone}`,
      line: `LINE ${c.lineId}`,
    },
    homepage: {
      headline: s.homepageHeadline,
      description: s.homepageDescription,
      serviceMessage: s.homepageServiceMessage,
      heroImage: s.heroImage || undefined,
      executivePortrait: s.executivePortrait || undefined,
    },
    footerInformation: s.footerInformation,
  };
});

export function isGoogleMapsEmbed(value?: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      ['www.google.com', 'maps.google.com'].includes(url.hostname) &&
      url.pathname.startsWith('/maps/embed')
    );
  } catch {
    return false;
  }
}
