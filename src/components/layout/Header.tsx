import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Container';
import { contact, cta, quoteLinks, serviceAreas } from '@/lib/site';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    // Solid background on purpose: a backdrop-filter here would create a
    // containing block and trap any `position: fixed` descendant (the mobile
    // drawer) inside the header's box.
    <header className="sticky top-0 z-40 bg-white shadow-header">
      {/* Utility strip — service areas and direct channels, desktop only. */}
      <div className="hidden border-b border-hairline bg-navy-900 text-navy-100 xl:block">
        <Container width="wide">
          <div className="flex h-9 items-center justify-between text-caption">
            <p className="flex items-center gap-2">
              <Icon name="map-pin" className="h-4 w-4 text-sky-brand" />
              ให้บริการ {serviceAreas.map((area) => area.name).join(' · ')}
            </p>
            <p className="flex items-center gap-5">
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Icon name="phone" className="h-4 w-4 text-sky-brand" />
                {contact.phone}
              </a>
              <a
                href={contact.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Icon name="line" className="h-4 w-4 text-line-500" />
                LINE {contact.lineId}
              </a>
            </p>
          </div>
        </Container>
      </div>

      <Container width="wide">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="NP88 Solar — กลับสู่หน้าแรก">
            <Logo />
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
              <Icon name="line" className="h-5 w-5" />
              <span className="hidden sm:inline">LINE</span>
              <span className="sr-only">แชตกับ NP88 Solar ทาง LINE {contact.lineId}</span>
            </a>

            {/* Visibility lives on a wrapper, not on the button's own class list:
                `hidden` and the button's `inline-flex` are both display
                utilities, so whichever Tailwind emits last would win. */}
            <div className="hidden xl:block">
              <ButtonLink href={quoteLinks.general} variant="primary">
                {cta.primaryShort}
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
