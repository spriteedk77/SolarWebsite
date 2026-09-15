'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { signIn, signOut, requireSignedIn } from '@/lib/admin-session';
import {
  adminWriteClient,
  COMPANY_ID,
  SETTINGS_ID,
  draftId,
} from '@/cms/admin-write';
import { defaultSiteData } from '@/lib/site-data';
import { usesSanity } from '@/cms/client';
import {
  fromDocuments,
  requiredAddressDefaults,
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
    values: fromDocuments(company ?? companyDraft, settings ?? settingsDraft),
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
      googleBusinessProfileUrl: contact.googleBusinessProfileUrl,
      googleMapsEmbedUrl: contact.googleMapsEmbedUrl,
      address: contact.address,
      serviceAreas: defaultSiteData.serviceAreas,
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
    await config.client
      .transaction()
      .createIfNotExists({ _id: COMPANY_ID, _type: 'company' })
      .createIfNotExists({ _id: SETTINGS_ID, _type: 'siteSettings' })
      .patch(COMPANY_ID, (patch) =>
        patch
          .setIfMissing({ address: {} })
          .setIfMissing(requiredAddressDefaults())
          .set({ ...company, approvedForPublication: true }),
      )
      .patch(SETTINGS_ID, (patch) =>
        patch.set({ ...settings, approvedForPublication: true }),
      )
      .delete(draftId(COMPANY_ID))
      .delete(draftId(SETTINGS_ID))
      .commit();
  } catch {
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
    };
  }

  revalidatePath('/admin', 'layout');
  revalidateTag('cms', 'max');
  revalidatePath('/', 'layout');
  return {
    status: 'ok',
    message: 'บันทึกแล้ว',
  };
}
