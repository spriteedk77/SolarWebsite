'use client';

import { useId, useState } from 'react';
import { adminSecondaryButton } from './styles';

/** Shrinks phone photos before the form is sent, so several images fit safely in one request. */
export function ImageFileInput({ name, hasImage = false }: { name: string; hasImage?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  return <div className="mt-2 flex flex-wrap items-center gap-3">
    <input
      id={id}
      type="file"
      name={name}
      accept="image/jpeg,image/png,image/webp"
      className="sr-only"
      disabled={busy}
      onChange={async (event) => {
        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file || file.size <= 1_200_000 || typeof createImageBitmap !== 'function') {
          setStatus(file ? `${(file.size / 1_000_000).toFixed(1)} MB` : '');
          return;
        }
        setBusy(true);
        setStatus('กำลังย่อรูป…');
        try {
          const bitmap = await createImageBitmap(file);
          const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(bitmap.width * scale);
          canvas.height = Math.round(bitmap.height * scale);
          canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          bitmap.close();
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
          if (blob && blob.size < file.size) {
            const transfer = new DataTransfer();
            transfer.items.add(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' }));
            input.files = transfer.files;
            setStatus(`เตรียมแล้ว ${(blob.size / 1_000_000).toFixed(1)} MB`);
          } else setStatus(`${(file.size / 1_000_000).toFixed(1)} MB`);
        } catch {
          setStatus(`${(file.size / 1_000_000).toFixed(1)} MB — ระบบจะตรวจอีกครั้งตอนบันทึก`);
        } finally {
          setBusy(false);
        }
      }}
    />
    <label htmlFor={id} aria-disabled={busy} className={`${adminSecondaryButton} ${busy ? 'pointer-events-none opacity-50' : ''}`}>
      {busy ? 'กำลังเตรียมรูป…' : hasImage ? 'เปลี่ยนรูป' : 'เลือกรูป'}
    </label>
    <span aria-live="polite" className="text-caption text-ink-600">
      {status || (hasImage ? 'ใช้รูปเดิมอยู่' : 'ยังไม่ได้เลือกรูป')}
    </span>
  </div>;
}
