import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import { listArticles } from './actions';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ published?: string; deleted?: string }> }) {
  if (!(await isSignedIn())) redirect('/admin');
  const result = await listArticles();
  const notice = await searchParams;
  return (
    <AdminShell signedIn>
      <Container width="wide"><div className="mx-auto w-full max-w-5xl py-10">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">จัดการเนื้อหา</p><h1 className="mt-2 text-h2">บทความความรู้</h1><p className="mt-2 text-body text-ink-600">เขียน แทรกรูป บันทึกฉบับร่าง และเผยแพร่จากที่เดียว</p></div>
          <Link href="/admin/articles/new" className="inline-flex min-h-12 items-center rounded-lg bg-solar-600 px-6 font-semibold text-white hover:bg-solar-700">เขียนบทความใหม่</Link>
        </header>
        {(notice.published || notice.deleted) && <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-body font-medium text-green-800">{notice.deleted ? 'ลบบทความแล้ว' : 'เผยแพร่แล้ว เว็บไซต์จะอัปเดตภายในประมาณ 1 นาที'}</p>}
        {!result.ready ? (
          <div className="mt-8 rounded-card border border-flare-500 bg-white p-6"><h2 className="text-h3">ยังเชื่อมต่อระบบเนื้อหาไม่ได้</h2><p className="mt-3 text-body text-ink-700">ต้องตั้งค่า {result.missing.join(', ')} ในระบบโฮสต์ก่อน</p></div>
        ) : result.articles.length === 0 ? (
          <div className="mt-8 rounded-card border border-hairline bg-white p-8 text-center"><h2 className="text-h3">ยังไม่มีบทความ</h2><p className="mt-2 text-body text-ink-600">เริ่มเขียนบทความแรกได้เลย</p></div>
        ) : (
          <ul className="mt-8 divide-y divide-hairline overflow-hidden rounded-card border border-hairline bg-white">
            {result.articles.map((article) => <li key={article.id} className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6"><div><h2 className="text-body font-semibold text-navy-900">{article.title}</h2><p className="mt-1 text-caption text-ink-600">/{article.slug || 'ยังไม่มี-url'} · {article.draft ? 'มีฉบับร่าง' : ''}{article.draft && article.published ? ' · ' : ''}{article.published ? 'เผยแพร่แล้ว' : 'ยังไม่เผยแพร่'}</p></div><Link href={`/admin/articles/${article.id}`} className="inline-flex min-h-11 items-center rounded-lg border border-hairline px-4 text-caption font-semibold text-solar-700 hover:border-solar-400">แก้ไข</Link></li>)}
          </ul>
        )}
      </div></Container>
    </AdminShell>
  );
}
