import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset)
  throw new Error(
    'ตั้งค่า SANITY_STUDIO_PROJECT_ID และ SANITY_STUDIO_DATASET ก่อนเปิด Studio',
  );
const singletons = new Set(['company', 'siteSettings']);
export default defineConfig({
  name: 'np88',
  title: 'NP88 Solar — จัดการเนื้อหา',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('เนื้อหาเว็บไซต์')
          .items([
            S.listItem()
              .title('ข้อมูลบริษัทและช่องทางติดต่อ')
              .child(S.document().schemaType('company').documentId('company')),
            S.listItem()
              .title('หน้าแรกและข้อความหลัก')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            ...S.documentTypeListItems().filter(
              (item) => !singletons.has(item.getId()!),
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter((o) => !singletons.has(o.templateId)),
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(
            (a) =>
              !['delete', 'duplicate', 'unpublish'].includes(a.action || ''),
          )
        : actions,
  },
});
