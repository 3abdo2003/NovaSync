import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure mongoose is properly resolved
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('mongoose');
    }
    return config;
  },
  // Force rebuild
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
};

export default nextConfig;
