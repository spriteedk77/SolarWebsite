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
  const { cta } = await getSiteData();
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
            {/* Shown from md up, not xl: between 768px and the xl breakpoint
                there is no sticky bar and no desktop nav, so without this the
                header would carry no action at all. Below md the sticky bar
                already offers call, LINE and this same assessment CTA.

                Visibility lives on a wrapper, not on the button's own class
                list: `hidden` and the button's `inline-flex` are both display
                utilities, so whichever Tailwind emits last would win. */}
            <div className="hidden md:block">
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
