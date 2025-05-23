/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placekitten.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
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