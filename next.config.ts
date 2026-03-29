import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypasses strict errors for production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
