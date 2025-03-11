/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/pokemon-card-tracker' : '';

const nextConfig = {
  ...(isProduction ? {
    output: 'export',
    distDir: 'out',
  } : {}),
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig; 