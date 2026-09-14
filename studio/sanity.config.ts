import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { singletons, structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset)
  throw new Error(
    'ตั้งค่า SANITY_STUDIO_PROJECT_ID และ SANITY_STUDIO_DATASET ก่อนเปิด Studio',
  );
export default defineConfig({
  name: 'np88',
  title: 'NP88 Solar — จัดการเนื้อหา',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
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
