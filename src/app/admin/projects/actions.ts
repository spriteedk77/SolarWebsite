'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { projectFieldsModel, lines, warranties, warrantyText } from '@/admin/projects/model';
import { portableTextForEditorBlock, validateBlocks, type EditorBlock } from '@/admin/articles/model';
import { resolveAdminImage } from '@/cms/admin-images';
import { adminWriteClient, draftId } from '@/cms/admin-write';
import { projectProjection } from '@/cms/content';
import { projectModel } from '@/cms/models';
import { requireSignedIn } from '@/lib/admin-session';

export type ProjectActionState = { status: 'idle' | 'error'; message?: string; errors?: string[] };
type ImageEditorData = { key: string; assetId?: string; src?: string; alt: string; caption: string };
export type ProjectEditorData = {
  id: string; title: string; slug: string; summary: string; customerName: string; customerType: string;
  location: string; province: string; systemCapacity: string; phase: '1 เฟส' | '3 เฟส'; solarPanels: string;
  panelQuantity: string; inverter: string; battery: string; optimizer: string; systemType: string;
  zeroExport: boolean; monitoring: string; estimatedSavings: string; standards: string; servicesIncluded: string;
  warranty: string; publishedAt: string; seoTitle: string; seoDescription: string; featured: boolean;
  coverImage?: Omit<ImageEditorData, 'key'>; gallery: ImageEditorData[]; blocks: EditorBlock[]; published: boolean;
};

type RawDocument = Record<string, unknown> & { _id?: string; content?: RawBlock[] };
type RawBlock = Record<string, unknown> & {
  _type?: string; _key?: string; style?: string; listItem?: string; children?: { text?: string }[];
  markDefs?: { href?: string }[]; assetId?: string; src?: string; width?: number; height?: number; alt?: string; caption?: string;
};
const imageEditorProjection = `{_key,"assetId":asset->_id,"src":asset->url,alt,caption}`;
const editorProjection = `{
  _id,title,"slug":slug.current,summary,customerName,customerType,location,province,systemCapacity,phase,solarPanels,panelQuantity,inverter,battery,optimizer,systemType,zeroExport,monitoring,estimatedSavings,standards,servicesIncluded,warranty,publishedAt,seoTitle,seoDescription,featured,
  "coverImage":coverImage ${imageEditorProjection},"gallery":coalesce(gallery[] ${imageEditorProjection},[]),
  content[]{...,"assetId":asset->_id,"src":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height}
}`;
const baseId = (id: string) => id.replace(/^drafts\./, '');

export async function listProjects() {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { ready: false as const, missing: config.missing, projects: [] };
  const documents = await config.client.fetch<Array<{ _id: string; title?: string; slug?: string; province?: string }>>(`*[_type == "project"] | order(_updatedAt desc){_id,title,"slug":slug.current,province}`);
  const grouped = new Map<string, { id: string; title: string; slug: string; province: string; draft: boolean; published: boolean }>();
  for (const document of documents) {
    const id = baseId(document._id);
    const current = grouped.get(id) ?? { id, title: document.title || 'ยังไม่มีชื่อ', slug: document.slug || '', province: document.province || '', draft: false, published: false };
    if (document._id.startsWith('drafts.')) { current.draft = true; current.title = document.title || current.title; current.slug = document.slug || current.slug; current.province = document.province || current.province; }
    else current.published = true;
    grouped.set(id, current);
  }
  return { ready: true as const, missing: [], projects: [...grouped.values()] };
}

