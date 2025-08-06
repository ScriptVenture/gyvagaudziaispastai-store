import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
