import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production build to continue with ESLint warnings
  eslint: {
    // Only fail on actual errors, not warnings
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Keep TypeScript strict checking - these ARE critical
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '9000', 
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '9000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
