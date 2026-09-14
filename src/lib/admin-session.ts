import 'server-only';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminConfig,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from './admin-auth';

/**
 * The signed-in state of the current request.
 *
 * Everything here runs on the server and nowhere else. The browser is given
 * one cookie it cannot read or forge, and every decision about what may be
 * changed is made again on the server from that cookie — never from anything
 * the page sends back.
 */

/** Wrong guesses are slowed down rather than counted precisely. */
const FAILED_ATTEMPT_DELAY_MS = 1000;
const MAX_ATTEMPTS_PER_WINDOW = 8;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Recent failures, in memory.
 *
 * Deliberately not a database. A serverless instance may be replaced and this
 * resets, so it is a brake and not a wall: the real protection is a long
 * password behind scrypt, which makes each guess cost 16 MiB and real time.
 */
const failures: number[] = [];

function tooManyAttempts(now: number): boolean {
  while (failures.length && now - failures[0] > WINDOW_MS) failures.shift();
  return failures.length >= MAX_ATTEMPTS_PER_WINDOW;
}

export async function isSignedIn(): Promise<boolean> {
  const config = adminConfig();
  if (!config.ready) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, config.secret);
}

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'rate-limited' | 'wrong-password' };

export async function signIn(password: string): Promise<SignInResult> {
  const config = adminConfig();
  if (!config.ready) return { ok: false, reason: 'not-configured' };

  const now = Date.now();
  if (tooManyAttempts(now)) return { ok: false, reason: 'rate-limited' };

  if (!verifyPassword(password, config.passwordHash)) {
    failures.push(now);
    // Costs an attacker time per guess and a person nothing they notice.
    await new Promise((resolve) => setTimeout(resolve, FAILED_ATTEMPT_DELAY_MS));
    return { ok: false, reason: 'wrong-password' };
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(config.secret), {
    httpOnly: true,
    // Off on localhost, where there is no https to be secure over.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_TTL_SECONDS,
  });
  return { ok: true };
}

export async function signOut(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: '/admin' });
}

/**
 * Refuse to go any further unless this request is signed in.
 *
 * Called at the top of every action that writes. A page that renders the form
 * is not permission to submit it: the check is made again here, on the
 * request that actually changes something.
 */
export async function requireSignedIn(): Promise<void> {
  if (!(await isSignedIn()))
    throw new Error('ต้องเข้าสู่ระบบก่อนจึงจะบันทึกได้');
}
