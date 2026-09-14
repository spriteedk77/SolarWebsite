import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Lead intake endpoint.
 *
 * The form posts multipart/form-data (fields + optional bill / roof uploads).
 * Everything is validated server-side — the client checks are a convenience,
 * never a control — and then handed to whatever delivery the deployment has
 * configured.
 *
 * Delivery is pluggable and defaults to a local JSON file so the site is
 * functional out of the box without wiring credentials into the repo:
 *
 *   LEAD_WEBHOOK_URL   POST the lead as JSON (Make / Zapier / n8n / LINE OA)
 *   (unset)            write to ./.data/leads/ — development fallback only
 *
 * ⚠️ PRODUCTION CHECKLIST
 *   - set LEAD_WEBHOOK_URL (or replace `deliver()` with an email/CRM call)
 *   - store uploads in object storage with access control, not the app disk
 *   - keep personal data only as long as the privacy notice states
 *   - add the proxy-level body limit described under "Request size" below
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ------------------------------- limits ---------------------------------- */

/** Hard ceiling for the whole request body, headers excluded. */
const MAX_REQUEST_BYTES = 30 * 1024 * 1024; // 30 MB
/** Combined size of all attachments. Leaves headroom for the text fields. */
const MAX_TOTAL_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 8;

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

/** Used when a part arrives with no Content-Type of its own. */
const ALLOWED_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

/* ------------------------------- types ----------------------------------- */

type Lead = {
  receivedAt: string;
  name: string;
  phone: string;
  lineId: string;
  province: string;
  placeType: string;
  billRange: string;
  systemInterest: string;
  message: string;
  source: string;
  /** Which marketing path the visitor came from, if the link carried it. */
  segment: string;
  interestedPackage: string;
  consent: boolean;
  attachments: { field: string; filename: string; type: string; size: number }[];
};

const fail = (status: number, message: string) =>
  NextResponse.json({ ok: false, message }, { status });

/** ASCII control characters — stripped before logging or naming a file. */
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;

function clean(value: FormDataEntryValue | null, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, ' ').trim().slice(0, maxLength);
}

/** Strips directory components for POSIX *and* Windows-style names. */
function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  return base.replace(CONTROL_CHARS, '').slice(0, 180) || 'file';
}

function extensionOf(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(safeFilename(name));
  return match ? match[1].toLowerCase() : '';
}

/**
 * Request size.
 *
 * `request.formData()` buffers the entire body before returning, so the only
 * way to bound memory inside a Route Handler is to consume the stream first
 * and stop reading once the cap is passed. That is what this does:
 *
 *  1. If `content-length` is present and already over the cap, reject without
 *     touching the body at all.
 *  2. Otherwise read the stream, aborting the moment the running total exceeds
 *     the cap — so a chunked upload with no (or a lying) `content-length`
 *     still cannot make us hold more than MAX_REQUEST_BYTES.
 *
 * This bounds *this process*. It does not stop a client from occupying a
 * connection while it uploads, so a platform-level limit should also be set:
 * Vercel enforces its own body limit; on nginx use `client_max_body_size 30m;`
 * and on Cloudflare the plan's upload cap applies.
 */
