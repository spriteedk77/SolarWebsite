'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState, useState } from 'react';
import { saveMediaAction, type MediaActionState } from '@/app/admin/images/actions';
import { ContentStatusBadge } from './ContentStatusBadge';
import { ImageFileInput } from './ImageFileInput';
import { RequiredMark } from './RequiredMark';
import { adminCheckbox, adminDangerButton, adminInput, adminPrimaryButton, adminPublishButton, adminSecondaryButton } from './styles';

type ImageView = { assetId: string; src: string; alt: string; caption: string };
const initial: MediaActionState = { status: 'idle' };

export function ImageUploadForm({ scope, id, field, title, help, image, draft, published, position, allowRemove }: {
  scope: 'homepage' | 'project'; id?: string; field?: 'heroImage' | 'historyBackground';
  title: string; help: string; image?: ImageView; draft?: boolean; published?: boolean;
  position?: 'left' | 'center' | 'right'; allowRemove?: boolean;
}) {
  const [state, action, pending] = useActionState(saveMediaAction, initial);
  const [pendingIntent, setPendingIntent] = useState('save');
  const direct = scope === 'homepage';

  return <form action={action} className="min-w-0 rounded-card border border-hairline bg-white p-6 sm:p-7" noValidate>
    <input type="hidden" name="scope" value={scope} /><input type="hidden" name="id" value={id ?? ''} /><input type="hidden" name="field" value={field ?? ''} /><input type="hidden" name="assetId" value={image?.assetId ?? ''} />
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-h3">{title}</h2><p className="mt-1 text-caption text-ink-600">{help}</p></div>{!direct && <div className="flex flex-wrap gap-2">{draft && <ContentStatusBadge status="draft" />}{published && <ContentStatusBadge status="published" />}</div>}</div>
    {image?.src ? <img src={image.src} alt="" className="mt-4 max-h-64 w-full rounded-lg bg-soft object-contain" /> : <div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-dashed border-hairline bg-soft text-caption text-ink-600">ยังไม่มีรูป</div>}
    <fieldset disabled={pending} className={pending ? 'pointer-events-none opacity-60' : ''}>
      <div className="mt-5 space-y-4">
        <div className="block text-body font-semibold">รูปภาพ<ImageFileInput name="imageFile" hasImage={Boolean(image)} /></div>
        <label className="block text-body font-semibold">คำอธิบายภาพ<RequiredMark /><input name="alt" defaultValue={image?.alt ?? ''} className={adminInput} aria-required="true" /><span className="mt-1 block text-caption font-normal text-ink-600">อธิบายสั้น ๆ ว่าในรูปมีอะไร เพื่อการเข้าถึงและ SEO</span></label>
        <label className="block text-body font-semibold">คำบรรยายใต้ภาพ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="caption" defaultValue={image?.caption ?? ''} className={adminInput} /></label>
        {field === 'historyBackground' && <label className="block text-body font-semibold">ตำแหน่งจุดสำคัญของภาพ<select name="position" defaultValue={position ?? 'left'} className={`${adminInput} cursor-pointer`}><option value="left">ซ้าย</option><option value="center">กลาง</option><option value="right">ขวา</option></select></label>}
        {!direct && <label className="flex cursor-pointer items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className={`${adminCheckbox} mt-1`} /> ยืนยันว่าเป็นรูปจริงและมีสิทธิ์เผยแพร่ (ต้องติ๊กเมื่อเผยแพร่)</label>}
        <div className="flex flex-wrap gap-3">
          {direct ? <button name="intent" value="save" onClick={() => setPendingIntent('save')} className={adminPrimaryButton}>{pending && pendingIntent === 'save' ? 'กำลังบันทึก…' : image ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}</button> : <><button name="intent" value="save" onClick={() => setPendingIntent('save')} className={adminSecondaryButton}>{pending && pendingIntent === 'save' ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}</button><button name="intent" value="publish" onClick={() => setPendingIntent('publish')} className={adminPublishButton}>{pending && pendingIntent === 'publish' ? 'กำลังเผยแพร่…' : published ? 'เผยแพร่รูปใหม่' : 'เผยแพร่'}</button></>}
        </div>
        {allowRemove && image && <div className="border-t border-hairline pt-4"><label className="flex cursor-pointer items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirmRemove" value="yes" className={`${adminCheckbox} mt-1`} /> ยืนยันลบรูปนี้และใช้พื้นหลังสำรองของเว็บไซต์</label><button name="intent" value="remove" formNoValidate onClick={() => setPendingIntent('remove')} className={`${adminDangerButton} mt-3`}>{pending && pendingIntent === 'remove' ? 'กำลังลบ…' : 'ลบรูป'}</button></div>}
        {state.message && <p role={state.status === 'error' ? 'alert' : 'status'} className={`text-caption font-medium ${state.status === 'error' ? 'text-red-700' : 'text-green-700'}`}>{state.message}</p>}
      </div>
    </fieldset>
  </form>;
}
