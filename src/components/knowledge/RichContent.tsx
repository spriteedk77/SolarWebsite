import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import { z } from 'zod';
import { imageModel, safeContentHref, type RichBlock } from '@/cms/models';
import { Figure } from '@/components/ui/Figure';

const tableModel = z.object({
  caption: z.string().optional(),
  head: z.array(z.string()),
  rows: z.array(z.object({ cells: z.array(z.string()) })),
});
const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={`section-${value._key}`}>{children}</h2>
    ),
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeContentHref(value?.href);
      if (!href) return <span>{children}</span>;
      return href.startsWith('/') ? (
        <Link href={href}>{children}</Link>
      ) : (
        <a href={href} rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  types: {
    siteImage: ({ value }) => (
      <Figure
        image={imageModel.parse(value)}
        showCaption
        sizes="(min-width:1024px) 760px, 100vw"
      />
    ),
    contentTable: ({ value }) => {
      const table = tableModel.parse(value);
      return (
        <div className="my-7 max-w-full overflow-x-auto">
          <table>
            {table.caption && <caption>{table.caption}</caption>}
            <thead>
              <tr>
                {table.head.map((cell, i) => (
                  <th key={i} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.cells.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};
export function RichContent({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="prose-th min-w-0">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
export function RichToc({ blocks, id }: { blocks: RichBlock[]; id: string }) {
  const headings = blocks.filter(
    (block) => block._type === 'block' && block.style === 'h2',
  );
  if (headings.length < 3) return null;
  return (
    <nav
      aria-labelledby={id}
      className="rounded-card border border-hairline bg-paper-soft p-5"
    >
      <p id={id} className="text-body font-semibold">
        หัวข้อในบทความนี้
      </p>
      <ol className="mt-3 space-y-2 text-caption">
        {headings.map((block, i) => (
          <li key={block._key || i}>
            <a href={`#section-${block._key}`} className="text-solar-700">
              {Array.isArray(block.children)
                ? block.children
                    .map((child: { text?: string }) => child.text || '')
                    .join('')
                : ''}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
