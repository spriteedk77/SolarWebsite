import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import { listProjects } from './actions';
import { ContentStatusBadge } from '@/components/admin/ContentStatusBadge';
import { adminPrimaryButton, adminSecondaryButton } from '@/components/admin/styles';

export const dynamic = 'force-dynamic';

export default async function ProjectsAdminPage({ searchParams }: { searchParams: Promise<{ published?: string; deleted?: string }> }) {
  if (!(await isSignedIn())) redirect('/admin');
  const result = await listProjects(); const notice = await searchParams;
  return <AdminShell signedIn><Container width="wide"><div className="mx-auto w-full max-w-5xl py-10">
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">จัดการเนื้อหา</p><h1 className="mt-2 text-h2">ผลงานติดตั้ง</h1><p className="mt-2 text-body text-ink-600">เพิ่ม แก้ไข เรียงรูป บันทึกร่าง และเผยแพร่โครงการจากที่เดียว</p></div><Link href="/admin/projects/new" className={adminPrimaryButton}>เพิ่มโครงการใหม่</Link></header>
    {(notice.published || notice.deleted) && <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-body font-medium text-green-800">{notice.deleted ? 'ลบโครงการแล้ว' : 'เผยแพร่แล้ว'}</p>}
    {!result.ready ? <div className="mt-8 rounded-card border border-flare-500 bg-white p-6"><h2 className="text-h3">ยังเชื่อมต่อระบบเนื้อหาไม่ได้</h2><p className="mt-3 text-body text-ink-700">ต้องตั้งค่า {result.missing.join(', ')} ในระบบโฮสต์ก่อน</p></div> : result.projects.length === 0 ? <div className="mt-8 rounded-card border border-hairline bg-white p-8 text-center"><h2 className="text-h3">ยังไม่มีโครงการ</h2><p className="mt-2 text-body text-ink-600">เพิ่มโครงการแรกได้เลย</p></div> : <ul className="mt-8 divide-y divide-hairline overflow-hidden rounded-card border border-hairline bg-white">{result.projects.map((project) => <li key={project.id} className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6"><div><h2 className="text-body font-semibold text-navy-900">{project.title}</h2><p className="mt-1 text-caption text-ink-600">{project.province || 'ยังไม่ระบุจังหวัด'} · /{project.slug || 'ระบบจะสร้าง URL'}</p><div className="mt-2 flex flex-wrap gap-2">{project.draft && <ContentStatusBadge status="draft" />}{project.published && <ContentStatusBadge status="published" />}</div></div><Link href={`/admin/projects/${project.id}`} className={adminSecondaryButton}>แก้ไข</Link></li>)}</ul>}
  </div></Container></AdminShell>;
}
