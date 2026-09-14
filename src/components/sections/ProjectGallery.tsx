import type { ImageAsset } from '@/content/types';
import { Figure } from '@/components/ui/Figure';

/**
 * Project photo gallery.
 *
 * A plain responsive grid rather than a JavaScript lightbox: it costs no
 * client bundle, works without JS, and lets each photo keep its own caption —
 * which on a project page is part of the evidence, not decoration.
 */
export function ProjectGallery({
  images,
  title,
}: {
  images: ImageAsset[];
  title?: string;
}) {
  if (images.length === 0) return null;
  const [lead, ...rest] = images;

  return (
    <div>
      {title && <h2 className="text-h2">{title}</h2>}

      <Figure
        image={lead}
        ratio="16/9"
        showCaption
        priority
        sizes="(min-width: 1024px) 66vw, 100vw"
        className={title ? 'mt-6' : undefined}
      />

      {rest.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {rest.map((image) => (
            <li key={image.src + image.alt}>
              <Figure
                image={image}
                ratio="4/3"
                showCaption
                sizes="(min-width: 1024px) 22vw, 45vw"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
