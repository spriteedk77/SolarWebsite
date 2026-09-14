import { notFound, redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { Container } from '@/components/ui/Container';
import { isSignedIn } from '@/lib/admin-session';
import { deleteArticleAction, loadArticle } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  if (!(await isSignedIn())) redirect('/admin');
  const { id } = await params;
  const article = await loadArticle(id);
  if (!article) notFound();
  const { saved } = await searchParams;
  return <AdminShell signedIn><Container width="wide"><div className="mx-auto w-full max-w-4xl py-10"><header className="mb-8"><p className="text-caption font-semibold tracking-wide text-solar-700 uppercase">แก้ไขบทความ</p><h1 className="mt-2 text-h2">{article.title || 'ยังไม่มีชื่อ'}</h1><p className="mt-2 text-body text-ink-600">{article.published ? 'เผยแพร่แล้ว การบันทึกครั้งต่อไปจะเป็นฉบับร่างจนกดเผยแพร่อีกครั้ง' : 'ยังไม่เผยแพร่ ลูกค้ายังไม่เห็นบทความนี้'}</p></header>{saved && <p role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-body font-medium text-green-800">บันทึกฉบับร่างแล้ว</p>}<ArticleForm article={article} /><section className="mt-10 rounded-card border border-red-200 bg-white p-6"><h2 className="text-h3 text-red-800">ลบบทความ</h2><p className="mt-2 text-caption text-ink-600">ลบทั้งฉบับร่างและฉบับที่เผยแพร่ การทำงานนี้ย้อนกลับไม่ได้</p><form action={deleteArticleAction} className="mt-4"><input type="hidden" name="id" value={article.id} /><label className="flex items-center gap-3 text-caption"><input type="checkbox" name="confirmDelete" value="yes" className="h-5 w-5" /> ยืนยันว่าต้องการลบบทความนี้</label><button type="submit" className="mt-4 min-h-11 rounded-lg border border-red-300 px-5 font-semibold text-red-700">ลบบทความ</button></form></section></div></Container></AdminShell>;
}
