'use client';

import { useState } from 'react';

/** Shrinks phone photos before the form is sent, so several images fit safely in one request. */
export function ImageFileInput({ name }: { name: string }) {
  const [status, setStatus] = useState('');
  return <>
    <input
      type="file"
      name={name}
      accept="image/jpeg,image/png,image/webp"
      className="mt-2 block w-full text-caption"
      onChange={async (event) => {
        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file || file.size <= 1_200_000 || typeof createImageBitmap !== 'function') {
          setStatus(file ? `${(file.size / 1_000_000).toFixed(1)} MB` : '');
          return;
        }
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
        }
      }}
    />
    {status && <span className="mt-1 block text-caption text-ink-600">{status}</span>}
  </>;
}
