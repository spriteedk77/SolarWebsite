import test from 'node:test';
import assert from 'node:assert/strict';
import {
  safeContentHref,
  isActivePromotion,
  projectModel,
  type Promotion,
} from '../src/cms/models';
import { convertBlocks } from '../scripts/cms-conversion';
import {
  MAX_REQUEST_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
} from '../src/lib/upload-policy';
import { projects } from '../src/content/th/projects';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RichContent } from '../src/components/knowledge/RichContent';

test('CMS links reject scripts, protocol-relative and backslash URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//evil.example',
    '/\\evil.example',
    'java\nscript:alert(1)',
  ])
    assert.equal(safeContentHref(value), undefined);
  for (const value of [
    '/projects/example',
    '#section-a',
    'https://example.com/path',
    'tel:+66956971915',
  ])
    assert.equal(safeContentHref(value), value);
});
test('promotion visibility respects active flag and both scheduling boundaries', () => {
  const promo = {
    active: true,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
  } as Promotion;
  assert.equal(isActivePromotion(promo, new Date('2026-08-31')), false);
  assert.equal(isActivePromotion(promo, new Date('2026-09-15')), true);
  assert.equal(isActivePromotion(promo, new Date('2026-10-01')), false);
  assert.equal(
    isActivePromotion({ ...promo, active: false }, new Date('2026-09-15')),
    false,
  );
});
test('migration retains rich text emphasis, links, list ordering and table cells', () => {
  const blocks = convertBlocks([
    { type: 'p', text: 'อ่าน **สำคัญ** และ [ผลงาน](/projects)' },
    { type: 'ol', items: ['หนึ่ง', 'สอง'] },
    { type: 'table', head: ['หัว'], rows: [['ค่า']] },
  ]) as Record<string, unknown>[];
  assert.equal(blocks.length, 4);
  assert.equal(blocks[1].listItem, 'number');
  assert.ok(
    (blocks[0].markDefs as { href: string }[]).some(
      (mark) => mark.href === '/projects',
    ),
  );
  assert.ok(
    (blocks[0].children as { marks: string[] }[]).some((span) =>
      span.marks.includes('strong'),
    ),
  );
  assert.equal(blocks[3]._type, 'contentTable');
  assert.equal(JSON.stringify(blocks).includes('**'), false);
});
test('published project shape rejects missing cover and invalid capacity', () => {
  const project = {
    ...projects[0],
    publishedAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    richContent: convertBlocks([{ type: 'p', text: 'ข้อมูลจากโครงการเดิม' }]),
  };
  assert.equal(projectModel.safeParse(project).success, true);
  assert.equal(
    projectModel.safeParse({ ...project, gallery: [] }).success,
    false,
  );
  assert.equal(
    projectModel.safeParse({ ...project, systemCapacityKw: -1 }).success,
    false,
  );
});

test('CMS rich content is present in server HTML and unsafe links are inert', () => {
  const blocks = convertBlocks([
    { type: 'h2', text: 'รายละเอียดระบบ' },
    { type: 'p', text: 'ข้อมูล **สำคัญ** และ [ผลงาน](/projects)' },
    { type: 'ol', items: ['หนึ่ง', 'สอง'] },
    { type: 'note', text: 'ข้อความอ้างอิง' },
    { type: 'table', head: ['อุปกรณ์'], rows: [['แผง Solar']] },
  ]);
  blocks.push({
    _type: 'block',
    _key: 'unsafe',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'unsafe-span',
        text: 'ลิงก์ไม่ปลอดภัย',
        marks: ['bad'],
      },
    ],
    markDefs: [{ _type: 'link', _key: 'bad', href: 'javascript:alert(1)' }],
  });
  const html = renderToStaticMarkup(createElement(RichContent, { blocks }));
  for (const expected of [
    'รายละเอียดระบบ',
    '<strong>สำคัญ</strong>',
    'href="/projects"',
    '<ol>',
    '<blockquote>',
    '<table>',
    'แผง Solar',
  ])
    assert.ok(html.includes(expected), expected);
  assert.equal(html.includes('javascript:'), false);
});
test('uploads leave room below the host body limit', () => {
  assert.ok(MAX_REQUEST_BYTES < 4.5 * 1000 * 1000);
  assert.ok(MAX_TOTAL_UPLOAD_BYTES + 128 * 1024 < MAX_REQUEST_BYTES);
});
