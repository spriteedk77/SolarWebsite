import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  SESSION_TTL_SECONDS,
} from '../src/lib/admin-auth';

const PASSWORD = 'ตัวอย่างรหัสผ่านที่ยาวพอ-2026';

test('a password verifies against its own hash and nothing else', () => {
  const stored = hashPassword(PASSWORD);
  assert.equal(verifyPassword(PASSWORD, stored), true);
  assert.equal(verifyPassword(PASSWORD + ' ', stored), false);
  assert.equal(verifyPassword(PASSWORD.slice(0, -1), stored), false);
  assert.equal(verifyPassword('', stored), false);
});

test('the same password hashes differently every time', () => {
  // A shared salt would let one cracked hash answer for every deployment.
  assert.notEqual(hashPassword(PASSWORD), hashPassword(PASSWORD));
});

test('a hash that cannot be read denies access, never grants it', () => {
  const valid = hashPassword(PASSWORD);
  const broken = [
    '',
    '   ',
    'not-a-hash',
    valid.replace('scrypt', 'sha256'),
    valid.split(':').slice(0, 5).join(':'),
    valid.slice(0, valid.length - 4),
    valid.replace(':16384:', ':2:'),
    valid.replace(/:[0-9a-f]+$/, ':zzzz'),
  ];
  for (const stored of broken)
    assert.equal(verifyPassword(PASSWORD, stored), false, JSON.stringify(stored));
});

test('a session is accepted only with the secret that signed it', () => {
  const secret = 'a'.repeat(48);
  const token = createSessionToken(secret);
  assert.equal(verifySessionToken(token, secret), true);
  assert.equal(verifySessionToken(token, 'b'.repeat(48)), false);
  assert.equal(verifySessionToken(token, ''), false);
});

test('a session stops being accepted once it expires', () => {
  const secret = 'c'.repeat(48);
  const issued = Date.UTC(2026, 0, 1);
  const token = createSessionToken(secret, issued);

  assert.equal(verifySessionToken(token, secret, issued + 1000), true);
  assert.equal(
    verifySessionToken(token, secret, issued + SESSION_TTL_SECONDS * 1000 - 1),
    true,
  );
  assert.equal(
    verifySessionToken(token, secret, issued + SESSION_TTL_SECONDS * 1000 + 1),
    false,
  );
});

test('a tampered session is rejected before its contents are read', () => {
  const secret = 'd'.repeat(48);
  const issued = Date.UTC(2026, 0, 1);
  const token = createSessionToken(secret, issued);
  const [payload, signature] = token.split('.');

  // Someone extending their own expiry, unsigned.
  const forged = Buffer.from(
    JSON.stringify({ iat: 0, exp: 9_999_999_999 }),
  ).toString('base64url');

  for (const bad of [
    `${forged}.${signature}`,
    `${payload}.${signature.slice(0, -1)}`,
    `${payload}.`,
    payload,
    '',
    'ï¿½.ï¿½',
  ])
    assert.equal(verifySessionToken(bad, secret, issued + 1000), false, bad);
});

test('nothing is accepted when there is no token at all', () => {
  const secret = 'e'.repeat(48);
  for (const value of [undefined, null, ''])
    assert.equal(verifySessionToken(value, secret), false);
});
