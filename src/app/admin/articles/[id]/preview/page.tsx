import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PreviewNotice } from '@/components/admin/PreviewNotice';
import { PreviewUnavailable } from '@/components/admin/PreviewUnavailable';
import { RichContent, RichToc } from '@/components/knowledge/RichContent';
import { SiteShell } from '@/components/layout/SiteShell';
import { PageHero } from '@/components/layout/PageHero';
import { Badge } from '@/components/ui/Badge';
import { Figure } from '@/components/ui/Figure';
import { Section } from '@/components/ui/Section';
import { loadArticlePreview } from '@/cms/admin-preview';
import { isSignedIn } from '@/lib/admin-session';
import { formatThaiDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ดูตัวอย่างบทความ', robots: { index: false, follow: false } };

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) redirect('/admin');
  const { id } = await params;
  const editorHref = `/admin/articles/${encodeURIComponent(id.replace(/^drafts\./, ''))}`;
  const result = await loadArticlePreview(id);
  if (!result.ok) return <PreviewUnavailable editorHref={editorHref} errors={result.errors} />;
  const article = result.data;
  const blocks = article.richContent ?? [];

  return (
    <SiteShell>
      <PreviewNotice source={result.source} editorHref={editorHref} />
      <PageHero
        crumbs={[{ name: 'หน้าแรก', path: '/' }, { name: 'บทความความรู้', path: '/knowledge' }, { name: article.title, path: '#' }]}
        eyebrow={article.category}
        title={article.title}
        lead={article.summary}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-navy-200">
          {article.author && <span>โดย {article.author}</span>}
          <span>เผยแพร่ <time dateTime={article.publishedAt}>{formatThaiDate(article.publishedAt)}</time></span>
        </p>
      </PageHero>
      <Section tone="white" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-8">
            {article.featuredImage && <Figure image={article.featuredImage} ratio="16/9" priority sizes="(min-width: 1024px) 66vw, 100vw" />}
            <div className="mt-8 lg:hidden"><RichToc blocks={blocks} id="preview-toc-inline" /></div>
            <div className="mt-8"><RichContent blocks={blocks} /></div>
            {article.faq?.length ? <section className="mt-14"><h2 className="text-h2">คำถามที่เกี่ยวข้อง</h2><div className="mt-6 space-y-5">{article.faq.map((item) => <div key={item.question}><h3 className="text-h3">{item.question}</h3><p className="mt-2 text-body text-ink-700">{item.answer}</p></div>)}</div></section> : null}
            <ul className="mt-10 flex flex-wrap gap-2">{article.tags.map((tag) => <li key={tag}><Badge tone="neutral">#{tag}</Badge></li>)}</ul>
          </article>
          <aside className="hidden lg:col-span-4 lg:block"><div className="sticky top-20"><RichToc blocks={blocks} id="preview-toc-sidebar" /></div></aside>
        </div>
      </Section>
    </SiteShell>
  );
}
