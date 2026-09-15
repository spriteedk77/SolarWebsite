'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { articleFieldsModel, faqFromText, portableTextForEditorBlock, tagsFromText, validateBlocks, type EditorBlock } from '@/admin/articles/model';
import { adminWriteClient, draftId } from '@/cms/admin-write';
import { articleProjection } from '@/cms/content';
import { articleModel } from '@/cms/models';
import { requireSignedIn } from '@/lib/admin-session';
import { resolveAdminImage } from '@/cms/admin-images';


export type ArticleActionState = {
  status: 'idle' | 'error';
  message?: string;
  errors?: string[];
  fieldErrors?: Record<string, string>;
};
type DeleteActionState = { status: 'idle' | 'error'; message?: string };

export type ArticleEditorData = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string;
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  related: string;
  faq: string;
  featuredImage?: { assetId: string; src: string; alt: string; caption: string };
  blocks: EditorBlock[];
  draft: boolean;
  published: boolean;
};

type RawBlock = Record<string, unknown> & {
  _type?: string; _key?: string; style?: string; children?: { text?: string }[];
  listItem?: string; markDefs?: { _key?: string; href?: string }[];
  assetId?: string; src?: string; width?: number; height?: number; alt?: string; caption?: string;
};

const editorProjection = `{
  _id,title,"slug":slug.current,summary,category,"tags":coalesce(tags,[]),author,publishedAt,seoTitle,seoDescription,featured,"related":related[]->slug.current,faq,
  "featuredImage": featuredImage{"assetId":asset->_id,"src":asset->url,alt,caption},
  content[]{...,"assetId":asset->_id,"src":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height}
}`;

const baseId = (id: string) => id.replace(/^drafts\./, '');

export async function listArticles() {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { ready: false as const, missing: config.missing, articles: [] };
  const documents = await config.client.fetch<Array<{ _id: string; title?: string; slug?: string; publishedAt?: string }>>(
    `*[_type == "article"] | order(_updatedAt desc){_id,title,"slug":slug.current,publishedAt}`,
  );
  const grouped = new Map<string, { id: string; title: string; slug: string; publishedAt?: string; draft: boolean; published: boolean }>();
  for (const document of documents) {
    const id = baseId(document._id);
    const current = grouped.get(id) ?? { id, title: document.title || 'ยังไม่มีชื่อ', slug: document.slug || '', publishedAt: document.publishedAt, draft: false, published: false };
    if (document._id.startsWith('drafts.')) {
      current.draft = true;
      current.title = document.title || current.title;
      current.slug = document.slug || current.slug;
      current.publishedAt = document.publishedAt || current.publishedAt;
    } else current.published = true;
    grouped.set(id, current);
  }
  return { ready: true as const, missing: [], articles: [...grouped.values()] };
}

export async function loadArticle(id: string): Promise<ArticleEditorData | null> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return null;
  const cleanId = baseId(id);
  const [draft, published] = await Promise.all([
    config.client.fetch<RawBlock | null>(`*[_id == $id][0] ${editorProjection}`, { id: draftId(cleanId) }),
    config.client.fetch<RawBlock | null>(`*[_id == $id][0] ${editorProjection}`, { id: cleanId }),
  ]);
  const document = draft ?? published;
  if (!document) return null;
  const content = Array.isArray(document.content) ? (document.content as RawBlock[]) : [];
  return {
    id: cleanId,
    title: String(document.title ?? ''),
    slug: String(document.slug ?? ''),
    summary: String(document.summary ?? ''),
    category: String(document.category ?? 'พื้นฐาน Solar'),
    tags: Array.isArray(document.tags) ? document.tags.join(', ') : '',
    author: String(document.author ?? ''),
    publishedAt: String(document.publishedAt ?? new Date().toISOString()).slice(0, 16),
    seoTitle: String(document.seoTitle ?? ''),
    seoDescription: String(document.seoDescription ?? ''),
    featured: document.featured === true,
    related: Array.isArray(document.related) ? document.related.join(', ') : '',
    faq: Array.isArray(document.faq) ? document.faq.map((item) => { const row = item as { question?: string; answer?: string }; return `${row.question || ''} | ${row.answer || ''}`; }).join('\n') : '',
    featuredImage: toEditorImage(document.featuredImage),
    blocks: content.map(toEditorBlock).filter((block): block is EditorBlock => Boolean(block)),
    draft: Boolean(draft),
    published: Boolean(published),
  };
}

function toEditorImage(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const image = value as Record<string, unknown>;
  if (typeof image.assetId !== 'string' || typeof image.src !== 'string') return undefined;
  return { assetId: image.assetId, src: image.src, alt: String(image.alt ?? ''), caption: String(image.caption ?? '') };
}

