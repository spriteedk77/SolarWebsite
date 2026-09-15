import { Section, SectionHeading } from '@/components/ui/Section';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Note';
import { disclaimers } from '@/lib/site';
import type { Project } from '@/content/types';

/** Section 6 — real installations with their full specification. */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section tone="white" labelledBy="projects-title" width="wide">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="projects-title"
          eyebrow="ผลงานติดตั้ง"
          title="ระบบที่ติดตั้งจริง พร้อมสเปกที่ตรวจสอบได้"
          lead="แต่ละโครงการแสดงขนาดระบบ รุ่นแผง จำนวนแผง และอุปกรณ์ที่ใช้จริง เพื่อให้เปรียบเทียบกับงานของคุณได้"
        />
        <ButtonLink href="/projects" variant="ghost" className="shrink-0 self-start md:self-auto">
          ดูผลงานทั้งหมด
          <Icon name="arrow-right" className="h-5 w-5" />
        </ButtonLink>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} priority={index === 0} />
        ))}
      </div>

      <Disclaimer className="mt-8">{disclaimers.savings}</Disclaimer>
    </Section>
  );
}
