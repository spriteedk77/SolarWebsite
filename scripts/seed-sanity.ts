import { createClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { projects } from '../src/content/th/projects';
import { articles } from '../src/content/th/articles';
import { homePackage } from '../src/content/th/pages';
import { defaultSiteData } from '../src/lib/site-data';
import type { ImageAsset, InlineBlock } from '../src/content/types';
import { convertBlocks } from './cms-conversion';

const write = process.argv.includes('--write');
const {
  SANITY_PROJECT_ID: projectId,
  SANITY_DATASET: dataset,
  SANITY_WRITE_TOKEN: token,
} = process.env;
if (write && (!projectId || !dataset || !token))
  throw new Error(
    'Set SANITY_PROJECT_ID, SANITY_DATASET and a scoped SANITY_WRITE_TOKEN locally. Never put the write token in browser variables.',
  );
const client = write
  ? createClient({
      projectId,
      dataset,
      token,
      apiVersion: '2026-01-01',
      useCdn: false,
    })
  : undefined;
let imageKey = 0;
const uploads = new Map<string, string>();
async function image(source: ImageAsset) {
  const base = {
    _type: 'siteImage',
    _key: `image${imageKey++}`,
    alt: source.alt,
    caption: source.caption,
  };
  if (source.placeholder || source.src.endsWith('.svg') || !client)
    return { ...base, legacySrc: source.src };
  const file = path.resolve('public', source.src.replace(/^\//, ''));
  if (!file.startsWith(path.resolve('public/images') + path.sep))
    throw new Error('Image outside public/images');
  let id = uploads.get(source.src);
  if (!id) {
    const asset = await client.assets.upload('image', createReadStream(file), {
      filename: path.basename(file),
    });
    id = asset._id;
    uploads.set(source.src, id);
  }
  return { ...base, asset: { _type: 'reference', _ref: id } };
}
async function seed(
  id: string,
  make: () => Promise<Record<string, unknown> & { _type: string }>,
) {
  // Do not even upload assets if either a published document or draft already exists.
  if (
    client &&
    (await client.getDocuments([id, `drafts.${id}`])).some(Boolean)
  ) {
    console.log(`Skip existing ${id}`);
    return;
  }
  const document = {
    ...(await make()),
    _id: `drafts.${id}`,
    approvedForPublication: false,
  };
  if (client)
    try {
      await client.createIfNotExists(document);
    } catch (cause) {
      // Which document failed is the first thing worth knowing, and the
      // caller only sees one line. Sanity's own message is kept intact.
      throw new Error(
        `Could not create draft "${id}": ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      );
    }
  console.log(`${write ? 'Created draft' : 'Dry run'}: ${id}`);
}
async function main() {
  const { site, contact, serviceAreas, homepage, cta, footerInformation } =
    defaultSiteData;
  await seed('company', async () => ({
    _type: 'company',
    companyName: site.name,
    legalName: site.legalNameShort,
    tagline: site.tagline,
    description: site.description,
    phone: contact.phone,
    phoneE164: contact.phoneE164,
    lineId: contact.lineId,
    lineUrl: contact.lineUrl,
    facebookUrl: contact.facebookUrl || undefined,
    businessHours: contact.businessHours || undefined,
    address: contact.address,
    serviceAreas: serviceAreas.map((a) => ({
      ...a,
      _key: a.slug,
      _type: 'object',
    })),
  }));
  await seed('siteSettings', async () => ({
    _type: 'siteSettings',
    homepageHeadline: homepage.headline,
    homepageDescription: homepage.description,
    homepageServiceMessage: homepage.serviceMessage,
    primaryCTA: cta.primary,
    secondaryCTA: cta.projects,
    footerInformation,
    // Weak on purpose. Sanity refuses a strong reference to a document that
    // does not exist, and this import creates `drafts.company` — never
    // `company` — because nothing here is allowed to publish. A strong
    // reference would make the whole import impossible, not just this field.
    // Once an editor has published the company document, re-picking it in the
    // Settings field writes the strong reference the schema asks for.
    contactInformation: { _type: 'reference', _ref: 'company', _weak: true },
  }));
  for (const p of projects)
    await seed(p.id, async () => {
      const blocks: InlineBlock[] = [
        { type: 'h2', text: 'ภาพรวมโครงการ' },
        { type: 'p', text: p.overview },
      ];
      for (const [heading, items] of [
        ['โจทย์และเป้าหมาย', p.objective],
        ['ระบบที่ออกแบบ', p.solution],
        ['รายละเอียดการติดตั้ง', p.installation],
        ['ประโยชน์ที่ได้รับ', p.benefits],
      ] as const)
        if (items.length)
          blocks.push(
            { type: 'h2', text: heading },
            { type: 'ul', items: [...items] },
          );
      return {
        _type: 'project',
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        summary: p.summary,
        customerName: p.customerName,
        customerType: p.customerType,
        location: p.location,
        province: p.province,
        systemCapacity: p.systemCapacityKw,
        phase: p.phase,
        solarPanels: p.solarPanel,
        panelQuantity: p.panelQuantity,
        inverter: p.inverter,
        battery: p.battery,
        optimizer: p.optimizer,
        systemType: p.systemType,
        zeroExport: p.zeroExport,
        monitoring: p.monitoring,
        estimatedSavings: p.estimatedSavingsThbPerMonth,
        standards: p.standards,
        servicesIncluded: p.servicesIncluded,
        warranty: p.warranty?.map((w, i) => ({ ...w, _key: `w${i}` })),
        content: convertBlocks(blocks),
        coverImage: await image(p.gallery[0]),
        gallery: await Promise.all(p.gallery.slice(1).map(image)),
        featured: p.featured,
        publishedAt: new Date(p.publishedAt).toISOString(),
      };
    });
  for (const a of articles)
    await seed(a.id, async () => ({
      _type: 'article',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      summary: a.summary,
      category: a.category,
      tags: a.tags,
      related: a.related?.flatMap((slug, i) => {
        const related = articles.find((item) => item.slug === slug);
        return related
          ? [
              {
                _type: 'reference',
                _key: `r${i}`,
                _ref: related.id,
                _weak: true,
              },
            ]
          : [];
      }),
      content: convertBlocks(a.content),
      ...(a.featuredImage ? { featuredImage: await image(a.featuredImage) } : {}),
      publishedAt: new Date(a.publishedAt).toISOString(),
      updatedAt: new Date(a.updatedAt).toISOString(),
      faq: a.faq?.map((f, i) => ({ ...f, _key: `q${i}` })),
      featured: articles.slice(0, 3).includes(a),
    }));
  await seed('promotion-sigenenergy-neo', async () => ({
    _type: 'promotion',
    title: homePackage.name,
    slug: { _type: 'slug', current: 'sigenenergy-neo' },
    price: homePackage.priceThb,
    systemSize: 5,
    phase: '1 เฟส',
    solarPanel: 'AIKO 670W',
    panelQuantity: 8,
    battery: homePackage.battery,
    includedServices: homePackage.includes,
    active: false,
  }));
  console.log(
    write
      ? 'Draft import finished. Review and publish in Studio; nothing was published automatically.'
      : 'No remote changes. Add --write only after configuring the target dataset and taking a backup.',
  );
}
main().catch((error: unknown) => {
  // Print what Sanity actually said. Guessing at "credentials, dataset and
  // network" sent the first real import hunting in the wrong place: the token
  // was fine and one document was at fault. Only the message and the status
  // are printed — never the error object or the client config, either of
  // which can carry the write token into a terminal log or a screenshot.
  const status = (error as { statusCode?: number } | null)?.statusCode;
  console.error(
    `CMS import failed${status ? ` (HTTP ${status})` : ''}; no documents were published.`,
  );
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
