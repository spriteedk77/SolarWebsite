import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

/**
 * Site-wide social share image.
 *
 * Generated as a real PNG rather than shipped as an SVG, because most social
 * platforms will not render SVG og:images. Every page inherits this unless it
 * passes its own image to `buildMetadata()`.
 *
 * The text is Latin-only on purpose: rendering Thai here would mean shipping a
 * Thai font binary into the edge bundle for one image.
 */

export const alt =
  'NP88 Solar — Solar Rooftop design and installation, Chiang Mai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#001D78',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 18,
            backgroundColor: '#036DC9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              backgroundColor: '#F2A323',
              display: 'flex',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Satori needs an explicit display on any element with >1 child. */}
          <div
            style={{ display: 'flex', gap: 10, fontSize: 40, fontWeight: 700 }}
          >
            <span style={{ color: '#ffffff' }}>NP88</span>
            <span style={{ color: '#F2A323' }}>Solar</span>
          </div>
          <div style={{ fontSize: 20, color: '#8ac5fb', marginTop: 4 }}>
            by NP88 Engineering Co., Ltd.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          Engineering Your
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          Energy Future.
        </div>
        <div style={{ fontSize: 26, color: '#bcdcfd', marginTop: 20 }}>
          Solar Rooftop — survey, design, installation and after-sales service
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '2px solid rgba(255,255,255,0.15)',
          paddingTop: 26,
          fontSize: 23,
          color: '#bcdcfd',
        }}
      >
        <div style={{ display: 'flex' }}>
          Chiang Mai · Lamphun · Chiang Rai · Lampang · Phayao
        </div>
        <div style={{ display: 'flex', color: '#ffffff', fontWeight: 600 }}>
          095-697-1915 · LINE @np88solar
        </div>
      </div>
    </div>,
    { ...size },
  );
}
