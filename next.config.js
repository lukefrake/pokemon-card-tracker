/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pokemon-card-tracker',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/pokemon-card-tracker/',
  trailingSlash: true,
};

module.exports = nextConfig; 