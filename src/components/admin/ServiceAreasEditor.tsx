'use client';

import { useMemo, useState } from 'react';
import { createServiceAreaSlug } from '@/admin/site-info/model';
import { RequiredMark } from './RequiredMark';
import { adminCheckbox, adminDangerButton, adminInput, adminSecondaryButton } from './styles';

type Row = { name: string; nameEn: string; primary: boolean };
const blank = (): Row => ({ name: '', nameEn: '', primary: false });

function parse(value: string): Row[] {
  const rows = value.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
    const [name = '', nameEn = '', , primary = ''] = line.split('|').map((part) => part.trim());
    return { name, nameEn, primary: primary === 'หลัก' };
  });
  return rows.length ? rows : [blank()];
}

export function ServiceAreasEditor({ value, error, describedBy }: { value: string; error?: string; describedBy?: string }) {
  const initial = useMemo(() => parse(value), [value]);
  const [rows, setRows] = useState(initial);
  const encoded = rows.map((row) => [row.name, row.nameEn, createServiceAreaSlug(row.nameEn), row.primary ? 'หลัก' : ''].join(' | ').replace(/ \| $/, '')).join('\n');
  const update = (index: number, patch: Partial<Row>) => setRows((current) => current.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="mt-3 space-y-3" aria-describedby={describedBy}>
    <input type="hidden" name="serviceAreas" value={encoded} />
    {rows.map((row, index) => <div key={index} className="grid gap-2 rounded-lg border border-hairline bg-soft p-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
      <label className="text-caption font-semibold">จังหวัด<RequiredMark /><input value={row.name} onChange={(event) => update(index, { name: event.target.value })} className={adminInput} aria-required="true" /></label>
      <label className="text-caption font-semibold">ชื่ออังกฤษ<RequiredMark /><input value={row.nameEn} onChange={(event) => update(index, { nameEn: event.target.value })} className={adminInput} aria-required="true" placeholder="Chiang Mai" /></label>
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-caption font-semibold"><input type="checkbox" checked={row.primary} onChange={(event) => update(index, { primary: event.target.checked })} className={adminCheckbox} /> พื้นที่หลัก</label>
      <button type="button" onClick={() => setRows((current) => current.length === 1 ? [blank()] : current.filter((_, i) => i !== index))} className={adminDangerButton}>ลบ</button>
    </div>)}
    <button type="button" onClick={() => setRows((current) => [...current, blank()])} className={adminSecondaryButton}>+ เพิ่มจังหวัด</button>
    {error && <p className="text-caption font-medium text-red-700">{error}</p>}
  </div>;
}
