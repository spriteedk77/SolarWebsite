'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { ImageFileInput } from './ImageFileInput';

export type GalleryEditorImage = { key: string; assetId?: string; src?: string; alt: string; caption: string };
const uid = () => Math.random().toString(36).slice(2, 10);

export function ProjectGalleryEditor({ initialImages }: { initialImages: GalleryEditorImage[] }) {
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
    <p className="mt-1 text-caption text-ink-600">เพิ่ม ลบ และเรียงภาพได้ ภาพทุกภาพต้องเป็นภาพจริงและมีคำอธิบายก่อนเผยแพร่</p>
    <div className="mt-6 space-y-4">{images.map((image, index) => <div key={image.key} className="rounded-lg border border-hairline bg-soft p-4">
      <input type="hidden" name={`gallery.${index}.key`} value={image.key} /><input type="hidden" name={`gallery.${index}.assetId`} value={image.assetId ?? ''} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><strong className="text-caption">ภาพที่ {index + 1}</strong><div className="flex gap-2"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="min-h-11 rounded border border-hairline bg-white px-3 py-1 text-caption disabled:opacity-40">ขึ้น</button><button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="min-h-11 rounded border border-hairline bg-white px-3 py-1 text-caption disabled:opacity-40">ลง</button><button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="min-h-11 rounded border border-red-200 bg-white px-3 py-1 text-caption text-red-700">ลบ</button></div></div>
      <div className="grid gap-4 sm:grid-cols-2">{image.src && <img src={image.src} alt="" className="max-h-48 w-full rounded-lg bg-white object-contain" />}<div className="space-y-3"><label className="block text-caption font-semibold">เลือกรูปใหม่<ImageFileInput name={`gallery.${index}.file`} /></label><label className="block text-caption font-semibold">คำอธิบายภาพ<input name={`gallery.${index}.alt`} defaultValue={image.alt} className="mt-1 w-full rounded-lg border border-hairline bg-white px-3 py-2 text-body" /></label><label className="block text-caption font-semibold">คำบรรยายใต้ภาพ<input name={`gallery.${index}.caption`} defaultValue={image.caption} className="mt-1 w-full rounded-lg border border-hairline bg-white px-3 py-2 text-body" /></label></div></div>
    </div>)}</div>
    <button type="button" onClick={() => setImages((current) => [...current, { key: uid(), alt: '', caption: '' }])} className="mt-5 min-h-11 rounded-lg border border-solar-600 bg-white px-4 font-semibold text-solar-700">+ เพิ่มรูป</button>
  </section>;
}