function toEditorBlock(block: RawBlock): EditorBlock | null {
  const key = block._key || randomUUID();
  if (block._type === 'siteImage' && block.assetId && block.src)
    return { kind: 'image', key, assetId: block.assetId, src: block.src, width: block.width, height: block.height, alt: block.alt || '', caption: block.caption || '' };
  if (block._type === 'block') {
    const rawStyle = block.listItem === 'bullet' || block.listItem === 'number' ? block.listItem : block.style;
    const style = ['normal', 'h2', 'h3', 'blockquote', 'bullet', 'number'].includes(rawStyle || '') ? rawStyle as 'normal' | 'h2' | 'h3' | 'blockquote' | 'bullet' | 'number' : 'normal';
    const link = Array.isArray(block.markDefs) ? block.markDefs.find((mark) => typeof mark.href === 'string')?.href : undefined;
    return { kind: 'text', key, style, text: Array.isArray(block.children) ? block.children.map((child) => child.text || '').join('') : '', link, raw: JSON.stringify(block) };
  }
  return { kind: 'preserved', key, label: block._type === 'contentTable' ? 'ตารางเดิม' : 'เนื้อหารูปแบบเดิม', raw: JSON.stringify(block) };
}

export async function saveArticleAction(_previous: ArticleActionState, formData: FormData): Promise<ArticleActionState> {
  await requireSignedIn();
  const config = adminWriteClient();
  if (!config.ready) return { status: 'error', message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}` };

  const parsed = articleFieldsModel.safeParse({
    title: formData.get('title'), slug: formData.get('slug'), summary: formData.get('summary'),
    category: formData.get('category'), tags: formData.get('tags') || '', author: formData.get('author') || '',
    publishedAt: formData.get('publishedAt'), seoTitle: formData.get('seoTitle') || '',
    seoDescription: formData.get('seoDescription') || '', featured: formData.get('featured') === 'yes',
    related: formData.get('related') || '', faq: formData.get('faq') || '',
  });
  if (!parsed.success) return validationState(parsed.error.issues);

  const id = baseId(String(formData.get('id') || `article-${randomUUID()}`));
  let slug = parsed.data.slug || automaticSlug(parsed.data.title, 'article', id);
  const duplicate = await config.client.fetch<number>(`count(*[_type == "article" && slug.current == $slug && !(_id in [$id,$draftId])])`, { slug, id, draftId: draftId(id) });
  if (duplicate) slug = `${slug}-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toLowerCase()}`;

  const blocks = readEditorBlocks(formData);
  const blockErrors = validateBlocks(blocks);
  if (blockErrors.length) return { status: 'error', message: 'กรุณาตรวจช่องที่มีข้อความสีแดง', errors: blockErrors, fieldErrors: { content: blockErrors[0] } };

  const featuredAlt = String(formData.get('featuredAlt') || '').trim();
  if (hasImage(formData.get('featuredImageFile'), formData.get('featuredAssetId')) && !featuredAlt)
    return { status: 'error', message: 'กรุณาตรวจช่องที่มีข้อความสีแดง', fieldErrors: { featuredAlt: 'กรุณากรอกคำอธิบายภาพเมื่อมีรูปหน้าปก' } };

  let destination = '';
  try {
    const featuredImage = await resolveAdminImage(config.client, formData.get('featuredImageFile'), String(formData.get('featuredAssetId') || ''), featuredAlt, String(formData.get('featuredCaption') || ''));
    const content = [];
    for (const block of blocks) {
      if (block.kind === 'text' || block.kind === 'preserved') content.push(portableTextForEditorBlock(block));
      else {
        const image = await resolveAdminImage(config.client, formData.get(`body.file.${block.key}`), block.assetId || '', block.alt, block.caption);
        if (!image) return { status: 'error', message: 'กรุณาตรวจช่องที่มีข้อความสีแดง', fieldErrors: { content: `กรุณาเลือกรูปสำหรับส่วน "${block.alt || block.key}"` } };
        content.push({ _key: block.key, ...image });
      }
    }
    const now = new Date().toISOString();
    const relatedSlugs = tagsFromText(parsed.data.related);
    const relatedDocs = relatedSlugs.length ? await config.client.fetch<Array<{ _id: string; slug: string }>>(`*[_type == "article" && slug.current in $slugs && !(_id match "drafts.*")]{_id,"slug":slug.current}`, { slugs: relatedSlugs }) : [];
    if (relatedDocs.length !== relatedSlugs.length) return { status: 'error', message: 'มี URL บทความเกี่ยวข้องที่หาไม่พบ กรุณาตรวจรายการอีกครั้ง' };
    const document = {
      _id: draftId(id), _type: 'article', title: parsed.data.title, slug: { _type: 'slug', current: slug },
      summary: parsed.data.summary, category: parsed.data.category, tags: tagsFromText(parsed.data.tags), author: parsed.data.author || undefined,
      publishedAt: new Date(parsed.data.publishedAt).toISOString(), updatedAt: now, seoTitle: parsed.data.seoTitle || undefined,
      seoDescription: parsed.data.seoDescription || undefined, featured: parsed.data.featured, ...(featuredImage ? { featuredImage } : {}), content,
      related: relatedDocs.map((item) => ({ _type: 'reference', _key: randomUUID(), _ref: item._id })), faq: faqFromText(parsed.data.faq).map((item) => ({ _type: 'faqItem', _key: randomUUID(), ...item })),
      approvedForPublication: false,
    };
    await config.client.createOrReplace(document);

    const intent = String(formData.get('intent') || 'save');
    if (intent === 'publish') {
      if (formData.get('confirm') !== 'yes') return { status: 'error', message: 'กรุณาตรวจช่องที่มีข้อความสีแดง', fieldErrors: { confirm: 'กรุณาติ๊กยืนยันข้อมูลก่อนเผยแพร่' } };
      const projected = await config.client.fetch<unknown>(`*[_id == $id][0] ${articleProjection}`, { id: draftId(id) });
      const checked = articleModel.safeParse(projected);
      if (!checked.success) return { status: 'error', message: 'เว็บไซต์ยังแสดงบทความนี้ไม่ได้', errors: checked.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`) };
      const liveDocument = { ...document, _id: id, approvedForPublication: true };
      await config.client.transaction().createOrReplace(liveDocument).delete(draftId(id)).commit();
      revalidateTag('cms', 'max');
      revalidatePath('/knowledge', 'layout');
      destination = '/admin/articles?published=1';
    } else {
      destination = `/admin/articles/${id}?saved=1`;
    }
  } catch {
    return { status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
  }
  redirect(destination);
}

