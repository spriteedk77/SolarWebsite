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
    <section aria-labelledby="trust-title" className="on-navy bg-navy-900 bg-blueprint">
      <Container width="wide">
        <div className="flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:gap-10">
          <h2 id="trust-title" className="shrink-0 text-body-lg font-semibold text-white">
            ประสบการณ์จากงานติดตั้งจริง
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
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
