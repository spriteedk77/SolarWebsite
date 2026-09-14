import type { Metadata } from 'next';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Disclaimer } from '@/components/ui/Note';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getProjects } from '@/content';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/schema';
import { disclaimers, quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';

const crumbs = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ผลงานติดตั้ง', path: '/projects' },
];

export const metadata: Metadata = buildMetadata({
  title: 'ผลงานติดตั้ง Solar Rooftop — เชียงใหม่ ลำปาง และภาคเหนือ',
  description:
    'ตัวอย่างงานติดตั้งระบบ Solar Rooftop ของ NP88 Solar พร้อมสเปกจริงของแต่ละโครงการ ทั้งขนาดระบบ รุ่นแผง จำนวนแผง อินเวอร์เตอร์ และแบตเตอรี่',
  path: '/projects',
  keywords: [
    'ผลงานติดตั้งโซลาร์เซลล์',
    'Solar Rooftop เชียงใหม่',
    'ติดตั้งโซลาร์เซลล์ลำปาง',
  ],
});

export default async function ProjectsPage() {
  const { cta } = await getSiteData();
  const projects = await getProjects();

  const itemList = {
    '@type': 'ItemList',
    name: 'ผลงานติดตั้ง Solar Rooftop โดย NP88 Solar',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: absoluteUrl(`/projects/${project.slug}`),
    })),
  };

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ผลงานติดตั้ง"
        title="ระบบที่ติดตั้งจริง พร้อมสเปกที่ตรวจสอบได้"
        lead="แต่ละโครงการแสดงขนาดระบบ รุ่นแผง จำนวนแผง และอุปกรณ์ที่ใช้จริง เพื่อให้คุณเปรียบเทียบกับลักษณะงานของตัวเองได้ ไม่ใช่แค่ดูภาพประกอบ"
        image={{
          src: '/images/placeholder/project-commercial-wide.svg',
          alt: '',
        }}
        actions={
          <ButtonLink href={quoteLinks.general} variant="primary" size="lg">
            {cta.primary}
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
        }
      />

      <Section tone="white" width="wide" labelledBy="projects-list-title">
        <h2 id="projects-list-title" className="sr-only">
          รายการผลงานติดตั้งทั้งหมด
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 2}
            />
          ))}
        </div>

        <Disclaimer className="mt-8">{disclaimers.savings}</Disclaimer>
      </Section>

      <LeadSection
        source="projects"
        title="ต้องการให้ทีม NP88 Solar วิเคราะห์ระบบสำหรับธุรกิจของคุณ?"
        lead="ส่งบิลค่าไฟและข้อมูลพื้นที่ ทีมงานจะประเมินเบื้องต้นและเสนอแนวทางที่เหมาะกับการใช้ไฟจริงของคุณ"
      />

      <JsonLd
        id="schema-projects"
        data={graph(breadcrumbSchema(crumbs), itemList)}
      />
    </>
  );
}
