import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Crumb } from '@/lib/schema';
import { publicAssetPath } from '@/lib/utils';

/**
 * Standard page header: breadcrumb, H1, lead paragraph and (optionally) the
 * page's primary action. Every inner page uses it so the entry point to each
 * page reads the same way.
 */
export function PageHero({
  crumbs,
  title,
  lead,
  eyebrow,
  actions,
  image,
  children,
  width = 'wide',
}: {
  crumbs: Crumb[];
  title: string;
  lead?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  /** Background photograph. Falls back to the flat navy ground when omitted. */
  image?: { src: string; alt: string };
  children?: React.ReactNode;
  /** Must match the width of the section below, so the page reads as one column. */
  width?: 'default' | 'narrow' | 'wide';
}) {
  const imageSrc = image ? publicAssetPath(image.src) : undefined;

  return (
    <section className="on-navy relative isolate bg-navy-900">
      {image && imageSrc && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            unoptimized={imageSrc.endsWith('.svg')}
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-navy-950/62" />
        </div>
      )}
      {!image && <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />}

      <Container width={width}>
        <div className="py-10 md:py-14">
          <Breadcrumb crumbs={crumbs} tone="dark" />

          <div className="mt-6 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-caption font-semibold tracking-wide text-sky-brand uppercase">
                {eyebrow}
              </p>
            )}
            <h1 className="text-h1 text-white">{title}</h1>
            {lead && <p className="mt-4 text-body-lg text-navy-100">{lead}</p>}
          </div>

          {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>}
          {children}
        </div>
      </Container>
    </section>
  );
}
