/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
