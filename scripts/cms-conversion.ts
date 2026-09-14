import type { InlineBlock } from '../src/content/types';
import type { RichBlock } from '../src/cms/models';

/** Convert the existing editorial snapshot into native rich text, not Markdown fields. */
export function convertBlocks(blocks: InlineBlock[]) {
  let key = 0;
  const nextKey = () => `m${key++}`;
  function paragraph(text: string, style = 'normal', listItem?: string) {
    const markDefs: { _key: string; _type: string; href: string }[] = [];
    const children = text
      .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
      .filter(Boolean)
      .map((part) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        const marks: string[] = [];
        let value = part;
        if (link) {
          const id = nextKey();
          markDefs.push({ _key: id, _type: 'link', href: link[2] });
          marks.push(id);
          value = link[1];
        } else if (part.startsWith('**') && part.endsWith('**')) {
          marks.push('strong');
          value = part.slice(2, -2);
        }
        return { _type: 'span', _key: nextKey(), text: value, marks };
      });
    return {
      _type: 'block',
      _key: nextKey(),
      style,
      markDefs,
      children,
      ...(listItem ? { listItem, level: 1 } : {}),
    };
  }
  return blocks.flatMap<RichBlock>((block) => {
    if (block.type === 'ul' || block.type === 'ol')
      return block.items.map((item) =>
        paragraph(item, 'normal', block.type === 'ul' ? 'bullet' : 'number'),
      );
    if (block.type === 'table')
      return [
        {
          _type: 'contentTable',
          _key: nextKey(),
          caption: block.caption,
          head: block.head,
          rows: block.rows.map((cells) => ({
            _type: 'tableRow',
            _key: nextKey(),
            cells,
          })),
        },
      ];
    return [
      paragraph(
        block.text,
        block.type === 'p'
          ? 'normal'
          : block.type === 'note'
            ? 'blockquote'
            : block.type,
      ),
    ];
  });
}
