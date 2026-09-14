'use server';

import { revalidatePath } from 'next/cache';
import { signIn, signOut, requireSignedIn } from '@/lib/admin-session';
import {
  adminWriteClient,
  COMPANY_ID,
  SETTINGS_ID,
  draftId,
} from '@/cms/admin-write';
import { defaultSiteData } from '@/lib/site-data';
import { companyModel, settingsModel } from '@/cms/site';
import { usesSanity } from '@/cms/client';
import {
  fromDocuments,
  toPatches,
  validate,
  type SiteInfoValues,
} from '@/admin/site-info/model';

/**
 * Everything the admin can do, as server actions.
 *
 * Each one checks the session again before it touches anything. Having been
 * shown the form is not permission to submit it — the browser can send this
 * request at any time, with anything in it, so the request is what gets
 * checked, not the page that produced it.
 */

export type FormState = {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  errors?: Partial<Record<keyof SiteInfoValues, string>>;
};

export async function signInAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get('password') ?? '');
  const result = await signIn(password);
  if (result.ok) {
    revalidatePath('/admin');
    return { status: 'ok' };
  }
  return {
    status: 'error',
    message: {
      'not-configured':
        'ยังไม่ได้ตั้งค่ารหัสผ่านสำหรับหน้านี้ ดูวิธีตั้งค่าด้านล่าง',
      'rate-limited':
        'ลองผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
      // Deliberately the same wording whatever went wrong with the password:
      // "ไม่มีรหัสนี้" and "รหัสผิด" would be two different answers to guess with.
      'wrong-password': 'รหัสผ่านไม่ถูกต้อง',
    }[result.reason],
  };
}

export async function signOutAction(): Promise<void> {
  await signOut();
  revalidatePath('/admin');
}

/**
 * The two documents the short form edits, as they stand right now.
 *
 * Before the CMS is wired up there is nothing to read, so the form is filled
 * from the snapshot in this repository — which is exactly what the website is
 * serving in that state, so it is what it claims to be rather than a
 * placeholder. Saving is refused until the connection exists, and the page
 * says which settings are missing.
 */
export async function loadSiteInfo(): Promise<{
  values: SiteInfoValues;
  canSave: boolean;
  missing: string[];
  /** Whether the website actually reads this content, or still the snapshot. */
  liveReadsCms: boolean;
}> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready)
    return {
      values: fromSiteData(),
      canSave: false,
      missing: config.missing,
      liveReadsCms: usesSanity(),
    };

  const [companyDraft, company, settingsDraft, settings] =
    await config.client.getDocuments([
      draftId(COMPANY_ID),
      COMPANY_ID,
      draftId(SETTINGS_ID),
      SETTINGS_ID,
    ]);

  return {
    values: fromDocuments(companyDraft ?? company, settingsDraft ?? settings),
    canSave: true,
    missing: [],
    liveReadsCms: usesSanity(),
  };
}

/**
 * The same fields, read out of the content snapshot the repository ships.
 *
 * Used only before the CMS is connected. It goes through the same
 * `fromDocuments` the live path uses, so there is one place that decides what
 * an empty field looks like.
 */
function fromSiteData(): SiteInfoValues {
  const { site, contact, homepage, cta, footerInformation } = defaultSiteData;
  return fromDocuments(
    {
      companyName: site.name,
      legalName: site.legalNameShort,
      tagline: site.tagline,
      description: site.description,
      phone: contact.phone,
      phoneE164: contact.phoneE164,
      lineId: contact.lineId,
      lineUrl: contact.lineUrl,
      facebookUrl: contact.facebookUrl,
      businessHours: contact.businessHours,
      address: contact.address,
    },
    {
      homepageHeadline: homepage.headline,
      homepageDescription: homepage.description,
      homepageServiceMessage: homepage.serviceMessage,
      primaryCTA: cta.primary,
      secondaryCTA: cta.projects,
      footerInformation,
    },
  );
}

