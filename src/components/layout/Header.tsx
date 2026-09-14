import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Container';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export async function Header() {
  const { contact, cta } = await getSiteData();
  return (
    // Solid background on purpose: a backdrop-filter here would create a
    // containing block and trap any `position: fixed` descendant (the mobile
    // drawer) inside the header's box.
    //
    // One 4.5rem row at every width — the navy utility strip that used to sit
    // above it is gone, so the anchor and sticky offsets below it are 5rem
    // everywhere rather than the old two-height 6.5rem compromise.
    <header className="sticky top-0 z-40 bg-white shadow-header">
      <Container width="wide">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="shrink-0"
            aria-label="NP88 Solar — กลับสู่หน้าแรก"
          >
            <Logo priority />
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-2">
            {/* On mobile the LINE action stays one tap away, next to the menu. */}
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-line-500 px-3 text-caption font-semibold text-navy-950 sm:px-4 xl:hidden"
            >
              {/* Green ground — see LineIcon: the official mark is not placed
                  on LINE green. */}
              <span>LINE</span>
              <span className="sr-only">
                แชตกับ NP88 Solar ทาง LINE {contact.lineId}
              </span>
            </a>

            {/* Visibility lives on a wrapper, not on the button's own class list:
                `hidden` and the button's `inline-flex` are both display
                utilities, so whichever Tailwind emits last would win. */}
            <div className="hidden xl:block">
              <ButtonLink href={quoteLinks.general} variant="primary">
                <span className="whitespace-nowrap">{cta.primaryShort}</span>
                <Icon name="arrow-right" className="h-5 w-5" />
              </ButtonLink>
            </div>

            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
