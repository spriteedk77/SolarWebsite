'use client';

import { useMemo, useState } from 'react';

type Row = { name: string; nameEn: string; slug: string; primary: boolean };
const blank = (): Row => ({ name: '', nameEn: '', slug: '', primary: false });

function parse(value: string): Row[] {
  const rows = value.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
    const [name = '', nameEn = '', slug = '', primary = ''] = line.split('|').map((part) => part.trim());
    return { name, nameEn, slug, primary: primary === 'หลัก' };
  });
  return rows.length ? rows : [blank()];
}

export function ServiceAreasEditor({ value, error, describedBy }: { value: string; error?: string; describedBy?: string }) {
  const initial = useMemo(() => parse(value), [value]);
  const [rows, setRows] = useState(initial);
  const encoded = rows.map((row) => [row.name, row.nameEn, row.slug, row.primary ? 'หลัก' : ''].join(' | ').replace(/ \| $/, '')).join('\n');
  const update = (index: number, patch: Partial<Row>) => setRows((current) => current.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="mt-3 space-y-3" aria-describedby={describedBy}>
    <input type="hidden" name="serviceAreas" value={encoded} />
    {rows.map((row, index) => <div key={index} className="grid gap-2 rounded-lg border border-hairline bg-soft p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto] sm:items-end">
      <label className="text-caption font-semibold">จังหวัด<input value={row.name} onChange={(event) => update(index, { name: event.target.value })} className="mt-1 w-full rounded border border-hairline bg-white px-3 py-2 text-body" /></label>
      <label className="text-caption font-semibold">ชื่ออังกฤษ<input value={row.nameEn} onChange={(event) => update(index, { nameEn: event.target.value })} className="mt-1 w-full rounded border border-hairline bg-white px-3 py-2 text-body" /></label>
      <label className="text-caption font-semibold">ชื่อในลิงก์<input value={row.slug} onChange={(event) => update(index, { slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="mt-1 w-full rounded border border-hairline bg-white px-3 py-2 text-body" /></label>
      <label className="flex min-h-11 items-center gap-2 text-caption font-semibold"><input type="checkbox" checked={row.primary} onChange={(event) => update(index, { primary: event.target.checked })} className="h-5 w-5" /> พื้นที่หลัก</label>
      <button type="button" onClick={() => setRows((current) => current.length === 1 ? [blank()] : current.filter((_, i) => i !== index))} className="min-h-11 rounded border border-red-200 bg-white px-3 text-caption text-red-700">ลบ</button>
    </div>)}
    <button type="button" onClick={() => setRows((current) => [...current, blank()])} className="min-h-11 rounded-lg border border-solar-600 bg-white px-4 text-caption font-semibold text-solar-700">+ เพิ่มจังหวัด</button>
    {error && <p className="text-caption font-medium text-red-700">{error}</p>}
  </div>;
}