export async function saveSiteInfoAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSignedIn();

  const config = adminWriteClient();
  if (!config.ready)
    return {
      status: 'error',
      message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}`,
    };

  const values = Object.fromEntries(
    [...formData.entries()]
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, String(value)]),
  ) as SiteInfoValues;

  const errors = validate(values);
  if (errors)
    return {
      status: 'error',
      message: 'ยังมีช่องที่ต้องแก้ ดูข้อความสีแดงใต้ช่องนั้น',
      errors,
    };

  const { company, settings } = toPatches(values);
  try {
    // Saved as a draft. Nothing here puts text on the live site: that stays a
    // separate, deliberate step.
    await config.client
      .transaction()
      .createIfNotExists({ _id: draftId(COMPANY_ID), _type: COMPANY_ID })
      .createIfNotExists({ _id: draftId(SETTINGS_ID), _type: SETTINGS_ID })
      .patch(draftId(COMPANY_ID), (patch) => patch.set(company))
      .patch(draftId(SETTINGS_ID), (patch) => patch.set(settings))
      .commit();
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? `บันทึกไม่สำเร็จ: ${error.message}`
          : 'บันทึกไม่สำเร็จ',
    };
  }

  revalidatePath('/admin');
  return {
    status: 'ok',
    message: 'บันทึกแล้ว — ยังไม่ขึ้นเว็บจริง กดเผยแพร่ด้านล่างเมื่อพร้อม',
  };
}

/**
 * Put the saved draft on the live website.
 *
 * Two documents move together: the company details and the homepage text. The
 * company goes first because the settings document points at it, and a
 * published document may not reference one that does not exist yet.
 *
 * Before anything is written, the result is held to the same rules the website
 * itself applies when it reads the content back — see companyModel and
 * settingsModel. Publishing something the site cannot render would not show up
 * here; it would show up as a site that refuses to build, which is a far worse
 * place to find out.
 */
export async function publishSiteInfoAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSignedIn();

  if (formData.get('confirm') !== 'yes')
    return {
      status: 'error',
      message: 'กรุณาติ๊กยืนยันว่าข้อมูลถูกต้องก่อนเผยแพร่',
    };

  const config = adminWriteClient();
  if (!config.ready)
    return {
      status: 'error',
      message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}`,
    };

  const [companyDraft, companyLive, settingsDraft, settingsLive] =
    await config.client.getDocuments([
      draftId(COMPANY_ID),
      COMPANY_ID,
      draftId(SETTINGS_ID),
      SETTINGS_ID,
    ]);

  const company = companyDraft ?? companyLive;
  const settings = settingsDraft ?? settingsLive;
  if (!company || !settings)
    return {
      status: 'error',
      message:
        'ยังไม่มีข้อมูลให้เผยแพร่ กรุณากดบันทึกก่อนอย่างน้อยหนึ่งครั้ง',
    };

  // The approval the schema asks for is being given here, by whoever ticked
  // the box and pressed the button.
  const publishedCompany = {
    ...company,
    _id: COMPANY_ID,
    _type: 'company',
    approvedForPublication: true,
  };
  const publishedSettings = {
    ...settings,
    _id: SETTINGS_ID,
    _type: 'siteSettings',
    approvedForPublication: true,
  };

  const problems = [
    ...describeIssues('ข้อมูลบริษัท', companyModel.safeParse(publishedCompany)),
    ...describeIssues('หน้าแรก', settingsModel.safeParse(publishedSettings)),
  ];
  if (problems.length)
    return {
      status: 'error',
      message: `ยังเผยแพร่ไม่ได้ เพราะเว็บไซต์จะแสดงข้อมูลนี้ไม่ได้ — ${problems.join(' · ')}`,
    };

  try {
    await config.client
      .transaction()
      .createOrReplace(publishedCompany)
      .createOrReplace(publishedSettings)
      // The drafts have served their purpose; leaving them would make the next
      // edit start from a copy that is no longer what the site is showing.
      .delete(draftId(COMPANY_ID))
      .delete(draftId(SETTINGS_ID))
      .commit();
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? `เผยแพร่ไม่สำเร็จ: ${error.message}`
          : 'เผยแพร่ไม่สำเร็จ',
    };
  }

  revalidatePath('/admin', 'layout');
  revalidatePath('/', 'layout');
  return {
    status: 'ok',
    message: 'เผยแพร่แล้ว ข้อมูลนี้คือข้อมูลที่เว็บไซต์ใช้',
  };
}

/** Field paths a zod failure names, in words rather than as a stack trace. */
function describeIssues(
  label: string,
  result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } },
): string[] {
  if (result.success || !result.error) return [];
  const fields = [
    ...new Set(
      result.error.issues.map((issue) => issue.path.join('.') || '(ทั้งเอกสาร)'),
    ),
  ];
  return [`${label}: ${fields.join(', ')}`];
}
