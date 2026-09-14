import { Container } from '@/components/ui/Container';
import { AdminShell } from '@/components/admin/AdminShell';
import { LoginForm } from '@/components/admin/LoginForm';
import { SiteInfoForm } from '@/components/admin/SiteInfoForm';
import { PublishPanel } from '@/components/admin/PublishPanel';
import { isSignedIn } from '@/lib/admin-session';
import { adminConfig } from '@/lib/admin-auth';
import { loadSiteInfo } from './actions';

/**
 * The admin.
 *
 * Three states, decided on the server every time: not set up, not signed in,
 * and signed in. Nothing further down renders until the one above it is
 * settled, so the form is never sent to a browser that has not proved it may
 * see it.
 */
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const config = adminConfig();
  if (!config.ready)
    return (
      <AdminShell>
        <Panel title="ยังตั้งค่าหน้านี้ไม่เสร็จ">
          <p className="mt-4 text-body text-ink-700">
            หน้านี้จะยังเข้าไม่ได้จนกว่าจะตั้งค่าสองอย่างนี้ในระบบโฮสต์
            เป็นการปิดไว้โดยตั้งใจ ไม่ใช่ข้อผิดพลาด
          </p>
          <ul className="mt-4 space-y-2">
            {config.missing.map((name) => (
              <li
                key={name}
                className="rounded-lg border border-hairline bg-white px-4 py-3 font-mono text-caption text-ink-900"
              >
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-body text-ink-700">
            สร้างค่าทั้งสองได้ด้วยคำสั่ง{' '}
            <code className="rounded bg-white px-2 py-1 font-mono text-caption">
              npm run admin:password
            </code>{' '}
            บนเครื่องของคุณ รหัสผ่านจะไม่ออกจากเครื่องไปไหน
          </p>
        </Panel>
      </AdminShell>
    );

  if (!(await isSignedIn()))
    return (
      <AdminShell>
        <Panel title="เข้าสู่ระบบ">
          <p className="mt-3 text-body text-ink-600">
            สำหรับทีมงาน NP88 Solar เพื่อแก้ไขข้อมูลบนเว็บไซต์
          </p>
          <LoginForm />
        </Panel>
      </AdminShell>
    );

  const info = await loadSiteInfo();

  return (
    <AdminShell signedIn>
      <Container width="wide">
        <div className="mx-auto w-full max-w-3xl py-10">
          <header className="mb-8">
            <p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">
              แก้ไขข้อมูล
            </p>
            <h1 className="mt-2 text-h2">ข้อมูลเว็บไซต์</h1>
            <p className="mt-3 max-w-prose text-body text-ink-600">
              แก้ช่องทางติดต่อ ที่อยู่ และข้อความหน้าแรกได้จากหน้านี้
              เมื่อกดบันทึกจะเก็บเป็นฉบับร่างก่อน ยังไม่ขึ้นเว็บจริง
            </p>
          </header>

          {!info.canSave && (
            <div className="mb-8 rounded-card border border-flare-500 bg-white p-6">
              <h2 className="text-h3">ยังบันทึกไม่ได้</h2>
              <p className="mt-3 text-body text-ink-700">
                ค่าที่เห็นด้านล่างคือข้อมูลที่เว็บไซต์ใช้อยู่จริงตอนนี้
                แต่จะยังแก้ไม่ได้จนกว่าจะตั้งค่าต่อไปนี้ในระบบโฮสต์
                แล้วสั่ง deploy ใหม่หนึ่งครั้ง
              </p>
              <ul className="mt-4 space-y-2">
                {info.missing.map((name) => (
                  <li
                    key={name}
                    className="rounded-lg border border-hairline px-4 py-3 font-mono text-caption text-ink-900"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {info.canSave && !info.liveReadsCms && (
            <div className="mb-8 rounded-card border border-flare-500 bg-white p-6">
              <h2 className="text-h3">เว็บไซต์ยังไม่ได้อ่านข้อมูลจากที่นี่</h2>
              <p className="mt-3 max-w-prose text-body text-ink-700">
                ตอนนี้เว็บไซต์ยังแสดงข้อมูลชุดเดิมที่ฝังมากับตัวเว็บ
                การแก้ไขที่นี่จะยังไม่มีผลจนกว่าจะตั้งค่า{' '}
                <code className="rounded bg-soft px-2 py-1 font-mono text-caption">
                  CONTENT_SOURCE=sanity
                </code>{' '}
                ในระบบโฮสต์
              </p>
              <p className="mt-3 max-w-prose text-body text-ink-700">
                ต้องกดเผยแพร่ด้านล่างให้สำเร็จอย่างน้อยหนึ่งครั้งก่อน
                แล้วค่อยตั้งค่านั้น มิฉะนั้นเว็บไซต์จะไม่มีข้อมูลให้แสดงและจะ
                build ไม่ผ่าน
              </p>
            </div>
          )}

          <SiteInfoForm values={info.values} canSave={info.canSave} />
          <PublishPanel canSave={info.canSave} />
        </div>
      </Container>
    </AdminShell>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container width="wide">
      <div className="mx-auto w-full max-w-md py-16">
        <div className="rounded-card border border-hairline bg-white p-7 sm:p-8">
          <h1 className="text-h3">{title}</h1>
          {children}
        </div>
      </div>
    </Container>
  );
}
