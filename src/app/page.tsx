import { LuxeHeroSection } from '@/components/LuxeHeroSection';
import { FeaturedPropertiesSection } from '@/components/FeaturedPropertiesSection';
import { PopularListingsSection } from '@/components/PopularListingsSection';
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
        <PopularListingsSection />
        <VideoGallerySection />
      </main>
    </>
  );
}
