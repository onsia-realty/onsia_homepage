import { LuxeHeroSection } from '@/components/LuxeHeroSection';
import { FeaturedPropertiesSection } from '@/components/FeaturedPropertiesSection';
import { FeaturedSubscriptionsSection } from '@/components/FeaturedSubscriptionsSection';
import { VideoGallerySection } from '@/components/VideoGallerySection';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { Navigation } from '@/components/Navigation';

export default function Home() {
  return (
    <>
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
