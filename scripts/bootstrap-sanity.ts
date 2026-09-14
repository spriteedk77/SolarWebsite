import { createClient } from '@sanity/client';
import { defaultSiteData } from '../src/lib/site-data';
import { companyModel, settingsModel } from '../src/cms/site-models';

/**
 * One-time handoff from the versioned snapshot to Sanity on the production
 * Netlify build. It publishes only the two singleton drafts that describe the
 * already-live site. Articles and projects remain drafts for a person to
 * review; no claim or placeholder image is published automatically.
 */
async function main() {
  if (process.env.NETLIFY !== 'true' || process.env.CONTEXT !== 'production') {
    console.log('[cms bootstrap] skipped outside the production Netlify build');
    return;
  }
  const projectId = process.env.SANITY_PROJECT_ID?.trim();
  const dataset = process.env.SANITY_DATASET?.trim();
  const token = process.env.SANITY_WRITE_TOKEN?.trim();
  const missing = [!projectId && 'SANITY_PROJECT_ID', !dataset && 'SANITY_DATASET', !token && 'SANITY_WRITE_TOKEN'].filter((value): value is string => Boolean(value));
  if (missing.length) throw new Error(`[cms bootstrap] missing ${missing.join(', ')}`);

  const client = createClient({ projectId: projectId!, dataset: dataset!, token: token!, apiVersion: '2026-01-01', useCdn: false, perspective: 'raw' });
  const [companyLive, settingsLive] = await client.getDocuments(['company', 'siteSettings']);
  if (companyLive && settingsLive) {
    console.log('[cms bootstrap] published singleton documents already exist');
    return;
  }
  const [companyDraft, settingsDraft] = await client.getDocuments(['drafts.company', 'drafts.siteSettings']);
  if (!companyDraft || !settingsDraft)
    throw new Error('[cms bootstrap] drafts.company and drafts.siteSettings must exist before the live site can switch to Sanity');

  const { contact, serviceAreas } = defaultSiteData;
  const company = {
    ...clean(companyDraft),
    _id: 'company',
    _type: 'company',
    address: {
      ...(typeof companyDraft.address === 'object' && companyDraft.address ? companyDraft.address : {}),
      country: (companyDraft.address as Record<string, unknown> | undefined)?.country || contact.address.country,
      countryName: (companyDraft.address as Record<string, unknown> | undefined)?.countryName || contact.address.countryName,
    },
    serviceAreas: Array.isArray(companyDraft.serviceAreas) && companyDraft.serviceAreas.length ? companyDraft.serviceAreas : serviceAreas,
    approvedForPublication: true,
  };
  const settings = { ...clean(settingsDraft), _id: 'siteSettings', _type: 'siteSettings', approvedForPublication: true };
  const problems = [
    ...issues('company', companyModel.safeParse(company)),
    ...issues('siteSettings', settingsModel.safeParse(settings)),
  ];
  if (problems.length) throw new Error(`[cms bootstrap] drafts cannot render on the website: ${problems.join('; ')}`);
  await client.transaction().createOrReplace(company).createOrReplace(settings).delete('drafts.company').delete('drafts.siteSettings').commit();
  console.log('[cms bootstrap] published company and siteSettings from their reviewed drafts');
}

function clean(document: Record<string, unknown>) {
  const { _id, _rev, _createdAt, _updatedAt, ...content } = document;
  void _id; void _rev; void _createdAt; void _updatedAt;
  return content;
}

function issues(label: string, result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) {
  return result.success || !result.error ? [] : result.error.issues.map((issue) => `${label}.${issue.path.join('.')}: ${issue.message}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
