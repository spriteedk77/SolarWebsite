import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

/**
 * Who is allowed to change the website's content — the rules, on their own.
 *
 * No `server-only` here, and nothing in this file touches a request: it is
 * hashing and signing, so it can be tested directly. Reading cookies and
 * deciding whether the current request is signed in lives in admin-session.ts,
 * which is server-only for real.
 *
 * One shared password for the people at NP88 who edit the site. The password
 * itself is never stored, sent here, or written down in this repository: the
 * environment holds a scrypt hash produced by scripts/admin-password.mjs on
 * whoever's machine chose it.
 *
 * Everything below is deliberately plain and testable — no session store, no
 * database, no third party. A signed cookie says "this browser proved it knew
 * the password, and when". That is the whole model.
 *
 * The one rule that must never bend: a missing or malformed configuration
 * denies access. Never the other way round.
 */

/** scrypt cost. 16 MiB of memory per attempt, which is the point. */
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 } as const;
const HASH_PREFIX = 'scrypt';

/** How long a login lasts before it has to be done again. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export const SESSION_COOKIE = 'np88_admin';

function scrypt(password: string, salt: Buffer): Buffer {
  return scryptSync(password.normalize('NFKC'), salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    // 128 * N * r is 16 MiB; the default ceiling is below that.
    maxmem: 256 * SCRYPT.N * SCRYPT.r,
  });
}

/** `scrypt:N:r:p:salt:hash`, all hex — what goes in the environment. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scrypt(password, salt);
  return [
    HASH_PREFIX,
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString('hex'),
    hash.toString('hex'),
  ].join(':');
}

/**
 * Constant-time check of a password against a stored hash.
 *
 * Returns false for anything it cannot make sense of, so a truncated or
 * mistyped environment variable locks the admin rather than opening it.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!password || !stored) return false;
  const parts = stored.trim().split(':');
  if (parts.length !== 6 || parts[0] !== HASH_PREFIX) return false;

  const [, n, r, p, saltHex, hashHex] = parts;
  if (
    Number(n) !== SCRYPT.N ||
    Number(r) !== SCRYPT.r ||
    Number(p) !== SCRYPT.p
  )
    return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltHex, 'hex');
    expected = Buffer.from(hashHex, 'hex');
  } catch {
    return false;
  }
  if (salt.length !== 16 || expected.length !== SCRYPT.keylen) return false;

  let actual: Buffer;
  try {
    actual = scrypt(password, salt);
  } catch {
    return false;
  }
  return timingSafeEqual(actual, expected);
}

/* ------------------------------------------------------------------ */
/* Session cookie                                                      */
/* ------------------------------------------------------------------ */

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * A session value: when it was issued and when it stops being accepted, with
 * an HMAC over both. It carries no identity because there is only one login,
 * and nothing secret, because a cookie is not a safe place for either.
 */
export function createSessionToken(
  secret: string,
  now: number = Date.now(),
  ttlSeconds: number = SESSION_TTL_SECONDS,
): string {
  if (!secret) throw new Error('A session secret is required');
  const payload = base64url(
    JSON.stringify({
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + ttlSeconds,
    }),
  );
  return `${payload}.${sign(payload, secret)}`;
}

/** True only for a token this secret signed, which has not expired. */
export function verifySessionToken(
  token: string | undefined | null,
  secret: string,
  now: number = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  // Compare the signature before reading the payload: an unsigned payload is
  // attacker-controlled text and has no business being parsed.
  if (expected.length !== given.length) return false;
  if (!timingSafeEqual(expected, given)) return false;

  let claims: { exp?: unknown };
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  return typeof claims.exp === 'number' && claims.exp * 1000 > now;
}

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

export type AdminConfig =
  | { ready: true; passwordHash: string; secret: string }
  | { ready: false; missing: string[] };

/**
 * What the admin needs before it will let anyone in.
 *
 * Reported rather than thrown so the page can explain what is missing to
 * whoever is setting it up, instead of returning a blank error — while still
 * refusing every login until it is complete.
 */
export function adminConfig(): AdminConfig {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? '';
  const missing: string[] = [];
  if (!passwordHash) missing.push('ADMIN_PASSWORD_HASH');
  // Short secrets are the same as no secret; 32 characters of random text is
  // what the setup script produces.
  if (secret.length < 32) missing.push('ADMIN_SESSION_SECRET');
  if (missing.length) return { ready: false, missing };
  return { ready: true, passwordHash, secret };
}
