import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import type { ArticleEditorData } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  if (!(await isSignedIn())) redirect('/admin');
  const article: ArticleEditorData = {
    id: '', title: '', slug: '', summary: '', category: 'พื้นฐาน Solar', tags: '', author: '',
    publishedAt: new Date().toISOString().slice(0, 16), seoTitle: '', seoDescription: '', featured: false,
    blocks: [{ kind: 'text', key: 'opening', style: 'normal', text: '' }], published: false,
  };
  return <AdminShell signedIn><Container width="wide"><div className="mx-auto w-full max-w-4xl py-10"><header className="mb-8"><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">บทความความรู้</p><h1 className="mt-2 text-h2">เขียนบทความใหม่</h1><p className="mt-2 text-body text-ink-600">บันทึกฉบับร่างได้ตลอด บทความจะไม่ขึ้นเว็บจนกดเผยแพร่</p></header><ArticleForm article={article} /></div></Container></AdminShell>;
}
