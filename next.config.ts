import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle server-side dependencies
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('mongoose');
    }
    return config;
  },
  // Ensure server components can use mongoose
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // Disable static optimization for API routes
  output: 'standalone'
};

export default nextConfig;
