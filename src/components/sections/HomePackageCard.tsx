import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Note';
import { homePackage } from '@/content/th/pages';
import { cta, disclaimers, quoteLinks } from '@/lib/site';
import { formatThb } from '@/lib/utils';

/**
 * Residential promotional package.
 *
 * Presented explicitly as a promotion — badge, price, inclusions and an
 * unmissable "prices and promotions may change" line — so it can never be read
 * as a standing price list. All values are pending client confirmation
 * (`home-package-promo` in src/lib/pending.ts).
 */
export function HomePackageCard({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';

  return (
    <div
      className={
        dark
          ? 'rounded-card border border-white/15 bg-navy-800 p-6 sm:p-8'
          : 'rounded-card border border-hairline bg-white p-6 shadow-card sm:p-8'
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="flare">โปรโมชั่นปัจจุบัน</Badge>
        <span className={dark ? 'text-caption text-navy-200' : 'text-caption text-ink-600'}>
          แพ็กเกจสำหรับบ้านพักอาศัย
        </span>
      </div>

      <h3 className={dark ? 'mt-4 text-h2 text-white' : 'mt-4 text-h2'}>{homePackage.name}</h3>

      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {[
          { label: 'ขนาดระบบ', value: homePackage.capacity },
          { label: 'แผงโซลาร์', value: homePackage.panels },
          { label: 'แบตเตอรี่', value: homePackage.battery },
          { label: 'ระบบ', value: 'Solar + Battery สำหรับที่พักอาศัย' },
        ].map((row) => (
          <div key={row.label}>
            <dt className={dark ? 'text-caption text-navy-200' : 'text-caption text-ink-600'}>
              {row.label}
            </dt>
            <dd className={dark ? 'font-semibold text-white' : 'font-semibold text-navy-900'}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className={
          dark
            ? 'mt-6 border-t border-white/15 pt-6'
            : 'mt-6 border-t border-hairline pt-6'
        }
      >
        <p className={dark ? 'text-caption text-navy-200' : 'text-caption text-ink-600'}>
          ราคาโปรโมชั่น
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span
            className={
              dark
                ? 'font-display text-[2.5rem] leading-none font-bold text-white'
                : 'font-display text-[2.5rem] leading-none font-bold text-navy-900'
            }
          >
            {formatThb(homePackage.priceThb)}
          </span>
          <span className={dark ? 'text-body text-navy-200' : 'text-body text-ink-600'}>บาท</span>
        </p>

        <ul className="mt-5 space-y-2.5">
          {homePackage.includes.map((item) => (
            <li
              key={item}
              className={
                dark
                  ? 'flex items-start gap-2.5 text-body text-navy-100'
                  : 'flex items-start gap-2.5 text-body text-ink-700'
              }
            >
              <Icon name="check" className="mt-1.5 h-4.5 w-4.5 shrink-0 text-flare-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7">
        <ButtonLink href={quoteLinks.package('sigenenergy-neo')} variant="primary" size="lg" fullWidth>
          {cta.packageEnquiry}
          <Icon name="arrow-right" className="h-5 w-5" />
        </ButtonLink>
      </div>

      <Disclaimer className={dark ? 'mt-4 text-navy-200' : 'mt-4'}>
        {disclaimers.promotion}
      </Disclaimer>
    </div>
  );
}
