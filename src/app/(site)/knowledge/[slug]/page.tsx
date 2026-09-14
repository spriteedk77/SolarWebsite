import { RichContent, RichToc } from '@/components/knowledge/RichContent';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Figure } from '@/components/ui/Figure';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ArticleBody, ArticleToc } from '@/components/knowledge/ArticleBody';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { KnowledgeCard } from '@/components/cards/KnowledgeCard';
import { LeadSection } from '@/components/sections/LeadSection';
import { JsonLd } from '@/components/seo/JsonLd';

import { getArticle, getArticles, getRelatedArticles } from '@/content';
import { buildMetadata } from '@/lib/seo';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from '@/lib/schema';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';
import { formatThaiDate } from '@/lib/utils';
import { usesSanity } from '@/cms/client';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Live CMS slugs are resolved per request; only the frozen Pages preview
  // knows its complete route list at build time.
  if (usesSanity()) return [];
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article)
    return buildMetadata({
      title: 'ไม่พบบทความ',
      description: '',
      path: '/knowledge',
      noIndex: true,
    });

  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    path: `/knowledge/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    keywords: article.tags,
    image: {
      url: article.featuredImage.src,
      width: article.featuredImage.width,
      height: article.featuredImage.height,
      alt: article.featuredImage.alt,
    },
  });
}

export default async function ArticlePage({ params }: Params) {
  const { contact, cta } = await getSiteData();
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.related);
  const others = related
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const crumbs = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'บทความความรู้', path: '/knowledge' },
    { name: article.title, path: `/knowledge/${article.slug}` },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={article.category}
        title={article.title}
        lead={article.summary}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-navy-200">
          {article.author && <span>โดย {article.author}</span>}
          <span>
            เผยแพร่{' '}
            <time dateTime={article.publishedAt}>
              {formatThaiDate(article.publishedAt)}
            </time>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            อัปเดตล่าสุด{' '}
            <time dateTime={article.updatedAt}>
              {formatThaiDate(article.updatedAt)}
            </time>
          </span>
        </p>
      </PageHero>

      <Section tone="white" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-8">
            <Figure
              image={article.featuredImage}
              ratio="16/9"
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
            />

            <div className="mt-8 lg:hidden">
              {article.richContent ? (
                <RichToc blocks={article.richContent} id="toc-title-inline" />
              ) : (
                <ArticleToc blocks={article.content} id="toc-title-inline" />
              )}
            </div>

            <div className="mt-8">
              {article.richContent ? (
                <RichContent blocks={article.richContent} />
              ) : (
                <ArticleBody blocks={article.content} />
              )}
            </div>

            {article.faq && article.faq.length > 0 && (
              <section aria-labelledby="article-faq-title" className="mt-14">
                <h2 id="article-faq-title" className="text-h2">
                  คำถามที่เกี่ยวข้อง
                </h2>
                <div className="mt-6">
                  <FAQAccordion items={article.faq} />
                </div>
              </section>
            )}

            <ul className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Badge tone="neutral">#{tag}</Badge>
                </li>
              ))}
            </ul>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-20">
              <div className="hidden lg:block">
                {article.richContent ? (
                  <RichToc
                    blocks={article.richContent}
                    id="toc-title-sidebar"
                  />
                ) : (
                  <ArticleToc blocks={article.content} id="toc-title-sidebar" />
                )}
              </div>

              <div className="rounded-card border border-navy-700 bg-navy-900 p-6 text-navy-100">
                <h2 className="text-h3 text-white">อยากได้ตัวเลขของตัวเอง?</h2>
                <p className="mt-3 text-caption">
                  บทความช่วยให้เข้าใจหลักการ
                  แต่ตัวเลขจริงต้องมาจากบิลค่าไฟและหลังคาของคุณเอง
                  ส่งให้ทีมงานประเมินเบื้องต้นได้โดยไม่มีค่าใช้จ่าย
                </p>
                <Link
                  href={quoteLinks.general}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-flare-500 px-6 font-semibold text-navy-950 hover:bg-flare-400"
                >
                  {cta.primary}
                  <Icon name="arrow-right" className="h-5 w-5" />
                </Link>
                <p className="mt-4 text-caption">
                  หรือสอบถามทาง{' '}
                  <a
                    href={contact.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    LINE {contact.lineId}
                  </a>{' '}
                  ·{' '}
                  <a
                    href={contact.phoneHref}
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    {contact.phone}
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {others.length > 0 && (
        <Section tone="soft" width="wide" labelledBy="related-articles-title">
          <h2 id="related-articles-title" className="text-h2">
            อ่านต่อ
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <KnowledgeCard key={item.id} article={item} />
            ))}
          </div>
        </Section>
      )}

      <LeadSection source={`article-${article.slug}`} />

      <JsonLd
        id="schema-article"
        data={graph(
          breadcrumbSchema(crumbs),
          articleSchema(article),
          ...(article.faq?.length ? [faqSchema(article.faq)] : []),
        )}
      />
    </>
  );
}
