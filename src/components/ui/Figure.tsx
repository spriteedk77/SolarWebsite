import Image from 'next/image';
import type { ImageAsset } from '@/content/types';
import { cn } from '@/lib/utils';

type Props = {
  image: ImageAsset;
  className?: string;
  imageClassName?: string;
  /** Only the LCP image on a page should set this. */
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
  ratio?: '16/9' | '4/3' | '3/2' | '1/1';
  rounded?: boolean;
};

const ratios = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
};

/**
 * Project and article imagery.
 *
 * NP88 Solar's real installation photography is not in the repository yet, so
 * every asset currently flagged `placeholder` renders with a visible marker.
 * That is deliberate: a placeholder must never be mistaken for a real project
 * photograph, by a visitor or by whoever reviews the site before launch.
 * Drop the real files into /public/images/ and set `placeholder: false`.
 */
export function Figure({
  image,
  className,
  imageClassName,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  showCaption = false,
  ratio = '16/9',
  rounded = true,
}: Props) {
  return (
    <figure className={cn('relative', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-navy-50',
          ratios[ratio],
          rounded && 'rounded-card',
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          // Vector placeholders gain nothing from the raster pipeline; real
          // photography (jpg/webp) goes through it as normal.
          unoptimized={image.src.endsWith('.svg')}
          className={cn('object-cover', imageClassName)}
        />
      </div>
      {showCaption && image.caption && (
        <figcaption className="mt-2.5 text-caption text-ink-600">{image.caption}</figcaption>
      )}
    </figure>
  );
}
