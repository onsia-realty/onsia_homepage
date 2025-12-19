import type { Metadata } from 'next';
import Script from 'next/script';

const marketJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://www.onsia.city"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI 부동산시세",
          "item": "https://www.onsia.city/market"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.onsia.city/market#webpage",
      "url": "https://www.onsia.city/market",
      "name": "AI 부동산시세 - 서울 아파트 실거래가 조회",
      "isPartOf": {
        "@id": "https://www.onsia.city/#website"
      },
      "about": {
        "@type": "Thing",
        "name": "부동산 시세 분석"
      },
      "description": "서울 아파트 실거래가를 AI가 분석. 구별 실시간 시세 조회.",
      "inLanguage": "ko-KR"
    },
    {
      "@type": "Service",
      "name": "AI 부동산 시세 분석 서비스",
      "description": "AI 기반 부동산 실거래가 분석 및 시세 조회 서비스",
      "provider": {
        "@id": "https://www.onsia.city/#organization"
      },
      "areaServed": {
        "@type": "City",
        "name": "서울특별시"
      },
      "serviceType": "부동산 시세 분석"
    }
  ]
};

export const metadata: Metadata = {
  title: 'AI 부동산시세 - 서울 아파트 실거래가 조회 | ONSIA',
  description: '서울 아파트 실거래가를 AI가 분석! 강남, 송파, 서초 등 구별 실시간 시세 조회. 매매, 전세 거래 내역과 가격 변동 추이를 지도에서 한눈에 확인하세요. 국토교통부 실거래가 기반.',
  keywords: ['아파트 실거래가', '부동산 시세', '서울 아파트 시세', '강남 아파트', '송파 아파트', 'AI 시세분석', '실거래 조회', '아파트 가격', '부동산 시세 조회'],
  openGraph: {
    title: 'AI 부동산시세 - 서울 아파트 실거래가 조회 | ONSIA',
    description: '서울 아파트 실거래가를 AI가 분석! 구별 실시간 시세 조회, 매매/전세 거래 내역과 가격 변동 추이.',
    url: 'https://www.onsia.city/market',
    siteName: 'ONSIA - 온시아 부동산',
    images: [
      {
        url: 'https://www.onsia.city/og-market.png',
        width: 1200,
        height: 630,
        alt: 'ONSIA AI 부동산시세',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 부동산시세 - 서울 아파트 실거래가 조회 | ONSIA',
    description: '서울 아파트 실거래가를 AI가 분석! 실시간 시세 조회.',
    images: ['https://www.onsia.city/og-market.png'],
  },
  alternates: {
    canonical: 'https://www.onsia.city/market',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="market-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketJsonLd) }}
      />
      {children}
    </>
  );
}
