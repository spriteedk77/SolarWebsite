'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState } from 'react';
import { saveProjectAction, type ProjectActionState, type ProjectEditorData } from '@/app/admin/projects/actions';
import { CUSTOMER_TYPES } from '@/admin/projects/model';
import { ArticleBodyEditor } from './ArticleBodyEditor';
import { ImageFileInput } from './ImageFileInput';
import { ProjectGalleryEditor } from './ProjectGalleryEditor';

const initialState: ProjectActionState = { status: 'idle' };
const input = 'mt-1 w-full rounded-lg border border-hairline bg-white px-4 py-3 text-body text-ink-900 focus:border-solar-600 focus:outline-none';

export function ProjectForm({ project }: { project: ProjectEditorData }) {
  const [state, action, pending] = useActionState(saveProjectAction, initialState);
  return <form action={action} className="space-y-8">
    <input type="hidden" name="id" value={project.id} /><input type="hidden" name="slug" value={project.slug} />
    {state.status === 'error' && <div role="alert" className="rounded-card border border-red-300 bg-red-50 p-5 text-body text-red-800"><strong>{state.message}</strong>{state.errors?.length ? <ul className="mt-2 list-disc pl-5">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}</div>}
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ข้อมูลโครงการ</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-body font-semibold sm:col-span-2">ชื่อโครงการ<input name="title" defaultValue={project.title} className={input} required /></label>
        <div className="text-body font-semibold">URL ของโครงการ<p className="mt-1 rounded-lg bg-soft px-4 py-3 font-normal text-ink-600">{project.slug ? `/projects/${project.slug}` : 'ระบบจะสร้างให้อัตโนมัติเมื่อบันทึก'}</p></div>
        <label className="text-body font-semibold">ประเภทลูกค้า<select name="customerType" defaultValue={project.customerType} className={input}><option value="">ไม่ระบุ</option>{CUSTOMER_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-body font-semibold">ชื่อลูกค้า <span className="font-normal text-ink-600">(เมื่อได้รับอนุญาต)</span><input name="customerName" defaultValue={project.customerName} className={input} /></label>
        <label className="text-body font-semibold">สถานที่<input name="location" defaultValue={project.location} className={input} required /></label>
        <label className="text-body font-semibold">จังหวัด<input name="province" defaultValue={project.province} className={input} required /></label>
        <label className="text-body font-semibold">วันที่เผยแพร่<input name="publishedAt" type="datetime-local" defaultValue={project.publishedAt} className={input} required /></label>
        <label className="text-body font-semibold sm:col-span-2">คำอธิบายย่อ<textarea name="summary" defaultValue={project.summary} rows={3} className={input} required /></label>
        <label className="flex items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="featured" value="yes" defaultChecked={project.featured} className="h-5 w-5" /> แนะนำโครงการนี้บนหน้าแรก</label>
      </div>
    </section>
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ระบบและอุปกรณ์</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-body font-semibold">กำลังติดตั้ง (kW)<input name="systemCapacity" type="number" min="0.01" step="0.01" defaultValue={project.systemCapacity} className={input} required /></label>
        <label className="text-body font-semibold">ระบบไฟ<select name="phase" defaultValue={project.phase} className={input}><option>1 เฟส</option><option>3 เฟส</option></select></label>
        <label className="text-body font-semibold">ประเภทระบบ<input name="systemType" defaultValue={project.systemType} placeholder="On-grid, Hybrid ฯลฯ" className={input} required /></label>
        <label className="text-body font-semibold">ระบบติดตามการผลิตไฟ<input name="monitoring" defaultValue={project.monitoring} className={input} /></label>
        <label className="text-body font-semibold">รุ่นแผง Solar<input name="solarPanels" defaultValue={project.solarPanels} className={input} required /></label>
        <label className="text-body font-semibold">จำนวนแผง<input name="panelQuantity" type="number" min="1" step="1" defaultValue={project.panelQuantity} className={input} required /></label>
        <label className="text-body font-semibold">อินเวอร์เตอร์<input name="inverter" defaultValue={project.inverter} className={input} /></label>
        <label className="text-body font-semibold">แบตเตอรี่<input name="battery" defaultValue={project.battery} className={input} /></label>
        <label className="text-body font-semibold">Optimizer<input name="optimizer" defaultValue={project.optimizer} className={input} /></label>
        <label className="text-body font-semibold">ประหยัดโดยประมาณ (บาท/เดือน)<input name="estimatedSavings" type="number" min="0" step="1" defaultValue={project.estimatedSavings} className={input} /></label>
        <label className="flex items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="zeroExport" value="yes" defaultChecked={project.zeroExport} className="h-5 w-5" /> ใช้ระบบ Zero Export</label>
        <label className="text-body font-semibold">มาตรฐานที่ยืนยันได้ <span className="font-normal text-ink-600">(หนึ่งรายการต่อบรรทัด)</span><textarea name="standards" defaultValue={project.standards} rows={4} className={input} /></label>
        <label className="text-body font-semibold">ขอบเขตงาน <span className="font-normal text-ink-600">(หนึ่งรายการต่อบรรทัด)</span><textarea name="servicesIncluded" defaultValue={project.servicesIncluded} rows={4} className={input} /></label>
        <label className="text-body font-semibold sm:col-span-2">การรับประกัน <span className="font-normal text-ink-600">(หัวข้อ | รายละเอียด | เงื่อนไข หนึ่งรายการต่อบรรทัด)</span><textarea name="warranty" defaultValue={project.warranty} rows={4} className={input} /></label>
      </div>
    </section>
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ภาพหน้าปก</h2><p className="mt-1 text-caption text-ink-600">บันทึกร่างได้โดยยังไม่มีภาพ แต่ต้องใช้ภาพจริง JPG, PNG หรือ WebP พร้อมคำอธิบายก่อนเผยแพร่</p>
      {project.coverImage?.src && <img src={project.coverImage.src} alt="" className="mt-4 max-h-72 w-full rounded-lg bg-soft object-contain" />}
      <input type="hidden" name="coverAssetId" value={project.coverImage?.assetId ?? ''} />
      <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-body font-semibold">เลือกรูปใหม่<ImageFileInput name="coverImageFile" /></label><label className="text-body font-semibold">คำอธิบายภาพ<input name="coverAlt" defaultValue={project.coverImage?.alt ?? ''} className={input} /></label><label className="text-body font-semibold sm:col-span-2">คำบรรยายใต้ภาพ<input name="coverCaption" defaultValue={project.coverImage?.caption ?? ''} className={input} /></label></div>
    </section>
    <ProjectGalleryEditor initialImages={project.gallery} />
    <ArticleBodyEditor initialBlocks={project.blocks} title="รายละเอียดโครงการ" />
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8"><h2 className="text-h3">ข้อมูลสำหรับ Google</h2><div className="mt-5 space-y-5"><label className="block text-body font-semibold">ชื่อในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้ชื่อโครงการ)</span><input name="seoTitle" defaultValue={project.seoTitle} maxLength={100} className={input} /></label><label className="block text-body font-semibold">คำอธิบายในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้คำอธิบายย่อ)</span><textarea name="seoDescription" defaultValue={project.seoDescription} maxLength={240} rows={3} className={input} /></label></div></section>
    <section className="sticky bottom-0 rounded-card border border-hairline bg-white p-5 shadow-card"><label className="flex items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className="mt-1 h-5 w-5 shrink-0" /> ยืนยันว่าข้อมูลเป็นจริงและมีสิทธิ์ใช้รูปภาพทั้งหมด (ต้องติ๊กเมื่อเผยแพร่)</label><div className="mt-4 flex flex-wrap gap-3"><button name="intent" value="save" disabled={pending} className="min-h-12 rounded-lg border border-solar-600 bg-white px-6 font-semibold text-solar-700 disabled:opacity-50">{pending ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}</button><button name="intent" value="publish" disabled={pending} className="min-h-12 rounded-lg bg-navy-900 px-6 font-semibold text-white disabled:opacity-50">{pending ? 'กำลังเผยแพร่…' : project.published ? 'เผยแพร่การแก้ไข' : 'เผยแพร่โครงการ'}</button></div></section>
  </form>;
}
