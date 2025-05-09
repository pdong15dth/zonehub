/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb'
    },
    optimisticClientCache: true,
    scrollRestoration: true,
  }
}

export default nextConfig