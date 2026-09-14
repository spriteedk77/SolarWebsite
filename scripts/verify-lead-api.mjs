#!/usr/bin/env node
/** Loopback CI validation only. testMode=1 never delivers or stores a lead.
 * The server must explicitly enable LEAD_TEST_MODE=1; otherwise it rejects 403. */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const target = new URL(BASE);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname))
  throw new Error('Lead verification is restricted to a loopback CI server');
const URL_ = `${BASE}/api/lead`;

function baseFields(fd) {
  fd.set('name', 'CI ทดสอบระบบ');
  fd.set('phone', '0812345678');
  fd.set('consent', 'yes');
  fd.set('testMode', '1');
  return fd;
}

async function post(fd) {
  const res = await fetch(URL_, { method: 'POST', body: fd });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response — leave body null, caller's assertion will fail loudly */
  }
  return { status: res.status, body };
}

// --- test cases ---------------------------------------------------------------
// The first case IS the safety gate: it is the only shape that reaches
// delivery, so it is sent exactly once, and its result is checked specially
// below before any other case is allowed to run.

const cases = [
  {
    name: 'valid submission (testMode)',
    build: () => baseFields(new FormData()),
    expectStatus: 200,
    expectOk: true,
    isSafetyGate: true,
  },
  {
    name: 'missing consent',
    build: () => {
      const fd = new FormData();
      fd.set('name', 'CI ทดสอบ');
      fd.set('phone', '0812345678');
      fd.set('testMode', '1');
      return fd;
    },
    expectStatus: 422,
    expectOk: false,
  },
  {
    name: 'invalid phone number',
    build: () => {
      const fd = baseFields(new FormData());
      fd.set('phone', '123');
      return fd;
    },
    expectStatus: 422,
    expectOk: false,
  },
  {
    name: 'honeypot filled (bot)',
    build: () => {
      const fd = baseFields(new FormData());
      fd.set('companyWebsite', 'http://spam.example');
      return fd;
    },
    expectStatus: 200,
    expectOk: true,
  },
  {
    name: 'disallowed attachment MIME type',
    build: () => {
      const fd = baseFields(new FormData());
      fd.append(
        'bill',
        new Blob(['MZ'], { type: 'application/x-msdownload' }),
        'a.exe',
      );
      return fd;
    },
    expectStatus: 415,
    expectOk: false,
  },
  {
    name: 'attachment over the per-file limit',
    build: () => {
      const fd = baseFields(new FormData());
      fd.append(
        'bill',
        new Blob([new Uint8Array(3 * 1024 * 1024 + 1)], { type: 'image/png' }),
        'big.png',
      );
      return fd;
    },
    expectStatus: 413,
    expectOk: false,
  },
  {
    name: 'valid image attachment accepted',
    build: () => {
      const fd = baseFields(new FormData());
      fd.append(
        'bill',
        new Blob(
          [
            Buffer.from(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
              'base64',
            ),
          ],
          { type: 'image/png' },
        ),
        'ok.png',
      );
      return fd;
    },
    expectStatus: 200,
    expectOk: true,
  },
];

cases.push({
  name: 'spoofed image rejected',
  build: () => {
    const fd = baseFields(new FormData());
    fd.append(
      'bill',
      new Blob(['MZ executable'], { type: 'image/png' }),
      'fake.png',
    );
    return fd;
  },
  expectStatus: 415,
  expectOk: false,
});

cases.push({
  name: 'too many attachments rejected before decoding',
  build: () => {
    const fd = baseFields(new FormData());
    for (let i = 0; i < 9; i++)
      fd.append('bill', new Blob(['x'], { type: 'image/png' }), 'a.png');
    return fd;
  },
  expectStatus: 413,
  expectOk: false,
});
cases.push({
  name: 'total attachments exceed 3 MiB',
  build: () => {
    const fd = baseFields(new FormData());
    for (let i = 0; i < 2; i++)
      fd.append(
        'bill',
        new Blob([new Uint8Array(1600 * 1024)], { type: 'image/png' }),
        'a.png',
      );
    return fd;
  },
  expectStatus: 413,
  expectOk: false,
});

let failed = 0;
for (const c of cases) {
  const { status, body } = await post(c.build());
  const ok = status === c.expectStatus && body?.ok === c.expectOk;

  if (c.isSafetyGate && (!ok || body?.testMode !== true)) {
    console.error(
      `FAIL  ${c.name.padEnd(38)} expected ${c.expectStatus}/${c.expectOk}, got ${status}/${JSON.stringify(body)}`,
    );
    console.error(
      '\n[verify-lead-api] SAFETY GATE FAILED — testMode did not engage.',
    );
    console.error(
      '  This server is not running with LEAD_TEST_MODE=1. Stopping here — running ' +
        'no further requests were sent.',
    );
    process.exit(1);
  }

  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${c.name.padEnd(38)} expected ${c.expectStatus}/${c.expectOk}, ` +
      `got ${status}/${body?.ok}`,
  );
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`[verify-lead-api] ${failed}/${cases.length} case(s) failed.`);
  process.exit(1);
}

console.log(
  `[verify-lead-api] OK — all ${cases.length} case(s) passed, nothing delivered.`,
);
