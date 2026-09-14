import type { StructureBuilder, StructureResolver } from 'sanity/structure';

/** Documents there is exactly one of; they are opened, never created or listed. */
export const singletons = new Set(['company', 'siteSettings']);

/**
 * The Studio's left-hand menu.
 *
 * Kept out of sanity.config.ts so it can be serialized on its own — see
 * verify-structure.ts. Sanity resolves this in the browser, so a mistake here
 * is invisible to `sanity build` and only shows up as a broken pane after the
 * Studio is already deployed.
 *
 * Every list and every list item needs an `id`. Sanity uses it as the URL
 * segment for the pane and refuses to serialize a node without one; the two
 * singletons below are the only hand-written items, since
 * `documentTypeListItems()` already names its own after the schema type.
 */
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .id('root')
    .title('เนื้อหาเว็บไซต์')
    .items([
      S.listItem()
        .id('company')
        .title('ข้อมูลบริษัทและช่องทางติดต่อ')
        .child(S.document().schemaType('company').documentId('company')),
      S.listItem()
        .id('siteSettings')
        .title('หน้าแรกและข้อความหลัก')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !singletons.has(item.getId()!),
      ),
    ]);