async function readBodyWithCap(
  request: Request,
  cap: number,
): Promise<{ ok: true; bytes: Uint8Array } | { ok: false }> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > cap) return { ok: false };

  const body = request.body;
  if (!body) return { ok: true, bytes: new Uint8Array(0) };

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > cap) {
        await reader.cancel().catch(() => {});
        return { ok: false };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock?.();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

/* -------------------------------- handler -------------------------------- */

export async function POST(request: Request) {
  /**
   * A native form post (no JavaScript) arrives with `Accept: text/html…` and
   * expects to navigate somewhere; our own `fetch()` sends `* / *` and expects
   * JSON. Both get the same validation — only the reply shape differs.
   */
  const wantsHtml = (request.headers.get('accept') ?? '').includes('text/html');
  const backToForm = (params: Record<string, string>) =>
    NextResponse.redirect(
      new URL(`/quote?${new URLSearchParams(params).toString()}`, request.url),
      303,
    );
  const bad = (status: number, message: string) =>
    wantsHtml ? backToForm({ error: message }) : fail(status, message);
  const good = (extra?: Record<string, unknown>) =>
    wantsHtml ? backToForm({ sent: '1' }) : NextResponse.json({ ok: true, ...extra });

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return bad(415, 'รูปแบบข้อมูลไม่ถูกต้อง');
  }

  const capped = await readBodyWithCap(request, MAX_REQUEST_BYTES);
  if (!capped.ok) {
    return bad(
      413,
      'ข้อมูลที่ส่งมีขนาดใหญ่เกินกำหนด กรุณาลดจำนวนหรือขนาดไฟล์แนบ แล้วลองใหม่อีกครั้ง',
    );
  }

  let form: FormData;
  try {
    // Re-wrap the bytes we already bounded; only the content-type is carried
    // over so the multipart parser can find the boundary.
    form = await new Request(request.url, {
      method: 'POST',
      headers: { 'content-type': contentType },
      // Uint8Array is a valid BodyInit at runtime; the DOM lib types only
      // accept the underlying buffer, so hand it that.
      body: capped.bytes.buffer as ArrayBuffer,
    }).formData();
  } catch {
    return bad(400, 'รูปแบบข้อมูลไม่ถูกต้อง');
  }

  // Honeypot: a filled hidden field means a bot. Answer 200 so it learns nothing.
  if (clean(form.get('companyWebsite'))) {
    return good();
  }

  const name = clean(form.get('name'), 120);
  const phoneRaw = clean(form.get('phone'), 30);
  const phoneDigits = phoneRaw.replace(/[^0-9]/g, '');
  const consent = form.get('consent') === 'yes';

  if (name.length < 2) return bad(422, 'กรุณากรอกชื่อ');
  if (phoneDigits.length < 9 || phoneDigits.length > 10) {
    return bad(422, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
  }
  if (!consent) return bad(422, 'ต้องให้ความยินยอมก่อนส่งข้อมูล');

  /* --- attachments: every limit is checked from metadata before any bytes
         are read, so an oversized set is rejected without being buffered --- */

  const attachments: Lead['attachments'] = [];
  const incoming: { field: string; entry: File }[] = [];
  let totalUploadBytes = 0;

  for (const field of ['bill', 'roof'] as const) {
    for (const entry of form.getAll(field)) {
      if (!(entry instanceof File) || entry.size === 0) continue;

      if (incoming.length + 1 > MAX_FILES) {
        return bad(413, `แนบไฟล์ได้ไม่เกิน ${MAX_FILES} ไฟล์`);
      }
      if (entry.size > MAX_FILE_BYTES) {
        return bad(413, `แต่ละไฟล์ต้องมีขนาดไม่เกิน ${MAX_FILE_BYTES / 1024 / 1024} MB`);
      }
      totalUploadBytes += entry.size;
      if (totalUploadBytes > MAX_TOTAL_UPLOAD_BYTES) {
        return bad(
          413,
          `ไฟล์แนบทั้งหมดรวมกันต้องไม่เกิน ${MAX_TOTAL_UPLOAD_BYTES / 1024 / 1024} MB`,
        );
      }

      // A part may legitimately arrive without its own Content-Type; fall back
      // to the extension rather than letting it through unchecked.
      const declaredType = entry.type.split(';')[0].trim().toLowerCase();
      const typeAllowed = declaredType
        ? ALLOWED_TYPES.has(declaredType)
        : ALLOWED_EXTENSIONS.has(extensionOf(entry.name));
      if (!typeAllowed) {
        return bad(415, 'รองรับเฉพาะไฟล์ PDF และไฟล์ภาพ (JPG, PNG, WEBP, HEIC) เท่านั้น');
      }

      incoming.push({ field, entry });
      attachments.push({
        field,
        filename: safeFilename(entry.name),
        type: declaredType || 'application/octet-stream',
        size: entry.size,
      });
    }
  }

  const lead: Lead = {
    receivedAt: new Date().toISOString(),
    name,
    phone: phoneRaw,
    lineId: clean(form.get('lineId'), 80),
    province: clean(form.get('province'), 80),
    placeType: clean(form.get('placeType'), 80),
    billRange: clean(form.get('billRange'), 80),
    systemInterest: clean(form.get('systemInterest'), 40),
    message: clean(form.get('message'), 4000),
    source: clean(form.get('source'), 60) || 'website',
    segment: clean(form.get('segment'), 40),
    interestedPackage: clean(form.get('package'), 60),
    consent,
    attachments,
  };

  /**
   * Test mode: exercises the full validation path and returns the normal
   * success shape without delivering anything anywhere. Used by CI and by
   * manual end-to-end checks so they never push a fake lead at NP88 Solar's
   * real inbox or webhook.
   *
   * Gated on LEAD_TEST_MODE rather than NODE_ENV: `next start` always sets
   * NODE_ENV=production regardless of how the app was built, so a NODE_ENV
   * check would silently disable test mode in exactly the environment (CI
   * running the production build) it exists for. LEAD_TEST_MODE must be set
   * explicitly — set it in CI only, never in a real deployment's environment.
   */
  if (clean(form.get('testMode')) === '1' && process.env.LEAD_TEST_MODE === '1') {
    console.info('[lead] test mode — validated but not delivered');
    return good({ testMode: true });
  }

  try {
    const files = await Promise.all(
      incoming.map(async ({ entry }, index) => ({
        name: `${index}-${safeFilename(entry.name)}`,
        bytes: await entry.arrayBuffer(),
      })),
    );
    await deliver(lead, files);
  } catch (error) {
    console.error('[lead] delivery failed', error);
    return bad(
      502,
      'ระบบส่งข้อมูลขัดข้องชั่วคราว กรุณาติดต่อทีมงานทาง LINE @np88solar หรือโทร 095-697-1915',
    );
  }

  return good();
}

async function deliver(lead: Lead, files: { name: string; bytes: ArrayBuffer }[]) {
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error(`webhook responded ${response.status}`);
    // Note: attachments are described in the payload but not forwarded here.
    // Wire object storage (S3 / GCS / Cloudinary) and send the resulting URLs.
    return;
  }

  // Development fallback — never rely on this in production.
  const stamp = lead.receivedAt.replace(/[:.]/g, '-');
  const dir = path.join(process.cwd(), '.data', 'leads', stamp);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'lead.json'), JSON.stringify(lead, null, 2), 'utf8');
  for (const file of files) {
    await writeFile(path.join(dir, file.name), Buffer.from(file.bytes));
  }
  console.info(`[lead] stored at ${dir} (set LEAD_WEBHOOK_URL for real delivery)`);
}
