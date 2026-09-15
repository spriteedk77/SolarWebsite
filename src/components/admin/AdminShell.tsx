import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/brand/Logo';
import { signOutAction } from '@/app/admin/actions';
import Link from 'next/link';

/**
 * The frame around every admin screen.
 *
 * Built from the site's own components and tokens, because this is the same
 * website — the person editing the contact details should not feel handed over
 * to a different product halfway through. Deliberately narrower than the site's
 * chrome: no navigation to the public pages, no contact bar, nothing to click
 * that is not part of the job.
 */
export function AdminShell({
  children,
  signedIn = false,
}: {
  children: React.ReactNode;
  signedIn?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-soft">
      <header className="border-b border-hairline bg-white">
        <Container width="wide">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <Logo className="h-8 sm:h-8 lg:h-8" />
              <span className="text-caption font-semibold tracking-wide text-ink-600 uppercase">
                จัดการเนื้อหา
              </span>
            </div>

            {signedIn && (
              <div className="flex flex-wrap items-center gap-2">
                <nav aria-label="เมนูจัดการเนื้อหา" className="flex flex-wrap gap-1">
                  <Link href="/admin" className="inline-flex min-h-11 items-center rounded-lg px-3 text-caption font-semibold text-navy-900 hover:bg-soft">ข้อมูลเว็บไซต์</Link>
                  <Link href="/admin/articles" className="inline-flex min-h-11 items-center rounded-lg px-3 text-caption font-semibold text-navy-900 hover:bg-soft">บทความ</Link>
                  <Link href="/admin/projects" className="inline-flex min-h-11 items-center rounded-lg px-3 text-caption font-semibold text-navy-900 hover:bg-soft">โครงการ</Link>
                  <Link href="/admin/images" className="inline-flex min-h-11 items-center rounded-lg px-3 text-caption font-semibold text-navy-900 hover:bg-soft">รูปภาพ</Link>
                </nav>
                <form action={signOutAction}>
                  <button type="submit" className="inline-flex min-h-11 items-center rounded-lg border border-hairline px-4 text-caption font-semibold text-navy-900 hover:border-solar-400">ออกจากระบบ</button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-hairline bg-white">
        <Container width="wide">
          <p className="py-5 text-caption text-ink-600">
            หน้านี้ใช้สำหรับทีมงาน NP88 Solar เท่านั้น
            การเปลี่ยนแปลงจะถูกบันทึกเป็นฉบับร่างก่อนเสมอ
          </p>
        </Container>
      </footer>
    </div>
  );
}
