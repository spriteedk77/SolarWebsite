import Image from 'next/image';
import { cn, publicAssetPath } from '@/lib/utils';

/**
 * The official NP88 Solar logo.
 *
 * `public/logo/np88-logo-horizontal.png` is the registered artwork supplied by
 * NP88 Solar — it is only ever scaled, never cropped, recoloured or rebuilt in
 * markup. The intrinsic size below is the file's own, so `next/image` keeps the
 * aspect ratio and reserves the right box before the image loads.
 *
 * The wordmark is dark navy on a transparent ground, so it reads on white and
 * on the light surfaces. On the navy footer it sits on a white plate rather
 * than being inverted, because inverting would alter the mark.
 */

/** Intrinsic pixel size of np88-logo-horizontal.png. */
const INTRINSIC = { width: 1692, height: 537 };

export function Logo({
  className,
  variant = 'dark',
  priority = false,
}: {
  className?: string;
  /** `dark` = the artwork as-is, for white and light grounds.
   *  `light` = the same artwork on a white plate, for navy grounds. */
  variant?: 'dark' | 'light';
  /** Set on the header logo, which is above the fold on every page. */
  priority?: boolean;
}) {
  const image = (
    <Image
      src={publicAssetPath('/logo/np88-logo-horizontal.png')}
      alt="NP88 Solar by NP88 Engineering Co., Ltd."
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      priority={priority}
      // Height-driven: the width follows from the intrinsic aspect ratio.
      className={cn('h-9 w-auto sm:h-10 lg:h-11', className)}
      sizes="160px"
    />
  );

  if (variant === 'light') {
    return (
      <span className="inline-flex items-center rounded-lg bg-white px-3 py-2">
        {image}
      </span>
    );
  }

  return image;
}
