#!/usr/bin/env node
/**
 * Exercises /api/lead's validation contract without ever delivering a real
 * lead — every case that reaches full validation carries `testMode=1`.
 *
 * Safety gate: the one request shaped as a fully valid submission — the only
 * shape that reaches the delivery step — is sent exactly once, as the first
 * case, and its result gates everything after it. If the server does not echo
 * back `{ok:true, testMode:true}`, the script aborts immediately instead of
 * running the rest of the suite. testMode requires the server's own
 * LEAD_TEST_MODE=1 env var (see src/app/api/lead/route.ts) — every other case
 * below fails validation before reaching delivery, so only this one matters.
 *
 * Residual risk, stated plainly: that one request is real HTTP traffic to
 * /api/lead. If somehow run against a deployment that has LEAD_WEBHOOK_URL
 * set but LEAD_TEST_MODE unset, it would deliver one obviously-fake lead
 * (name "CI ทดสอบระบบ", a fixed dummy phone number) before this script
 * detects the mismatch and stops. Never configure LEAD_WEBHOOK_URL in the
 * environment this script runs in — CI has no reason to hold that secret.
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-lead-api.mjs
 *
 * Run this only against a server started with LEAD_TEST_MODE=1 — never
 * against a real deployment.
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
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
      fd.append('bill', new Blob(['MZ'], { type: 'application/x-msdownload' }), 'a.exe');
      return fd;
    },
    expectStatus: 415,
    expectOk: false,
  },
  {
    name: 'attachment over the per-file limit',
    build: () => {
      const fd = baseFields(new FormData());
      fd.append('bill', new Blob([new Uint8Array(12 * 1024 * 1024)], { type: 'image/png' }), 'big.png');
      return fd;
    },
    expectStatus: 413,
    expectOk: false,
  },
  {
    name: 'valid image attachment accepted',
    build: () => {
      const fd = baseFields(new FormData());
      fd.append('bill', new Blob([new Uint8Array(4)], { type: 'image/png' }), 'ok.png');
      return fd;
    },
    expectStatus: 200,
    expectOk: true,
  },
];

let failed = 0;
for (const c of cases) {
  const { status, body } = await post(c.build());
  const ok = status === c.expectStatus && body?.ok === c.expectOk;

  if (c.isSafetyGate && (!ok || body?.testMode !== true)) {
    console.error(`FAIL  ${c.name.padEnd(38)} expected ${c.expectStatus}/${c.expectOk}, got ${status}/${JSON.stringify(body)}`);
    console.error('\n[verify-lead-api] SAFETY GATE FAILED — testMode did not engage.');
    console.error(
      '  This server is not running with LEAD_TEST_MODE=1. Stopping here — running ' +
        'the remaining cases would risk creating further real deliveries.',
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

console.log(`[verify-lead-api] OK — all ${cases.length} case(s) passed, nothing delivered.`);
