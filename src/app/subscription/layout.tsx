import type { Metadata } from 'next';
import Script from 'next/script';

const subscriptionJsonLd = {
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
          "name": "분양정보",
          "item": "https://www.onsia.city/subscription"
        }
      ]
    },
    {
      "@type": "ItemList",
      "name": "분양 아파트 목록",
      "description": "전국 아파트 분양 청약 정보 목록",
      "url": "https://www.onsia.city/subscription",
      "numberOfItems": 100,
      "itemListOrder": "https://schema.org/ItemListOrderDescending"
    },
    {
      "@type": "WebPage",
      "@id": "https://www.onsia.city/subscription#webpage",
      "url": "https://www.onsia.city/subscription",
      "name": "분양정보 - 전국 아파트 청약 일정",
      "isPartOf": {
        "@id": "https://www.onsia.city/#website"
      },
      "about": {
        "@type": "Thing",
        "name": "아파트 분양 청약"
      },
      "description": "전국 아파트 분양 청약 일정, 모집공고, 당첨자 발표를 한눈에 확인",
      "inLanguage": "ko-KR"
    }
  ]
};

export const metadata: Metadata = {
  title: '분양정보 - 전국 아파트 청약 일정 | ONSIA',
  description: '전국 아파트 분양 청약 일정, 모집공고, 당첨자 발표를 한눈에! 서울, 경기, 인천 등 수도권 및 전국 분양정보를 지도와 목록으로 확인하세요. 실시간 청약 경쟁률, 분양가, 입주 예정일까지.',
  keywords: ['아파트 분양', '청약', '분양 일정', '모집공고', '당첨자 발표', '서울 분양', '경기 분양', '수도권 분양', '분양권', '신축 아파트'],
  openGraph: {
    title: '분양정보 - 전국 아파트 청약 일정 | ONSIA',
    description: '전국 아파트 분양 청약 일정, 모집공고, 당첨자 발표를 한눈에! 실시간 청약 경쟁률과 분양가 정보.',
    url: 'https://www.onsia.city/subscription',
    siteName: 'ONSIA - 온시아 부동산',
    images: [
      {
        url: 'https://www.onsia.city/og-subscription.png',
        width: 1200,
        height: 630,
        alt: 'ONSIA 분양정보',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '분양정보 - 전국 아파트 청약 일정 | ONSIA',
    description: '전국 아파트 분양 청약 일정, 모집공고, 당첨자 발표를 한눈에!',
    images: ['https://www.onsia.city/og-subscription.png'],
  },
  alternates: {
    canonical: 'https://www.onsia.city/subscription',
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

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="subscription-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subscriptionJsonLd) }}
      />
      {children}
    </>
  );
}
