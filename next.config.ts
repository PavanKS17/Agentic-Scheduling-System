/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bypasses strict errors for production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
