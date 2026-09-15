import 'server-only';

import type { Article, Project } from '@/content/types';
import { adminWriteClient, draftId } from './admin-write';
import { articleProjection, projectProjection } from './content';
import { articleModel, projectModel } from './models';

export type AdminPreviewResult<T> =
  | { ok: true; data: T; source: 'draft' | 'published' }
  | { ok: false; reason: 'not-configured' | 'not-found' | 'invalid'; errors?: string[] };

const documentIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]+$/;

type SavedVersion =
  | { document: unknown; source: 'draft' | 'published' }
  | { reason: 'not-configured' | 'not-found' };

async function readSavedVersion(id: string, projection: string): Promise<SavedVersion> {
  const config = adminWriteClient();
  if (!config.ready) return { reason: 'not-configured' as const };
  const cleanId = id.replace(/^drafts\./, '');
  if (!documentIdPattern.test(cleanId)) return { reason: 'not-found' as const };

  const [draft, published] = await Promise.all([
    config.client.fetch<unknown | null>(`*[_id == $id][0] ${projection}`, { id: draftId(cleanId) }),
    config.client.fetch<unknown | null>(`*[_id == $id][0] ${projection}`, { id: cleanId }),
  ]);
  if (!draft && !published) return { reason: 'not-found' as const };
  return { document: draft ?? published, source: draft ? 'draft' as const : 'published' as const };
}

export async function loadArticlePreview(id: string): Promise<AdminPreviewResult<Article>> {
  const saved = await readSavedVersion(id, articleProjection);
  if (!('document' in saved)) return { ok: false, reason: saved.reason };
  const parsed = articleModel.safeParse(saved.document);
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'invalid',
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }
  return { ok: true, source: saved.source, data: { ...parsed.data, content: [] } };
}

export async function loadProjectPreview(id: string): Promise<AdminPreviewResult<Project>> {
  const saved = await readSavedVersion(id, projectProjection);
  if (!('document' in saved)) return { ok: false, reason: saved.reason };
  const parsed = projectModel.safeParse(saved.document);
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'invalid',
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }
  return {
    ok: true,
    source: saved.source,
    data: { ...parsed.data, overview: '', objective: [], solution: [], installation: [], benefits: [] },
  };
}
