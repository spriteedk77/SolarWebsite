import Image from 'next/image';
import { publicAssetPath } from '@/lib/utils';

/**
 * The hero's ground, kept separate from its content so the photograph NP88
 * Solar is preparing can be dropped in without touching the layout.
 *
 * Until then `image` is undefined and the hero keeps the flat navy blueprint
 * ground. Nothing here invents imagery.
 *
 * ## Installing the real photograph
 *
 * Put the file in `public/images/hero/` and pass it to `<Hero image={…} />`:
 *
 * ```tsx
 * <HeroBackground
 *   image={{
 *     src: '/images/hero/rooftop-survey.jpg',
 *     // Which part of the frame survives the crop at narrow widths. The text
 *     // sits on the left, so bias towards the right where the subject is.
 *     position: '70% 50%',
 *     mobileSrc: '/images/hero/rooftop-survey-portrait.jpg',
 *   }}
 * />
 * ```
 *
 * Sizes to supply:
 *  - desktop  2400 × 1350 (minimum 1920 × 1080), calm area on the left
 *  - mobile   1080 × 1440, optional — the desktop file is cropped otherwise
 *
 * The overlay is brand navy (#001D78) and is what makes white text legible over
 * a photograph. `overlay` sets the flat opacity; the horizontal gradient on top
 * of it keeps the left column — where the headline sits — darker than the right
 * without introducing a decorative colour wash.
 */
export type HeroImage = {
  src: string;
  /** `object-position`, e.g. '70% 50%' to protect a subject on the right. */
  position?: string;
  /** Portrait crop used below 768px when the landscape frame loses the subject. */
  mobileSrc?: string;
  /** Navy overlay opacity over the photograph. 0.45–0.65 keeps AA contrast. */
  overlay?: number;
};

export function HeroBackground({ image }: { image?: HeroImage }) {
  if (!image) {
    // No photograph yet: the flat navy ground with the blueprint grid.
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
    );
  }

  const overlay = image.overlay ?? 0.55;
  const position = image.position ?? '70% 50%';

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {image.mobileSrc && (
        <Image
          src={publicAssetPath(image.mobileSrc)}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: position }}
          className="object-cover md:hidden"
        />
      )}
      <Image
        src={publicAssetPath(image.src)}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: position }}
        className={
          image.mobileSrc
            ? 'hidden object-cover md:block'
            : 'object-cover'
        }
      />
      {/* Flat readability overlay in brand navy. */}
      <div
        className="absolute inset-0 bg-navy-900"
        style={{ opacity: overlay }}
      />
      {/* Directional pass: darker behind the text column, clearing to the
          right so the subject of the photograph stays visible. */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/35 to-transparent" />
    </div>
  );
}
