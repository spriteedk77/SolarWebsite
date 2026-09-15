'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import type { EditorBlock, EditorTextBlock } from '@/admin/articles/model';
import { ImageFileInput } from './ImageFileInput';
import { RequiredMark } from './RequiredMark';
import { adminDangerButton, adminInput, adminNeutralButton, adminSecondaryButton } from './styles';

const uid = () => Math.random().toString(36).slice(2, 10);

export function ArticleBodyEditor({ initialBlocks, title = 'เนื้อหาบทความ', error }: { initialBlocks: EditorBlock[]; title?: string; error?: string }) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);

  const addText = (style: EditorTextBlock['style'] = 'normal') =>
    setBlocks((current) => [...current, { kind: 'text', key: uid(), style, text: '' }]);
  const addImage = () =>
    setBlocks((current) => [...current, { kind: 'image', key: uid(), alt: '', caption: '' }]);
  const remove = (index: number) => setBlocks((current) => current.filter((_, i) => i !== index));
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  return (
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8" aria-labelledby="article-body-title">
      <h2 id="article-body-title" className="text-h3">{title}<RequiredMark /></h2>
      <p className="mt-1 text-caption text-ink-600">เรียงจากบนลงล่าง เพิ่มรูปตรงตำแหน่งที่ต้องการให้แสดง และใส่คำอธิบายภาพทุกครั้ง</p>
      <div className="mt-6 space-y-4">
        {blocks.map((block, index) => (
          <div key={block.key} className="rounded-lg border border-hairline bg-soft p-4">
            <input type="hidden" name={`body.${index}.kind`} value={block.kind} />
            <input type="hidden" name={`body.${index}.key`} value={block.key} />
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-caption text-navy-900">ส่วนที่ {index + 1} · {block.kind === 'image' ? 'รูปภาพ' : block.kind === 'preserved' ? block.label : 'ข้อความ'}</strong>
              <div className="flex gap-2">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={adminNeutralButton} aria-label={`เลื่อนส่วนที่ ${index + 1} ขึ้น`}>ขึ้น</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} className={adminNeutralButton} aria-label={`เลื่อนส่วนที่ ${index + 1} ลง`}>ลง</button>
                <button type="button" onClick={() => remove(index)} className={adminDangerButton}>ลบ</button>
              </div>
            </div>
            {block.kind === 'text' ? (
              <div className="grid gap-3 sm:grid-cols-[11rem_1fr]">
                {block.raw && <input type="hidden" name={`body.${index}.raw`} value={block.raw} />}
                <label className="text-caption font-semibold">รูปแบบ
                  <select name={`body.${index}.style`} defaultValue={block.style} className={`${adminInput} cursor-pointer`}>
                    <option value="normal">ย่อหน้า</option><option value="h2">หัวข้อหลัก</option><option value="h3">หัวข้อย่อย</option><option value="blockquote">ข้อความเน้น</option><option value="bullet">รายการหัวข้อ</option><option value="number">รายการลำดับ</option>
                  </select>
                </label>
                <label className="text-caption font-semibold">ข้อความ<RequiredMark />
                  <textarea name={`body.${index}.text`} defaultValue={block.text} rows={block.style === 'normal' ? 5 : 2} className={adminInput} />
                </label>
                <label className="text-caption font-semibold sm:col-start-2">ลิงก์ของข้อความนี้ <span className="font-normal text-ink-600">(เว้นว่างได้)</span>
                  <input name={`body.${index}.link`} defaultValue={block.link ?? ''} placeholder="https://... หรือ /contact" className={adminInput} />
                </label>
              </div>
            ) : block.kind === 'image' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {block.src && <img src={block.src} alt="" className="max-h-48 w-full rounded-lg bg-white object-contain" />}
                <div className="space-y-3">
                  <input type="hidden" name={`body.${index}.assetId`} value={block.assetId ?? ''} />
                  <div className="block text-caption font-semibold">รูปภาพ
                    <ImageFileInput name={`body.${index}.file`} hasImage={Boolean(block.src)} />
                  </div>
                  <label className="block text-caption font-semibold">คำอธิบายภาพ<RequiredMark />
                    <input name={`body.${index}.alt`} defaultValue={block.alt} className={adminInput} aria-required="true" />
                  </label>
                  <label className="block text-caption font-semibold">คำบรรยายใต้ภาพ
                    <input name={`body.${index}.caption`} defaultValue={block.caption} className={adminInput} />
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <input type="hidden" name={`body.${index}.raw`} value={block.raw} />
                <p className="text-caption text-ink-700">ส่วนนี้มาจากบทความเดิมและจะถูกเก็บไว้ครบถ้วน คุณสามารถเลื่อนหรือลบได้</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => addText()} className={adminSecondaryButton}>+ ย่อหน้า</button>
        <button type="button" onClick={() => addText('h2')} className={adminNeutralButton}>+ หัวข้อ</button>
        <button type="button" onClick={() => addText('bullet')} className={adminNeutralButton}>+ รายการ</button>
        <button type="button" onClick={addImage} className={adminNeutralButton}>+ รูปในบทความ</button>
      </div>
      {error && <p className="mt-3 text-caption font-medium text-red-700">{error}</p>}
    </section>
  );
}
