import type { NextConfig } from 'next';

// GitHub Pages serves the site from /<repo-name>. The deploy workflow passes the
// correct path in via PAGES_BASE_PATH; locally it is empty.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
