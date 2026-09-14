import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'SolarWebsite';
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages is used only as a frontend preview. Normal builds keep the
  // full Next.js server so /api/lead continues to work on Railway later.
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        basePath: pagesBasePath,
        assetPrefix: pagesBasePath,
        trailingSlash: true,
      }
    : {}),
  images: {
    // Real project photography will be served either from /public or from a CMS.
    // Add the CMS host here when it is connected.
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
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
