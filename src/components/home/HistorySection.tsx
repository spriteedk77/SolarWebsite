import { Section } from '@/components/ui/Section';
import { homepageHistory } from '@/lib/site-data';

/**
 * "ประวัติและความเป็นมา" — the company statement directly under the hero.
 *
 * Editorial split: the heading holds the left column and the prose runs down
 * the right, the way a company profile reads on paper. Deliberately not a row
 * of cards, and deliberately no timeline — NP88 Solar has not confirmed a
 * founding year or any milestone, so there is nothing to plot.
 *
 * All copy lives in `homepageHistory` (src/lib/site-data.ts). Nothing is
 * written inline here, so editing the section never means editing markup.
 */
export function HistorySection() {
  const { historyEyebrow, historyTitle, historyParagraphs, historyQuote } =
    homepageHistory;

  return (
    <Section tone="soft" labelledBy="history-title" width="wide">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">
            {historyEyebrow}
          </p>
          <h2 id="history-title" className="mt-3 text-h2">
            {historyTitle}
          </h2>
        </div>

        <div className="lg:col-span-7">
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
    </Section>
  );
}
