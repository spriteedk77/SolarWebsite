'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { resolveAdminImage } from '@/cms/admin-images';
import { adminWriteClient, SETTINGS_ID, draftId } from '@/cms/admin-write';
import { projectProjection } from '@/cms/content';
import { projectModel } from '@/cms/models';
import { settingsProjection } from '@/cms/site';
import { settingsModel } from '@/cms/site-models';
import { requireSignedIn } from '@/lib/admin-session';

export type MediaActionState = { status: 'idle' | 'ok' | 'error'; message?: string };
type ImageView = { assetId: string; src: string; alt: string; caption: string };

const imageViewProjection = `{"assetId":asset->_id,"src":asset->url,alt,caption}`;
const baseId = (id: string) => id.replace(/^drafts\./, '');

export async function loadMediaManager() {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { ready: false as const, missing: config.missing, homepage: {}, projects: [] };
  const [settingsDraft, settingsLive, projectDocs] = await Promise.all([
    config.client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]{"heroImage":heroImage ${imageViewProjection},"executivePortrait":executivePortrait ${imageViewProjection}}`, { id: draftId(SETTINGS_ID) }),
    config.client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]{"heroImage":heroImage ${imageViewProjection},"executivePortrait":executivePortrait ${imageViewProjection}}`, { id: SETTINGS_ID }),
    config.client.fetch<Array<{ _id: string; title?: string; cover?: ImageView }>>(`*[_type == "project"] | order(_updatedAt desc){_id,title,"cover":coverImage ${imageViewProjection}}`),
  ]);
  const homepage = (settingsDraft ?? settingsLive ?? {}) as { heroImage?: ImageView; executivePortrait?: ImageView };
  const grouped = new Map<string, { id: string; title: string; image?: ImageView; draft: boolean; published: boolean }>();
  for (const document of projectDocs) {
    const id = baseId(document._id);
    const current = grouped.get(id) ?? { id, title: document.title || 'ยังไม่มีชื่อ', image: document.cover, draft: false, published: false };
    if (document._id.startsWith('drafts.')) {
      current.draft = true;
      current.title = document.title || current.title;
      current.image = document.cover || current.image;
    } else current.published = true;
    grouped.set(id, current);
  }
  return { ready: true as const, missing: [], homepage, projects: [...grouped.values()] };
}

export async function saveMediaAction(_previous: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { status: 'error', message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}` };
  const scope = String(formData.get('scope') || '');
  const intent = String(formData.get('intent') || 'save');
  if (intent === 'publish' && formData.get('confirm') !== 'yes')
    return { status: 'error', message: 'ติ๊กยืนยันสิทธิ์ใช้รูปก่อนเผยแพร่' };
  try {
    const image = await resolveAdminImage(
      config.client,
      formData.get('imageFile'),
      String(formData.get('assetId') || ''),
      String(formData.get('alt') || ''),
      String(formData.get('caption') || ''),
    );
    if (!image) return { status: 'error', message: 'เลือกรูปและใส่คำอธิบายภาพก่อนบันทึก' };
    if (scope === 'homepage')
      return saveHomepageImage(config.client, String(formData.get('field') || ''), image, intent === 'publish');
    if (scope === 'project')
      return saveProjectCover(config.client, String(formData.get('id') || ''), image, intent === 'publish');
    return { status: 'error', message: 'ไม่รู้ว่ารูปนี้อยู่ส่วนใดของเว็บไซต์' };
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? `บันทึกไม่สำเร็จ: ${error.message}` : 'บันทึกไม่สำเร็จ' };
  }
}

type SanityClient = Extract<ReturnType<typeof adminWriteClient>, { ready: true }>['client'];

async function saveHomepageImage(client: SanityClient, field: string, image: Record<string, unknown>, publish: boolean): Promise<MediaActionState> {
  if (!['heroImage', 'executivePortrait'].includes(field)) return { status: 'error', message: 'ตำแหน่งรูปหน้าแรกไม่ถูกต้อง' };
  const [draft, live] = await client.getDocuments([draftId(SETTINGS_ID), SETTINGS_ID]);
  const source = draft ?? live;
  if (!source) return { status: 'error', message: 'กรุณาบันทึกข้อมูลเว็บไซต์ก่อนเพิ่มรูปหน้าแรก' };
  const document = { ...withoutSystemFields(source), _id: draftId(SETTINGS_ID), _type: 'siteSettings', [field]: image, approvedForPublication: false };
  await client.createOrReplace(document);
  if (!publish) {
    revalidatePath('/admin/images');
    return { status: 'ok', message: 'บันทึกรูปเป็นฉบับร่างแล้ว' };
  }
  const projected = await client.fetch<unknown>(`*[_id == $id][0] ${settingsProjection}`, { id: draftId(SETTINGS_ID) });
  const checked = settingsModel.safeParse(projected);
  if (!checked.success) return { status: 'error', message: `ยังเผยแพร่ไม่ได้: ${checked.error.issues.map((issue) => issue.path.join('.')).join(', ')}` };
  await client.transaction().createOrReplace({ ...document, _id: SETTINGS_ID, approvedForPublication: true }).delete(draftId(SETTINGS_ID)).commit();
  refreshPublicPages();
  return { status: 'ok', message: 'เผยแพร่รูปแล้ว เว็บไซต์จะอัปเดตภายในประมาณ 1 นาที' };
}

async function saveProjectCover(client: SanityClient, unsafeId: string, image: Record<string, unknown>, publish: boolean): Promise<MediaActionState> {
  const id = baseId(unsafeId);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]+$/.test(id)) return { status: 'error', message: 'รหัสโครงการไม่ถูกต้อง' };
  const [draft, live] = await client.getDocuments([draftId(id), id]);
  const source = draft ?? live;
  if (!source || source._type !== 'project') return { status: 'error', message: 'ไม่พบโครงการนี้' };
  const document = { ...withoutSystemFields(source), _id: draftId(id), _type: 'project', coverImage: image, approvedForPublication: false };
  await client.createOrReplace(document);
  if (!publish) {
    revalidatePath('/admin/images');
    return { status: 'ok', message: 'บันทึกรูปโครงการเป็นฉบับร่างแล้ว' };
  }
  const projected = await client.fetch<unknown>(`*[_id == $id][0] ${projectProjection}`, { id: draftId(id) });
  const checked = projectModel.safeParse(projected);
  if (!checked.success) return { status: 'error', message: `โครงการยังเผยแพร่ไม่ได้: ${checked.error.issues.map((issue) => issue.path.join('.')).join(', ')}` };
  if (checked.data.gallery.some((item) => item.placeholder))
    return { status: 'error', message: 'โครงการยังมีภาพตัวอย่างอยู่ กรุณาเปลี่ยนเป็นภาพจริงก่อนเผยแพร่' };
  await client.transaction().createOrReplace({ ...document, _id: id, approvedForPublication: true }).delete(draftId(id)).commit();
  refreshPublicPages();
  return { status: 'ok', message: 'เผยแพร่รูปโครงการแล้ว เว็บไซต์จะอัปเดตภายในประมาณ 1 นาที' };
}

function withoutSystemFields(document: Record<string, unknown>) {
  const { _id, _rev, _createdAt, _updatedAt, ...content } = document;
  void _id; void _rev; void _createdAt; void _updatedAt;
  return content;
}

function refreshPublicPages() {
  revalidateTag('cms', 'max');
  revalidatePath('/', 'layout');
  revalidatePath('/projects', 'layout');
}
