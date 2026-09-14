import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ContactActions } from '@/components/cta/ContactCTAs';
import { primaryNav } from '@/lib/site';

/**
 * The body of the 404 page, without any chrome around it.
 *
 * Rendered by two not-found boundaries: the one inside (site), which already
 * sits in the site layout, and the one at the root of app/, which has to wrap
 * this in SiteShell itself.
 */
export function NotFoundContent() {
  return (
    <Section tone="white" width="default" spacing="loose">
      <p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">
        ข้อผิดพลาด 404
      </p>
      <h1 className="mt-3 text-h1">ไม่พบหน้าที่คุณกำลังมองหา</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-ink-600">
        หน้านี้อาจถูกย้าย เปลี่ยนชื่อ หรือลิงก์ที่ใช้อาจไม่ถูกต้อง
        ลองเริ่มจากหน้าด้านล่าง หรือติดต่อทีมงานได้โดยตรง
      </p>

      <nav aria-label="ลิงก์ที่ใช้บ่อย" className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {primaryNav
            .filter((item) => item.href !== '/')
            .map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-card border border-hairline bg-white px-5 py-4 hover:border-solar-400"
                >
                  <span className="font-semibold text-navy-900">{item.label}</span>
                  <Icon name="arrow-right" className="h-5 w-5 text-solar-600" />
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <div className="mt-10">
        <ContactActions />
      </div>
    </Section>
  );
}