export async function loadProject(id: string): Promise<ProjectEditorData | null> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return null;
  const cleanId = baseId(id);
  const [draft, published] = await Promise.all([
    config.client.fetch<RawDocument | null>(`*[_id == $id][0] ${editorProjection}`, { id: draftId(cleanId) }),
    config.client.fetch<RawDocument | null>(`*[_id == $id][0] ${editorProjection}`, { id: cleanId }),
  ]);
  const document = draft ?? published;
  if (!document) return null;
  const content = Array.isArray(document.content) ? document.content : [];
  return {
    id: cleanId, title: String(document.title ?? ''), slug: String(document.slug ?? ''), summary: String(document.summary ?? ''),
    customerName: String(document.customerName ?? ''), customerType: String(document.customerType ?? ''), location: String(document.location ?? ''), province: String(document.province ?? ''),
    systemCapacity: String(document.systemCapacity ?? ''), phase: document.phase === '1 เฟส' ? '1 เฟส' : '3 เฟส', solarPanels: String(document.solarPanels ?? ''), panelQuantity: String(document.panelQuantity ?? ''),
    inverter: String(document.inverter ?? ''), battery: String(document.battery ?? ''), optimizer: String(document.optimizer ?? ''), systemType: String(document.systemType ?? ''), zeroExport: document.zeroExport === true,
    monitoring: String(document.monitoring ?? ''), estimatedSavings: document.estimatedSavings === undefined ? '' : String(document.estimatedSavings), standards: arrayText(document.standards), servicesIncluded: arrayText(document.servicesIncluded), warranty: warrantyText(document.warranty),
    publishedAt: String(document.publishedAt ?? new Date().toISOString()).slice(0, 16), seoTitle: String(document.seoTitle ?? ''), seoDescription: String(document.seoDescription ?? ''), featured: document.featured === true,
    coverImage: toImage(document.coverImage), gallery: Array.isArray(document.gallery) ? document.gallery.map((image, index) => ({ key: String((image as Record<string, unknown>)._key ?? `gallery-${index}`), ...toImage(image) })).filter((image): image is ImageEditorData => Boolean(image.assetId && image.src)) : [],
    blocks: content.map(toEditorBlock).filter((block): block is EditorBlock => Boolean(block)), published: Boolean(published),
  };
}

function toImage(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const image = value as Record<string, unknown>;
  if (typeof image.assetId !== 'string' || typeof image.src !== 'string') return undefined;
  return { assetId: image.assetId, src: image.src, alt: String(image.alt ?? ''), caption: String(image.caption ?? '') };
}
function arrayText(value: unknown) { return Array.isArray(value) ? value.map(String).join('\n') : ''; }
function toEditorBlock(block: RawBlock): EditorBlock | null {
  const key = block._key || randomUUID();
  if (block._type === 'siteImage' && block.assetId && block.src) return { kind: 'image', key, assetId: block.assetId, src: block.src, width: block.width, height: block.height, alt: block.alt || '', caption: block.caption || '' };
  if (block._type === 'block') {
    const rawStyle = block.listItem === 'bullet' || block.listItem === 'number' ? block.listItem : block.style;
    const style = ['normal', 'h2', 'h3', 'blockquote', 'bullet', 'number'].includes(rawStyle || '') ? rawStyle as 'normal' | 'h2' | 'h3' | 'blockquote' | 'bullet' | 'number' : 'normal';
    return { kind: 'text', key, style, text: Array.isArray(block.children) ? block.children.map((child) => child.text || '').join('') : '', link: block.markDefs?.find((mark) => typeof mark.href === 'string')?.href, raw: JSON.stringify(block) };
  }
  return { kind: 'preserved', key, label: block._type === 'contentTable' ? 'ตารางเดิม' : 'เนื้อหารูปแบบเดิม', raw: JSON.stringify(block) };
}

