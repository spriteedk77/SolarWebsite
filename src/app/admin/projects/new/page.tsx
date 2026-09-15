import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import type { ProjectEditorData } from '../actions';

export const dynamic = 'force-dynamic';
export default async function NewProjectPage() {
  if (!(await isSignedIn())) redirect('/admin');
  const project: ProjectEditorData = { id: '', title: '', slug: '', summary: '', customerName: '', customerType: '', location: '', province: 'เชียงใหม่', systemCapacity: '', phase: '3 เฟส', solarPanels: '', panelQuantity: '', inverter: '', battery: '', optimizer: '', systemType: 'On-grid', zeroExport: false, monitoring: '', estimatedSavings: '', standards: '', servicesIncluded: '', warranty: '', publishedAt: new Date().toISOString().slice(0, 16), seoTitle: '', seoDescription: '', featured: false, gallery: [], blocks: [{ kind: 'text', key: 'opening', style: 'normal', text: '' }], published: false };
  return <AdminShell signedIn><Container width="wide"><div className="mx-auto w-full max-w-4xl py-10"><header className="mb-8"><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">ผลงานติดตั้ง</p><h1 className="mt-2 text-h2">เพิ่มโครงการใหม่</h1><p className="mt-2 text-body text-ink-600">บันทึกฉบับร่างได้ตลอด โครงการจะไม่ขึ้นเว็บจนกดเผยแพร่</p></header><ProjectForm project={project} /></div></Container></AdminShell>;
}
