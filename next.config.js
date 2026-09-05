/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
