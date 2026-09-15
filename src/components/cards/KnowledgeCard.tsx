import type { Article } from '@/content/types';
import { Card, StretchedLink } from '@/components/ui/Card';
import { Figure } from '@/components/ui/Figure';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatThaiDate } from '@/lib/utils';

export function KnowledgeCard({
  article,
  showImage = true,
}: {
  article: Article;
  showImage?: boolean;
}) {
  const href = `/knowledge/${article.slug}`;

  return (
    <Card as="article" interactive className="flex h-full flex-col">
      {showImage && article.featuredImage && (
        <Figure
          image={article.featuredImage}
          ratio="16/9"
          rounded={false}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Badge tone="solar" className="self-start">
          {article.category}
        </Badge>

        <h3 className="mt-3 text-h3 leading-snug">
          <StretchedLink href={href} className="hover:text-solar-700">
            {article.title}
          </StretchedLink>
        </h3>

        <p className="mt-2.5 text-caption text-ink-700">{article.summary}</p>

        <p className="mt-auto flex items-center gap-2 pt-5 text-caption text-ink-600">
          <time dateTime={article.updatedAt}>อัปเดต {formatThaiDate(article.updatedAt)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-solar-700">
            อ่านบทความ
            <Icon name="arrow-right" className="h-4 w-4" />
          </span>
        </p>
      </div>
    </Card>
  );
}
