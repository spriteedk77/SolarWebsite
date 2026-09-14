import 'server-only';
import type { SanityClient } from '@sanity/client';
import { fileTypeFromBuffer } from 'file-type';

export const MAX_CMS_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function resolveAdminImage(
  client: SanityClient,
  upload: FormDataEntryValue | null,
  existingAssetId: string,
  alt: string,
  caption = '',
) {
  if (!alt.trim()) return null;
  let assetId = existingAssetId;
  if (upload instanceof File && upload.size > 0) {
    if (upload.size > MAX_CMS_IMAGE_BYTES) throw new Error('รูปต้องมีขนาดไม่เกิน 3 MB');
    const buffer = Buffer.from(await upload.arrayBuffer());
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !IMAGE_TYPES.has(detected.mime))
      throw new Error('รองรับเฉพาะรูป JPG, PNG และ WebP ที่เป็นไฟล์จริง');
    const asset = await client.assets.upload('image', buffer, {
      filename: upload.name,
      contentType: detected.mime,
    });
    assetId = asset._id;
  }
  if (!assetId) return null;
  return {
    _type: 'siteImage',
    asset: { _type: 'reference', _ref: assetId },
    alt: alt.trim(),
    caption: caption.trim() || undefined,
  };
}
