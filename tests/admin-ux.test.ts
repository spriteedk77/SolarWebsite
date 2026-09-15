import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentStatusBadge } from '../src/components/admin/ContentStatusBadge';
import { RequiredMark } from '../src/components/admin/RequiredMark';

test('admin content status badges use the required Thai labels and colors', () => {
  const draft = renderToStaticMarkup(createElement(ContentStatusBadge, { status: 'draft' }));
  const published = renderToStaticMarkup(createElement(ContentStatusBadge, { status: 'published' }));
  assert.match(draft, /ฉบับร่าง/);
  assert.match(draft, /yellow/);
  assert.match(published, /เผยแพร่แล้ว/);
  assert.match(published, /green/);
});

test('the shared required marker is red and accessible', () => {
  const marker = renderToStaticMarkup(createElement(RequiredMark));
  assert.match(marker, /text-red-700/);
  assert.match(marker, /จำเป็น/);
});
