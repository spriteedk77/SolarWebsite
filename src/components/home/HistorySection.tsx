import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { homepageHistory } from '@/lib/site-data';
import { publicAssetPath } from '@/lib/utils';
import { getSiteData } from '@/cms/site';

/**
 * "ประวัติและความเป็นมา" — the company statement directly under the hero.
 *
 * Editorial split: a portrait holds the left column and the whole of the text
 * runs down the right, the way a company profile reads on paper. Deliberately
 * not a row of cards, and deliberately no timeline — NP88 Solar has not
 * confirmed a founding year or any milestone, so there is nothing to plot.
 *
 * All copy and the portrait live in `homepageHistory` (src/lib/site-data.ts).
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
  const cmsPortrait = homepage.executivePortrait;

  const portrait = cmsPortrait ?? (historyImage.src && historyImage.alt ? { ...historyImage, width: 1200, height: 1500 } : undefined);
  const portraitPosition = cmsPortrait ? '50% 50%' : historyImage.position;

  return (
    <Section
      tone="soft"
      labelledBy="history-title"
      width="wide"
      frame="major"
    >
      {/* 5/12 and 7/12 — the portrait takes ~42% and the text ~58%. The
          portrait comes first in the source, so it stacks above the text on a
          phone without any order juggling. */}
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-x-12 lg:gap-x-16">
        <div className="md:col-span-5">
          {/* Reserved 4:5 portrait frame. Until NP88 Solar supplies the
              photograph this stays empty on purpose: no stock image, no
              generated stand-in, and no caption claiming who it will be. */}
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-card border border-hairline bg-white">
            {portrait && (
              <Image
                src={publicAssetPath(portrait.src)}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                style={{ objectPosition: portraitPosition }}
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">
            {historyEyebrow}
          </p>
          <h2 id="history-title" className="mt-3 text-h2">
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
                    ? 'text-body-lg text-ink-700'
                    : 'mt-5 text-body text-ink-700'
                }
              >
                {paragraph}
              </p>
            ))}

            {/* The one orange accent in the section: a rule against the pull
                quote, not a background, badge or icon. */}
            <blockquote className="mt-8 border-l-2 border-flare-500 pl-5 sm:pl-6">
              <p className="text-body-lg font-medium text-navy-900">
                {historyQuote}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </Section>
  );
}
