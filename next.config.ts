import type { NextConfig } from "next";

// 포워딩 전용 도메인: 야목역서희스타힐스.xyz (punycode)
const YAMOK_FORWARD_HOSTS = [
  'xn--w52b01jv7aa057aotah02dmgmlja.xyz',
  'www.xn--w52b01jv7aa057aotah02dmgmlja.xyz',
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    // 야목역서희스타힐스.xyz → onsia.city 한글 랜딩으로 301 (쿼리 ?a= 자동 보존)
    return YAMOK_FORWARD_HOSTS.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host }],
      destination: 'https://www.onsia.city/야목역서희스타힐스',
      permanent: true,
    }));
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
