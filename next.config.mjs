/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: [],
  },
  // Temporarily disable static export to resolve build conflicts
  // output: 'export',
  trailingSlash: true,
  // distDir: 'out',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

export default nextConfig
