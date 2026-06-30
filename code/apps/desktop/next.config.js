/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['@lyricshare/ui', '@lyricshare/types', '@lyricshare/utils', '@lyricshare/store', '@lyricshare/api-client'],
};

module.exports = nextConfig;
