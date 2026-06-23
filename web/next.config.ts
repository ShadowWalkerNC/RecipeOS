import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for Render (and Docker) standalone deployment
  output: 'standalone',
  // Experimental: allow importing from shared/ outside web/
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../'),
  },
};

export default nextConfig;
