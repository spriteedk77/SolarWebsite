import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PreviewNotice } from '@/components/admin/PreviewNotice';
import { PreviewUnavailable } from '@/components/admin/PreviewUnavailable';
import { RichContent } from '@/components/knowledge/RichContent';
import { SiteShell } from '@/components/layout/SiteShell';
import { PageHero } from '@/components/layout/PageHero';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { loadProjectPreview } from '@/cms/admin-preview';
import { isSignedIn } from '@/lib/admin-session';
import { formatKw } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ดูตัวอย่างโครงการ', robots: { index: false, follow: false } };

export default async function ProjectPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) redirect('/admin');
  const { id } = await params;
  const editorHref = `/admin/projects/${encodeURIComponent(id.replace(/^drafts\./, ''))}`;
  const result = await loadProjectPreview(id);
  if (!result.ok) return <PreviewUnavailable editorHref={editorHref} errors={result.errors} />;
  const project = result.data;

  const specs = [
    ['กำลังติดตั้ง', `${formatKw(project.systemCapacityKw)} kW`],
    ['ระบบไฟฟ้า', project.phase],
    ['รูปแบบระบบ', project.systemType],
    ['แผงโซลาร์', project.solarPanel],
    ['จำนวนแผง', `${project.panelQuantity} แผง`],
    ['สถานที่', project.location],
  ];

  return (
    <SiteShell>
      <PreviewNotice source={result.source} editorHref={editorHref} />
      <PageHero
        crumbs={[{ name: 'หน้าแรก', path: '/' }, { name: 'ผลงานติดตั้ง', path: '/projects' }, { name: project.title, path: '#' }]}
        eyebrow={project.customerName ?? project.province}
        title={project.title}
        lead={project.summary}
      >
        <ul className="mt-7 flex flex-wrap gap-2.5">
          <li><Badge tone="onNavy" className="px-4 py-2 text-body"><Icon name="bolt" className="h-4 w-4 text-amber-brand" />{formatKw(project.systemCapacityKw)} kW</Badge></li>
          <li><Badge tone="onNavy" className="px-4 py-2 text-body">{project.phase}</Badge></li>
          {project.zeroExport && <li><Badge tone="onNavy" className="px-4 py-2 text-body">Zero Export</Badge></li>}
          <li><Badge tone="onNavy" className="px-4 py-2 text-body"><Icon name="map-pin" className="h-4 w-4" />{project.province}</Badge></li>
        </ul>
      </PageHero>
      <Section tone="white" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7">
            <ProjectGallery images={project.gallery} />
            <RichContent blocks={project.richContent ?? []} />
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-card border border-hairline bg-white shadow-card lg:sticky lg:top-20">
              <h2 className="border-b border-hairline px-6 py-4 text-h3">ข้อมูลระบบ</h2>
              <dl className="divide-y divide-hairline">{specs.map(([label, value]) => <div key={label} className="flex flex-wrap gap-x-4 gap-y-1 px-6 py-3.5"><dt className="min-w-32 text-caption text-ink-600">{label}</dt><dd className="flex-1 text-body font-medium text-navy-900">{value}</dd></div>)}</dl>
            </div>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
