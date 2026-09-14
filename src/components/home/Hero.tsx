import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { contact, cta, quoteLinks, serviceAreas } from '@/lib/site';

/**
 * Homepage hero.
 *
 * Kept deliberately sparse: one headline, one supporting paragraph, two
 * actions, and the two direct contact channels. Everything else on the page
 * earns its place below the fold.
 *
 * The background is the page's LCP element, so it is `priority` and carries an
 * empty alt — the headline beside it already states what it shows.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-navy relative isolate bg-navy-900">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/placeholder/hero-rooftop.svg"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        {/* Readability scrim, tuned to show as much of the photograph as the
            text allows. Measured against a worst case of pure white behind it:
            the 78% band under the copy still gives white text ~9.7:1, and the
            lightest point the headline reaches (~74%) stays above 7:1 — so the
            image reads as an image and the words stay legible on top of it. */}
        <div className="absolute inset-0 bg-navy-950/78 md:bg-gradient-to-r md:from-navy-950/92 md:via-navy-950/78 md:to-navy-950/35" />
      </div>

      <Container width="wide">
        <div className="flex min-h-[34rem] flex-col justify-center py-16 md:min-h-[40rem] md:py-24">
          <p className="flex items-center gap-2 text-caption font-semibold text-sky-brand">
            <Icon name="map-pin" className="h-4.5 w-4.5" />
            เชียงใหม่ · ลำพูน · เชียงราย · ลำปาง · พะเยา
          </p>

          <h1 id="hero-title" className="mt-4 max-w-3xl text-display text-white">
            ออกแบบระบบพลังงาน
            <br className="hidden sm:block" /> ให้เหมาะกับธุรกิจของคุณ
          </h1>

          <p className="mt-5 max-w-2xl text-body-lg text-navy-100">
            NP88 Solar ให้บริการสำรวจ วิเคราะห์ ออกแบบ และติดตั้งระบบ Solar Rooftop
            สำหรับบ้าน ธุรกิจ และโรงงาน พร้อมดูแลตั้งแต่เริ่มต้นจนถึงบริการหลังการขาย
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={quoteLinks.general}
              variant="primary"
              size="lg"
              data-analytics="hero-quote"
            >
              {cta.primary}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/projects" variant="outline-light" size="lg">
              {cta.projects}
            </ButtonLink>
          </div>

          <div className="mt-9 flex flex-col gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-body sm:flex-row sm:items-center">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 font-semibold text-white hover:text-sky-brand"
            >
              <Icon name="phone" className="h-5 w-5 text-sky-brand" />
              {contact.phone}
            </a>
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold text-white hover:text-sky-brand"
            >
              <Icon name="line" className="h-5 w-5 text-line-500" />
              LINE {contact.lineId}
            </a>
          </div>

          <p className="sr-only">
            พื้นที่ให้บริการ: {serviceAreas.map((area) => area.name).join(', ')}
          </p>
        </div>
      </Container>
    </section>
  );
}
