import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { adminPreviewHref, previewSaveFirstMessage } from '../src/admin/preview';

test('builds preview URLs only for saved Admin documents', () => {
  assert.equal(adminPreviewHref('articles', 'article-123'), '/admin/articles/article-123/preview');
  assert.equal(adminPreviewHref('projects', 'drafts.project-123'), '/admin/projects/project-123/preview');
  assert.equal(adminPreviewHref('articles', ''), null);
  assert.equal(adminPreviewHref('projects', '../project'), null);
});

test('explains that a new item must be saved before preview', () => {
  assert.equal(previewSaveFirstMessage, 'กรุณาบันทึกฉบับร่างก่อนดูตัวอย่าง');
});

test('preview is read-only and opens the saved version in a separate tab', () => {
  const loader = readFileSync('src/cms/admin-preview.ts', 'utf8');
  const button = readFileSync('src/components/admin/PreviewButton.tsx', 'utf8');

  assert.doesNotMatch(loader, /createOrReplace|\.patch\(|\.transaction\(|\.delete\(|\.commit\(/);
  assert.match(button, /target="_blank"/);
  assert.match(button, /rel="noopener noreferrer"/);
  assert.match(button, /type="button"/);
});
