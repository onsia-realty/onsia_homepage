import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import SessionProvider from "@/components/auth/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "온시아(ONSIA) - 부동산 AI 플랫폼 | 분양 청약 경매 정보",
    template: "%s | 온시아(ONSIA)",
  },
  description: "온시아는 AI 기반 부동산 정보 플랫폼입니다. 아파트 분양권 거래, 청약 일정, 법원경매 물건, AI 시세분석까지 한눈에 확인하세요.",
  keywords: ["온시아", "ONSIA", "부동산", "분양권", "경매", "청약", "아파트 분양", "부동산 AI", "법원경매", "분양권 거래", "청약 일정", "아파트 시세", "부동산 플랫폼"],
  authors: [{ name: "온시아(ONSIA)" }],
  creator: "온시아(ONSIA)",
  publisher: "온시아(ONSIA)",
  metadataBase: new URL("https://www.onsia.city"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.onsia.city",
    siteName: "온시아(ONSIA)",
    title: "온시아(ONSIA) - 부동산 AI 플랫폼 | 분양 청약 경매",
    description: "온시아는 AI 기반 부동산 정보 플랫폼입니다. 아파트 분양권 거래, 청약 일정, 법원경매 물건, AI 시세분석까지 한눈에 확인하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "온시아(ONSIA) - 부동산 AI 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "온시아(ONSIA) - 부동산 AI 플랫폼",
    description: "온시아 - AI 기반 부동산 정보 플랫폼. 분양권, 청약, 경매 정보를 한눈에.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "9lrEwNdce4bdybKgjFlxhkeKjV5UQ_4HgCnpNEoxFa8",
    other: {
      "naver-site-verification": "747b33e6d2c3b922c544372795143926dfc0ad82",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.onsia.city/#organization",
      "name": "온시아(ONSIA)",
      "alternateName": ["온시아", "ONSIA", "onsia"],
      "url": "https://www.onsia.city",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.onsia.city/logo.png",
        "width": 512,
        "height": 512
      },
      "description": "온시아는 AI 기반 부동산 정보 플랫폼입니다. 분양권 거래, 청약 일정, 법원경매, AI 시세분석 서비스를 제공합니다.",
      "foundingDate": "2024",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+82-1668-5257",
        "contactType": "customer service",
        "areaServed": "KR",
        "availableLanguage": "Korean"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.onsia.city/#website",
      "url": "https://www.onsia.city",
      "name": "온시아(ONSIA) - 부동산 AI 플랫폼",
      "alternateName": "온시아",
      "description": "온시아는 AI 기반 부동산 정보 플랫폼입니다. 아파트 분양권 거래, 청약 일정, 법원경매 물건, AI 시세분석까지 한눈에 확인하세요.",
      "publisher": {
        "@id": "https://www.onsia.city/#organization"
      },
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.onsia.city/subscription?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "RealEstateAgent",
      "@id": "https://www.onsia.city/#business",
      "name": "온시아(ONSIA)",
      "alternateName": "온시아",
      "url": "https://www.onsia.city",
      "image": "https://www.onsia.city/og-image.png",
      "priceRange": "$$",
      "telephone": "+82-1668-5257",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "서울",
        "addressRegion": "서울특별시",
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.5665,
        "longitude": 126.9780
      },
      "areaServed": {
        "@type": "Country",
        "name": "대한민국"
      },
      "serviceType": ["분양권 거래", "부동산 경매", "청약 정보", "AI 시세분석", "아파트 분양 상담"]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.onsia.city/#breadcrumb",
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "분양권",
          "item": "https://www.onsia.city/properties"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "경매정보",
          "item": "https://www.onsia.city/auctions"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "AI 부동산시세",
          "item": "https://www.onsia.city/market"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
{process.env.NODE_ENV === 'production' && (
          <AnalyticsTracker
            config={{
              apiEndpoint: process.env.NEXT_PUBLIC_TRACKER_API || 'https://tracker-1jtn6j9qy-realtors77-7871s-projects.vercel.app/api/analytics',
              siteSlug: 'onsia-main',
              trackClicks: true,
              trackScroll: true,
              trackMouse: true,
              debugMode: false,
            }}
          />
        )}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
