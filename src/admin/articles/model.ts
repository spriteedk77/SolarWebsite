import { z } from 'zod';
import { ARTICLE_CATEGORIES } from '@/cms/models';

const required = (label: string) => z.string().trim().min(1, `กรุณากรอก${label}`);

export const articleFieldsModel = z.object({
  title: required('ชื่อบทความ'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL ใช้ a-z ตัวเลข และขีดกลางเท่านั้น'),
  summary: required('คำอธิบายย่อ'),
  category: z.enum(ARTICLE_CATEGORIES),
  tags: z.string(),
  author: z.string().trim(),
  publishedAt: z.string().trim().min(1, 'กรุณาเลือกวันที่เผยแพร่'),
  seoTitle: z.string().trim().max(100, 'ชื่อสำหรับ Google ยาวเกิน 100 ตัวอักษร'),
  seoDescription: z.string().trim().max(240, 'คำอธิบายสำหรับ Google ยาวเกิน 240 ตัวอักษร'),
  featured: z.boolean(),
});

export type ArticleFields = z.infer<typeof articleFieldsModel>;

export type EditorTextBlock = {
  kind: 'text';
  key: string;
  style: 'normal' | 'h2' | 'h3' | 'blockquote';
  text: string;
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

export function textBlock(key: string, style: EditorTextBlock['style'], text: string) {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-span`, text: text.trim(), marks: [] }],
  };
}

export function portableTextForEditorBlock(block: EditorTextBlock | EditorPreservedBlock) {
  if (block.kind === 'preserved') return JSON.parse(block.raw) as Record<string, unknown>;
  if (block.raw) {
    try {
      const original = JSON.parse(block.raw) as { _key?: string; style?: string; children?: { text?: string }[] };
      const originalText = Array.isArray(original.children) ? original.children.map((child) => child.text || '').join('') : '';
      if (originalText === block.text && (original.style || 'normal') === block.style)
        return { ...original, _key: block.key };
    } catch {
      // Hidden form values are untrusted; use the visible fields if parsing fails.
    }
  }
  return textBlock(block.key, block.style, block.text);
}

export function tagsFromText(value: string): string[] {
  return [...new Set(value.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean))];
}

export function validateBlocks(blocks: EditorBlock[]): string[] {
  const errors: string[] = [];
  if (!blocks.length) errors.push('เพิ่มเนื้อหาอย่างน้อย 1 ส่วน');
  blocks.forEach((block, index) => {
    if (block.kind === 'text' && !block.text.trim()) errors.push(`เนื้อหาส่วนที่ ${index + 1} ยังว่าง`);
    if (block.kind === 'image' && !block.alt.trim()) errors.push(`รูปในเนื้อหาลำดับที่ ${index + 1} ต้องมีคำอธิบายภาพ`);
  });
  return errors;
}
