import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { segments } from '@/content/th/pages';

/**
 * Credibility band directly under the hero.
 *
 * ⚠️ Deliberately carries **no installation count**. NP88 Solar's own material
 * is inconsistent (older pieces say 600+, newer ones 700+), and an unverified
 * number is worth less than no number at all to the factory owner this page is
 * written for. The segment list below is verifiable from the project pages, so
 * that is what we lead with instead. See docs/content-confirmation.md — once a
 * figure and its "as of" date are confirmed, it belongs here.
 */
export function TrustStrip() {
  return (
    // Transparent on purpose: this sits inside the hero section and shares its
    // ground, so the future hero photograph runs behind it unbroken.
    <section
      aria-labelledby="trust-title"
      className="relative border-t border-white/15"
    >
      <Container width="wide">
        <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-x-10 lg:gap-y-3 lg:py-7">
          <h2 id="trust-title" className="shrink-0 text-body-lg font-semibold text-white">
            ประสบการณ์จากงานติดตั้งจริง
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {segments.map((segment) => (
              <li key={segment} className="flex items-center gap-2 text-body text-navy-100">
                <Icon name="check" className="h-4 w-4 shrink-0 text-flare-600" />
                {segment}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
