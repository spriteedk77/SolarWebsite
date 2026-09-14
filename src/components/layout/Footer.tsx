import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { copyrightYear, footerNav } from '@/lib/site';
import { getSiteData } from '@/cms/site';

export async function Footer() {
  const { contact, serviceAreas, site, footerInformation } =
    await getSiteData();
  return (
    <footer className="on-navy bg-navy-950 text-navy-200">
      <Container width="wide">
        <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
          {/* Identity + NAP */}
          <div className="md:col-span-5 lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-caption leading-relaxed">
              {site.legalNameShort}
              <br />
              {footerInformation}
            </p>

            <address className="mt-6 space-y-3 text-caption not-italic">
              <p className="flex items-start gap-2.5">
                <Icon
                  name="map-pin"
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-brand"
                />
                <span>
                  {contact.addressLines[0]}
                  <br />
                  {contact.addressLines[1]}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon
                  name="phone"
                  className="h-4.5 w-4.5 shrink-0 text-sky-brand"
                />
                <a
                  href={contact.phoneHref}
                  className="font-semibold text-white hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon
                  name="line"
                  className="h-4.5 w-4.5 shrink-0 text-line-500"
                />
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:underline"
                >
                  LINE {contact.lineId}
                </a>
              </p>
            </address>

            {(contact.facebookUrl || contact.googleBusinessProfileUrl) && (
              <ul className="mt-6 flex gap-3 text-caption">
                {contact.facebookUrl && (
                  <li>
                    <a
                      href={contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10"
                    >
                      Facebook
                    </a>
                  </li>
                )}
                {contact.googleBusinessProfileUrl && (
                  <li>
                    <a
                      href={contact.googleBusinessProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10"
                    >
                      Google Business Profile
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Link columns */}
          <nav
            aria-label="ลิงก์ท้ายเว็บไซต์"
            className="grid gap-8 sm:grid-cols-3 md:col-span-7 lg:col-span-8 lg:grid-cols-4"
          >
            {[footerNav.services, footerNav.company, footerNav.legal].map(
              (group) => (
                <div key={group.title}>
                  <h2 className="text-caption font-semibold tracking-wide text-white uppercase">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-caption">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="hover:text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}

            <div>
              <h2 className="text-caption font-semibold tracking-wide text-white uppercase">
                บริการในภาคเหนือ
              </h2>
              <ul className="mt-4 space-y-2.5 text-caption">
                {serviceAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/contact#${area.slug}`}
                      className="hover:text-white hover:underline"
                    >
                      ติดตั้งโซลาร์เซลล์{area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-caption sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYear} {site.legalNameShort} สงวนลิขสิทธิ์
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white hover:underline">
              ประกาศความเป็นส่วนตัว
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-white hover:underline"
            >
              นโยบายคุกกี้
            </Link>
            <Link href="/contact" className="hover:text-white hover:underline">
              ติดต่อเรา
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
