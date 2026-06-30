/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lyricshare/ui', '@lyricshare/types', '@lyricshare/utils', '@lyricshare/store', '@lyricshare/api-client'],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@lyricshare/ui', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
