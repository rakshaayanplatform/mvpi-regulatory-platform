import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ensure resolve exists
    if (!config.resolve) {
      config.resolve = {};
    }
    
    // Ensure alias exists
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Add the @ alias
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    return config;
  },
  experimental: {
    // Enable experimental features if needed
  }
};

export default nextConfig;
