'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState, useState } from 'react';
import { saveProjectAction, type ProjectActionState, type ProjectEditorData } from '@/app/admin/projects/actions';
import { CUSTOMER_TYPES } from '@/admin/projects/model';
import { ArticleBodyEditor } from './ArticleBodyEditor';
import { ContentStatusBadge } from './ContentStatusBadge';
import { ImageFileInput } from './ImageFileInput';
import { ProjectGalleryEditor } from './ProjectGalleryEditor';
import { RequiredMark } from './RequiredMark';
import { PreviewButton } from './PreviewButton';
import { adminCheckbox, adminInput, adminPublishButton, adminSecondaryButton } from './styles';

const initialState: ProjectActionState = { status: 'idle' };

export function ProjectForm({ project }: { project: ProjectEditorData }) {
  const [state, action, pending] = useActionState(saveProjectAction, initialState);
  const [pendingIntent, setPendingIntent] = useState<'save' | 'publish'>('save');
  const error = (name: string) => state.fieldErrors?.[name];
  const inputClass = (name: string) => `${adminInput} ${error(name) ? 'border-red-600' : ''}`;

  return <form action={action} className="min-w-0 space-y-8" noValidate>
    <input type="hidden" name="id" value={project.id} /><input type="hidden" name="slug" value={project.slug} />
    <div className="flex flex-wrap gap-2" aria-label="สถานะโครงการ">
      {project.draft && <ContentStatusBadge status="draft" />}
      {project.published && <ContentStatusBadge status="published" />}
      {!project.draft && !project.published && <ContentStatusBadge status="draft" />}
    </div>
    {state.status === 'error' && <div role="alert" className="rounded-card border border-red-300 bg-red-50 p-5 text-body text-red-800"><strong>{state.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'}</strong>{state.errors?.length ? <ul className="mt-2 list-disc pl-5">{state.errors.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>}

    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ข้อมูลโครงการ</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-body font-semibold sm:col-span-2">ชื่อโครงการ<RequiredMark /><input name="title" defaultValue={project.title} className={inputClass('title')} aria-required="true" aria-invalid={Boolean(error('title'))} /><span className="mt-1 block text-caption font-normal text-ink-600">ตัวอย่าง: Solar Rooftop 10.78 kW</span><FieldError message={error('title')} /></label>
        <div className="text-body font-semibold">URL ของโครงการ<p className="mt-1 rounded-lg bg-soft px-4 py-3 font-normal text-ink-600">{project.slug ? `/projects/${project.slug}` : 'ระบบจะสร้างให้อัตโนมัติเมื่อบันทึก'}</p></div>
        <label className="text-body font-semibold">ประเภทลูกค้า <span className="font-normal text-ink-600">(เว้นว่างได้)</span><select name="customerType" defaultValue={project.customerType} className={`${adminInput} cursor-pointer`}><option value="">ไม่ระบุ</option>{CUSTOMER_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-body font-semibold">ชื่อลูกค้า <span className="font-normal text-ink-600">(เมื่อได้รับอนุญาต)</span><input name="customerName" defaultValue={project.customerName} className={adminInput} /></label>
        <label className="text-body font-semibold">สถานที่<RequiredMark /><input name="location" defaultValue={project.location} className={inputClass('location')} aria-required="true" aria-invalid={Boolean(error('location'))} placeholder="อำเภอเมืองเชียงใหม่" /><FieldError message={error('location')} /></label>
        <label className="text-body font-semibold">จังหวัด<RequiredMark /><input name="province" defaultValue={project.province} className={inputClass('province')} aria-required="true" aria-invalid={Boolean(error('province'))} /><FieldError message={error('province')} /></label>
        <label className="text-body font-semibold">วันที่เผยแพร่<RequiredMark /><input name="publishedAt" type="datetime-local" defaultValue={project.publishedAt} className={inputClass('publishedAt')} aria-required="true" aria-invalid={Boolean(error('publishedAt'))} /><FieldError message={error('publishedAt')} /></label>
        <label className="text-body font-semibold sm:col-span-2">คำอธิบายย่อ<RequiredMark /><textarea name="summary" defaultValue={project.summary} rows={3} className={inputClass('summary')} aria-required="true" aria-invalid={Boolean(error('summary'))} /><FieldError message={error('summary')} /></label>
        <label className="flex cursor-pointer items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="featured" value="yes" defaultChecked={project.featured} className={adminCheckbox} /> แนะนำโครงการนี้บนหน้าแรก</label>
      </div>
    </section>

    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ระบบและอุปกรณ์</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <RequiredField label="กำลังติดตั้ง (kW)" error={error('systemCapacity')}><input name="systemCapacity" type="number" min="0.01" step="0.01" defaultValue={project.systemCapacity} className={inputClass('systemCapacity')} aria-required="true" aria-invalid={Boolean(error('systemCapacity'))} /></RequiredField>
        <RequiredField label="ระบบไฟ" error={error('phase')}><select name="phase" defaultValue={project.phase} className={`${inputClass('phase')} cursor-pointer`} aria-required="true" aria-invalid={Boolean(error('phase'))}><option>1 เฟส</option><option>3 เฟส</option></select></RequiredField>
        <RequiredField label="ประเภทระบบ" error={error('systemType')}><input name="systemType" defaultValue={project.systemType} placeholder="On-grid, Hybrid ฯลฯ" className={inputClass('systemType')} aria-required="true" aria-invalid={Boolean(error('systemType'))} /></RequiredField>
        <label className="text-body font-semibold">ระบบติดตามการผลิตไฟ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="monitoring" defaultValue={project.monitoring} className={adminInput} /></label>
        <RequiredField label="รุ่นแผง Solar" error={error('solarPanels')}><input name="solarPanels" defaultValue={project.solarPanels} className={inputClass('solarPanels')} aria-required="true" aria-invalid={Boolean(error('solarPanels'))} /></RequiredField>
        <RequiredField label="จำนวนแผง" error={error('panelQuantity')}><input name="panelQuantity" type="number" min="1" step="1" defaultValue={project.panelQuantity} className={inputClass('panelQuantity')} aria-required="true" aria-invalid={Boolean(error('panelQuantity'))} /></RequiredField>
        <label className="text-body font-semibold">อินเวอร์เตอร์ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="inverter" defaultValue={project.inverter} className={adminInput} /></label>
        <label className="text-body font-semibold">แบตเตอรี่ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="battery" defaultValue={project.battery} className={adminInput} /></label>
        <label className="text-body font-semibold">Optimizer <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="optimizer" defaultValue={project.optimizer} className={adminInput} /></label>
        <label className="text-body font-semibold">ประหยัดโดยประมาณ (บาท/เดือน) <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="estimatedSavings" type="number" min="0" step="1" defaultValue={project.estimatedSavings} className={inputClass('estimatedSavings')} /><FieldError message={error('estimatedSavings')} /></label>
        <label className="flex cursor-pointer items-center gap-3 text-body font-semibold sm:col-span-2"><input type="checkbox" name="zeroExport" value="yes" defaultChecked={project.zeroExport} className={adminCheckbox} /> ใช้ระบบ Zero Export</label>
        <label className="text-body font-semibold">มาตรฐานที่ยืนยันได้ <span className="font-normal text-ink-600">(หนึ่งรายการต่อบรรทัด)</span><textarea name="standards" defaultValue={project.standards} rows={4} className={adminInput} /></label>
        <label className="text-body font-semibold">ขอบเขตงาน <span className="font-normal text-ink-600">(หนึ่งรายการต่อบรรทัด)</span><textarea name="servicesIncluded" defaultValue={project.servicesIncluded} rows={4} className={adminInput} /></label>
        <label className="text-body font-semibold sm:col-span-2">การรับประกัน <span className="font-normal text-ink-600">(หัวข้อ | รายละเอียด | เงื่อนไข หนึ่งรายการต่อบรรทัด)</span><textarea name="warranty" defaultValue={project.warranty} rows={4} className={adminInput} /></label>
      </div>
    </section>

    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8">
      <h2 className="text-h3">ภาพหน้าปก <span className="text-caption font-normal text-ink-600">(ไม่บังคับ)</span></h2><p className="mt-1 text-caption text-ink-600">ไม่มีรูปก็สามารถบันทึกและเผยแพร่ได้ หากเลือกรูปต้องใส่คำอธิบายภาพ</p>
      {project.coverImage?.src && <img src={project.coverImage.src} alt="" className="mt-4 max-h-72 w-full rounded-lg bg-soft object-contain" />}
      <input type="hidden" name="coverAssetId" value={project.coverImage?.assetId ?? ''} />
      <div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="text-body font-semibold">รูปภาพ<ImageFileInput name="coverImageFile" hasImage={Boolean(project.coverImage)} /></div><label className="text-body font-semibold">คำอธิบายภาพ <span className="font-normal text-ink-600">(จำเป็นเมื่อมีรูป)</span><input name="coverAlt" defaultValue={project.coverImage?.alt ?? ''} className={inputClass('coverAlt')} /><FieldError message={error('coverAlt')} /></label><label className="text-body font-semibold sm:col-span-2">คำบรรยายใต้ภาพ <span className="font-normal text-ink-600">(เว้นว่างได้)</span><input name="coverCaption" defaultValue={project.coverImage?.caption ?? ''} className={adminInput} /></label></div>
    </section>

    <ProjectGalleryEditor initialImages={project.gallery} error={error('gallery')} />
    <ArticleBodyEditor initialBlocks={project.blocks} title="รายละเอียดโครงการ" error={error('content')} />
    <section className="rounded-card border border-hairline bg-white p-6 sm:p-8"><h2 className="text-h3">ข้อมูลสำหรับ Google</h2><div className="mt-5 space-y-5"><label className="block text-body font-semibold">ชื่อในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้ชื่อโครงการ)</span><input name="seoTitle" defaultValue={project.seoTitle} maxLength={100} className={inputClass('seoTitle')} /><FieldError message={error('seoTitle')} /></label><label className="block text-body font-semibold">คำอธิบายในผลค้นหา <span className="font-normal text-ink-600">(เว้นว่างเพื่อใช้คำอธิบายย่อ)</span><textarea name="seoDescription" defaultValue={project.seoDescription} maxLength={240} rows={3} className={inputClass('seoDescription')} /><FieldError message={error('seoDescription')} /></label></div></section>
    <section className="sticky bottom-0 z-10 rounded-card border border-hairline bg-white p-5 shadow-card"><label className="flex cursor-pointer items-start gap-3 text-caption text-ink-700"><input type="checkbox" name="confirm" value="yes" className={`${adminCheckbox} mt-1`} /> ยืนยันว่าข้อมูลเป็นจริงและมีสิทธิ์ใช้รูปภาพทั้งหมด (ต้องติ๊กเมื่อเผยแพร่)</label><FieldError message={error('confirm')} /><div className="mt-4 flex flex-wrap gap-3"><PreviewButton kind="projects" id={project.id} /><button name="intent" value="save" disabled={pending} onClick={() => setPendingIntent('save')} className={adminSecondaryButton}>{pending && pendingIntent === 'save' ? 'กำลังบันทึก…' : 'บันทึกฉบับร่าง'}</button><button name="intent" value="publish" disabled={pending} onClick={() => setPendingIntent('publish')} className={adminPublishButton}>{pending && pendingIntent === 'publish' ? 'กำลังเผยแพร่…' : project.published ? 'เผยแพร่การแก้ไข' : 'เผยแพร่โครงการ'}</button></div></section>
  </form>;
}

function FieldError({ message }: { message?: string }) { return message ? <span className="mt-1 block text-caption font-medium text-red-700">{message}</span> : null; }
function RequiredField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="text-body font-semibold">{label}<RequiredMark />{children}<FieldError message={error} /></label>; }
