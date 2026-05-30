import { LuxeHeroSection } from '@/components/LuxeHeroSection';
import { FeaturedPropertiesSection } from '@/components/FeaturedPropertiesSection';
import { FeaturedSubscriptionsSection } from '@/components/FeaturedSubscriptionsSection';
import { VideoGallerySection } from '@/components/VideoGallerySection';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { Navigation } from '@/components/Navigation';

// 홈 전용 BreadcrumbList (네이버/구글 검색 결과에 사이트 카테고리 노출용)
// 랜딩 페이지는 자체 빵부스러기를 별도 주입하므로 여기 들어가지 않음.
const homeBreadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://www.onsia.city/#breadcrumb',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.onsia.city' },
    { '@type': 'ListItem', position: 2, name: '분양정보', item: 'https://www.onsia.city/subscription' },
    { '@type': 'ListItem', position: 3, name: '분양권', item: 'https://www.onsia.city/properties' },
    { '@type': 'ListItem', position: 4, name: '경매정보', item: 'https://www.onsia.city/auctions' },
    { '@type': 'ListItem', position: 5, name: 'AI 부동산시세', item: 'https://www.onsia.city/market' },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }}
      />
      <Navigation />
      <main className="relative">
        <ParticlesBackground />
        <LuxeHeroSection />
        <FeaturedPropertiesSection />
        <FeaturedSubscriptionsSection />
        <VideoGallerySection />
      </main>
    </>
  );
}
