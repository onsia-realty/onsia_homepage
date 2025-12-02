import { AboutHeroSection } from '@/components/AboutHeroSection';
import { PatentShowcaseSection } from '@/components/PatentShowcaseSection';
import { BlockchainSection } from '@/components/BlockchainSection';
import { TeamSection } from '@/components/TeamSection';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { Navigation } from '@/components/Navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회사소개 - 온시아 | AI 바이브 코딩 전문가와 블록체인 부동산 혁신',
  description: '온시아는 AI와 블록체인 기술을 융합하여 부동산 산업의 새로운 패러다임을 제시하는 스마트 테크 기업입니다. 특허받은 기술로 부동산 거래의 미래를 만들어갑니다.',
  keywords: [
    '온시아',
    'ONSIA', 
    'AI 바이브 코딩',
    '블록체인 부동산',
    '부동산 특허',
    '스마트 계약',
    'AI 부동산 분석',
    '공인중개사',
    '부동산 테크',
    '프롭테크'
  ],
  authors: [{ name: '온시아', url: 'https://onsia.com' }],
  creator: '온시아',
  publisher: '온시아',
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
  openGraph: {
    title: '회사소개 - 온시아 | AI 바이브 코딩 전문가와 블록체인 부동산 혁신',
    description: '온시아는 AI와 블록체인 기술을 융합하여 부동산 산업의 새로운 패러다임을 제시하는 스마트 테크 기업입니다.',
    url: 'https://onsia.com/about',
    siteName: '온시아',
    images: [
      {
        url: '/og/about.jpg',
        width: 1200,
        height: 630,
        alt: '온시아 회사소개 - 블록체인 부동산 특허 기술',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '회사소개 - 온시아 | AI 바이브 코딩 전문가와 블록체인 부동산 혁신',
    description: '온시아는 AI와 블록체인 기술을 융합하여 부동산 산업의 새로운 패러다임을 제시하는 스마트 테크 기업입니다.',
    images: ['/og/about.jpg'],
  },
  alternates: {
    canonical: 'https://onsia.com/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="relative">
        <ParticlesBackground />
        <AboutHeroSection />
        <PatentShowcaseSection />
        <BlockchainSection />
        <TeamSection />
      </main>
    </>
  );
}