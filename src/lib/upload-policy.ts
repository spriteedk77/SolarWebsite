/**
 * Shared client/server limits.
 *
 * The whole request stays under the smallest cap of the hosts this site can run
 * on: Vercel rejects a function request over 4.5 MB, and Netlify's 6 MB limit
 * is spent on base64-encoded bodies, which costs about a third — roughly the
 * same 4.5 MB of actual bytes. 4 MB leaves room for the form fields and the
 * encoding overhead on either.
 */
export const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_BYTES = 3 * 1024 * 1024;
export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const MAX_FILES = 8;
export const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
export const UPLOAD_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif';
