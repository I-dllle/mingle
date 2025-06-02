import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 프론트에서 /api 경로로 요청 시 → 백엔드로 프록시 처리
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트 요청 경로
        destination: 'http://localhost:8080/api/:path*', // 백엔드 서버로 전달

      },
    ];
  },
};

export default nextConfig;
