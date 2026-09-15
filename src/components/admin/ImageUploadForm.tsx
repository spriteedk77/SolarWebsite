'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState } from 'react';
import { saveMediaAction, type MediaActionState } from '@/app/admin/images/actions';
import { ImageFileInput } from './ImageFileInput';

type ImageView = { assetId: string; src: string; alt: string; caption: string };
const initial: MediaActionState = { status: 'idle' };

export function ImageUploadForm({ scope, id, field, title, help, image, published, position, allowRemove }: {
  scope: 'homepage' | 'project'; id?: string; field?: 'heroImage' | 'historyBackground';
  title: string; help: string; image?: ImageView; published?: boolean;
  position?: 'left' | 'center' | 'right';
  allowRemove?: boolean;
}) {
  const [state, action, pending] = useActionState(saveMediaAction, initial);
  return <form action={action} className="rounded-card border border-hairline bg-white p-6 sm:p-7">
    <input type="hidden" name="scope" value={scope} /><input type="hidden" name="id" value={id ?? ''} /><input type="hidden" name="field" value={field ?? ''} /><input type="hidden" name="assetId" value={image?.assetId ?? ''} />
    <h2 className="text-h3">{title}</h2><p className="mt-1 text-caption text-ink-600">{help}</p>
    {image?.src ? <img src={image.src} alt="" className="mt-4 max-h-64 w-full rounded-lg bg-soft object-contain" /> : <div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-dashed border-hairline bg-soft text-caption text-ink-600">ยังไม่มีรูปจริง</div>}
    <div className="mt-5 space-y-4">
      <label className="block text-body font-semibold">เลือกรูปใหม่<ImageFileInput name="imageFile" /></label>
      <label className="block text-body font-semibold">คำอธิบายภาพ<input name="alt" defaultValue={image?.alt ?? ''} className="mt-1 w-full rounded-lg border border-hairline px-4 py-3 text-body" required /></label>
      <label className="block text-body font-semibold">คำบรรยายใต้ภาพ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="caption" defaultValue={image?.caption ?? ''} className="mt-1 w-full rounded-lg border border-hairline px-4 py-3 text-body" /></label>
      {field === 'historyBackground' && <label className="block text-body font-semibold">ตำแหน่งจุดสำคัญของภาพ<select name="position" defaultValue={position ?? 'left'} className="mt-1 w-full rounded-lg border border-hairline bg-white px-4 py-3 text-body"><option value="left">ซ้าย</option><option value="center">กลาง</option><option value="right">ขวา</option></select></label>}
      <label className="flex items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className="mt-1 h-5 w-5 shrink-0" /> ยืนยันว่าเป็นรูปจริงและมีสิทธิ์เผยแพร่ (ต้องติ๊กเมื่อเผยแพร่)</label>
      <div className="flex flex-wrap gap-3"><button name="intent" value="save" disabled={pending} className="min-h-11 rounded-lg border border-solar-600 px-4 font-semibold text-solar-700 disabled:opacity-50">บันทึกฉบับร่าง</button><button name="intent" value="publish" disabled={pending} className="min-h-11 rounded-lg bg-navy-900 px-4 font-semibold text-white disabled:opacity-50">{published ? 'เผยแพร่รูปใหม่' : 'เผยแพร่'}</button></div>
      {allowRemove && image && <div className="border-t border-hairline pt-4"><label className="flex items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirmRemove" value="yes" className="mt-1 h-5 w-5 shrink-0" /> ยืนยันลบรูปนี้และใช้พื้นหลังสำรองของเว็บไซต์</label><button name="intent" value="remove" formNoValidate disabled={pending} className="mt-3 min-h-11 rounded-lg border border-red-300 px-4 font-semibold text-red-700 disabled:opacity-50">ลบรูปและเผยแพร่</button></div>}
      {state.message && <p role={state.status === 'error' ? 'alert' : 'status'} className={`text-caption font-medium ${state.status === 'error' ? 'text-red-700' : 'text-green-700'}`}>{state.message}</p>}
    </div>
  </form>;
}
