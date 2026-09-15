import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { homepageHistory } from '@/lib/site-data';
import { publicAssetPath } from '@/lib/utils';
import { getSiteData } from '@/cms/site';

/**
 * "ประวัติและความเป็นมา" — the company statement directly under the hero.
 *
 * Editorial split: a full-section image holds the left/left-centre and the text
 * runs down the right, the way a company profile reads on paper. Deliberately
 * not a row of cards, and deliberately no timeline — NP88 Solar has not
 * confirmed a founding year or any milestone, so there is nothing to plot.
 *
 * Copy and the repository fallback live in `homepageHistory`; the production
 * background comes from siteSettings through `getSiteData()`.
 * Nothing is written inline here, so editing the section never means editing
 * markup.
 */
export async function HistorySection() {
  const {
    historyEyebrow,
    historyTitle,
    historyParagraphs,
    historyQuote,
    historyImage,
  } = homepageHistory;
  const { homepage } = await getSiteData();
  const background = homepage.historyBackground ?? (historyImage.src && historyImage.alt ? { ...historyImage, width: 2400, height: 1350 } : undefined);
  const positions = { left: '25% 50%', center: '50% 50%', right: '75% 50%' } as const;
  const backgroundPosition = background
    ? (homepage.historyBackground ? positions[homepage.historyImagePosition] : historyImage.position)
    : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 sm:py-24 lg:py-32" aria-labelledby="history-title">
      {background ? (
        <Image
          src={publicAssetPath(background.src)}
          alt={background.alt}
          fill
          sizes="100vw"
          style={{ objectPosition: backgroundPosition }}
          className="-z-20 object-cover"
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_22%_48%,rgba(22,163,74,0.22),transparent_30%),linear-gradient(135deg,#071a32_0%,#0a2948_52%,#071a32_100%)]" aria-hidden="true" />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,20,39,0.18)_0%,rgba(4,20,39,0.72)_48%,rgba(4,20,39,0.96)_100%)] max-md:bg-[linear-gradient(180deg,rgba(4,20,39,0.66)_0%,rgba(4,20,39,0.97)_55%)]" aria-hidden="true" />
      <Container width="wide">
        <div className="grid min-h-[34rem] items-center md:grid-cols-12">
          <div data-scroll-reveal="" className="md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-6">
            <p className="text-caption font-semibold tracking-wide text-solar-300 uppercase">
              {historyEyebrow}
            </p>
            <h2 id="history-title" className="mt-3 text-h2 text-white">
              {historyTitle}
            </h2>

            {/* Capped so long Thai paragraphs keep a readable measure instead of
                running the full width of the column on a wide screen. */}
            <div className="mt-6 max-w-prose">
              {historyParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    // The opening paragraph carries the section, so it is set a
                    // step larger than the ones that follow it.
                    index === 0
                      ? 'text-body-lg text-white/90'
                      : 'mt-5 text-body text-white/78'
                  }
                >
                  {paragraph}
                </p>
              ))}

              {/* The one orange accent in the section: a rule against the pull
                  quote, not a background, badge or icon. */}
              <blockquote className="mt-8 border-l-2 border-flare-500 pl-5 sm:pl-6">
                <p className="text-body-lg font-medium text-white">
                  {historyQuote}
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
