import Image from 'next/image';
import { cn, publicAssetPath } from '@/lib/utils';

/**
 * The official LINE Brand Icon.
 *
 * `public/logo/LINE_Brand_icon.png` is LINE's own file, taken byte-for-byte
 * from LINE_Brand_icon.zip on https://www.line.me/en/logo. LINE's guideline is
 * that the mark is used "as-is and without alteration": it is never redrawn,
 * recoloured, cropped, restretched, or rebuilt as SVG paths, and no text is
 * baked into it — "@np88solar" is page text set beside it.
 *
 * `unoptimized` so the bytes LINE published are the bytes the browser gets.
 * The file is 22 KB, so there is nothing to gain from resizing it anyway.
 *
 * Size: LINE's stated minimum is 20px on screen (40px on mobile layouts), so
 * `size` must not go below 20 — the wordmark inside the bubble stops being
 * readable first. Height drives the box and the width follows from the file's
 * own 1001×1000, so the proportions are never touched.
 *
 * Do not place it on a LINE-green ground: the green of the mark's rounded
 * square is the same green, and the shape disappears into the background. The
 * green LINE buttons on this site carry their label alone for that reason.
 */

/** Intrinsic pixel size of LINE_Brand_icon.png — very slightly non-square. */
const INTRINSIC = { width: 1001, height: 1000 };

export function LineIcon({
  className,
  size = 20,
}: {
  className?: string;
  /** Rendered height in px. LINE's minimum is 20. */
  size?: number;
}) {
  return (
    <Image
      src={publicAssetPath('/logo/LINE_Brand_icon.png')}
      alt="LINE"
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      unoptimized
      // Height-driven; `w-auto` keeps the file's own aspect ratio.
      style={{ height: `${Math.max(size, 20)}px` }}
      className={cn('w-auto shrink-0', className)}
    />
  );
}