export async function saveProjectAction(_previous: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { status: 'error', message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}` };
  const parsed = projectFieldsModel.safeParse({
    title: formData.get('title'), slug: formData.get('slug') || '', summary: formData.get('summary'), customerName: formData.get('customerName') || '', customerType: formData.get('customerType') || '',
    location: formData.get('location'), province: formData.get('province'), systemCapacity: formData.get('systemCapacity'), phase: formData.get('phase'), solarPanels: formData.get('solarPanels'), panelQuantity: formData.get('panelQuantity'),
    inverter: formData.get('inverter') || '', battery: formData.get('battery') || '', optimizer: formData.get('optimizer') || '', systemType: formData.get('systemType'), zeroExport: formData.get('zeroExport') === 'yes', monitoring: formData.get('monitoring') || '',
    estimatedSavings: formData.get('estimatedSavings') || '', standards: formData.get('standards') || '', servicesIncluded: formData.get('servicesIncluded') || '', warranty: formData.get('warranty') || '', publishedAt: formData.get('publishedAt'), seoTitle: formData.get('seoTitle') || '', seoDescription: formData.get('seoDescription') || '', featured: formData.get('featured') === 'yes',
  });
  if (!parsed.success) return { status: 'error', message: 'ยังบันทึกไม่ได้', errors: parsed.error.issues.map((issue) => issue.message) };
  const id = baseId(String(formData.get('id') || `project-${randomUUID()}`));
  let slug = parsed.data.slug || automaticSlug(parsed.data.title, id);
  const duplicate = await config.client.fetch<number>(`count(*[_type == "project" && slug.current == $slug && !(_id in [$id,$draftId])])`, { slug, id, draftId: draftId(id) });
  if (duplicate) slug = `${slug}-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toLowerCase()}`;
  const blocks = readEditorBlocks(formData);
  const blockErrors = validateBlocks(blocks);
  if (blockErrors.length) return { status: 'error', message: 'รายละเอียดโครงการยังไม่ครบ', errors: blockErrors };
  let destination = '';
  try {
    const coverImage = await resolveAdminImage(config.client, formData.get('coverImageFile'), String(formData.get('coverAssetId') || ''), String(formData.get('coverAlt') || ''), String(formData.get('coverCaption') || ''));
    const content = [];
    for (const block of blocks) {
      if (block.kind === 'text' || block.kind === 'preserved') content.push(portableTextForEditorBlock(block));
      else {
        const image = await resolveAdminImage(config.client, formData.get(`body.file.${block.key}`), block.assetId || '', block.alt, block.caption);
        if (!image) return { status: 'error', message: `กรุณาเลือกรูปสำหรับส่วน "${block.alt || block.key}"` };
        content.push({ _key: block.key, ...image });
      }
    }
    const gallery = [];
    for (const row of readGallery(formData)) {
      const image = await resolveAdminImage(config.client, formData.get(`gallery.file.${row.key}`), row.assetId, row.alt, row.caption);
      if (!image) return { status: 'error', message: `กรุณาเลือกรูปแกลเลอรี "${row.alt || row.key}"` };
      gallery.push({ _key: row.key, ...image });
    }
    const now = new Date().toISOString();
    const document = {
      _id: draftId(id), _type: 'project', title: parsed.data.title, slug: { _type: 'slug', current: slug }, summary: parsed.data.summary,
      customerName: parsed.data.customerName || undefined, customerType: parsed.data.customerType || undefined, location: parsed.data.location, province: parsed.data.province,
      systemCapacity: parsed.data.systemCapacity, phase: parsed.data.phase, solarPanels: parsed.data.solarPanels, panelQuantity: parsed.data.panelQuantity,
      inverter: parsed.data.inverter || undefined, battery: parsed.data.battery || undefined, optimizer: parsed.data.optimizer || undefined, systemType: parsed.data.systemType, zeroExport: parsed.data.zeroExport, monitoring: parsed.data.monitoring || undefined,
      estimatedSavings: parsed.data.estimatedSavings === '' ? undefined : parsed.data.estimatedSavings, standards: lines(parsed.data.standards), servicesIncluded: lines(parsed.data.servicesIncluded), warranty: warranties(parsed.data.warranty).map((item) => ({ _type: 'warrantyItem', _key: randomUUID(), ...item })),
      publishedAt: new Date(parsed.data.publishedAt).toISOString(), updatedAt: now, seoTitle: parsed.data.seoTitle || undefined, seoDescription: parsed.data.seoDescription || undefined, featured: parsed.data.featured,
      ...(coverImage ? { coverImage } : {}), gallery, content, approvedForPublication: false,
    };
    await config.client.createOrReplace(document);
    const intent = String(formData.get('intent') || 'save');
    if (intent === 'publish') {
      if (formData.get('confirm') !== 'yes') return { status: 'error', message: 'ติ๊กยืนยันข้อมูลและสิทธิ์ใช้รูปก่อนเผยแพร่' };
      const projected = await config.client.fetch<unknown>(`*[_id == $id][0] ${projectProjection}`, { id: draftId(id) });
      const checked = projectModel.safeParse(projected);
      if (!checked.success) return { status: 'error', message: 'เว็บไซต์ยังแสดงโครงการนี้ไม่ได้', errors: checked.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`) };
      if (checked.data.gallery.some((image) => image.placeholder)) return { status: 'error', message: 'ต้องเปลี่ยนภาพตัวอย่างเป็นภาพจริงก่อนเผยแพร่' };
      await config.client.transaction().createOrReplace({ ...document, _id: id, approvedForPublication: true }).delete(draftId(id)).commit();
      refreshProjects(); destination = '/admin/projects?published=1';
    } else destination = `/admin/projects/${id}?saved=1`;
  } catch (error) { return { status: 'error', message: error instanceof Error ? `บันทึกไม่สำเร็จ: ${error.message}` : 'บันทึกไม่สำเร็จ' }; }
  redirect(destination);
}

