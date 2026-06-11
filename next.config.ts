import type { NextConfig } from "next";

// 야목역서희스타힐스.xyz는 리다이렉트가 아니라 독립 랜딩 도메인으로 직접 서빙
// (src/middleware.ts + src/lib/landing-slugs.ts LANDING_DOMAINS 참고)
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [25, 50, 75, 100],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.dooinauction.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.apnews.kr',
      },
      {
        protocol: 'https',
        hostname: 'stqnq5ux4599.edge.naverncp.com',
      },
      {
        protocol: 'https',
        hostname: 'img.hankyung.com',
      },
      {
        protocol: 'https',
        hostname: 'image.edaily.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'e-model.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'flexible.img.hani.co.kr',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'wimg.heraldcorp.com',
      },
      {
        protocol: 'https',
        hostname: 'i3n.news1.kr',
      },
      {
        protocol: 'https',
        hostname: 'image.ajunews.com',
      },
      {
        protocol: 'https',
        hostname: 'cfnimage.commutil.kr',
      },
      {
        protocol: 'https',
        hostname: 'img1.newsis.com',
      },
      {
        protocol: 'https',
        hostname: '*.prugio.com',
      },
      {
        protocol: 'https',
        hostname: 'lottecastle.co.kr',
      },
      {
        protocol: 'https',
        hostname: '*.lottecastle.co.kr',
      },
    ]
  }
};

export default nextConfig;
