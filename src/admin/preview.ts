export type AdminPreviewKind = 'articles' | 'projects';

const documentIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]+$/;

/** Returns a safe Admin preview URL only after the document has been saved. */
export function adminPreviewHref(kind: AdminPreviewKind, id: string): string | null {
  const cleanId = id.replace(/^drafts\./, '').trim();
  if (!documentIdPattern.test(cleanId)) return null;
  return `/admin/${kind}/${encodeURIComponent(cleanId)}/preview`;
}

export const previewSaveFirstMessage = 'กรุณาบันทึกฉบับร่างก่อนดูตัวอย่าง';
