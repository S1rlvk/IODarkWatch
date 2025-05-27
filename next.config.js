/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['earnest-melba-21bea5.netlify.app'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Ensure proper static generation
  output: 'standalone',
  // Enable static optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
}

module.exports = nextConfig; 