function readEditorBlocks(formData: FormData): EditorBlock[] {
  const indexes = [...new Set([...formData.keys()].map((key) => /^body\.(\d+)\.kind$/.exec(key)?.[1]).filter((value): value is string => Boolean(value)))].sort((a, b) => Number(a) - Number(b));
  return indexes.map((index) => {
    const kind = String(formData.get(`body.${index}.kind`)); const key = String(formData.get(`body.${index}.key`) || randomUUID());
    if (kind === 'image') { formData.set(`body.file.${key}`, formData.get(`body.${index}.file`) || ''); return { kind: 'image' as const, key, assetId: String(formData.get(`body.${index}.assetId`) || ''), alt: String(formData.get(`body.${index}.alt`) || ''), caption: String(formData.get(`body.${index}.caption`) || '') }; }
    if (kind === 'preserved') return { kind: 'preserved' as const, key, label: 'เนื้อหารูปแบบเดิม', raw: String(formData.get(`body.${index}.raw`) || '') };
    const rawStyle = String(formData.get(`body.${index}.style`) || 'normal'); const style = ['normal', 'h2', 'h3', 'blockquote', 'bullet', 'number'].includes(rawStyle) ? rawStyle as 'normal' | 'h2' | 'h3' | 'blockquote' | 'bullet' | 'number' : 'normal';
    return { kind: 'text' as const, key, style, text: String(formData.get(`body.${index}.text`) || ''), link: String(formData.get(`body.${index}.link`) || ''), raw: String(formData.get(`body.${index}.raw`) || '') || undefined };
  });
}
function readGallery(formData: FormData) {
  const indexes = [...new Set([...formData.keys()].map((key) => /^gallery\.(\d+)\.key$/.exec(key)?.[1]).filter((value): value is string => Boolean(value)))].sort((a, b) => Number(a) - Number(b));
  return indexes.map((index) => { const key = String(formData.get(`gallery.${index}.key`) || randomUUID()); formData.set(`gallery.file.${key}`, formData.get(`gallery.${index}.file`) || ''); return { key, assetId: String(formData.get(`gallery.${index}.assetId`) || ''), alt: String(formData.get(`gallery.${index}.alt`) || ''), caption: String(formData.get(`gallery.${index}.caption`) || '') }; });
}
function automaticSlug(title: string, id: string) { const readable = title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56); return readable || `project-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toLowerCase()}`; }
function refreshProjects() { revalidateTag('cms', 'max'); revalidatePath('/', 'layout'); revalidatePath('/projects', 'layout'); }

export async function deleteProjectAction(formData: FormData) {
  await requireSignedIn();
  if (formData.get('confirmDelete') !== 'yes') throw new Error('กรุณาติ๊กยืนยันก่อนลบโครงการ');
  const config = adminWriteClient(); if (!config.ready) throw new Error(`ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}`);
  const id = baseId(String(formData.get('id') || '')); if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]+$/.test(id)) throw new Error('รหัสโครงการไม่ถูกต้อง');
  const exists = await config.client.fetch<boolean>(`count(*[_type == "project" && _id in [$id,$draftId]]) > 0`, { id, draftId: draftId(id) }); if (!exists) throw new Error('ไม่พบโครงการที่ต้องการลบ');
  await config.client.transaction().delete(id).delete(draftId(id)).commit(); refreshProjects(); redirect('/admin/projects?deleted=1');
}
