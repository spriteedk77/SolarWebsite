import type { NextConfig } from 'next';
import { isPreviewDeployment } from './src/lib/deployment';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'SolarWebsite';
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : '';

/**
 * Is this build the one real customers reach?
 *
 * Two things have to be true. The host has to call it production — Vercel and
 * Netlify each say so in their own read-only variable, so nobody has to
 * remember a setting — and the address it answers on has to be a real domain.
 *
 * The second half matters because a Netlify site is production from the moment
 * it exists, while np88solar.netlify.app is an address for the people building
 * the site, not for customers. Holding a staging URL to the full launch
 * checklist only means there is nothing to look at. Attaching the company's
 * domain is the moment that changes, and Netlify rewrites `URL` itself when
 * that happens, so the checklist starts being enforced without a flag being
 * flipped. See src/lib/deployment.ts.
 *
 * PRODUCTION_LAUNCH=1 still forces the checklist anywhere, for a host that
 * reports neither.
 */
const isProductionLaunch =
  process.env.PRODUCTION_LAUNCH === '1' ||
  ((process.env.VERCEL_ENV === 'production' ||
    (process.env.NETLIFY === 'true' &&
      process.env.CONTEXT === 'production')) &&
    !isPreviewDeployment());

if (isProductionLaunch) {
  const required = [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_READ_TOKEN',
    'NEXT_PUBLIC_SITE_URL',
    'LEAD_WEBHOOK_URL',
    'TURNSTILE_SECRET_KEY',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (
    isGitHubPages ||
    process.env.CONTENT_SOURCE !== 'sanity' ||
    process.env.LEAD_TEST_MODE === '1' ||
    missing.length
  ) {
    throw new Error(
      `Production launch requires live CMS, private lead delivery and spam protection; missing: ${missing.join(', ')}`,
    );
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages is used only as a frontend preview. Normal builds keep the
  // full Next.js server for the later CMS and private form deployment.
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        basePath: pagesBasePath,
        assetPrefix: pagesBasePath,
        trailingSlash: true,
      }
    : {}),
  images: {
    // Restrict remote images to the configured CMS image service.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    unoptimized: isGitHubPages,
  },
  ...(!isGitHubPages
    ? {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                {
                  key: 'Referrer-Policy',
                  value: 'strict-origin-when-cross-origin',
                },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                {
                  key: 'Permissions-Policy',
                  value:
                    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
