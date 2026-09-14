'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState } from 'react';
import { ARTICLE_CATEGORIES } from '@/cms/models';
import { ArticleBodyEditor } from './ArticleBodyEditor';
import { saveArticleAction, type ArticleActionState, type ArticleEditorData } from '@/app/admin/articles/actions';

const initialState: ArticleActionState = { status: 'idle' };
const input = 'mt-1 w-full rounded-lg border border-hairline bg-white px-4 py-3 text-body text-ink-900 focus:border-solar-600 focus:outline-none';

export function ArticleForm({ article }: { article: ArticleEditorData }) {
  const [state, action, pending] = useActionState(saveArticleAction, initialState);
  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="id" value={article.id} />
      {state.status === 'error' && (
        <div role="alert" className="rounded-card border border-red-300 bg-red-50 p-5 text-body text-red-800">
          <strong>{state.message}</strong>
          {state.errors?.length ? <ul className="mt-2 list-disc pl-5">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
        </div>
      )}
      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">ข้อมูลบทความ</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-body font-semibold sm:col-span-2">ชื่อบทความ<input name="title" defaultValue={article.title} className={input} required /></label>
          <label className="text-body font-semibold">ชื่อใน URL<input name="slug" defaultValue={article.slug} placeholder="how-to-choose-solar" className={input} required /></label>
          <label className="text-body font-semibold">หมวดหมู่<select name="category" defaultValue={article.category} className={input}>{ARTICLE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="text-body font-semibold sm:col-span-2">คำอธิบายย่อ<textarea name="summary" defaultValue={article.summary} rows={3} className={input} required /></label>
          <label className="text-body font-semibold">ผู้เขียน<input name="author" defaultValue={article.author} className={input} /></label>
          <label className="text-body font-semibold">วันที่เผยแพร่<input name="publishedAt" type="datetime-local" defaultValue={article.publishedAt} className={input} required /></label>
          <label className="text-body font-semibold sm:col-span-2">คำสำคัญ <span className="font-normal text-ink-600">(คั่นด้วยเครื่องหมายจุลภาค)</span><input name="tags" defaultValue={article.tags} className={input} /></label>
          <label className="flex items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="featured" value="yes" defaultChecked={article.featured} className="h-5 w-5" /> แนะนำบทความนี้บนหน้าแรก</label>
        </div>
      </section>
      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">รูปหน้าปก</h2>
        <p className="mt-1 text-caption text-ink-600">ใช้รูปจริง JPG, PNG หรือ WebP ไม่เกิน 3 MB และบอกว่ารูปแสดงอะไร</p>
        {article.featuredImage?.src && <img src={article.featuredImage.src} alt="" className="mt-4 max-h-72 w-full rounded-lg bg-soft object-contain" />}
        <input type="hidden" name="featuredAssetId" value={article.featuredImage?.assetId ?? ''} />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-body font-semibold">เลือกรูปใหม่<input type="file" name="featuredImageFile" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-caption" /></label>
          <label className="text-body font-semibold">คำอธิบายภาพ<input name="featuredAlt" defaultValue={article.featuredImage?.alt ?? ''} className={input} required /></label>
          <label className="text-body font-semibold sm:col-span-2">คำบรรยายใต้ภาพ<input name="featuredCaption" defaultValue={article.featuredImage?.caption ?? ''} className={input} /></label>
        </div>
      </section>
      <ArticleBodyEditor initialBlocks={article.blocks} />
      <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
        <h2 className="text-h3">ข้อมูลสำหรับ Google</h2>
        <div className="mt-5 space-y-5">
          <label className="block text-body font-semibold">ชื่อในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้ชื่อบทความ)</span><input name="seoTitle" defaultValue={article.seoTitle} maxLength={100} className={input} /></label>
          <label className="block text-body font-semibold">คำอธิบายในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้คำอธิบายย่อ)</span><textarea name="seoDescription" defaultValue={article.seoDescription} maxLength={240} rows={3} className={input} /></label>
        </div>
      </section>
      <section className="sticky bottom-0 rounded-card border border-hairline bg-white p-5 shadow-card">
        <label className="flex items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className="mt-1 h-5 w-5 shrink-0" /> ยืนยันว่าข้อมูลเป็นจริงและมีสิทธิ์ใช้รูปภาพทั้งหมด (ต้องติ๊กเมื่อเผยแพร่)</label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button name="intent" value="save" disabled={pending} className="min-h-12 rounded-lg border border-solar-600 bg-white px-6 font-semibold text-solar-700 disabled:opacity-50">{pending ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}</button>
          <button name="intent" value="publish" disabled={pending} className="min-h-12 rounded-lg bg-navy-900 px-6 font-semibold text-white disabled:opacity-50">{pending ? 'กำลังเผยแพร่…' : article.published ? 'เผยแพร่การแก้ไข' : 'เผยแพร่บทความ'}</button>
        </div>
      </section>
    </form>
  );
}