function readEditorBlocks(formData: FormData): EditorBlock[] {
  const keys = [...formData.keys()].map((key) => /^body\.(\d+)\.kind$/.exec(key)?.[1]).filter((value): value is string => Boolean(value));
  return [...new Set(keys)].sort((a, b) => Number(a) - Number(b)).map((index) => {
    const kind = String(formData.get(`body.${index}.kind`));
    const key = String(formData.get(`body.${index}.key`) || randomUUID());
    if (kind === 'image') return { kind: 'image' as const, key, assetId: String(formData.get(`body.${index}.assetId`) || ''), alt: String(formData.get(`body.${index}.alt`) || ''), caption: String(formData.get(`body.${index}.caption`) || '') };
    if (kind === 'preserved') return { kind: 'preserved' as const, key, label: 'เนื้อหารูปแบบเดิม', raw: String(formData.get(`body.${index}.raw`) || '') };
    const rawStyle = String(formData.get(`body.${index}.style`) || 'normal');
    const style = ['normal', 'h2', 'h3', 'blockquote', 'bullet', 'number'].includes(rawStyle) ? rawStyle as 'normal' | 'h2' | 'h3' | 'blockquote' | 'bullet' | 'number' : 'normal';
    return { kind: 'text' as const, key, style, text: String(formData.get(`body.${index}.text`) || ''), link: String(formData.get(`body.${index}.link`) || ''), raw: String(formData.get(`body.${index}.raw`) || '') || undefined };
  }).map((block) => {
    if (block.kind === 'image') {
      const index = keys.find((candidate) => String(formData.get(`body.${candidate}.key`)) === block.key);
      if (index) formData.set(`body.file.${block.key}`, formData.get(`body.${index}.file`) || '');
    }
    return block;
  });
}

function automaticSlug(title: string, prefix: string, id: string) {
  const readable = title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56);
  return readable || `${prefix}-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toLowerCase()}`;
}

export async function deleteArticleAction(_previous: DeleteActionState, formData: FormData): Promise<DeleteActionState> {
  await requireSignedIn();
  if (formData.get('confirmDelete') !== 'yes') return { status: 'error', message: 'กรุณายืนยันการลบ' };
  const config = adminWriteClient();
  if (!config.ready) return { status: 'error', message: `ยังตั้งค่าไม่ครบ: ${config.missing.join(', ')}` };
  const id = baseId(String(formData.get('id') || ''));
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]+$/.test(id)) return { status: 'error', message: 'รหัสบทความไม่ถูกต้อง' };
  try {
    const isArticle = await config.client.fetch<boolean>(`count(*[_type == "article" && _id in [$id,$draftId]]) > 0`, { id, draftId: draftId(id) });
    if (!isArticle) return { status: 'error', message: 'ไม่พบบทความที่ต้องการลบ' };
    await config.client.transaction().delete(id).delete(draftId(id)).commit();
  } catch {
    return { status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
  }
  revalidateTag('cms', 'max');
  revalidatePath('/knowledge', 'layout');
  redirect('/admin/articles?deleted=1');
}

function validationState(issues: { path: PropertyKey[]; message: string }[]): ArticleActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] || 'form');
    fieldErrors[field] ||= issue.message;
  }
  return { status: 'error', message: 'กรุณาตรวจช่องที่มีข้อความสีแดง', fieldErrors };
}

function hasImage(file: FormDataEntryValue | null, assetId: FormDataEntryValue | null) {
  return (typeof assetId === 'string' && assetId.trim() !== '') || (typeof file !== 'string' && Boolean(file?.size));
}
