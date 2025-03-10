/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker/' : '',
  trailingSlash: true,
};

module.exports = nextConfig; 