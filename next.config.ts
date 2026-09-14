import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'SolarWebsite';
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : '';

/**
 * Hosts that mean "this build is going in front of real customers".
 *
 * Vercel and Netlify each say so in their own read-only build variable, so the
 * guard below fires without anyone remembering to set anything. On any other
 * host — or locally — set PRODUCTION_LAUNCH=1 to opt in manually.
 *
 * Netlify's CONTEXT is `production`, `deploy-preview`, `branch-deploy` or
 * `dev`; only the first one is a real launch, so previews stay buildable
 * against the local content snapshot.
 */
const isProductionLaunch =
  process.env.VERCEL_ENV === 'production' ||
  (process.env.NETLIFY === 'true' && process.env.CONTEXT === 'production') ||
  process.env.PRODUCTION_LAUNCH === '1';

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
