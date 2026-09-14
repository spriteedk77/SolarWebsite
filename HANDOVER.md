# NP88 Solar — handover

## What works now

- Content admin: `https://np88solar.netlify.app/admin`. Sign in, edit the company/contact/homepage fields, save a draft, tick the confirmation, then publish. Netlify reads the published Sanity document directly and refreshes the site within about one minute.
- Articles: open **บทความ**, create or edit an article, arrange paragraphs/headings/images in order, add alt text to every image, then save or publish. A publish is refused if the exact public-site schema cannot render it. Draft and published copies are shown separately in the status line, and deletion removes both only after confirmation.
- Images: open **รูปภาพ** to replace the homepage hero, executive portrait, or a project cover. Large phone photos are resized in the browser before upload; Sanity stores and delivers the original asset through its image CDN. The server accepts only real JPG/PNG/WebP files up to 3 MB after resizing.
- The production Netlify build performs a one-time, explicit bootstrap of the existing `company` and `siteSettings` drafts when their published versions do not yet exist. It fills only the previously dropped country/service-area fields from the repository's existing snapshot, validates both documents, publishes them together, and never auto-publishes an article or project.
- Local development and GitHub Pages remain a frozen review copy. Netlify always uses Sanity; there is no `CONTENT_SOURCE` switch and no silent fallback.

## Decisions I made

- Kept Sanity because image upload, resizing metadata, CDN delivery, drafts, and minute-scale live updates already fit the project and environment; replacing it would add another store and migration without solving a product problem.
- Built the editor inside `/admin` with the site's Prompt typography, colours, spacing, labels, and shared-password session so staff do not need to learn Sanity Studio.
- Kept saving and publishing separate: staff can pause safely in a draft, while publication requires an explicit truth/image-rights confirmation and the same Zod models the public site executes.
- Made Netlify the deterministic live-CMS boundary and GitHub Pages the deterministic snapshot boundary. A successful edit can no longer be stranded by a stale content-source variable.
- Uploads pass through server actions so `SANITY_WRITE_TOKEN` never reaches browser code. Client-side resizing lets a normal article carry multiple phone photos without exceeding the host request limit.
- Did not publish migrated articles/projects automatically because they still require a human check for factual accuracy and image rights.

## Owner must do

- In Netlify → **Site configuration → Environment variables**, keep `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_WRITE_TOKEN` set for production. The screenshot supplied for this task shows all five names present. Never paste their values into the repo, chat, email, or screenshots.
- Remove `CONTENT_SOURCE` if it exists in another Netlify scope or context; the application no longer reads it.
- After the deploy, sign in at `/admin`, change one harmless field and publish it, then confirm the public page updates. This proves the owner-held password and the host-held write token work together without exposing either.
- Before attaching the real company domain, set the launch-only lead and anti-spam variables named in `.env.example`: `LEAD_WEBHOOK_URL`, `TURNSTILE_SECRET_KEY`, and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. The launch guard deliberately blocks a real domain without them.

## Not done

- Hero background, executive portrait, and real article photos are empty until the client supplies the requested files. The admin now has the exact upload places and size guidance. No stock or generated substitute was added.
- Migrated article and project drafts are not published. Review each for facts and rights, replace any placeholder cover with a real image, then publish from the admin.
- The ten unconfirmed items in `src/lib/pending.ts` remain unfilled. They need client answers; the 600+/700+ installation-count conflict remains off the site.
- A mark-only square favicon still needs the client's real logo asset.
