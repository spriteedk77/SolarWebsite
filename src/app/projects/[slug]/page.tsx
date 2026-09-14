import { RichContent } from '@/components/knowledge/RichContent';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer, Note } from '@/components/ui/Note';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getProject, getProjects } from '@/content';
import {
  customerTypeLabels,
  type Project,
  type SpecRow,
} from '@/content/types';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph, projectSchema } from '@/lib/schema';
import { disclaimers, quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import { formatKw, formatThb } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project)
    return buildMetadata({
      title: 'ไม่พบโครงการ',
      description: '',
      path: '/projects',
      noIndex: true,
    });

  return buildMetadata({
    // The project title is already long; the layout appends the brand.
    title: project.seoTitle || project.title,
    description:
      project.seoDescription ||
      `${project.summary} ดูสเปกระบบ อุปกรณ์ที่ใช้ และรายละเอียดการติดตั้งของโครงการใน${project.province}`,
    path: `/projects/${project.slug}`,
    image: project.gallery[0]
      ? {
          url: project.gallery[0].src,
          width: project.gallery[0].width,
          height: project.gallery[0].height,
          alt: project.gallery[0].alt,
        }
      : undefined,
  });
}

/** Builds the specification table from whatever the project actually has. */
function specRows(project: Project): SpecRow[] {
  const rows: SpecRow[] = [
    {
      label: 'กำลังติดตั้ง',
      value: `${formatKw(project.systemCapacityKw)} kW`,
    },
    { label: 'ระบบไฟฟ้า', value: project.phase },
    { label: 'รูปแบบระบบ', value: project.systemType },
    { label: 'แผงโซลาร์', value: project.solarPanel },
    { label: 'จำนวนแผง', value: `${project.panelQuantity} แผง` },
  ];

  if (project.inverter)
    rows.push({ label: 'อินเวอร์เตอร์', value: project.inverter });
  if (project.battery)
    rows.push({ label: 'แบตเตอรี่', value: project.battery });
  if (project.optimizer)
    rows.push({ label: 'Optimizer', value: project.optimizer });
  rows.push({
    label: 'Zero Export',
    value: project.zeroExport ? 'มี' : 'ไม่มี',
  });
  if (project.monitoring)
    rows.push({ label: 'Monitoring', value: project.monitoring });
  rows.push({ label: 'สถานที่', value: project.location });
  if (project.customerType)
    rows.push({
      label: 'ประเภทลูกค้า',
      value: customerTypeLabels[project.customerType],
    });

  return rows;
}

function NarrativeBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-h2">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-body text-ink-700"
          >
            <Icon
              name="check"
              className="mt-1.5 h-5 w-5 shrink-0 text-flare-600"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { cta } = await getSiteData();
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await getProjects();
  const others = all.filter((item) => item.slug !== project.slug).slice(0, 3);

  const crumbs = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'ผลงานติดตั้ง', path: '/projects' },
    { name: project.title, path: `/projects/${project.slug}` },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={project.customerName ?? project.province}
        title={project.title}
        lead={project.summary}
      >
        <ul className="mt-7 flex flex-wrap gap-2.5">
          <li>
            <Badge tone="onNavy" className="px-4 py-2 text-body">
              <Icon name="bolt" className="h-4 w-4 text-amber-brand" />
              {formatKw(project.systemCapacityKw)} kW
            </Badge>
          </li>
          <li>
            <Badge tone="onNavy" className="px-4 py-2 text-body">
              {project.phase}
            </Badge>
          </li>
          {project.zeroExport && (
            <li>
              <Badge tone="onNavy" className="px-4 py-2 text-body">
                Zero Export
              </Badge>
            </li>
          )}
          {project.battery && (
            <li>
              <Badge tone="onNavy" className="px-4 py-2 text-body">
                Solar + Battery
              </Badge>
            </li>
          )}
          <li>
            <Badge tone="onNavy" className="px-4 py-2 text-body">
              <Icon name="map-pin" className="h-4 w-4" />
              {project.province}
            </Badge>
          </li>
        </ul>
      </PageHero>

      <Section tone="white" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Narrative */}
          <div className="space-y-12 lg:col-span-7">
            <ProjectGallery images={project.gallery} />

            {project.richContent ? (
              <RichContent blocks={project.richContent} />
            ) : (
              <>
                <section>
                  <h2 className="text-h2">ภาพรวมโครงการ</h2>
                  <p className="mt-4 text-body text-ink-700">
                    {project.overview}
                  </p>
                </section>

                <NarrativeBlock
                  title="โจทย์และเป้าหมาย"
                  items={project.objective}
                />
                <NarrativeBlock
                  title="ระบบที่ออกแบบ"
                  items={project.solution}
                />
                <NarrativeBlock
                  title="รายละเอียดการติดตั้ง"
                  items={project.installation}
                />
                <NarrativeBlock
                  title="ประโยชน์ที่ได้รับ"
                  items={project.benefits}
                />
              </>
            )}

            {project.standards && project.standards.length > 0 && (
              <section>
                <h2 className="text-h2">มาตรฐานที่ใช้พิจารณา</h2>
                <ul className="mt-5 space-y-3">
                  {project.standards.map((standard) => (
                    <li
                      key={standard}
                      className="flex items-start gap-3 text-body text-ink-700"
                    >
                      <Icon
                        name="shield"
                        className="mt-0.5 h-5 w-5 shrink-0 text-solar-600"
                      />
                      {standard}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.estimatedSavingsThbPerMonth && (
              <section className="rounded-card border border-hairline bg-paper-soft p-6 sm:p-8">
                <h2 className="text-h3">ประมาณการความคุ้มค่า</h2>
                <p className="mt-4 text-body text-ink-700">
                  สื่อประชาสัมพันธ์ของโครงการนี้ระบุว่าช่วยลดค่าไฟได้สูงสุดประมาณ{' '}
                  <strong className="font-semibold text-navy-900">
                    {formatThb(project.estimatedSavingsThbPerMonth)} บาทต่อเดือน
                  </strong>
                </p>
                <Note
                  tone="caution"
                  label="โปรดอ่านก่อนนำไปเปรียบเทียบ"
                  className="mt-5"
                >
                  {disclaimers.savings} ตัวเลขนี้ไม่ใช่การรับประกันผลลัพธ์
                  และไม่ควรนำไปใช้ประเมินสถานที่อื่นโดยตรง
                </Note>
              </section>
            )}
          </div>

          {/* Specification sidebar */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-card border border-hairline bg-white shadow-card">
                <h2 className="border-b border-hairline px-6 py-4 text-h3">
                  ข้อมูลระบบ
                </h2>
                <dl className="divide-y divide-hairline">
                  {specRows(project).map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap gap-x-4 gap-y-1 px-6 py-3.5"
                    >
                      <dt className="min-w-32 text-caption text-ink-600">
                        {row.label}
                      </dt>
                      <dd className="flex-1 text-body font-medium text-navy-900">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {project.servicesIncluded &&
                project.servicesIncluded.length > 0 && (
                  <div className="mt-6 rounded-card border border-hairline bg-paper-soft p-6">
                    <h2 className="text-h3">ขอบเขตงานที่ให้บริการ</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.servicesIncluded.map((service) => (
                        <li key={service}>
                          <Badge tone="solar">{service}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {project.warranty && project.warranty.length > 0 && (
                <div className="mt-6 rounded-card border border-hairline bg-white p-6 shadow-card">
                  <h2 className="text-h3">การรับประกันของโครงการนี้</h2>
                  <dl className="mt-4 space-y-3">
                    {project.warranty.map((row) => (
                      <div key={row.label}>
                        <dt className="text-caption text-ink-600">
                          {row.label}
                        </dt>
                        <dd className="text-body font-semibold text-navy-900">
                          {row.value}
                          {row.note && (
                            <span className="mt-0.5 block text-caption font-normal text-ink-600">
                              {row.note}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Disclaimer className="mt-4">
                    {disclaimers.warranty}
                  </Disclaimer>
                </div>
              )}

              <div className="mt-6 rounded-card border border-navy-700 bg-navy-900 p-6 text-navy-100">
                <h2 className="text-h3 text-white">
                  ต้องการระบบลักษณะนี้สำหรับสถานที่ของคุณ?
                </h2>
                <p className="mt-3 text-caption">
                  ส่งบิลค่าไฟและรูปหลังคาให้ทีมงานประเมินเบื้องต้น
                  แล้วเราจะเสนอขนาดระบบที่เหมาะกับการใช้ไฟจริงของคุณ
                </p>
                <Link
                  href={quoteLinks.general}
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-flare-500 px-6 font-semibold text-navy-950 hover:bg-flare-400"
                >
                  {cta.primary}
                  <Icon name="arrow-right" className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related projects */}
      {others.length > 0 && (
        <Section tone="soft" width="wide" labelledBy="related-projects-title">
          <h2 id="related-projects-title" className="text-h2">
            ผลงานอื่นของ NP88 Solar
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
          <Container className="mt-8 px-0">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-semibold text-solar-700 underline-offset-4 hover:underline"
            >
              ดูผลงานทั้งหมด
              <Icon name="arrow-right" className="h-4.5 w-4.5" />
            </Link>
          </Container>
        </Section>
      )}

      <LeadSection
        source={`project-${project.slug}`}
        title="ต้องการให้ทีม NP88 Solar วิเคราะห์ระบบสำหรับธุรกิจของคุณ?"
        lead="ผลการประหยัดขึ้นอยู่กับรูปแบบและปริมาณการใช้ไฟของแต่ละสถานประกอบการ ส่งบิลค่าไฟให้ทีมงานประเมินเพื่อดูตัวเลขของคุณเอง"
      />

      <JsonLd
        id="schema-project"
        data={graph(breadcrumbSchema(crumbs), projectSchema(project))}
      />
    </>
  );
}
