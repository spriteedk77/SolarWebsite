'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState, useState } from 'react';
import { ARTICLE_CATEGORIES } from '@/cms/models';
import { saveArticleAction, type ArticleActionState, type ArticleEditorData } from '@/app/admin/articles/actions';
import { ArticleBodyEditor } from './ArticleBodyEditor';
import { ContentStatusBadge } from './ContentStatusBadge';
import { ImageFileInput } from './ImageFileInput';
import { RequiredMark } from './RequiredMark';
import { PreviewButton } from './PreviewButton';
import { adminCheckbox, adminInput, adminPublishButton, adminSecondaryButton } from './styles';

const initialState: ArticleActionState = { status: 'idle' };

export function ArticleForm({ article }: { article: ArticleEditorData }) {
  const [state, action, pending] = useActionState(saveArticleAction, initialState);
  const [pendingIntent, setPendingIntent] = useState<'save' | 'publish'>('save');
  const error = (name: string) => state.fieldErrors?.[name];
  const inputClass = (name: string) => `${adminInput} ${error(name) ? 'border-red-600' : ''}`;

  return (
    <form action={action} className="min-w-0 space-y-8" noValidate>
      <input type="hidden" name="id" value={article.id} />
      <input type="hidden" name="slug" value={article.slug} />
      <div className="flex flex-wrap gap-2" aria-label="สถานะบทความ">
        {article.draft && <ContentStatusBadge status="draft" />}
        {article.published && <ContentStatusBadge status="published" />}
        {!article.draft && !article.published && <ContentStatusBadge status="draft" />}
      </div>
      {state.status === 'error' && <div role="alert" className="rounded-card border border-red-300 bg-red-50 p-5 text-body text-red-800"><strong>{state.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'}</strong>{state.errors?.length ? <ul className="mt-2 list-disc pl-5">{state.errors.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>}

      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">ข้อมูลบทความ</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-body font-semibold sm:col-span-2">ชื่อบทความ<RequiredMark /><input name="title" defaultValue={article.title} className={inputClass('title')} aria-invalid={Boolean(error('title'))} aria-required="true" /><span className="mt-1 block text-caption font-normal text-ink-600">ตัวอย่าง: วิธีเลือก Solar Rooftop ให้เหมาะกับบ้าน</span><FieldError message={error('title')} /></label>
          <div className="text-body font-semibold">URL ของบทความ<p className="mt-1 rounded-lg bg-soft px-4 py-3 font-normal text-ink-600">{article.slug ? `/knowledge/${article.slug}` : 'ระบบจะสร้างให้อัตโนมัติเมื่อบันทึก'}</p></div>
          <label className="text-body font-semibold">หมวดหมู่<RequiredMark /><select name="category" defaultValue={article.category} className={`${inputClass('category')} cursor-pointer`} aria-required="true">{ARTICLE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select><FieldError message={error('category')} /></label>
          <label className="text-body font-semibold sm:col-span-2">คำอธิบายย่อ<RequiredMark /><textarea name="summary" defaultValue={article.summary} rows={3} className={inputClass('summary')} aria-invalid={Boolean(error('summary'))} aria-required="true" /><span className="mt-1 block text-caption font-normal text-ink-600">สรุปสั้น ๆ ว่าผู้อ่านจะได้อะไรจากบทความนี้</span><FieldError message={error('summary')} /></label>
          <label className="text-body font-semibold">ผู้เขียน <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="author" defaultValue={article.author} className={adminInput} /></label>
          <label className="text-body font-semibold">วันที่เผยแพร่<RequiredMark /><input name="publishedAt" type="datetime-local" defaultValue={article.publishedAt} className={inputClass('publishedAt')} aria-invalid={Boolean(error('publishedAt'))} aria-required="true" /><FieldError message={error('publishedAt')} /></label>
          <label className="text-body font-semibold sm:col-span-2">คำสำคัญ <span className="font-normal text-ink-600">(คั่นด้วยเครื่องหมายจุลภาค)</span><input name="tags" defaultValue={article.tags} className={adminInput} /></label>
          <label className="text-body font-semibold sm:col-span-2">บทความเกี่ยวข้อง <span className="font-normal text-ink-600">(ใส่ URL ท้ายบทความ เช่น how-to-choose-solar คั่นด้วยจุลภาค)</span><input name="related" defaultValue={article.related} className={adminInput} /></label>
          <label className="text-body font-semibold sm:col-span-2">คำถามท้ายบทความ <span className="font-normal text-ink-600">(คำถาม | คำตอบ หนึ่งคู่ต่อบรรทัด)</span><textarea name="faq" defaultValue={article.faq} rows={4} className={adminInput} /></label>
          <label className="flex cursor-pointer items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="featured" value="yes" defaultChecked={article.featured} className={adminCheckbox} /> แนะนำบทความนี้บนหน้าแรก</label>
        </div>
      </section>

      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">รูปหน้าปก <span className="text-caption font-normal text-ink-600">(ไม่บังคับ)</span></h2>
        <p className="mt-1 text-caption text-ink-600">ไม่มีรูปก็สามารถบันทึกและเผยแพร่ได้ หากเลือกรูปต้องใส่คำอธิบายภาพ</p>
        {article.featuredImage?.src && <img src={article.featuredImage.src} alt="" className="mt-4 max-h-72 w-full rounded-lg bg-soft object-contain" />}
        <input type="hidden" name="featuredAssetId" value={article.featuredImage?.assetId ?? ''} />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="text-body font-semibold">รูปภาพ<ImageFileInput name="featuredImageFile" hasImage={Boolean(article.featuredImage)} /></div>
          <label className="text-body font-semibold">คำอธิบายภาพ <span className="font-normal text-ink-600">(จำเป็นเมื่อมีรูป)</span><input name="featuredAlt" defaultValue={article.featuredImage?.alt ?? ''} className={inputClass('featuredAlt')} aria-invalid={Boolean(error('featuredAlt'))} /><FieldError message={error('featuredAlt')} /></label>
          <label className="text-body font-semibold sm:col-span-2">คำบรรยายใต้ภาพ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="featuredCaption" defaultValue={article.featuredImage?.caption ?? ''} className={adminInput} /></label>
        </div>
      </section>

      <ArticleBodyEditor initialBlocks={article.blocks} error={error('content')} />

      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">ข้อมูลสำหรับ Google</h2>
        <div className="mt-5 space-y-5">
          <label className="block text-body font-semibold">ชื่อในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้ชื่อบทความ)</span><input name="seoTitle" defaultValue={article.seoTitle} maxLength={100} className={inputClass('seoTitle')} /><FieldError message={error('seoTitle')} /></label>
          <label className="block text-body font-semibold">คำอธิบายในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้คำอธิบายย่อ)</span><textarea name="seoDescription" defaultValue={article.seoDescription} maxLength={240} rows={3} className={inputClass('seoDescription')} /><FieldError message={error('seoDescription')} /></label>
        </div>
      </section>

      <section className="sticky bottom-0 z-10 rounded-card border border-hairline bg-white p-5 shadow-card">
        <label className="flex cursor-pointer items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className={`${adminCheckbox} mt-1`} /> ยืนยันว่าข้อมูลเป็นจริงและมีสิทธิ์ใช้รูปภาพทั้งหมด (ต้องติ๊กเมื่อเผยแพร่)</label>
        <FieldError message={error('confirm')} />
        <div className="mt-4 flex flex-wrap gap-3">
          <PreviewButton kind="articles" id={article.id} />
          <button name="intent" value="save" disabled={pending} onClick={() => setPendingIntent('save')} className={adminSecondaryButton}>{pending && pendingIntent === 'save' ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}</button>
          <button name="intent" value="publish" disabled={pending} onClick={() => setPendingIntent('publish')} className={adminPublishButton}>{pending && pendingIntent === 'publish' ? 'กำลังเผยแพร่…' : article.published ? 'เผยแพร่การแก้ไข' : 'เผยแพร่บทความ'}</button>
        </div>
      </section>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1 block text-caption font-medium text-red-700">{message}</span> : null;
}
