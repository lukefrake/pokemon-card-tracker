/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pokemon-card-tracker/' : '',
  trailingSlash: true,
}

module.exports = nextConfig 