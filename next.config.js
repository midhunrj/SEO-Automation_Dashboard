/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      'bullmq',
      'ioredis',
      'puppeteer',
      'cheerio',
      '@prisma/client',
      'pdf-lib'
    ]
  }
};

module.exports = nextConfig;
