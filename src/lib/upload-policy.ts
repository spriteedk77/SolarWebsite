/** Shared client/server limits: whole request stays below Vercel's 4.5 MB cap. */
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
