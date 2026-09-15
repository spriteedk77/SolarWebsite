'use client';

import { useState } from 'react';
import { adminPreviewHref, previewSaveFirstMessage, type AdminPreviewKind } from '@/admin/preview';
import { adminNeutralButton } from './styles';

export function PreviewButton({ kind, id }: { kind: AdminPreviewKind; id: string }) {
  const [message, setMessage] = useState('');
  const href = adminPreviewHref(kind, id);

  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={adminNeutralButton}>
          ดูตัวอย่าง
        </a>
      ) : (
        <button type="button" className={adminNeutralButton} onClick={() => setMessage(previewSaveFirstMessage)}>
          ดูตัวอย่าง
        </button>
      )}
      {message && <p role="status" className="text-caption font-medium text-amber-800">{message}</p>}
    </div>
  );
}
