/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.maptiler.com'],
  },
  transpilePackages: ['react-leaflet']
}

module.exports = nextConfig; 