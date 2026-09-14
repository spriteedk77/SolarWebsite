import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from '@studio/schemaTypes';
import { singletons, structure } from '@studio/structure';
import { siteInfoTool } from './site-info/plugin';
import { np88StudioTheme } from './theme';
import { StudioLogo } from './StudioLogo';

/**
 * The Studio as it runs inside this website, at /admin.
 *
 * Same schema and same menu as the standalone Studio in studio/ — imported,
 * not copied, so the two cannot describe different content. What differs is
 * where it lives: on the company's own domain rather than a separate
 * sanity.studio address, which is the whole point of mounting it here.
 *
 * The project and dataset only name the content project; they grant nothing,
 * which is why they can sit in a browser bundle. They are read from the
 * environment so a second dataset can be pointed at without a code change, and
 * fall back to the values already committed in studio/.env.example so a
 * missing variable cannot take the whole site's build down with it.
 */
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'mtnue2wm';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';

export const adminBasePath = '/admin';

export default defineConfig({
  name: 'np88-admin',
  title: 'NP88 Solar — จัดการเนื้อหา',
  basePath: adminBasePath,
  projectId,
  dataset,
  // The short form first: it is what an editor opens the admin to do. The
  // document editor sits behind it for articles, projects and anything the
  // form deliberately does not cover.
  plugins: [siteInfoTool(), structureTool({ structure })],
  // The admin is part of this website, so it wears the website's colours and
  // the company's mark rather than Sanity's defaults. See theme.ts.
  theme: np88StudioTheme,
  studio: { components: { logo: StudioLogo } },
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
