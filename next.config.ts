// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // raise to whatever you need: '10mb', '20mb', etc.
      bodySizeLimit: '20mb',
    },
  },
};
module.exports = nextConfig;