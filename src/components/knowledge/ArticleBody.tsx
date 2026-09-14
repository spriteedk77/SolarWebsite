import Link from 'next/link';
import { safeContentHref } from '@/cms/models';
import type { InlineBlock } from '@/content/types';
import { Note } from '@/components/ui/Note';

/**
 * Renders article content from structured blocks.
 *
 * Blocks rather than raw HTML: content stays safe to move into a CMS, headings
 * keep a correct hierarchy (article H1 is the title, so blocks start at H2),
 * and no `dangerouslySetInnerHTML` is needed anywhere in the article path.
 *
 * Inline text supports two lightweight marks — `**bold**` and `[label](href)` —
 * parsed here rather than by a markdown dependency.
 */

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`;

      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }

      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) {
        const [, label, rawHref] = link;
        const href = safeContentHref(rawHref);
        if (!href) return <span key={key}>{label}</span>;
        if (href.startsWith('/')) {
          return (
            <Link key={key} href={href}>
              {label}
            </Link>
          );
        }
        return (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }

      return <span key={key}>{part}</span>;
    });
}

export function ArticleBody({ blocks }: { blocks: InlineBlock[] }) {
  return (
    <div className="prose-th">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.type) {
          case 'h2':
            return (
              <h2 key={key} id={`section-${index}`}>
                {block.text}
              </h2>
            );
          case 'h3':
            return <h3 key={key}>{block.text}</h3>;
          case 'p':
            return <p key={key}>{renderInline(block.text, key)}</p>;
          case 'ul':
            return (
              <ul key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>
                    {renderInline(item, `${key}-${itemIndex}`)}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>
                    {renderInline(item, `${key}-${itemIndex}`)}
                  </li>
                ))}
              </ol>
            );
          case 'note':
            return (
              <Note
                key={key}
                tone={block.tone ?? 'info'}
                className="not-prose my-7"
              >
                {renderInline(block.text, key)}
              </Note>
            );
          case 'table':
            return (
              <figure key={key} className="my-7">
                <div className="overflow-x-auto rounded-card border border-hairline">
                  <table>
                    <thead>
                      <tr>
                        {block.head.map((cell) => (
                          <th key={cell} scope="col">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={`${key}-row-${rowIndex}`}>
                          {row.map((cell, cellIndex) =>
                            cellIndex === 0 ? (
                              <th
                                key={`${key}-${rowIndex}-${cellIndex}`}
                                scope="row"
                              >
                                {cell}
                              </th>
                            ) : (
                              <td key={`${key}-${rowIndex}-${cellIndex}`}>
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-caption text-ink-600">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * In-page table of contents built from the article's H2 blocks.
 *
 * The article page renders two instances (one in the flow on small screens,
 * one in the sticky sidebar on large ones), so each needs its own heading id —
 * hence the required `id` prop rather than a hard-coded one.
 */
export function ArticleToc({
  blocks,
  id,
}: {
  blocks: InlineBlock[];
  id: string;
}) {
  const headings = blocks
    .map((block, index) => ({ block, index }))
    .filter(
      (
        entry,
      ): entry is {
        block: Extract<InlineBlock, { type: 'h2' }>;
        index: number;
      } => entry.block.type === 'h2',
    );

  if (headings.length < 3) return null;

  return (
    <nav
      aria-labelledby={id}
      className="rounded-card border border-hairline bg-paper-soft p-5"
    >
      <p id={id} className="text-body font-semibold text-navy-900">
        หัวข้อในบทความนี้
      </p>
      <ol className="mt-3 space-y-2 text-caption">
        {headings.map((entry) => (
          <li key={entry.index}>
            <a
              href={`#section-${entry.index}`}
              className="text-solar-700 underline-offset-4 hover:underline"
            >
              {entry.block.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
