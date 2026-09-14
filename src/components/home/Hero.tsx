import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ContactChannels } from '@/components/cta/ContactChannels';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import { TrustStrip } from '@/components/home/TrustStrip';
import { HeroBackground, type HeroImage } from '@/components/home/HeroBackground';

/**
 * Homepage hero.
 *
 * One left-aligned column: headline, supporting line, the two actions, then the
 * direct channels and the service areas, with the experience strip anchored
 * along the bottom of the same section. The ground is rendered by
 * `HeroBackground` so the photograph NP88 Solar is preparing replaces it
 * without the content moving — see that file for the sizes and the overlay.
 */
export async function Hero({ image }: { image?: HeroImage } = {}) {
  const { contact, cta, serviceAreas, homepage } = await getSiteData();
  const background = image ?? (homepage.heroImage ? { src: homepage.heroImage.src } : undefined);

  return (
    <section
      aria-labelledby="hero-title"
      className="on-navy relative isolate bg-navy-900"
    >
      <HeroBackground image={background} />

      <Container width="wide">
        {/* Asymmetric padding: generous above the headline, tighter below the
            service areas so the experience strip reads as anchored to the
            hero rather than floating after a gap. */}
        <div className="max-w-3xl pt-14 pb-10 md:pt-20 md:pb-12 lg:pt-24 lg:pb-14">
          <h1 id="hero-title" className="hero-headline whitespace-pre-line text-white">
            {homepage.headline}
          </h1>

          <p className="mt-6 text-body-lg text-navy-100">
            {homepage.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={quoteLinks.general}
              variant="primary"
              size="lg"
              data-analytics="hero-quote"
            >
              {cta.primary}
              <Icon name="arrow-right" className="h-5 w-5 shrink-0" />
            </ButtonLink>
            <ButtonLink href="/projects" variant="outline-light" size="lg">
              {cta.projects}
            </ButtonLink>
          </div>

          <p className="mt-9 text-body font-semibold text-white">
            {homepage.serviceMessage}
          </p>

          {/* One row while there is room, wrapping when there is not.
              Deliberately not three cards — these are links, not features. */}
          <ContactChannels
            contact={contact}
            tone="dark"
            layout="row"
            analytics="hero"
            className="mt-3"
          />

          <p className="mt-5 flex items-start gap-2 text-caption text-navy-200">
            <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serviceAreas.map((area) => area.name).join(' · ')}</span>
          </p>
        </div>
      </Container>

      {/* Anchored along the bottom of the hero, inside the same ground. */}
      <TrustStrip />
    </section>
  );
}
