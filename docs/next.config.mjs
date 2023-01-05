import pwa from 'next-pwa';
import pkg from '../package/package.json' assert { type: 'json' };
import nextra from 'nextra';

const withPWA = pwa({ dest: 'public', disable: process.env.NODE_ENV === 'development' });

const nextConfig = (phase) => {
  /** @type {import('nextra').Nextra} */
  const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.jsx',
    defaultShowCopyCode: true,
  });
  /** @type {import('next').NextConfig} */
  const config = withNextra({
    reactStrictMode: true,
    transpilePackages: ['@trautmann/react-headless-table'],
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    env: {
      PACKAGE_VERSION: pkg.version,
      BASE_PATH: ''
    }
  });

  if (phase === 'phase-production-build' && process.env.GITHUB_PAGES === 'true') {
    config.env.BASE_PATH = config.basePath = '/';
    config.env.CANONICAL_URL = 'https://react-headless-table.trautmann.software/';
  }

  return withPWA(config);
};

export default nextConfig;