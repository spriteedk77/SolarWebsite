import test from 'node:test';
import assert from 'node:assert/strict';
import {
  articleFieldsModel,
  tagsFromText,
  textBlock,
  portableTextForEditorBlock,
  validateBlocks,
} from '../src/admin/articles/model';
import { articleModel } from '../src/cms/models';

const fields = {
  title: 'วิธีเลือกแผงโซลาร์',
  slug: 'how-to-choose-solar',
  summary: 'ข้อมูลที่ควรดูก่อนเลือกแผงโซลาร์',
  category: 'พื้นฐาน Solar' as const,
  tags: 'แผงโซลาร์, Solar, แผงโซลาร์',
  author: '',
  publishedAt: '2026-09-15T08:30',
  seoTitle: '',
  seoDescription: '',
  featured: false,
  related: '',
  faq: '',
};

test('article fields reject a URL the public router cannot serve', () => {
  assert.equal(articleFieldsModel.safeParse(fields).success, true);
  for (const slug of ['ภาษาไทย', 'Upper-Case', 'two words', '../secret'])
    assert.equal(articleFieldsModel.safeParse({ ...fields, slug }).success, false, slug);
});

test('article tags are trimmed, empty values removed and duplicates collapsed', () => {
  assert.deepEqual(tagsFromText(fields.tags), ['แผงโซลาร์', 'Solar']);
});

test('an inline article image without alt text cannot be published', () => {
  assert.deepEqual(
    validateBlocks([{ kind: 'image', key: 'photo', assetId: 'image-test', alt: '', caption: '' }]),
    ['รูปในเนื้อหาลำดับที่ 1 ต้องมีคำอธิบายภาพ'],
  );
});

test('the publish model accepts the same text and inline-image blocks the editor writes', () => {
  const date = '2026-09-15T08:30:00.000Z';
  const image = {
    src: 'https://cdn.sanity.io/images/mtnue2wm/production/example-1200x800.jpg',
    alt: 'ช่างกำลังตรวจแผงโซลาร์บนหลังคา',
    width: 1200,
    height: 800,
  };
  const result = articleModel.safeParse({
    id: 'article-test',
    title: fields.title,
    slug: fields.slug,
    summary: fields.summary,
    category: fields.category,
    tags: [],
    publishedAt: date,
    updatedAt: date,
    featuredImage: image,
    featured: false,
    richContent: [textBlock('intro', 'normal', 'เนื้อหา'), { _type: 'siteImage', _key: 'photo', ...image }],
  });
  assert.equal(result.success, true);
});

test('an article can be published without an optional cover image', () => {
  const date = '2026-09-15T08:30:00.000Z';
  const result = articleModel.safeParse({
    id: 'article-without-cover',
    title: fields.title,
    slug: fields.slug,
    summary: fields.summary,
    category: fields.category,
    tags: [],
    publishedAt: date,
    updatedAt: date,
    featured: false,
    richContent: [textBlock('intro', 'normal', 'เนื้อหา')],
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.featuredImage, undefined);
});

test('an article cover image requires alt text only when the image exists', () => {
  const date = '2026-09-15T08:30:00.000Z';
  const base = {
    id: 'article-cover-alt', title: fields.title, slug: fields.slug,
    summary: fields.summary, category: fields.category, tags: [],
    publishedAt: date, updatedAt: date, featured: false,
    richContent: [textBlock('intro', 'normal', 'เนื้อหา')],
  };
  assert.equal(articleModel.safeParse(base).success, true);
  assert.equal(articleModel.safeParse({ ...base, featuredImage: { src: '/images/cover.webp', alt: '', width: 1600, height: 900 } }).success, false);
});

test('saving an untouched migrated block preserves its links and emphasis', () => {
  const original = {
    _type: 'block',
    _key: 'intro',
    style: 'normal',
    children: [{ _type: 'span', _key: 'span', text: 'อ่านเพิ่มเติม', marks: ['strong', 'link'] }],
    markDefs: [{ _type: 'link', _key: 'link', href: '/projects' }],
  };
  assert.deepEqual(
    portableTextForEditorBlock({ kind: 'text', key: 'intro', style: 'normal', text: 'อ่านเพิ่มเติม', raw: JSON.stringify(original) }),
    original,
  );
  const edited = portableTextForEditorBlock({ kind: 'text', key: 'intro', style: 'normal', text: 'ข้อความใหม่', raw: JSON.stringify(original) });
  assert.equal(JSON.stringify(edited).includes('/projects'), false);
});
