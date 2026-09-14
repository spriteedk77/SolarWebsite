import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';

/**
 * Sticky mobile contact bar: call, LINE, request an assessment.
 *
 * The matching `MobileContactBarSpacer` is rendered at the end of the page so
 * the bar never covers content — including the footer and any form submit
 * button. Both are hidden from `md` upwards, where the header CTAs take over.
 */
export async function MobileContactBar() {
  const { contact, cta } = await getSiteData();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-700 bg-navy-900 md:hidden print:hidden">
      <nav
        aria-label="ช่องทางติดต่อด่วน"
        className="mx-auto grid max-w-lg grid-cols-3"
      >
        <a
          href={contact.phoneHref}
          className="flex min-h-[58px] flex-col items-center justify-center gap-0.5 py-1.5 text-white"
          data-analytics="sticky-phone"
        >
          <Icon name="phone" className="h-5 w-5 text-sky-brand" />
          <span className="text-[0.8125rem] font-semibold">โทร</span>
        </a>

        <a
          href={contact.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[58px] flex-col items-center justify-center gap-1 border-x border-navy-700 bg-line-500 py-2 text-navy-950"
          data-analytics="sticky-line"
        >
          {/* Green ground — see LineIcon: the official mark is not placed on
              LINE green. The cell's colour and label carry the channel. */}
          <span className="text-body font-semibold">LINE</span>
        </a>

        <Link
          href={quoteLinks.general}
          className="flex min-h-[58px] flex-col items-center justify-center gap-1 bg-flare-500 py-2 text-navy-950"
          data-analytics="sticky-quote"
        >
          <Icon name="bolt" className="h-5 w-5" />
          <span className="text-[0.8125rem] font-semibold">
            {cta.primaryShort}
          </span>
        </Link>
      </nav>
      <div className="h-[env(safe-area-inset-bottom)] bg-navy-900" />
    </div>
  );
}

/**
 * Reserves the height of the sticky bar so it never overlaps page content.
 *
 * The bar measures 59px (58px of cell height plus its top border); the spacer
 * is 80px so the last line of the footer keeps a little breathing room rather
 * than sitting flush against the bar.
 */
export function MobileContactBarSpacer() {
  return (
    <div
      aria-hidden="true"
      className="h-[calc(5rem+env(safe-area-inset-bottom))] md:hidden print:hidden"
    />
  );
}
