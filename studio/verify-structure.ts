import { createSchema } from 'sanity';
import { createStructureBuilder } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

/**
 * Serialize the Studio's menu the way the Studio does, and fail if it cannot
 * be serialized.
 *
 * `sanity build` never touches the structure — it is resolved in the browser
 * on first render — so a pane missing its `id` compiles, bundles, deploys, and
 * only then greets whoever opens the Studio with "Encountered an error while
 * reading structure". This walks it up front instead.
 *
 * The builder needs a source to read the schema from. Only the schema is real:
 * the project and dataset are placeholders and `getClient` throws, because
 * serializing a menu must not reach the network, and a check that quietly
 * started talking to a live dataset would be a worse problem than the one it
 * is guarding against.
 */
const schema = createSchema({ name: 'np88', types: schemaTypes });

const S = createStructureBuilder({
  source: {
    projectId: 'structure-check',
    dataset: 'structure-check',
    schema,
    currentUser: null,
    getClient: () => {
      throw new Error('Serializing the structure must not call the API');
    },
    i18n: { t: (key: string) => key },
  },
} as unknown as Parameters<typeof createStructureBuilder>[0]);

const root = structure(S, {} as Parameters<typeof structure>[1]);
if (!root || typeof (root as { serialize?: unknown }).serialize !== 'function')
  throw new Error('structure() did not return a serializable node');

const serialized = (
  root as { serialize: (options: { path: [] }) => unknown }
).serialize({ path: [] });

const items =
  (serialized as { items?: { id?: string; title?: string }[] }).items ?? [];
if (!items.length) throw new Error('The Studio menu serialized to no panes');

const ids = items.map((item) => item.id);
const duplicates = [
  ...new Set(ids.filter((id, index) => id && ids.indexOf(id) !== index)),
];
if (duplicates.length)
  throw new Error(`Two panes share an id: ${duplicates.join(', ')}`);

console.log(`Studio structure OK: ${items.length} pane(s)`);
for (const item of items) console.log(`  ${item.id} — ${item.title}`);
