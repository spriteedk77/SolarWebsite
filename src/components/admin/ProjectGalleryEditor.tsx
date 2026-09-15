'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { ImageFileInput } from './ImageFileInput';
import { RequiredMark } from './RequiredMark';
import { adminDangerButton, adminInput, adminNeutralButton, adminSecondaryButton } from './styles';

export type GalleryEditorImage = { key: string; assetId?: string; src?: string; alt: string; caption: string };
const uid = () => Math.random().toString(36).slice(2, 10);

export function ProjectGalleryEditor({ initialImages, error }: { initialImages: GalleryEditorImage[]; error?: string }) {
  const [images, setImages] = useState(initialImages);
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };
  return <section className="rounded-card border border-hairline bg-white p-6 sm:p-8" aria-labelledby="gallery-title">
    <h2 id="gallery-title" className="text-h3">แกลเลอรีโครงการ</h2>
    <p className="mt-1 text-caption text-ink-600">ส่วนนี้ไม่บังคับ หากเพิ่มรูปต้องใส่คำอธิบายภาพทุกภาพ</p>
    <div className="mt-6 space-y-4">{images.map((image, index) => <div key={image.key} className="rounded-lg border border-hairline bg-soft p-4">
      <input type="hidden" name={`gallery.${index}.key`} value={image.key} /><input type="hidden" name={`gallery.${index}.assetId`} value={image.assetId ?? ''} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><strong className="text-caption">ภาพที่ {index + 1}</strong><div className="flex flex-wrap gap-2"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={adminNeutralButton}>ขึ้น</button><button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className={adminNeutralButton}>ลง</button><button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className={adminDangerButton}>ลบ</button></div></div>
      <div className="grid gap-4 sm:grid-cols-2">{image.src && <img src={image.src} alt="" className="max-h-48 w-full rounded-lg bg-white object-contain" />}<div className="space-y-3"><div className="block text-caption font-semibold">รูปภาพ<ImageFileInput name={`gallery.${index}.file`} hasImage={Boolean(image.src)} /></div><label className="block text-caption font-semibold">คำอธิบายภาพ<RequiredMark /><input name={`gallery.${index}.alt`} defaultValue={image.alt} className={adminInput} aria-required="true" /></label><label className="block text-caption font-semibold">คำบรรยายใต้ภาพ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name={`gallery.${index}.caption`} defaultValue={image.caption} className={adminInput} /></label></div></div>
    </div>)}</div>
    <button type="button" onClick={() => setImages((current) => [...current, { key: uid(), alt: '', caption: '' }])} className={`${adminSecondaryButton} mt-5`}>+ เพิ่มรูป</button>
    {error && <p className="mt-3 text-caption font-medium text-red-700">{error}</p>}
  </section>;
}
