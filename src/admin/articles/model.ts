import { z } from 'zod';
import { ARTICLE_CATEGORIES, safeContentHref } from '@/cms/models';

const required = (label: string) => z.string().trim().min(1, `กรุณากรอก${label}`);

export const articleFieldsModel = z.object({
  title: required('ชื่อบทความ'),
  slug: z.string().trim().refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), 'URL ไม่ถูกต้อง'),
  summary: required('คำอธิบายย่อ'),
  category: z.enum(ARTICLE_CATEGORIES),
  tags: z.string(),
  author: z.string().trim(),
  publishedAt: z.string().trim().min(1, 'กรุณาเลือกวันที่เผยแพร่'),
  seoTitle: z.string().trim().max(100, 'ชื่อสำหรับ Google ยาวเกิน 100 ตัวอักษร'),
  seoDescription: z.string().trim().max(240, 'คำอธิบายสำหรับ Google ยาวเกิน 240 ตัวอักษร'),
  featured: z.boolean(),
  related: z.string(),
  faq: z.string(),
});

export type ArticleFields = z.infer<typeof articleFieldsModel>;

export type EditorTextBlock = {
  kind: 'text';
  key: string;
  style: 'normal' | 'h2' | 'h3' | 'blockquote' | 'bullet' | 'number';
  text: string;
  link?: string;
  raw?: string;
};
export type EditorImageBlock = {
  kind: 'image';
  key: string;
  assetId?: string;
  src?: string;
  width?: number;
  height?: number;
  alt: string;
  caption: string;
};
export type EditorPreservedBlock = {
  kind: 'preserved';
  key: string;
  label: string;
  raw: string;
};
export type EditorBlock = EditorTextBlock | EditorImageBlock | EditorPreservedBlock;

export function textBlock(key: string, style: EditorTextBlock['style'], text: string, link?: string) {
  const href = safeContentHref(link);
  const listItem = style === 'bullet' || style === 'number' ? style : undefined;
  return {
    _type: 'block',
    _key: key,
    style: listItem ? 'normal' : style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: href ? [{ _type: 'link', _key: `${key}-link`, href }] : [],
    children: [{ _type: 'span', _key: `${key}-span`, text: text.trim(), marks: href ? [`${key}-link`] : [] }],
  };
}

export function portableTextForEditorBlock(block: EditorTextBlock | EditorPreservedBlock) {
  if (block.kind === 'preserved') return JSON.parse(block.raw) as Record<string, unknown>;
  if (block.raw) {
    try {
      const original = JSON.parse(block.raw) as { _key?: string; style?: string; listItem?: string; markDefs?: { href?: string }[]; children?: { text?: string }[] };
      const originalText = Array.isArray(original.children) ? original.children.map((child) => child.text || '').join('') : '';
      const originalStyle = original.listItem === 'bullet' || original.listItem === 'number' ? original.listItem : original.style || 'normal';
      const originalLink = original.markDefs?.find((mark) => typeof mark.href === 'string')?.href || '';
      if (originalText === block.text && originalStyle === block.style && (block.link === undefined || originalLink === block.link))
        return { ...original, _key: block.key };
    } catch {
      // Hidden form values are untrusted; use the visible fields if parsing fails.
    }
  }
  return textBlock(block.key, block.style, block.text, block.link);
}

export function tagsFromText(value: string): string[] {
  return [...new Set(value.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean))];
}

export function faqFromText(value: string) {
  return value.split(/\r?\n/).map((line) => {
    const [question = '', ...answerParts] = line.split('|');
    return { question: question.trim(), answer: answerParts.join('|').trim() };
  }).filter((item) => item.question && item.answer);
}

export function validateBlocks(blocks: EditorBlock[]): string[] {
  const errors: string[] = [];
  if (!blocks.length) errors.push('เพิ่มเนื้อหาอย่างน้อย 1 ส่วน');
  blocks.forEach((block, index) => {
    if (block.kind === 'text' && !block.text.trim()) errors.push(`เนื้อหาส่วนที่ ${index + 1} ยังว่าง`);
    if (block.kind === 'text' && block.link && !safeContentHref(block.link)) errors.push(`ลิงก์ในเนื้อหาส่วนที่ ${index + 1} ไม่ถูกต้อง`);
    if (block.kind === 'image' && !block.alt.trim()) errors.push(`รูปในเนื้อหาลำดับที่ ${index + 1} ต้องมีคำอธิบายภาพ`);
  });
  return errors;
}
